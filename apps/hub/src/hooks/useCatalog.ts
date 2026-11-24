import { useCallback, useEffect, useState } from 'react';
import type { CategoryRecord, PublicCatalogDocument } from '@game-hub/contract';
import { useRepositories } from '../app/RepositoryContext';

export function useCatalog() {
  const { catalog, categories } = useRepositories();
  const [data, setData] = useState<PublicCatalogDocument | null>(null);
  const [categoryList, setCategoryList] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (forceRefresh = false) => {
      setLoading(true);
      setError(null);
      try {
        const [catRes, cats] = await Promise.all([
          catalog.getPublicCatalog({ forceRefresh }),
          categories.listEnabledCategories().catch(() => []),
        ]);
        setData(catRes.catalog);
        setStale(catRes.stale);
        setCategoryList(cats);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load catalog right now. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    },
    [catalog, categories]
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  return {
    catalog: data,
    games: data?.games ?? [],
    categories: categoryList,
    loading,
    stale,
    error,
    refresh: () => load(true),
  };
}
