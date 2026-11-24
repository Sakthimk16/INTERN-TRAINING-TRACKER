import type { ReactNode } from 'react';
import { ClipboardList, LayoutDashboard, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface Item { key: string; label: string; icon: ReactNode; to: { pathname: string; hash?: string } }

export default function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const role = useAppSelector((s) => s.auth.user?.role);
  const { pathname, hash } = useLocation();

  const trainerItems: Item[] = [
    { key: 'dash', label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: { pathname: '/trainer' } },
    { key: 'interns', label: 'Interns', icon: <Users size={18} />, to: { pathname: '/trainer', hash: '#interns' } },
    { key: 'assignments', label: 'Assignments', icon: <ClipboardList size={18} />, to: { pathname: '/trainer', hash: '#assignments' } },
  ];
  const traineeItems: Item[] = [
    { key: 'dash', label: 'My Dashboard', icon: <LayoutDashboard size={18} />, to: { pathname: '/trainee' } },
    { key: 'assignments', label: 'My Assignments', icon: <ClipboardList size={18} />, to: { pathname: '/trainee', hash: '#assignments' } },
  ];

  // Which item is highlighted (TRD section 9.1: S3 -> Interns, S4 -> Assignments, S6 -> My Assignments).
  let active = 'dash';
  if (pathname.startsWith('/trainer/interns')) active = 'interns';
  else if (pathname.startsWith('/trainer/assignments')) active = 'assignments';
  else if (pathname.startsWith('/trainee/assignments')) active = 'assignments';
  else if (hash === '#interns') active = 'interns';
  else if (hash === '#assignments') active = 'assignments';

  const items = role === 'Trainer' ? trainerItems : traineeItems;

  return (
    <nav className={`sidebar${open ? ' open' : ''}`} aria-label="Main">
      {items.map((it) => (
        <Link
          key={it.key}
          to={it.to}
          onClick={onNavigate}
          className={`side-item${active === it.key ? ' active' : ''}`}
          aria-current={active === it.key ? 'page' : undefined}
        >
          {it.icon} {it.label}
        </Link>
      ))}
    </nav>
  );
}
