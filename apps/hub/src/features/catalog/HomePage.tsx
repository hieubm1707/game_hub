import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Play,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import type { CompactCatalogGame } from '@game-hub/contract';
import { getLocalizedGameText, matchesGameQuery, useI18n } from '../../app/I18nContext';
import { useTheme } from '../../app/ThemeContext';
import { useCatalog } from '../../hooks/useCatalog';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

function ShowcaseCard({ game, wide = false }: { game: CompactCatalogGame; wide?: boolean }) {
  const { locale, t } = useI18n();
  const localized = getLocalizedGameText(game, locale);

  return (
    <article
      className={`hub-card group relative flex flex-col overflow-hidden ${
        wide ? 'sm:col-span-2' : ''
      }`}
    >
      <Link
        to={`/games/${game.slug}`}
        className={`relative block w-full overflow-hidden bg-black ${
          wide ? 'aspect-[16/9] sm:aspect-[21/10]' : 'aspect-[4/3]'
        }`}
      >
        <img
          src={game.thumbnail}
          alt={localized.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Top-left category/version pill */}
        <span className="hub-badge-featured absolute left-3 top-3 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase">
          {game.categories[0] ?? t('common.gameFallback')}
        </span>

        {/* Bottom overlay title */}
        <div className="absolute inset-x-3 bottom-3">
          <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm line-clamp-1">
            {localized.title}
          </h3>
          <p className="mt-0.5 text-xs text-white/80 line-clamp-1">{localized.shortDescription}</p>
        </div>
      </Link>

      <div className="flex items-center gap-2 p-3">
        <Link
          to={`/play/${game.slug}`}
          className="arcade-btn arcade-btn-sm arcade-btn-pink flex-1 px-3 py-2 text-xs"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          {t('common.playNow')}
        </Link>
        <Link
          to={`/games/${game.slug}`}
          className="arcade-btn arcade-btn-sm arcade-btn-white px-3 py-2 text-xs"
        >
          {t('common.details')}
        </Link>
      </div>
    </article>
  );
}

