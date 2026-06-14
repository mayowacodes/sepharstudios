// src/lib/types/media.ts
export type MediaItem = {
  id: string;
  // Audience category set by the upload wizard / admin. `null` (or
  // absent) means general-audience. `kids` and `teens` route through
  // the audience-specific detail pages instead of /movies/<slug>.
  category?: 'kids' | 'teens' | string | null;
  // Watch-progress overlay set by `attachCatalogProgress` on the
  // server side. When present + sub-95%, catalog cards render a small
  // orange strip across the bottom of the artwork ("you started this").
  progressPercent?: number;
  positionSeconds?: number;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  trailerUrl?: string | null;
  link?: string;
  rating?: string | null;
  duration?: string | null;
  quality?: string | null;
  year?: string | null;
  genres?: string[] | null;
  // camelCase (DB fields)
  backdropUrl?: string | null;
  posterUrl?: string | null;
  releaseDate?: string | null;
  voteAverage?: string | null;
  voteCount?: string | null;
  // legacy snake_case aliases (from old hardcoded data)
  backdrop_url?: string | null;
  poster_url?: string | null;
  release_date?: string | null;
  vote_average?: string | null;
  vote_count?: string | null;
  original_language?: string | null;
  topics?: string[] | null;
  featured?: boolean | null;
  overview?: string[];
  popularity?: string | null;
  keywords?: string | string[] | null;
  keywords_list?: string[];
  keyword_ids?: string;
  genres_list?: string[];
  bibleReference?: string | null;
  ageRating?: string | null;
  slug?: string | null;
  language?: string | null;
  isNew?: boolean | null;
};

export type MediaSection = {
  id?: string;
  title: string;
  items: MediaItem[];
};			
