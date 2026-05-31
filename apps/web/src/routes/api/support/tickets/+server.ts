import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { supportTickets } from '$lib/db/schema/sepharstudios';
import { desc, eq } from 'drizzle-orm';
import { take } from '$lib/server/rate-limit';
import { sendEmailAction } from '$lib/authentication/server';
import { Constants } from '$lib/constants';
import { notify } from '$lib/server/notify';

/**
 * GET  /api/support/tickets?mine=1 — list the current user's tickets.
 * POST /api/support/tickets        — submit a tech-support ticket.
 *
 * Auth optional. Rate-limited 3/hr per user/IP. Inserts a `support_tickets`
 * row, emails Constants.SUPPORTEMAIL, and fires an in-app `notify()` so the
 * submitter sees confirmation in their notification center.
 */

export const GET: RequestHandler = async ({ url, locals }) => {
	if (url.searchParams.get('mine') !== '1') {
		return json({ error: 'Only ?mine=1 listing is supported' }, { status: 400 });
	}
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const rows = await db.select({
		id: supportTickets.id,
		subject: supportTickets.subject,
		category: supportTickets.category,
		priority: supportTickets.priority,
		description: supportTickets.description,
		status: supportTickets.status,
		adminResponse: supportTickets.adminResponse,
		attachments: supportTickets.attachments,
		createdAt: supportTickets.createdAt,
		updatedAt: supportTickets.updatedAt
	})
		.from(supportTickets)
		.where(eq(supportTickets.userId, session.user.id))
		.orderBy(desc(supportTickets.createdAt))
		.limit(100);

	return json({ tickets: rows });
};

const ALLOWED_CATEGORIES = new Set([
	'video-playback', 'audio-issues', 'streaming-quality', 'login', 'profile',
	'payments', 'monetization', 'mobile', 'other'
]);
const ALLOWED_PRIORITIES = new Set(['low', 'normal', 'high', 'urgent']);

function isValidEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	const session = await locals.auth.getSession();
	const bucketKey = session?.user.id ?? `ip:${getClientAddress()}`;
	const limit = await take(`support-tickets:${bucketKey}`, { capacity: 3, refillPerSec: 1 / 1200 });
	if (!limit.allowed) {
		return json({ error: 'Too many tickets, try again later.' }, { status: 429 });
	}

	const body = await request.json().catch(() => ({})) as {
		subject?: string;
		category?: string;
		priority?: string;
		description?: string;
		email?: string;
		attachments?: Array<{ id?: string; url: string; name: string; size?: number }>;
	};

	const subject = body.subject?.trim() ?? '';
	const description = body.description?.trim() ?? '';
	const email = (body.email ?? session?.user.email ?? '').trim();
	const category = body.category && ALLOWED_CATEGORIES.has(body.category) ? body.category : null;
	const priority = body.priority && ALLOWED_PRIORITIES.has(body.priority) ? body.priority : 'normal';

	if (!subject || subject.length < 3) {
		return json({ error: 'Subject is required.' }, { status: 400 });
	}
	if (!description || description.length < 20) {
		return json({ error: 'Description is too short (20+ characters).' }, { status: 400 });
	}
	if (description.length > 5000) {
		return json({ error: 'Description is too long (max 5000 characters).' }, { status: 400 });
	}
	if (!email || !isValidEmail(email)) {
		return json({ error: 'A valid email is required.' }, { status: 400 });
	}

	const attachments = (body.attachments ?? [])
		.filter((a) => a && typeof a.url === 'string' && typeof a.name === 'string')
		.slice(0, 5)
		.map((a) => ({ id: a.id ?? crypto.randomUUID(), url: a.url, name: a.name, size: a.size }));

	const [inserted] = await db.insert(supportTickets).values({
		userId: session?.user.id ?? null,
		email: email.slice(0, 320),
		subject: subject.slice(0, 255),
		category,
		priority,
		description,
		attachments: attachments.length > 0 ? attachments : null
	}).returning({ id: supportTickets.id });

	// Email the support inbox. Best-effort — we don't fail the request if the
	// SMTP provider is down; the row is already persisted and an admin can
	// triage from the admin queue.
	const attachmentList = attachments.length > 0
		? `\n\nAttachments:\n${attachments.map((a) => `- ${a.name}: ${a.url}`).join('\n')}`
		: '';
	const submitter = session?.user.name ? `${session.user.name} <${email}>` : email;
	try {
		await sendEmailAction({
			to: Constants.SUPPORTEMAIL,
			subject: `[Support ticket #${inserted.id.slice(0, 8)}] ${subject}`,
			meta: {
				description: `Priority: ${priority}\nCategory: ${category ?? 'unspecified'}\nFrom: ${submitter}\n\n${description}${attachmentList}`,
				link: `mailto:${email}`
			}
		});
	} catch (err) {
		console.error('[support/tickets] email send failed:', err);
	}

	if (session?.user.id) {
		await notify({
			userId: session.user.id,
			kind: 'system',
			title: 'Support ticket received',
			message: `We've received your ticket "${subject.slice(0, 80)}" and will get back to you within 24 hours.`,
			actionUrl: '/creator/tech-support'
		}).catch(() => undefined);
	}

	return json({ success: true, id: inserted.id });
};
