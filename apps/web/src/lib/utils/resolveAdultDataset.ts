import { faithMovies } from '$lib/data/movies';
import { faithTVShows } from '$lib/data/shows';
import { faithDocumentaries } from '$lib/data/documentaries';

type MediaType = 'movies' | 'shows' | 'documentaries';

export function resolveAdultDataset(type: MediaType) {
  const map = {
    movies: faithMovies,
    shows: faithTVShows,
    documentaries: faithDocumentaries
  };

  return map[type] ?? [];
}
