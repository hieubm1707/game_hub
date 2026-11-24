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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Verifying administrator session...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="w-60 shrink-0 border-r border-slate-800 bg-slate-900/60 p-4 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="font-bold text-white">
            Game Hub
          </Link>
          <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-indigo-300">
            {admin.role}
          </span>
        </div>

        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 pt-4 space-y-2">
          <p className="truncate text-xs text-slate-400">{admin.email}</p>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex w-full items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
