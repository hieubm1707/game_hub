import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  FolderTree,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  Settings,
} from 'lucide-react';
import { useAuth } from '../authentication/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/admin/games', label: 'Games', icon: Gamepad2 },
  { to: '/admin/games/new', label: 'Add / Import Game', icon: PlusCircle },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/content', label: 'Content Packs', icon: Package },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center arcade-bg p-4">
        <div className="brutal-panel p-6 text-center space-y-3">
          <p className="font-numeric text-sm font-bold uppercase">
            Verifying administrator session...
          </p>
          <div className="arcade-progress-track w-56 mx-auto">
            <div className="arcade-loading-bar h-full w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen arcade-bg">
      <aside className="hub-sidebar w-64 shrink-0 p-4 flex flex-col">
        <div className="mb-6 flex items-center justify-between border-b-[length:var(--border-w)] hub-divider pb-4">
          <Link to="/" className="hub-brand inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-bold">
            <Gamepad2 className="h-4 w-4" />
            Game Hub
          </Link>
          <span className="hub-badge-featured px-2 py-0.5 text-[10px] font-bold uppercase">
            {admin.role}
          </span>
        </div>

        <nav className="space-y-2 flex-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`arcade-btn arcade-btn-sm w-full justify-start px-3 py-2 text-xs ${
                  active ? 'arcade-btn-pink' : 'arcade-btn-white'
                }`}
              >
                <Icon className="h-4 w-4 stroke-[2.5]" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t-[length:var(--border-w)] hub-divider pt-4 space-y-2.5">
          <p className="truncate hub-alert-info px-2.5 py-1 font-numeric text-[11px] font-bold">
            {admin.email}
          </p>
          <button
            type="button"
            onClick={() => void logout()}
            className="arcade-btn arcade-btn-sm arcade-btn-black w-full px-3 py-2 text-xs"
          >
            <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6 pb-24 lg:p-8 lg:pb-24">
        <Outlet />
      </main>
    </div>
  );
}
