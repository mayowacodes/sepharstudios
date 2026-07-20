import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	askCompanion,
	getSceneInsight,
	buildCompanionStreamMessages,
	FOLLOWUPS_MARKER,
	type CompanionContext,
	type CompanionMessage
} from '$lib/server/ai-companion';
import { enforceRateLimit, AI_CHAT_LIMIT } from '$lib/server/rate-limit';
import { getAiModel } from '$lib/server/ai-model';
import { streamText } from 'ai';

/**
 * POST /api/ai/companion
 *
 * Modes:
 *   'chat'         → conversation about a specific piece of content (requires contentTitle + contentDescription)
 *   'scene_insight'→ short scene explanation (requires contentTitle + sceneDescription)
 *   'general'      → floating copilot with no specific content context (no content fields required)
 *
 * Body:
 *   { mode?, message, history?, stream?,
 *     contentTitle?, contentDescription?, bibleReference?, genres?, topics?, contentType?,
 *     sceneDescription? }
 *
 * When `stream: true` (chat + general modes), the response is
 * text/event-stream with these events:
 *   status → {"label":"Thinking about your question…"} — a READY-TO-
 *            DISPLAY human sentence. The client renders the string
 *            verbatim; it never sees stage enums or JSON internals.
 *   token  → {"text":"..."} incremental answer text (marker tail withheld)
 *   done   → {"label":"Done","followUps":[...]} terminal event
 *   error  → {"label":"Something went wrong — try again."}
 * The legacy blocking JSON path stays for scene_insight + old clients.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');
	await enforceRateLimit(`ai:companion:${locals.user.id}`, AI_CHAT_LIMIT);

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
		mode = 'chat',
		stream = false
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

	// ── SSE streaming path (chat + general) ────────────────────────────────────
	if (stream === true) {
		const context: CompanionContext = mode === 'general'
			? {
				contentTitle: 'Sephar Studios',
				contentDescription:
					'A faith-based streaming platform featuring Christian movies, documentaries, sermons, and family content from creators around the world.',
				contentType: 'platform',
				bibleReference: '',
				genres: ['Drama', 'Documentary', 'Worship', 'Sermon', 'Kids'],
				topics: ['Faith', 'Redemption', 'Family', 'Prayer', 'Scripture', 'Christian Living']
			}
			: {
				contentTitle: contentTitle ?? '',
				contentDescription: contentDescription ?? '',
				contentType,
				bibleReference,
				genres,
				topics
			};
		if (mode !== 'general' && (!context.contentTitle || !context.contentDescription)) {
			throw error(400, 'contentTitle and contentDescription are required for chat mode');
		}
		return streamCompanion(context, history as CompanionMessage[], String(message), mode);
	}

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

// ─── SSE streaming implementation ───────────────────────────────────────────

/** Encode one SSE frame. */
function sseFrame(event: string, data: unknown): Uint8Array {
	return new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

/**
 * Stream a companion answer as SSE. Status events carry ready-to-display
 * human sentences (never internal stage names) — the client renders the
 * `label` string verbatim.
 *
 * The model appends `[[FOLLOWUPS]] [...]` after the answer (see
 * ai-companion.ts). We withhold a small tail buffer from token emission
 * so the marker never flashes on screen — even when a token boundary
 * splits the marker itself — then parse the follow-ups out of the
 * accumulated text for the terminal `done` event.
 */
function streamCompanion(
	context: CompanionContext,
	history: CompanionMessage[],
	message: string,
	mode: string
): Response {
	// Hold back enough characters that a marker arriving across several
	// tokens can never partially leak into the visible answer.
	const HOLDBACK = FOLLOWUPS_MARKER.length + 4;

	const thinkingLabel = mode === 'general'
		? 'Thinking about your question…'
		: `Looking at "${context.contentTitle}" for you…`;

	const readable = new ReadableStream<Uint8Array>({
		async start(controller) {
			const send = (event: string, data: unknown) => {
				try { controller.enqueue(sseFrame(event, data)); } catch { /* client gone */ }
			};

			send('status', { label: thinkingLabel });

			let resolved;
			try {
				resolved = await getAiModel('chat');
			} catch (err) {
				console.error('[companion/stream] no AI provider:', err);
				send('error', { label: 'The assistant is unavailable right now — please try again in a moment.' });
				controller.close();
				return;
			}

			try {
				const result = streamText({
					model: resolved.model,
					messages: buildCompanionStreamMessages(context, history, message),
					temperature: 0.4,
					maxOutputTokens: 512
				});

				let full = '';        // everything the model produced
				let emitted = 0;      // chars of `full` already sent as tokens
				let markerAt = -1;    // index of FOLLOWUPS_MARKER once seen
				let sentWriting = false;

				for await (const chunk of result.textStream) {
					if (!chunk) continue;
					full += chunk;
					if (!sentWriting) {
						sentWriting = true;
						send('status', { label: 'Writing your answer…' });
					}
					if (markerAt === -1) {
						markerAt = full.indexOf(FOLLOWUPS_MARKER);
					}
					// Emit up to (marker || end-of-text) minus the holdback tail.
					const visibleEnd = markerAt >= 0 ? markerAt : full.length - HOLDBACK;
					if (visibleEnd > emitted) {
						send('token', { text: full.slice(emitted, visibleEnd) });
						emitted = visibleEnd;
					}
				}

				// Flush whatever visible text the holdback was still guarding.
				if (markerAt === -1) markerAt = full.indexOf(FOLLOWUPS_MARKER);
				const answerEnd = markerAt >= 0 ? markerAt : full.length;
				if (answerEnd > emitted) {
					send('token', { text: full.slice(emitted, answerEnd) });
				}

				// Parse follow-ups from the tail after the marker.
				let followUps: string[] = [];
				if (markerAt >= 0) {
					const tail = full.slice(markerAt + FOLLOWUPS_MARKER.length);
					try {
						const arrMatch = tail.match(/\[[\s\S]*?\]/);
						if (arrMatch) {
							const parsed = JSON.parse(arrMatch[0]);
							if (Array.isArray(parsed)) {
								followUps = parsed.filter((f): f is string => typeof f === 'string').slice(0, 3);
							}
						}
					} catch { /* no follow-ups — fine */ }
				}

				send('done', { label: 'Done', followUps });
			} catch (err) {
				console.error('[companion/stream] stream failed:', err);
				send('error', { label: 'Something went wrong while answering — please try again.' });
			} finally {
				try { controller.close(); } catch { /* already closed */ }
			}
		}
	});

	return new Response(readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
			Connection: 'keep-alive',
			// Tell nginx/Traefik not to buffer — tokens must reach the
			// browser as they're generated, not in one burst at the end.
			'X-Accel-Buffering': 'no'
		}
	});
}