export function HomePage() {
  const { locale, t } = useI18n();
  useDocumentTitle(t('home.docTitle'), t('home.docDesc'));
  const { games, categories, loading, stale, error, refresh } = useCatalog();
  const { theme } = useTheme();
  const isBento = theme === 'dark-bento-glass';

  const [activeTab, setActiveTab] = useState<string>('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stripPaused, setStripPaused] = useState(false);
  const [stripOverflows, setStripOverflows] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
      : false
  );
  const stripRef = useRef<HTMLDivElement>(null);
  const manualScrollUntilRef = useRef(0);

  const featured = useMemo(() => games.filter((g) => g.featured), [games]);
  const slides = useMemo(() => {
    if (featured.length > 1) return featured;
    const rest = games.filter((g) => !g.featured);
    return [...featured, ...rest].slice(0, 5);
  }, [featured, games]);
  const recent = useMemo(
    () => [...games].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [games]
  );
  const marqueeRecent = useMemo(
    () => (stripOverflows && recent.length > 1 ? [...recent, ...recent] : recent),
    [recent, stripOverflows]
  );

  // Sync OS reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(media.matches);
    onChange();
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  // Only duplicate marquee cards when a single copy actually overflows the strip width
  useEffect(() => {
    if (loading || recent.length <= 1) {
      setStripOverflows(false);
      return;
    }
    const el = stripRef.current;
    if (!el) return;

    const STRIP_GAP_PX = 16;

    const measure = () => {
      const singleWidth = stripOverflows ? (el.scrollWidth - STRIP_GAP_PX) / 2 : el.scrollWidth;
      const next = singleWidth > el.clientWidth + 1;
      if (!next && el.scrollLeft !== 0) {
        el.scrollLeft = 0;
      }
      setStripOverflows(next);
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, recent.length, stripOverflows]);

  // Keep slideIndex in bounds when catalog updates
  useEffect(() => {
    if (slideIndex >= slides.length) {
      setSlideIndex(0);
    }
  }, [slides.length, slideIndex]);

  // Auto-advance banner slides every 3 seconds, looping back to the first slide
  useEffect(() => {
    if (slides.length <= 1 || paused || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [slides.length, paused, prefersReducedMotion]);

  // Smooth, continuous horizontal auto-scroll for the Recently Updated strip
  useEffect(() => {
    if (loading || !stripOverflows || recent.length <= 1 || stripPaused || prefersReducedMotion) {
      return;
    }
    const el = stripRef.current;
    if (!el) return;

    let rafId = 0;
    let lastTime = performance.now();
    let carry = 0;
    const SPEED_PX_PER_SEC = 42;
    const STRIP_GAP_PX = 16;

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50) / 1000;
      lastTime = now;

      if (now >= manualScrollUntilRef.current) {
        const loopWidth = (el.scrollWidth + STRIP_GAP_PX) / 2;
        if (loopWidth > el.clientWidth) {
          carry += SPEED_PX_PER_SEC * dt;
          const step = Math.floor(carry);
          if (step >= 1) {
            carry -= step;
            el.scrollLeft += step;
            if (el.scrollLeft >= loopWidth) {
              el.scrollLeft -= loopWidth;
            }
          }
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [loading, stripOverflows, recent.length, stripPaused, prefersReducedMotion]);

  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      if (activeTab === 'featured' && !g.featured) return false;
      if (activeTab !== 'all' && activeTab !== 'featured' && !g.categories.includes(activeTab)) {
        return false;
      }
      return matchesGameQuery(g, filterQuery, locale);
    });
  }, [games, activeTab, filterQuery, locale]);

  const activeSlide = slides[slideIndex] ?? null;
  const activeSlideText = activeSlide ? getLocalizedGameText(activeSlide, locale) : null;

  const goPrevSlide = () => {
    if (slides.length <= 1) return;
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNextSlide = () => {
    if (slides.length <= 1) return;
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const scrollStrip = (direction: 'left' | 'right') => {
    const el = stripRef.current;
    if (!el) return;
    const step = 320;
    const STRIP_GAP_PX = 16;
    manualScrollUntilRef.current = performance.now() + 500;
    if (stripOverflows) {
      const loopWidth = (el.scrollWidth + STRIP_GAP_PX) / 2;
      if (direction === 'left' && el.scrollLeft < step) {
        el.scrollLeft += loopWidth;
      } else if (direction === 'right' && el.scrollLeft + el.clientWidth + step >= el.scrollWidth) {
        el.scrollLeft -= loopWidth;
      }
    }
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* 1. Full-Width Interactive Slide Banner */}
      <section
        aria-label={t('home.heroAria')}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setPaused(false);
          }
        }}
        className="brutal-panel-lg hub-hero-panel relative overflow-hidden"
      >
        {activeSlide && activeSlideText ? (
          <div className="relative min-h-[280px] sm:min-h-[340px] flex items-end sm:items-center">
            <img
              src={activeSlide.thumbnail}
              alt={activeSlideText.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/20" />

            <div className="relative z-10 max-w-2xl p-6 sm:p-10 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="hub-badge-featured inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  {activeSlide.featured ? t('common.featured') : t('common.nowPlaying')}
                </span>
                <span className="hub-topbar px-2.5 py-1 text-[10px] font-bold uppercase rounded-[var(--radius-badge)]">
                  {t('common.offlineFirst')}
                </span>
              </div>

              <div>
                <p className="font-numeric text-xs font-bold uppercase tracking-widest text-white/75">
                  {activeSlide.categories.slice(0, 3).join(' • ') || 'Game Hub'}
                </p>
                <h1 className="mt-1 text-3xl sm:text-5xl font-bold leading-tight text-white">
                  {activeSlideText.title}
                </h1>
                <p className="mt-2 max-w-xl text-sm sm:text-base font-medium text-white/85 line-clamp-2">
                  {activeSlideText.shortDescription}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to={`/play/${activeSlide.slug}`}
                  className="arcade-btn arcade-btn-pink px-6 py-2.5 text-sm"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {t('common.playNow')}
                </Link>
                <Link
                  to={`/games/${activeSlide.slug}`}
                  className="arcade-btn arcade-btn-white px-5 py-2.5 text-sm"
                >
                  {t('common.details')}
                </Link>
              </div>
            </div>

            {/* Slide Controls */}
            {slides.length > 1 && (
              <>
                <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrevSlide}
                    aria-label={t('home.prevSlide')}
                    className="arcade-btn arcade-btn-sm arcade-btn-white p-2"
                  >
                    <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={goNextSlide}
                    aria-label={t('home.nextSlide')}
                    className="arcade-btn arcade-btn-sm arcade-btn-white p-2"
                  >
                    <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>

                <div
                  className="absolute bottom-4 right-5 z-10 flex items-center gap-2"
                  role="tablist"
                  aria-label={t('home.heroAria')}
                >
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      role="tab"
                      aria-selected={idx === slideIndex}
                      aria-label={t('home.goToSlide', { n: idx + 1 })}
                      onClick={() => setSlideIndex(idx)}
                      className={`h-3 border-2 border-black transition-all cursor-pointer ${
                        idx === slideIndex
                          ? 'w-8 bg-white'
                          : 'w-3 bg-white/45 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="min-h-[220px] flex flex-col items-center justify-center p-8 text-center space-y-3">
            <Gamepad2 className="h-10 w-10" />
            <h1 className="text-2xl font-bold">
              {loading ? t('common.loadingCatalog') : t('home.emptyHeroTitle')}
            </h1>
            <p className="max-w-md text-sm hub-text-muted">
              {loading ? t('common.loadingCatalog') : t('home.emptyHeroDesc')}
            </p>
          </div>
        )}
      </section>

      {error && (
        <div className="hub-alert-error p-4 font-numeric text-sm font-bold">ERROR: {error}</div>
      )}

      {stale && !error && (
        <div className="hub-alert-info px-4 py-2.5 font-numeric text-xs font-bold uppercase">
          {t('home.cachedNotice')}
        </div>
      )}

      {/* 2. Tabs + Inline Filter & Refresh Bar (inspired by reference) */}
      <section className="space-y-5">
        <div className="brutal-panel p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label={t('home.filterAria')}>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
              className={`arcade-btn arcade-btn-sm px-3.5 py-1.5 text-xs ${
                activeTab === 'all' ? 'arcade-btn-pink' : 'arcade-btn-white'
              }`}
            >
              {t('common.all')} ({games.length})
            </button>
            {featured.length > 0 && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'featured'}
                onClick={() => setActiveTab('featured')}
                className={`arcade-btn arcade-btn-sm px-3.5 py-1.5 text-xs ${
                  activeTab === 'featured' ? 'arcade-btn-pink' : 'arcade-btn-white'
                }`}
              >
                {t('common.featured')}
              </button>
            )}
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={activeTab === c.id}
                onClick={() => setActiveTab(c.id)}
                className={`arcade-btn arcade-btn-sm px-3.5 py-1.5 text-xs ${
                  activeTab === c.id ? 'arcade-btn-pink' : 'arcade-btn-white'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex flex-1 sm:flex-initial items-center gap-2 justify-end">
            <div className="relative w-full sm:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[2.5] opacity-70" />
              <input
                type="search"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={t('home.filterPlaceholder')}
                aria-label={t('home.filterAria')}
                className="arcade-input pl-9 py-1.5 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              title={t('common.refreshCatalog')}
              className="arcade-btn arcade-btn-sm arcade-btn-yellow px-3 py-2 text-xs shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="hidden md:inline">{t('common.refresh')}</span>
            </button>
          </div>
        </div>

        {/* 3. 4-Column Showcase Grid */}
        {loading ? (
          <div className="brutal-panel p-10 text-center space-y-4">
            <p className="font-numeric text-sm font-bold uppercase">{t('common.loadingCatalog')}</p>
            <div className="arcade-progress-track mx-auto max-w-md">
              <div className="arcade-loading-bar h-full w-full" />
            </div>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="brutal-panel p-10 text-center font-numeric text-sm font-bold">
            {t('home.noMatchingGames')}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredGames.map((g, idx) => (
              <ShowcaseCard key={g.id} game={g} wide={isBento && idx === 0 && filteredGames.length >= 3} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Bottom Horizontal Scroll Row ("Recently Updated / Popular Strip") */}
      {!loading && recent.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Gamepad2 className="h-5 w-5 hub-text-highlight stroke-[2.5]" />
              <h2 className="text-xl font-bold tracking-tight">{t('home.recentlyUpdated')}</h2>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/games"
                className="arcade-btn arcade-btn-sm arcade-btn-white px-3 py-1.5 text-xs"
              >
                {t('common.viewAll')}
              </Link>
              <button
                type="button"
                disabled={!stripOverflows}
                onClick={() => scrollStrip('left')}
                aria-label={t('home.scrollLeft')}
                className="arcade-btn arcade-btn-sm arcade-btn-white p-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                disabled={!stripOverflows}
                onClick={() => scrollStrip('right')}
                aria-label={t('home.scrollRight')}
                className="arcade-btn arcade-btn-sm arcade-btn-white p-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div
            ref={stripRef}
            onMouseEnter={() => setStripPaused(true)}
            onMouseLeave={() => setStripPaused(false)}
            onTouchStart={() => setStripPaused(true)}
            onTouchEnd={() => setStripPaused(false)}
            className="no-scrollbar flex gap-4 overflow-x-auto pb-2"
          >
            {marqueeRecent.map((g, idx) => {
              const gText = getLocalizedGameText(g, locale);
              return (
                <Link
                  key={`${g.id}-${idx}`}
                  to={`/games/${g.slug}`}
                  aria-hidden={idx >= recent.length ? true : undefined}
                  tabIndex={idx >= recent.length ? -1 : undefined}
                  className="hub-card group shrink-0 w-44 sm:w-48 flex flex-col"
                >
                  <div className="aspect-square w-full overflow-hidden bg-black relative">
                    <img
                      src={g.thumbnail}
                      alt={gText.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5">
                      <p className="text-sm font-bold leading-tight text-white line-clamp-1">
                        {gText.title}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Editorial Platform Overview (helpful for visitors & search crawlers) */}
      <section className="brutal-panel p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight">
            {t('home.overviewTitle')}
          </h2>
          <Link
            to="/about"
            className="arcade-btn arcade-btn-sm arcade-btn-white px-3.5 py-1.5 text-xs"
          >
            {t('home.overviewLearnMore')}
          </Link>
        </div>
        <p className="text-sm leading-relaxed hub-text-muted">
          {t('home.overviewBody')}
        </p>
      </section>
    </div>
  );
}
