const FAVORITES_KEY = "favorite_properties";

export const getFavorites = (): number[] => {
  const raw = localStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as number[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const isFavorite = (id: number): boolean =>
  getFavorites().includes(id);

export const toggleFavorite = (id: number): number[] => {
  const current = new Set(getFavorites());
  if (current.has(id)) {
    current.delete(id);
  } else {
    current.add(id);
  }
  const next = Array.from(current);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
};
