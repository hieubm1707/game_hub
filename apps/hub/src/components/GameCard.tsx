import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { CompactCatalogGame } from '@game-hub/contract';

export function GameCategoryBadge({ category }: { category: string }) {
  return (
    <Link
      to={`/categories/${encodeURIComponent(category)}`}
      className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20"
    >
      {category}
    </Link>
  );
}

export function GameThumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-slate-900">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

export function GameCard({ game }: { game: CompactCatalogGame }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 transition hover:border-indigo-500/60">
      <Link to={`/games/${game.slug}`}>
        <GameThumbnail src={game.thumbnail} alt={game.title} />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/games/${game.slug}`}
            className="font-semibold text-white group-hover:text-indigo-300"
          >
            {game.title}
          </Link>
          {game.featured && (
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
              Featured
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-400">{game.shortDescription}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {game.categories.slice(0, 3).map((cat) => (
            <GameCategoryBadge key={cat} category={cat} />
          ))}
        </div>
        <div className="mt-auto pt-4 flex items-center gap-2">
          <Link
            to={`/play/${game.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            <Play className="h-4 w-4" />
            Play Now
          </Link>
          <Link
            to={`/games/${game.slug}`}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function GameGrid({ games, emptyText = 'No games found.' }: { games: CompactCatalogGame[]; emptyText?: string }) {
  if (games.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center text-slate-400">
        {emptyText}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((g) => (
        <GameCard key={g.id} game={g} />
      ))}
    </div>
  );
}
