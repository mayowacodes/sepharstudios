import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, desc, eq, ilike, or, sql, type SQL } from 'drizzle-orm';
import { Role } from '$lib/constants';

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 25;

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const status = url.searchParams.get('status');
	const type = url.searchParams.get('type');
	const q = url.searchParams.get('q')?.trim();
	const hasPaginationParam = url.searchParams.has('page') || url.searchParams.has('pageSize');

	const conds: SQL[] = [eq(mediaLibrary.creatorId, session.user.id)];
	if (status && status !== 'all') conds.push(eq(mediaLibrary.status, status));
	if (type && type !== 'all') conds.push(eq(mediaLibrary.mediaType, type));
	if (q) {
		const pat = `%${q}%`;
		const searchExpr = or(ilike(mediaLibrary.title, pat), ilike(mediaLibrary.description, pat));
		if (searchExpr) conds.push(searchExpr);
	}
	const whereExpr = conds.length === 1 ? conds[0] : and(...conds);

	const columns = {
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		description: mediaLibrary.description,
		mediaType: mediaLibrary.mediaType,
		status: mediaLibrary.status,
		isActive: mediaLibrary.isActive,
		thumbnail: mediaLibrary.thumbnail,
		posterUrl: mediaLibrary.posterUrl,
		backdropUrl: mediaLibrary.backdropUrl,
		duration: mediaLibrary.duration,
		viewCount: mediaLibrary.viewCount,
		genres: mediaLibrary.genres,
		keywords: mediaLibrary.keywords,
		createdAt: mediaLibrary.createdAt,
		updatedAt: mediaLibrary.updatedAt,
		reviewNotes: mediaLibrary.reviewNotes,
		rejectionReason: mediaLibrary.rejectionReason
	};

	// Back-compat: if no pagination params are present we keep returning a
	// bare array so the existing callers (creator dashboard, upload prefill)
	// keep working unchanged. Content library page opts in by passing
	// page/pageSize and gets the structured response with pagination meta.
	if (!hasPaginationParam) {
		const items = await db
			.select(columns)
			.from(mediaLibrary)
			.where(whereExpr)
			.orderBy(desc(mediaLibrary.createdAt));
		return json(items);
	}

	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10) || 1);
	const requested = parseInt(url.searchParams.get('pageSize') ?? `${DEFAULT_PAGE_SIZE}`, 10) || DEFAULT_PAGE_SIZE;
	const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, requested));
	const offset = (page - 1) * pageSize;

	const [items, totals] = await Promise.all([
		db.select(columns)
			.from(mediaLibrary)
			.where(whereExpr)
			.orderBy(desc(mediaLibrary.createdAt))
			.limit(pageSize)
			.offset(offset),
		db.select({ count: sql<number>`count(*)::int` })
			.from(mediaLibrary)
			.where(whereExpr)
	]);
	const total = totals[0]?.count ?? 0;
	return json({
		items,
		pagination: {
			page,
			pageSize,
			total,
			totalPages: Math.max(1, Math.ceil(total / pageSize))
		}
	});
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const data = await request.json();
	const id = crypto.randomUUID();
	const title = String(data.title || '').trim();

	if (!title) return json({ error: 'Title is required' }, { status: 400 });

	// Coming Soon — creator opted into pre-release. We stash the
	// release date on `scheduledPublishAt` so the existing cron can
	// pick it up after admin approval. The presence of
	// `scheduledPublishAt` on a `status='submitted'` row IS the
	// signal to the admin reviewer that this is a Coming Soon
	// request — no separate metadata flag needed. Falls back
	// gracefully when missing/invalid: the row goes through the
	// normal submitted path.
	let scheduledPublishAt: Date | null = null;
	if (data.comingSoon && data.comingSoonReleaseDate) {
		const ts = Date.parse(String(data.comingSoonReleaseDate));
		if (!Number.isNaN(ts)) scheduledPublishAt = new Date(ts);
	}

	// Audience → category. The wizard's Audience radio (general / kids / teens)
	// drives the `category` column the kids portal filters on. General leaves
	// the column NULL so /movies, /shows, /documentaries pick the row up.
	const category =
		data.audience === 'kids' ? 'kids'
		: data.audience === 'teens' ? 'teens'
		: null;

	try {
		await db.insert(mediaLibrary).values({
			id,
			title,
			description: data.description,
			mediaType: data.contentType,
			category,
			ageRating: data.ageRating,
			// 6 asset slots: every asset uploaded in AssetManagementStep maps
			// 1-to-1 to its own column so creators can later replace any of them
			// individually from the content detail page.
			thumbnail: data.assets?.thumbnail,
			posterUrl: data.assets?.posterPortrait,
			posterLandscapeUrl: data.assets?.posterLandscape,
			posterSquareUrl: data.assets?.posterSquare,
			logoTitleUrl: data.assets?.logoTitle,
			backdropUrl: data.assets?.backdropHero,
			trailerUrl: data.trailerUrl || null,
			language: data.language || 'English',
			bibleReference: data.bibleReferences?.[0] || null,
			genres: data.genre || [],
			topics: data.themes || [],
			keywords: data.keywords || [],
			// Cast/crew live as jsonb arrays. The wizard validates the row
			// shapes client-side; defensive Array.isArray here keeps a
			// malformed body from inserting an invalid jsonb literal.
			cast: Array.isArray(data.cast) ? data.cast : [],
			crew: Array.isArray(data.crew) ? data.crew : [],
			duration: data.duration?.toString() || null,
			isActive: false,
			isNew: true,
			status: 'submitted',
			creatorId: session.user.id,
			slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id.slice(0, 5)}`,
			link: `/watch/${id}`,
			videoUrl: data.videoUrl || null,
			processingStatus: 'not_started',
			scheduledPublishAt
		});

		return json({ success: true, contentId: id });
	} catch (error) {
		console.error('Content submission error:', error);
		return json({ error: 'Failed to save content metadata' }, { status: 500 });
	}
};
