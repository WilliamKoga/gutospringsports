export type CatalogOrderMode = 'manual' | 'created_at';

export interface CatalogOrderUpdate {
  id: string;
  catalog_order: number;
}

export function hasCatalogFilters(searchParams: URLSearchParams): boolean {
  return ['search', 'role', 'position'].some((key) => {
    const value = searchParams.get(key);
    return value !== null && value.trim() !== '';
  });
}

export function getCatalogOrderMode(searchParams: URLSearchParams): CatalogOrderMode {
  return hasCatalogFilters(searchParams) ? 'created_at' : 'manual';
}

export function buildCatalogOrderUpdates(ids: unknown): CatalogOrderUpdate[] {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('ids must be a non-empty array');
  }

  const seen = new Set<string>();

  return ids.map((id, index) => {
    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error('ids must contain only non-empty strings');
    }

    if (seen.has(id)) {
      throw new Error('ids must be unique');
    }

    seen.add(id);

    return {
      id,
      catalog_order: index + 1,
    };
  });
}
