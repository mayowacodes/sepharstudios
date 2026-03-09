import { kidsMovies } from '$lib/data/kidsmovies';
import { kidsShows } from '$lib/data/kidsshows';
import { kidsDocumentaries } from '$lib/data/kidsdocumentaries';
import { teenagersMovies } from '$lib/data/teenMovies';
import { teenagersShows } from '$lib/data/teenagersShows';
import { teenagersDocumentaries } from '$lib/data/teenagersDocumentaries';

type AgeGroup = 'kiddies' | 'teens';
type MediaType = 'movies' | 'shows' | 'documentaries';

export function resolveDataset(ageGroup: AgeGroup, type: MediaType) {
  const map = {
    kiddies: {
      movies: kidsMovies,
      shows: kidsShows,
      documentaries: kidsDocumentaries
    },
    teens: {
      movies: teenagersMovies,
      shows: teenagersShows,
      documentaries: teenagersDocumentaries
    }
  };

  return map[ageGroup]?.[type] ?? [];
}
