import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminMessages, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, asc, eq, inArray } from 'drizzle-orm';
import { Role } from '$lib/constants';
import { notify } from '$lib/server/notify';
import { publish } from '$lib/server/sse';

/**
 * GET  /api/creator/content/[id]/thread
 * POST /api/creator/content/[id]/thread
 *
 * Creator-facing thread on their own content row. Ownership-gated: only
 * the content's creator can read/write. Mirrors the admin endpoint shape
 * so the shared ContentThreadPanel component renders identically.
 */

async function loadOwned(contentId: string, ownerId: string) {
	const [row] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId,
		title: mediaLibrary.title
	})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);
	if (!row) return { row: null, status: 404 as const };
	if (row.creatorId !== ownerId) return { row: null, status: 403 as const };
	return { row, status: 200 as const };
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const { row: content, status } = await loadOwned(params.id!, session.user.id);
	if (status !== 200) return json({ error: status === 404 ? 'Not found' : 'Forbidden' }, { status });

	const rows = await db.select()
		.from(adminMessages)
		.where(eq(adminMessages.contentId, content.id))
		.orderBy(asc(adminMessages.createdAt));

	const senderIds = Array.from(new Set(
		rows.flatMap((r) => [r.isFromAdmin ? r.adminId : r.creatorId]).filter((id): id is string => !!id)
	));
	const senders = senderIds.length > 0
		? await db.select({ id: user.id, name: user.name, image: user.image })
			.from(user)
			.where(inArray(user.id, senderIds))
		: [];
	const senderMap = new Map(senders.map((s) => [s.id, s]));

	const messages = rows.map((r) => {
		const senderId = r.isFromAdmin ? r.adminId : r.creatorId;
		const sender = senderId ? senderMap.get(senderId) : null;
		return {
			id: r.id,
			message: r.message,
			subject: r.subject,
			type: r.type,
			status: r.status,
			isFromAdmin: r.isFromAdmin,
			attachments: r.attachments,
			createdAt: r.createdAt,
			senderName: sender?.name ?? null,
			senderImage: sender?.image ?? null
		};
	});

	// Mark any unread admin-sent messages as read (the creator just opened the thread).
	const unreadIds = rows.filter((r) => r.isFromAdmin && r.status === 'sent').map((r) => r.id);
	if (unreadIds.length > 0) {
		await db.update(adminMessages)
			.set({ status: 'read' })
			.where(and(inArray(adminMessages.id, unreadIds), eq(adminMessages.creatorId, session.user.id)));
	}

	return json({
		content: { id: content.id, title: content.title, creatorId: content.creatorId },
		messages
	});
};

export const POST: RequestHandler = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const body = await request.json().catch(() => ({})) as {
		message?: string;
		attachments?: string[];
	};
	const message = body.message?.trim();
	if (!message) return json({ error: 'message is required' }, { status: 400 });

	const { row: content, status } = await loadOwned(params.id!, session.user.id);
	if (status !== 200) return json({ error: status === 404 ? 'Not found' : 'Forbidden' }, { status });

	const attachments = Array.isArray(body.attachments)
		? body.attachments.filter((a) => typeof a === 'string')
		: [];

	const [inserted] = await db.insert(adminMessages).values({
		contentId: content.id,
		creatorId: session.user.id,
		adminId: null,
		subject: `Reply on "${content.title.slice(0, 80)}"`,
		message,
		type: 'thread',
		status: 'sent',
		isFromAdmin: false,
		attachments
	}).returning({ id: adminMessages.id });

	// Real-time push to anyone watching this content's thread.
	publish(`thread:${content.id}`, {
		type: 'new-message',
		messageId: inserted.id,
		isFromAdmin: false
	});

	// Fan-out to every admin. Cheap; admins are a small set.
	try {
		const admins = await db.select({ id: user.id })
			.from(user)
			.where(eq(user.role, 'admin'));
		await Promise.all(admins.map((a) => notify({
			userId: a.id,
			kind: 'admin_message',
			title: `Creator replied on "${content.title.slice(0, 50)}"`,
			message: message.slice(0, 140),
			actionUrl: `/admin/content/${content.id}`
		}).catch(() => undefined)));
	} catch (err) {
		console.warn('[creator/content/thread] admin fan-out failed:', err);
	}

	return json({ success: true, id: inserted.id });
};
