import { Link } from 'react-router-dom';
import { ArrowUpRight, Play, Star } from 'lucide-react';
import type { CompactCatalogGame } from '@game-hub/contract';

export function GameCategoryBadge({ category }: { category: string }) {
  return (
    <Link
      to={`/categories/${encodeURIComponent(category)}`}
      className="hub-badge px-2.5 py-0.5 text-[11px] uppercase tracking-wide transition-transform hover:-translate-y-0.5"
    >
      #{category}
    </Link>
  );
}

export function GameThumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden border-b-[length:var(--border-w)] hub-divider bg-black/90">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
      />
    </div>
  );
}

export function GameCard({ game }: { game: CompactCatalogGame }) {
  return (
    <article className="hub-card group flex flex-col">
      <Link to={`/games/${game.slug}`} className="relative block">
        <GameThumbnail src={game.thumbnail} alt={game.title} />
        {game.featured && (
          <span className="hub-badge-featured absolute left-2.5 top-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/games/${game.slug}`}
            className="text-lg font-bold leading-tight hover:underline"
          >
            {game.title}
          </Link>
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm font-medium hub-text-muted">
          {game.shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {game.categories.slice(0, 3).map((cat) => (
            <GameCategoryBadge key={cat} category={cat} />
          ))}
        </div>

        <div className="mt-auto pt-4 flex items-center gap-2.5">
          <Link
            to={`/play/${game.slug}`}
            className="arcade-btn arcade-btn-sm arcade-btn-pink flex-1 px-3 py-2 text-xs"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Play Now
          </Link>
          <Link
            to={`/games/${game.slug}`}
            className="arcade-btn arcade-btn-sm arcade-btn-white px-3 py-2 text-xs"
          >
            Details
            <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function GameGrid({
  games,
  emptyText = 'No games found.',
}: {
  games: CompactCatalogGame[];
  emptyText?: string;
}) {
  if (games.length === 0) {
    return (
      <div className="brutal-panel p-10 text-center font-numeric text-sm font-bold">
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
