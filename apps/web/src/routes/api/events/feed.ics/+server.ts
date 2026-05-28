import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { events } from '$lib/db/schema/sepharstudios';
import { and, eq, gte } from 'drizzle-orm';
import { SiteMeta } from '$lib/constants';

/**
 * GET /api/events/feed.ics?audience=public|creator
 *
 * Returns an .ics calendar feed for all upcoming events in the requested
 * audience. Users add this URL to Google Calendar / Apple Calendar /
 * Outlook and their app polls it for updates.
 *
 * Public — no auth required, since calendar apps don't send cookies.
 */

function fmtDate(d: Date): string {
	return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escape(s: string | null | undefined): string {
	return (s ?? '').replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
}

export const GET: RequestHandler = async ({ url }) => {
	const audience = url.searchParams.get('audience') ?? 'public';
	if (audience !== 'public' && audience !== 'creator') {
		return new Response('audience must be public or creator', { status: 400 });
	}

	const rows = await db
		.select()
		.from(events)
		.where(and(
			eq(events.audience, audience),
			gte(events.startsAt, new Date()),
			eq(events.status, 'scheduled')
		))
		.orderBy(events.startsAt);

	const lines: string[] = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Sephar Studios//Events Feed//EN',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
		`X-WR-CALNAME:${audience === 'creator' ? 'Sephar Creator Events' : 'Sephar Webinars'}`,
		'X-WR-TIMEZONE:UTC'
	];

	const now = new Date();
	for (const e of rows) {
		const start = new Date(e.startsAt);
		const end = e.endsAt
			? new Date(e.endsAt)
			: new Date(start.getTime() + (e.durationMinutes ?? 60) * 60_000);
		lines.push(
			'BEGIN:VEVENT',
			`UID:${e.id}@sepharstudios.com`,
			`DTSTAMP:${fmtDate(now)}`,
			`DTSTART:${fmtDate(start)}`,
			`DTEND:${fmtDate(end)}`,
			`SUMMARY:${escape(e.title)}`,
			`DESCRIPTION:${escape(e.description)}`,
			`LOCATION:${escape(e.location ?? 'Online')}`,
			`URL:${SiteMeta.link}${audience === 'creator' ? '/creator/events' : '/webinars'}`,
			'END:VEVENT'
		);
	}

	lines.push('END:VCALENDAR');

	return new Response(lines.join('\r\n'), {
		headers: {
			'Content-Type': 'text/calendar; charset=utf-8',
			'Content-Disposition': `inline; filename="sephar-${audience}-events.ics"`,
			// Calendar apps poll every few hours; let the CDN cache for 1 hr.
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	});
};
