import React from 'react';

function ShimmerBlock({
  className = '',
  variant = 'surface',
}: {
  className?: string;
  variant?: 'surface' | 'hero' | 'canvas';
}) {
  const variantClass =
    variant === 'hero'
      ? 'hub-shimmer-hero'
      : variant === 'canvas'
        ? 'hub-shimmer-canvas'
        : '';
  return <div aria-hidden="true" className={`hub-shimmer ${variantClass} ${className}`.trim()} />;
}

/** Hero banner shimmer skeleton mirroring HomePage's interactive featured banner. */
export function HomeHeroSkeleton({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className="relative min-h-[280px] sm:min-h-[340px] flex items-end sm:items-center hub-hero-skeleton"
    >
      <span className="sr-only">{label}</span>
      <div className="relative z-10 w-full max-w-2xl p-5 pb-16 sm:p-10 sm:pr-28 sm:pb-10 space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <ShimmerBlock variant="hero" className="h-6 w-28 rounded-[var(--radius-badge)]" />
          <ShimmerBlock variant="hero" className="h-6 w-24 rounded-[var(--radius-badge)]" />
        </div>
        <div className="space-y-2.5">
          <ShimmerBlock variant="hero" className="h-3.5 w-40 rounded-[var(--radius-badge)]" />
          <ShimmerBlock variant="hero" className="h-9 sm:h-12 w-3/4 rounded-[var(--radius-input)]" />
          <ShimmerBlock variant="hero" className="h-4 w-full max-w-lg rounded-[var(--radius-badge)]" />
          <ShimmerBlock variant="hero" className="h-4 w-2/3 max-w-md rounded-[var(--radius-badge)]" />
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <ShimmerBlock variant="hero" className="h-10 w-32 sm:w-36 rounded-[var(--radius-btn)]" />
          <ShimmerBlock variant="hero" className="h-10 w-24 sm:w-28 rounded-[var(--radius-btn)]" />
        </div>
      </div>
      <div className="absolute bottom-4 left-5 sm:left-auto sm:right-5 flex items-center gap-2" aria-hidden="true">
        <ShimmerBlock variant="hero" className="h-3 w-8 rounded-[var(--radius-badge)]" />
        <ShimmerBlock variant="hero" className="h-3 w-3 rounded-[var(--radius-badge)]" />
        <ShimmerBlock variant="hero" className="h-3 w-3 rounded-[var(--radius-badge)]" />
      </div>
    </div>
  );
}

/** Category filter chip shimmer placeholders shown while catalog metadata loads. */
export function CategoryChipsSkeleton({
  count = 4,
  onCanvas = false,
}: {
  count?: number;
  onCanvas?: boolean;
}) {
  return (
    <div
      className="no-scrollbar flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto pb-0.5"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, idx) => (
        <ShimmerBlock
          key={idx}
          variant={onCanvas ? 'canvas' : 'surface'}
          className={`h-8 shrink-0 rounded-[var(--radius-btn)] ${idx === 0 ? 'w-20' : 'w-24'}`}
        />
      ))}
    </div>
  );
}

/** 4-column showcase card shimmer grid for HomePage. */
export function ShowcaseGridSkeleton({
  label,
  count = 8,
}: {
  label: string;
  count?: number;
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      data-testid="home-showcase-shimmer"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, idx) => (
        <article
          key={idx}
          aria-hidden="true"
          className="hub-card flex flex-col overflow-hidden"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden hub-hero-skeleton">
            <ShimmerBlock variant="hero" className="absolute inset-0" />
            <ShimmerBlock
              variant="hero"
              className="absolute left-3 top-3 h-5 w-20 rounded-[var(--radius-badge)]"
            />
            <div className="absolute inset-x-3 bottom-3 space-y-2">
              <ShimmerBlock variant="hero" className="h-5 w-3/4 rounded-[var(--radius-badge)]" />
              <ShimmerBlock variant="hero" className="h-3.5 w-11/12 rounded-[var(--radius-badge)]" />
            </div>
          </div>
          <div className="flex items-center gap-2 p-3">
            <ShimmerBlock className="h-9 flex-1 rounded-[var(--radius-btn)]" />
            <ShimmerBlock className="h-9 w-20 rounded-[var(--radius-btn)]" />
          </div>
        </article>
      ))}
    </div>
  );
}

/** 3-column game card shimmer grid for GamesListPage. */
export function GameCardGridSkeleton({
  label,
  count = 6,
}: {
  label: string;
  count?: number;
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      data-testid="games-grid-shimmer"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, idx) => (
        <article
          key={idx}
          aria-hidden="true"
          className="hub-card flex flex-col overflow-hidden"
        >
          <div className="aspect-video w-full border-b-[length:var(--border-w)] hub-divider overflow-hidden">
            <ShimmerBlock className="h-full w-full" />
          </div>
          <div className="flex flex-1 flex-col p-4">
            <ShimmerBlock className="h-6 w-2/3 rounded-[var(--radius-badge)]" />
            <div className="mt-2.5 space-y-1.5">
              <ShimmerBlock className="h-3.5 w-full rounded-[var(--radius-badge)]" />
              <ShimmerBlock className="h-3.5 w-4/5 rounded-[var(--radius-badge)]" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <ShimmerBlock className="h-6 w-16 rounded-[var(--radius-badge)]" />
              <ShimmerBlock className="h-6 w-20 rounded-[var(--radius-badge)]" />
            </div>
            <div className="mt-auto pt-4 flex items-center gap-2.5">
              <ShimmerBlock className="h-9 flex-1 rounded-[var(--radius-btn)]" />
              <ShimmerBlock className="h-9 w-24 rounded-[var(--radius-btn)]" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
