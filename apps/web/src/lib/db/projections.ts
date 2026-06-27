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
	// Landscape poster (16:9). Consumed by ContinueWatchingRow + any
	// future landscape-card row before falling back to backdropUrl
	// (which is huge HD and meant for hero panels, not card slots).
	posterLandscapeUrl: mediaLibrary.posterLandscapeUrl,
	// Square poster (1:1). Reserved for compact mobile + square
	// carousel layouts. Not yet rendered on a card surface.
	posterSquareUrl: mediaLibrary.posterSquareUrl,
	backdropUrl: mediaLibrary.backdropUrl,
	trailerUrl: mediaLibrary.trailerUrl,
	// Transparent PNG title treatment. Renders in place of the
	// plain-text H1 / H2 on FeaturedBillboardPanel + MediaDetailPage
	// so the hero reads as a branded title logo, not system font.
	logoTitleUrl: mediaLibrary.logoTitleUrl,
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
	createdAt: mediaLibrary.createdAt,
	// Powers the Coming Soon "Releases [date]" badge + the dedicated
	// /coming-soon page's monthly grouping. Null on already-published
	// rows; only meaningful when status='coming_soon' or 'approved'.
	scheduledPublishAt: mediaLibrary.scheduledPublishAt,
	status: mediaLibrary.status
} as const;
