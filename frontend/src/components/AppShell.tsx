import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

/** Top bar + sidebar + content area for S2-S6. The login page uses no shell. */
export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="shell">
      <TopBar onMenu={() => setMenuOpen((o) => !o)} />
      <div className="shell-body">
        <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
