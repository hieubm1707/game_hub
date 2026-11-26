import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Gamepad2, Search, Sparkles, X } from 'lucide-react';
import { useI18n } from '../app/I18nContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function PublicLayout() {
  const [query, setQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    setMobileSearchOpen(false);
  }, [location.pathname, location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setMobileSearchOpen(false);
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/games');
  };

  return (
    <div className="min-h-screen flex flex-col arcade-bg">
      {/* Top status strip */}
      <div className="hub-topbar">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 shrink-0 hub-topbar-accent" />
            <span className="truncate">{t('topbar.tagline')}</span>
          </span>
          <span className="hidden sm:inline shrink-0 hub-topbar-accent">{t('topbar.localSave')}</span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="hub-header sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
          <Link
            to="/"
            className="hub-brand inline-flex shrink-0 items-center gap-1.5 sm:gap-2.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 transition-transform hover:-translate-y-0.5"
          >
            <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 stroke-[2.5]" />
            <span className="whitespace-nowrap text-base sm:text-lg font-bold tracking-tight">
              Game Hub
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[2.5] opacity-75" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('header.searchPlaceholder')}
                aria-label={t('header.searchAria')}
                className="arcade-input pl-9 py-1.5"
              />
            </div>
            <button
              type="submit"
              className="arcade-btn arcade-btn-sm arcade-btn-black px-3.5 py-2 text-xs"
            >
              {t('header.go')}
            </button>
          </form>

          <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2.5 text-xs">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              aria-label={t('header.searchAria')}
              aria-expanded={mobileSearchOpen}
              className="arcade-btn arcade-btn-sm arcade-btn-white p-2 sm:hidden"
            >
              {mobileSearchOpen ? (
                <X className="h-4 w-4 stroke-[2.5]" />
              ) : (
                <Search className="h-4 w-4 stroke-[2.5]" />
              )}
            </button>
            <Link
              to="/games"
              className={`arcade-btn arcade-btn-sm whitespace-nowrap px-2.5 py-1.5 sm:px-3.5 sm:py-2 ${
                location.pathname.startsWith('/games') || location.pathname.startsWith('/categories')
                  ? 'arcade-btn-pink'
                  : 'arcade-btn-yellow'
              }`}
            >
              {t('nav.games')}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>

        {mobileSearchOpen && (
          <form
            onSubmit={handleSearch}
            className="sm:hidden border-t-[length:var(--border-w)] hub-divider px-3 py-2.5 flex items-center gap-2"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[2.5] opacity-75" />
              <input
                type="search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('header.searchPlaceholder')}
                aria-label={t('header.searchAria')}
                className="arcade-input pl-9 py-1.5 text-sm"
              />
            </div>
            <button
              type="submit"
              className="arcade-btn arcade-btn-sm arcade-btn-black shrink-0 px-3.5 py-2 text-xs"
            >
              {t('header.go')}
            </button>
          </form>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-3 sm:px-4 py-5 sm:py-8 pb-12 sm:pb-24">
        <Outlet />
      </main>

      <footer className="hub-footer mt-6 sm:mt-8 py-5 sm:py-6">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-4 px-3 sm:px-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hub-brand px-2.5 py-0.5 text-xs font-bold">GAME HUB</span>
            <p className="font-numeric text-xs font-bold">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-2.5 text-xs w-full sm:w-auto">
            <Link to="/about" className="arcade-btn arcade-btn-sm arcade-btn-white px-3 py-1.5 sm:py-1 text-[11px]">
              {t('footer.about')}
            </Link>
            <Link to="/contact" className="arcade-btn arcade-btn-sm arcade-btn-lime px-3 py-1.5 sm:py-1 text-[11px]">
              {t('footer.contact')}
            </Link>
            <Link to="/privacy" className="arcade-btn arcade-btn-sm arcade-btn-yellow px-3 py-1.5 sm:py-1 text-[11px]">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="arcade-btn arcade-btn-sm arcade-btn-cyan px-3 py-1.5 sm:py-1 text-[11px]">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
