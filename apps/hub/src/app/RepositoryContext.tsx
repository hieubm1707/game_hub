import React, { createContext, useContext, useMemo } from 'react';
import { getHubFirestore } from '../firebase/client';
import { createFirestoreRepositories } from '../repositories/firestoreRepositories';
import type { HubRepositories } from '../repositories/interfaces';

const RepositoryContext = createContext<HubRepositories | null>(null);

export function RepositoryProvider({
  repositories,
  children,
}: {
  repositories?: HubRepositories;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => repositories ?? createFirestoreRepositories(getHubFirestore()),
    [repositories]
  );
  return <RepositoryContext.Provider value={value}>{children}</RepositoryContext.Provider>;
}

export function useRepositories(): HubRepositories {
  const ctx = useContext(RepositoryContext);
  if (!ctx) throw new Error('useRepositories must be used inside RepositoryProvider');
  return ctx;
}
