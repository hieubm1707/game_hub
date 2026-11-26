import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Gamepad2, Globe, Search, Sparkles } from 'lucide-react';
import { SUPPORTED_LOCALES, useI18n, type SupportedLocale } from '../app/I18nContext';

export function PublicLayout() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { locale, setLocale, t } = useI18n();

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
            {t('topbar.tagline')}
          </span>
          <span className="hidden sm:inline hub-topbar-accent">{t('topbar.localSave')}</span>
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

          <nav className="flex items-center gap-2.5 text-xs">
            <Link
              to="/games"
              className={`arcade-btn arcade-btn-sm px-3.5 py-2 ${
                location.pathname.startsWith('/games') || location.pathname.startsWith('/categories')
                  ? 'arcade-btn-pink'
                  : 'arcade-btn-yellow'
              }`}
            >
              {t('nav.games')}
            </Link>
            <div className="relative inline-flex items-center">
              <Globe className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 stroke-[2.5] opacity-80" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                aria-label={t('nav.languageAria')}
                className="arcade-btn arcade-btn-sm arcade-btn-white cursor-pointer appearance-none pl-7 pr-3 py-2 text-xs font-bold uppercase"
              >
                {SUPPORTED_LOCALES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.shortLabel}
                  </option>
                ))}
              </select>
            </div>
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
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 text-xs">
            <Link to="/about" className="arcade-btn arcade-btn-sm arcade-btn-white px-3 py-1 text-[11px]">
              {t('footer.about')}
            </Link>
            <Link to="/contact" className="arcade-btn arcade-btn-sm arcade-btn-lime px-3 py-1 text-[11px]">
              {t('footer.contact')}
            </Link>
            <Link to="/privacy" className="arcade-btn arcade-btn-sm arcade-btn-yellow px-3 py-1 text-[11px]">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="arcade-btn arcade-btn-sm arcade-btn-cyan px-3 py-1 text-[11px]">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
