import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { landingFor } from '../services/utils';
import type { Role } from '../services/types';

/** Route guard: anonymous -> /login; wrong role -> that user's own landing page (TRD section 9.1). */
export default function RequireRole({ role }: { role: Role }) {
  const user = useAppSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={landingFor(user.role)} replace />;
  return <Outlet />;
}
