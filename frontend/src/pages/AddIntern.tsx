import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addTrainee } from '../features/trainees/traineesSlice';
import FormField from '../components/FormField';
import type { ApiFailure } from '../services/types';
import { isEmail } from '../services/utils';

/** S3 - Add Intern (creates a Trainee account). */
export default function AddIntern() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const saving = useAppSelector((s) => s.trainees.saving);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Name is required.';
    else if (name.trim().length > 100) next.name = 'Name must be 100 characters or fewer.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!isEmail(email)) next.email = 'Enter a valid email address.';
    if (!password) next.initialPassword = 'Initial password is required.';
    else if (password.length < 8) next.initialPassword = 'Use at least 8 characters.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      await dispatch(addTrainee({ name, email, initialPassword: password })).unwrap();
      navigate('/trainer', { state: { toast: 'Intern added' } });
    } catch (err) {
      // Entered values are kept; the duplicate-email message appears under Email.
      const failure = err as ApiFailure;
      setErrors(failure.fieldErrors ?? {});
      if (!failure.fieldErrors || Object.keys(failure.fieldErrors).length === 0) setFormError(failure.message);
    }
  };

  return (
    <>
      <Link to="/trainer" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Back to Dashboard</Link>
      <form className="form-card" onSubmit={submit} noValidate>
        <h1>Add Intern</h1>

        <FormField id="name" label="Name" required icon={<User size={16} />} error={errors.name}>
          <input id="name" className="input" placeholder="Enter intern name" value={name}
            onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
        </FormField>

        <FormField id="email" label="Email" required icon={<Mail size={16} />} error={errors.email}>
          <input id="email" type="email" className="input" placeholder="Enter email address" value={email}
            onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
        </FormField>

        <FormField id="initialPassword" label="Initial Password" required icon={<Lock size={16} />} error={errors.initialPassword}>
          <input id="initialPassword" type="password" className="input" placeholder="Enter initial password" value={password}
            onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.initialPassword} autoComplete="new-password" />
        </FormField>

        {formError && <p className="form-error" role="alert">{formError}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <Link to="/trainer" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
