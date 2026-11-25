import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Gamepad2, Search, Sparkles } from 'lucide-react';

export function PublicLayout() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/games');
  };

  return (
    <div className="min-h-screen flex flex-col arcade-bg">
      {/* Top status strip */}
      <div className="hub-topbar">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 hub-topbar-accent" />
            FREE TO PLAY • OFFLINE-FIRST
          </span>
          <span className="hidden sm:inline hub-topbar-accent">LOCAL SAVE ONLY // NO LOGIN</span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="hub-header sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/"
            className="hub-brand inline-flex items-center gap-2.5 px-3.5 py-1.5 transition-transform hover:-translate-y-0.5"
          >
            <Gamepad2 className="h-6 w-6 stroke-[2.5]" />
            <span className="text-lg font-bold tracking-tight">Game Hub</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[2.5] opacity-75" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search offline-first games..."
                aria-label="Search games"
                className="arcade-input pl-9 py-1.5"
              />
            </div>
            <button
              type="submit"
              className="arcade-btn arcade-btn-sm arcade-btn-black px-3.5 py-2 text-xs"
            >
              GO
            </button>
          </form>

          <nav className="flex items-center gap-2.5 text-xs">
            <Link
              to="/games"
              className={`arcade-btn arcade-btn-sm px-3.5 py-2 ${
                location.pathname.startsWith('/games') || location.pathname.startsWith('/categories')
                  ? 'arcade-btn-pink'
                  : 'arcade-btn-yellow'
              }`}
            >
              Games
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 pb-24">
        <Outlet />
      </main>

      <footer className="hub-footer mt-8 py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hub-brand px-2.5 py-0.5 text-xs font-bold">GAME HUB</span>
            <p className="font-numeric text-xs font-bold">
              © {new Date().getFullYear()} Game Hub. All rights reserved.
            </p>
          </div>
          <div className="flex gap-2.5 text-xs">
            <Link to="/privacy" className="arcade-btn arcade-btn-sm arcade-btn-yellow px-3 py-1 text-[11px]">
              Privacy
            </Link>
            <Link to="/terms" className="arcade-btn arcade-btn-sm arcade-btn-cyan px-3 py-1 text-[11px]">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
