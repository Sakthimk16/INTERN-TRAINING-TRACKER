import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../components/AppShell';
import RequireRole from '../components/RequireRole';
import Login from '../pages/Login';
import TrainerDashboard from '../pages/TrainerDashboard';
import AddIntern from '../pages/AddIntern';
import CreateAssignment from '../pages/CreateAssignment';
import TraineeDashboard from '../pages/TraineeDashboard';
import AssignmentDetails from '../pages/AssignmentDetails';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RequireRole role="Trainer" />}>
        <Route element={<AppShell />}>
          <Route path="/trainer" element={<TrainerDashboard />} />
          <Route path="/trainer/interns/new" element={<AddIntern />} />
          <Route path="/trainer/assignments/new" element={<CreateAssignment />} />
        </Route>
      </Route>

      <Route element={<RequireRole role="Trainee" />}>
        <Route element={<AppShell />}>
          <Route path="/trainee" element={<TraineeDashboard />} />
          <Route path="/trainee/assignments/:id" element={<AssignmentDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
