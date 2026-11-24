import type { Status } from '../services/types';

const CLASS: Record<Status, string> = {
  'Not Started': 'chip-grey',
  'In Progress': 'chip-blue',
  Completed: 'chip-green',
};

/** Pill showing the stored status, or "Overdue" when the server says isOverdue. Always text, never colour only. */
export default function StatusChip({ status, isOverdue }: { status: Status; isOverdue?: boolean }) {
  if (isOverdue) return <span className="chip chip-orange">Overdue</span>;
  return <span className={`chip ${CLASS[status]}`}>{status}</span>;
}
