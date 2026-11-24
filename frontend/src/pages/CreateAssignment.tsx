import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Link as LinkIcon, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTrainees } from '../features/trainees/traineesSlice';
import { createAssignment } from '../features/assignments/assignmentsSlice';
import FormField from '../components/FormField';
import type { ApiFailure } from '../services/types';
import { isHttpUrl } from '../services/utils';

/** S4 - Create Assignment. New assignments start as Not Started (set by the API). */
export default function CreateAssignment() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const trainees = useAppSelector((s) => s.trainees);
  const saving = useAppSelector((s) => s.assignments.saving);

  const [traineeId, setTraineeId] = useState('');
  const [topic, setTopic] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => { dispatch(fetchTrainees()); }, [dispatch]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const next: Record<string, string> = {};
    if (!traineeId) next.traineeId = 'Select a trainee.';
    if (!topic.trim()) next.topic = 'Topic is required.';
    else if (topic.trim().length > 200) next.topic = 'Topic must be 200 characters or fewer.';
    if (videoUrl.trim() && (!isHttpUrl(videoUrl) || videoUrl.trim().length > 1000)) next.videoUrl = 'Enter a valid http:// or https:// link.';
    if (notes.length > 2000) next.notes = 'Notes are too long.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      await dispatch(createAssignment({
        traineeId: Number(traineeId),
        topic: topic.trim(),
        videoUrl: videoUrl.trim() || undefined,
        notes: notes.trim() || undefined,
        dueDate: dueDate || undefined,
      })).unwrap();
      navigate('/trainer', { state: { toast: 'Assignment created' } });
    } catch (err) {
      const failure = err as ApiFailure;
      setErrors(failure.fieldErrors ?? {});
      if (!failure.fieldErrors || Object.keys(failure.fieldErrors).length === 0) setFormError(failure.message);
    }
  };

  return (
    <>
      <Link to="/trainer" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Back to Dashboard</Link>
      <form className="form-card" onSubmit={submit} noValidate>
        <h1>Create Assignment</h1>

        <FormField id="traineeId" label="Trainee" required icon={<User size={16} />} error={errors.traineeId}>
          <select id="traineeId" className="input" value={traineeId} onChange={(e) => setTraineeId(e.target.value)} aria-invalid={!!errors.traineeId}>
            <option value="">Select a trainee</option>
            {trainees.items.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </FormField>
        {trainees.error && <p className="form-error" role="alert">{trainees.error}</p>}

        <FormField id="topic" label="Topic" required icon={<FileText size={16} />} error={errors.topic}>
          <input id="topic" className="input" placeholder="Enter topic" value={topic}
            onChange={(e) => setTopic(e.target.value)} aria-invalid={!!errors.topic} />
        </FormField>

        <FormField id="videoUrl" label="Video URL" optionalNote icon={<LinkIcon size={16} />} error={errors.videoUrl}>
          <input id="videoUrl" className="input" placeholder="https://..." value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)} aria-invalid={!!errors.videoUrl} />
        </FormField>

        <FormField id="notes" label="Notes" optionalNote error={errors.notes}>
          <textarea id="notes" className="input" rows={4} placeholder="Enter notes..." value={notes}
            onChange={(e) => setNotes(e.target.value)} aria-invalid={!!errors.notes} />
        </FormField>

        <FormField id="dueDate" label="Due Date" optionalNote icon={<Calendar size={16} />} error={errors.dueDate}>
          <input id="dueDate" type="date" className="input" value={dueDate}
            onChange={(e) => setDueDate(e.target.value)} aria-invalid={!!errors.dueDate} />
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
