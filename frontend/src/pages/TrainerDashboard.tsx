import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, ClipboardList, Loader, Plus, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchSummary } from '../features/dashboard/dashboardSlice';
import { fetchTrainees } from '../features/trainees/traineesSlice';
import { fetchAllAssignments } from '../features/assignments/assignmentsSlice';
import SummaryCard from '../components/SummaryCard';
import StatusChip from '../components/StatusChip';
import Toast from '../components/Toast';
import { formatDate } from '../services/utils';

/** S2 - Trainer dashboard: summary cards, interns panel, assignments panel. */
export default function TrainerDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { summary, error: summaryError } = useAppSelector((s) => s.dashboard);
  const trainees = useAppSelector((s) => s.trainees);
  const assignments = useAppSelector((s) => s.assignments);

  // Toast passed from S3 / S4 after a successful save.
  const [toast, setToast] = useState<string | null>((location.state as { toast?: string } | null)?.toast ?? null);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchTrainees());
    dispatch(fetchAllAssignments());
  }, [dispatch]);

  useEffect(() => {
    if ((location.state as { toast?: string } | null)?.toast) navigate(location.pathname + location.hash, { replace: true, state: null });
  }, [location.pathname, location.hash, location.state, navigate]);

  // Sidebar "Interns" / "Assignments" jump to the matching panel.
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [location.hash]);

  const s = summary?.role === 'Trainer' ? summary : null;

  return (
    <>
      {toast && <Toast message={toast} onClose={closeToast} />}
      <h1 className="page-title">Dashboard</h1>

      {summaryError && <p className="form-error" role="alert">{summaryError}</p>}

      <div className="cards">
        <SummaryCard icon={<Users size={24} />} label="Interns" value={s?.internCount ?? '–'} tone="blue" />
        <SummaryCard icon={<ClipboardList size={24} />} label="Assignments" value={s?.totalAssignments ?? '–'} tone="blue" />
        <SummaryCard icon={<Loader size={24} />} label="In Progress" value={s?.inProgress ?? '–'} tone="blue" />
        <SummaryCard icon={<AlertTriangle size={24} />} label="Overdue" value={s?.overdue ?? '–'} tone="orange" />
      </div>

      <div className="panels">
        <section className="panel panel-narrow" id="interns">
          <div className="panel-head">
            <h2>Interns</h2>
            <Link to="/trainer/interns/new" className="btn btn-primary"><Plus size={16} aria-hidden="true" /> Add Intern</Link>
          </div>
          {trainees.loading && trainees.items.length === 0 ? (
            <p className="muted">Loading interns…</p>
          ) : trainees.error ? (
            <p className="form-error" role="alert">{trainees.error}</p>
          ) : trainees.items.length === 0 ? (
            <div className="empty">
              <p>No interns yet</p>
              <Link to="/trainer/interns/new" className="btn btn-outline">Add Intern</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th></tr></thead>
                <tbody>
                  {trainees.items.map((t) => (
                    <tr key={t.id}><td>{t.name}</td><td>{t.email}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel panel-wide" id="assignments">
          <div className="panel-head">
            <h2>Assignments</h2>
            <Link to="/trainer/assignments/new" className="btn btn-primary"><Plus size={16} aria-hidden="true" /> Create Assignment</Link>
          </div>
          {assignments.allLoading && assignments.all.length === 0 ? (
            <p className="muted">Loading assignments…</p>
          ) : assignments.allError ? (
            <p className="form-error" role="alert">{assignments.allError}</p>
          ) : assignments.all.length === 0 ? (
            <div className="empty">
              <p>No assignments yet</p>
              <Link to="/trainer/assignments/new" className="btn btn-outline">Create Assignment</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Topic</th><th>Trainee</th><th>Status</th><th>Due Date</th></tr></thead>
                <tbody>
                  {assignments.all.map((a) => (
                    <tr key={a.id}>
                      <td>{a.topic}</td>
                      <td>{a.traineeName}</td>
                      <td><StatusChip status={a.status} isOverdue={a.isOverdue} /></td>
                      <td>{formatDate(a.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
