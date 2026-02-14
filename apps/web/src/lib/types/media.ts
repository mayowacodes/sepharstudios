// src/lib/types/media.ts
export type MediaItem = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  trailerUrl?: string;
  link: string;
  rating?: string;
  duration?: string;
  quality?: string;
  year?: string;
  genres?: string[];
  backdrop_url?: string;
  original_language?: string;
  topics?: string[];
  featured?: boolean;
  overview?: string[];
  popularity?: string;
  poster_url?: string;
  release_date?: string;
  vote_average?: string;
  vote_count?: string;
  keywords?: string;
  keywords_list?: string[];
  keyword_ids?: string;
  genres_list?: string[];
  bibleReference?: string; // Optional Bible verse related to content
  ageRating?: string;   // 'All' | '7+' | '10+' | '12+' | '16+' | '18+';
  slug?: string;
  language?: string;
  isNew?: boolean;
};

export type MediaSection = {
  id?: string;
  title: string;
  items: MediaItem[];
};			