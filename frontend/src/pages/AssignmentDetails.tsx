import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAssignment, updateAssignmentStatus } from '../features/assignments/assignmentsSlice';
import StatusChip from '../components/StatusChip';
import Toast from '../components/Toast';
import { STATUSES, type ApiFailure, type Status } from '../services/types';
import { formatDate } from '../services/utils';

/** S6 - Assignment details with notes, resource link and status update. */
export default function AssignmentDetails() {
  const { id } = useParams();
  const assignmentId = Number(id);
  const dispatch = useAppDispatch();
  const { current, currentLoading, currentError, saving } = useAppSelector((s) => s.assignments);

  const [status, setStatus] = useState<Status>('Not Started');
  const [toast, setToast] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (Number.isInteger(assignmentId) && assignmentId > 0) dispatch(fetchAssignment(assignmentId));
  }, [dispatch, assignmentId]);

  // Start the dropdown on the stored status whenever a (new) assignment arrives.
  useEffect(() => { if (current) setStatus(current.status); }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async () => {
    setSaveError(null);
    try {
      await dispatch(updateAssignmentStatus({ id: assignmentId, status })).unwrap();
      setToast('Status updated'); // only shown after the API confirmed the save
    } catch (err) {
      setSaveError((err as ApiFailure).message); // selection is kept
    }
  };

  return (
    <>
      {toast && <Toast message={toast} onClose={closeToast} />}
      <Link to="/trainee" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Back to Dashboard</Link>

      <div className="detail-card">
        {currentLoading && <p className="muted">Loading assignment…</p>}
        {currentError && <p className="form-error" role="alert">{currentError}</p>}

        {current && (
          <>
            <div className="detail-title">
              <h1>{current.topic}</h1>
              <StatusChip status={current.status} isOverdue={current.isOverdue} />
            </div>

            <p className="detail-due"><Calendar size={16} aria-hidden="true" /> {current.dueDate ? `Due date: ${formatDate(current.dueDate, true)}` : 'No due date'}</p>

            <h3>Notes</h3>
            <p className="notes">{current.notes ? current.notes : 'No notes'}</p>

            {current.videoUrl && (
              <>
                <h3>Resource</h3>
                <p>
                  <a href={current.videoUrl} target="_blank" rel="noopener noreferrer" className="link resource">
                    <LinkIcon size={16} aria-hidden="true" /> {current.videoUrl} <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </p>
              </>
            )}

            <hr />
            <div className="status-row">
              <label htmlFor="status" className="field-label">Update status</label>
              <select id="status" className="input status-select" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
              <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
            {saveError && <p className="form-error" role="alert">{saveError}</p>}
          </>
        )}
      </div>
    </>
  );
}
