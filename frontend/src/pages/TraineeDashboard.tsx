import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Loader, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchSummary } from '../features/dashboard/dashboardSlice';
import { fetchMyAssignments } from '../features/assignments/assignmentsSlice';
import SummaryCard from '../components/SummaryCard';
import StatusChip from '../components/StatusChip';
import ProgressBar from '../components/ProgressBar';
import { formatDate } from '../services/utils';

/** S5 - Trainee dashboard: summary cards, completion progress bar, my assignments. */
export default function TraineeDashboard() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { summary, error: summaryError } = useAppSelector((s) => s.dashboard);
  const { mine, mineLoading, mineError } = useAppSelector((s) => s.assignments);

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchMyAssignments());
  }, [dispatch]);

  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [location.hash]);

  const s = summary?.role === 'Trainee' ? summary : null;

  return (
    <>
      <h1 className="page-title">My Dashboard</h1>
      {summaryError && <p className="form-error" role="alert">{summaryError}</p>}

      <div className="cards cards-5">
        <SummaryCard icon={<Users size={24} />} label="Total" value={s?.total ?? '–'} tone="blue" />
        <SummaryCard icon={<AlertTriangle size={24} />} label="Not Started" value={s?.notStarted ?? '–'} tone="grey" />
        <SummaryCard icon={<Loader size={24} />} label="In Progress" value={s?.inProgress ?? '–'} tone="blue" />
        <SummaryCard icon={<CheckCircle2 size={24} />} label="Completed" value={s?.completed ?? '–'} tone="green" />
        <SummaryCard icon={<AlertTriangle size={24} />} label="Overdue" value={s?.overdue ?? '–'} tone="orange" />
      </div>

      <section className="panel">
        <h2>Completion</h2>
        <ProgressBar percent={s?.completionPercent ?? 0} />
      </section>

      <section className="panel" id="assignments">
        <h2>My Assignments</h2>
        {mineLoading && mine.length === 0 ? (
          <p className="muted">Loading assignments…</p>
        ) : mineError ? (
          <p className="form-error" role="alert">{mineError}</p>
        ) : mine.length === 0 ? (
          <p className="muted">No assignments yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Topic</th><th>Status</th><th>Due Date</th><th>Action</th></tr></thead>
              <tbody>
                {mine.map((a) => (
                  <tr key={a.id}>
                    <td>{a.topic}</td>
                    <td><StatusChip status={a.status} isOverdue={a.isOverdue} /></td>
                    <td>{formatDate(a.dueDate)}</td>
                    <td><Link to={`/trainee/assignments/${a.id}`} className="link">Open &gt;</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
