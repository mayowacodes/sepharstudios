import { mediaLibrary } from './schema/sepharstudios';

/**
 * Card-shaped projection for `mediaLibrary` rows on list/feed endpoints
 * (movies, shows, documentaries, kids feed). Drops admin-only and large
 * media-URL columns that the card components never read, reducing payload
 * by ~50% per row at scale.
 *
 * Use `db.select(mediaCardColumns).from(mediaLibrary).where(...)` instead of
 * `db.select().from(mediaLibrary)...` on any endpoint that returns >1 row.
 */
export const mediaCardColumns = {
	id: mediaLibrary.id,
	title: mediaLibrary.title,
	description: mediaLibrary.description,
	thumbnail: mediaLibrary.thumbnail,
	posterUrl: mediaLibrary.posterUrl,
	backdropUrl: mediaLibrary.backdropUrl,
	trailerUrl: mediaLibrary.trailerUrl,
	link: mediaLibrary.link,
	slug: mediaLibrary.slug,
	mediaType: mediaLibrary.mediaType,
	category: mediaLibrary.category,
	genres: mediaLibrary.genres,
	topics: mediaLibrary.topics,
	keywords: mediaLibrary.keywords,
	rating: mediaLibrary.rating,
	ageRating: mediaLibrary.ageRating,
	duration: mediaLibrary.duration,
	quality: mediaLibrary.quality,
	year: mediaLibrary.year,
	releaseDate: mediaLibrary.releaseDate,
	language: mediaLibrary.language,
	bibleReference: mediaLibrary.bibleReference,
	featured: mediaLibrary.featured,
	isNew: mediaLibrary.isNew,
	voteAverage: mediaLibrary.voteAverage,
	voteCount: mediaLibrary.voteCount,
	popularity: mediaLibrary.popularity,
	createdAt: mediaLibrary.createdAt
} as const;
