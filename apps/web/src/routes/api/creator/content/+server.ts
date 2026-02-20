import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const data = await request.json();
	const id = crypto.randomUUID();

	try {
		await db.insert(mediaLibrary).values({
			id,
			title: data.title,
			description: data.description,
			mediaType: data.contentType, 
			ageRating: data.ageRating,
			thumbnail: data.assets?.thumbnail,
			posterUrl: data.assets?.posterPortrait,
			backdropUrl: data.assets?.backdropHero,
			language: data.language || 'English',
			bibleReference: data.bibleReferences?.[0] || null,
			genres: data.genre || [],
			topics: data.themes || [],
			keywords: data.keywords || [],
			duration: data.duration?.toString() || null,
			isActive: false, 
			isNew: true,
			slug: `${data.title.toLowerCase().replace(/ /g, '-')}-${id.slice(0, 5)}`,
			link: `/watch/${id}`,
			videoUrl: data.videoUrl || '', 
		});

		return json({ success: true, contentId: id });
	} catch (error) {
		console.error('Content submission error:', error);
		return json({ error: 'Failed to save content metadata' }, { status: 500 });
	}
};
