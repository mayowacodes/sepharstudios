// stores/favoritesStore.ts
import { writable } from 'svelte/store';

export const favoritesStore = writable({
  favorites: [] as string[],
  watchlist: [] as string[]
});

export const addToFavorites = (id: string) => {
  favoritesStore.update(store => {
    return {
      ...store,
      favorites: [...store.favorites, id]
    };
  });
};

export const removeFromFavorites = (id: string) => {
  favoritesStore.update(store => {
    return {
      ...store,
      favorites: store.favorites.filter(item => item !== id)
    };
  });
};

export const addToWatchlist = (id: string) => {
  favoritesStore.update(store => {
    return {
      ...store,
      watchlist: [...store.watchlist, id]
    };
  });
};

export const removeFromWatchlist = (id: string) => {
  favoritesStore.update(store => {
    return {
      ...store,
      watchlist: store.watchlist.filter(item => item !== id)
    };
  });
};
