import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Briefcase, GraduationCap, Lock, LogIn, Mail, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuthError, login } from '../features/auth/authSlice';
import FormField from '../components/FormField';
import { isEmail, landingFor } from '../services/utils';
import type { Role } from '../services/types';

/** S1 - Login with the Trainer / Trainee role selector. */
export default function Login() {
  const dispatch = useAppDispatch();
  const { user, loading, error, fieldErrors } = useAppSelector((s) => s.auth);

  const [role, setRole] = useState<Role>('Trainer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  if (user) return <Navigate to={landingFor(user.role)} replace />;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!isEmail(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    dispatch(login({ email, password, role }));
  };

  const pick = (r: Role) => { setRole(r); dispatch(clearAuthError()); };

  return (
    <div className="login-page">
      <div className="login-brand">
        <GraduationCap size={28} className="logo" aria-hidden="true" />
        <span className="brand">Intern Training Tracker</span>
      </div>

      <form className="login-card" onSubmit={submit} noValidate>
        <div className="login-head">
          <GraduationCap size={32} className="logo" aria-hidden="true" />
          <h1>Sign in</h1>
          <p>to your account</p>
        </div>

        <div className="role-toggle" role="group" aria-label="Sign in as">
          <button type="button" className={role === 'Trainer' ? 'selected' : ''} aria-pressed={role === 'Trainer'} onClick={() => pick('Trainer')}>
            <Briefcase size={16} aria-hidden="true" /> Trainer
          </button>
          <button type="button" className={role === 'Trainee' ? 'selected' : ''} aria-pressed={role === 'Trainee'} onClick={() => pick('Trainee')}>
            <User size={16} aria-hidden="true" /> Trainee
          </button>
        </div>

        <FormField id="email" label="Email" icon={<Mail size={16} />} error={errors.email ?? fieldErrors.email} stacked>
          <input id="email" type="email" className="input" placeholder="Enter your email" autoComplete="username"
            value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!(errors.email ?? fieldErrors.email)} />
        </FormField>

        <FormField id="password" label="Password" icon={<Lock size={16} />} error={errors.password ?? fieldErrors.password} stacked>
          <input id="password" type="password" className="input" placeholder="Enter your password" autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!(errors.password ?? fieldErrors.password)} />
        </FormField>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          <LogIn size={18} aria-hidden="true" /> {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <div className="or-divider"><span>or</span></div>
        <p className="help-text">New here? Contact <a href="mailto:admin@example.com">your admin</a></p>
      </form>
    </div>
  );
}
