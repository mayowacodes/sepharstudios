// Single source of truth for the media-side type primitives. Earlier
// revisions of this file accidentally declared `AudioTrack`, `Subtitle`,
// and `Chapter` multiple times — TypeScript's interface-merging silently
// merged them into a union of every field, which let buggy code compile
// (e.g. a track with both `lang` and `language`). Keep one declaration
// per concept.

export interface Chapter {
  title: string;
  time: number;
}

export interface Subtitle {
  label: string;
  src: string;
  srclang: string;
}

export interface AudioTrack {
  // `id` and `language` are required everywhere they're actually used;
  // older spots passed `lang` instead — those have been migrated.
  id: string;
  label: string;
  language: string;
  src: string;
}

export type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  trailerUrl: string;
  videourl: string;
  genres: string[];
  rating: ContentRating;
  duration: string;
  year: number;
  quality: string;
  type: 'movie' | 'show';
  releaseDate: string;
  cast: string[];
  director: string;
  inWatchlist?: boolean;
  progress?: number;
  lastWatched?: string;
}

export type ContentRating = 'G' | 'PG' | 'PG-13' | 'TV-Y' | 'TV-G' | 'TV-PG';

export interface Genre {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface FilterState {
  search: string;
  genres: Set<string>;
  ratings: Set<ContentRating>;
  type: 'all' | 'movie' | 'show';
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  trailerUrl?: string;
  videoUrl: string;
  genre: string[];
  rating: string;
  duration: string;
  year: number;
  quality: string;
  trending?: boolean;
  audioTracks: AudioTrack[];
  subtitles: Subtitle[];
}

export interface UserType {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Profile {
  id: string;
  name: string;
  type: 'adult' | 'teen' | 'kids';
  avatar: string;
  email?: string;
  image?: string;
  avatarUrl?: string;
  parental: boolean;
}

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
  releaseDate: string;
  rating: string;
  genre: string[];
  views: number;
  isLive: boolean;
  ageRestriction?: string;
}

export interface PlayerSettings {
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
  showControls: true;
  enableDownload: false;
  enableThumbnailPreview: false;
  enableSpeedControls: true;
  enableSeekButtons: true;
  enablePictureInPicture: false;
  enableCasting: false;
  preferredQuality?: 'auto' | '1080p' | '720p' | '480p' | '360p';
  skin: {
    color: string;
    theme: 'dark' | 'light';
  };
  size: 'responsive' | 'fluid' | 'fixed';
}

export interface UserPreferences {
  userId: string;
  preferredLanguage: string;
  preferredSubtitle?: string;
  preferredAudioTrack?: string;
  preferredQuality?: 'auto' | '1080p' | '720p' | '480p' | '360p';
  watchHistory: WatchedVideo[];
  favorites: string[]; // Array of video IDs
}

export interface WatchedVideo {
  videoId: string;
  lastWatched: string;
  progress: number; // Percentage (0-100)
}

export type Theme = 'light' | 'dark' | 'system';
