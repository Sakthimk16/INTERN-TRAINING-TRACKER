import { ChevronDown, GraduationCap, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

export default function TopBar({ onMenu }: { onMenu: () => void }) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="menu-btn" onClick={onMenu} aria-label="Open menu"><Menu size={22} /></button>
        <GraduationCap size={26} className="logo" aria-hidden="true" />
        <span className="brand">Intern Training Tracker</span>
      </div>
      <div className="topbar-right">
        {user && (
          <span className="who">{user.role} • {user.name} <ChevronDown size={14} aria-hidden="true" /></span>
        )}
        <button type="button" className="btn btn-outline" onClick={signOut}>Sign Out</button>
      </div>
    </header>
  );
}
