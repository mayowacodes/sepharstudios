import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { askCompanion, getSceneInsight } from '$lib/server/ai-companion';

/**
 * POST /api/ai/companion
 *
 * Modes:
 *   'chat'         → conversation about a specific piece of content (requires contentTitle + contentDescription)
 *   'scene_insight'→ short scene explanation (requires contentTitle + sceneDescription)
 *   'general'      → floating copilot with no specific content context (no content fields required)
 *
 * Body:
 *   { mode?, message, history?,
 *     contentTitle?, contentDescription?, bibleReference?, genres?, topics?, contentType?,
 *     sceneDescription? }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const {
		contentTitle,
		contentDescription,
		bibleReference = '',
		genres = [],
		topics = [],
		contentType = 'movie',
		history = [],
		message,
		sceneDescription,
		mode = 'chat'
	} = body;

	// ── Scene insight (video player "lesson here" button) ──────────────────────
	if (mode === 'scene_insight') {
		if (!contentTitle) throw error(400, 'contentTitle required for scene_insight mode');
		if (!sceneDescription) throw error(400, 'sceneDescription required for scene_insight mode');
		const insight = await getSceneInsight(contentTitle, bibleReference, sceneDescription);
		if (!insight) throw error(503, 'AI service unavailable');
		return json({ insight });
	}

	if (!message?.trim()) throw error(400, 'message is required');

	// ── General copilot mode (no content context — floating widget) ────────────
	if (mode === 'general') {
		const response = await askCompanion(
			{
				contentTitle: 'Sephar Studios',
				contentDescription:
					'A faith-based streaming platform featuring Christian movies, documentaries, sermons, and family content from creators around the world.',
				contentType: 'platform',
				bibleReference: '',
				genres: ['Drama', 'Documentary', 'Worship', 'Sermon', 'Kids'],
				topics: ['Faith', 'Redemption', 'Family', 'Prayer', 'Scripture', 'Christian Living']
			},
			history,
			message
		);
		if (!response) throw error(503, 'AI service unavailable — try again shortly');
		return json(response);
	}

	// ── Content-specific chat (movie/show page companion) ──────────────────────
	if (!contentTitle || !contentDescription) {
		throw error(400, 'contentTitle and contentDescription are required for chat mode');
	}

	const response = await askCompanion(
		{ contentTitle, contentDescription, bibleReference, genres, topics, contentType },
		history,
		message
	);

	if (!response) throw error(503, 'AI service unavailable — try again shortly');

	return json(response);
};
