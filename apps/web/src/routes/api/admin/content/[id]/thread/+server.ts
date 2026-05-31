import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminMessages, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { asc, eq, inArray } from 'drizzle-orm';
import { notify } from '$lib/server/notify';
import { publish } from '$lib/server/sse';

/**
 * GET  /api/admin/content/[id]/thread
 * POST /api/admin/content/[id]/thread
 *
 * Admin-facing thread on a specific content row. Reuses `admin_messages`:
 * a "thread" is all rows with the same contentId, ordered chronologically.
 * No new schema.
 */

export const GET: RequestHandler = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId,
		title: mediaLibrary.title
	})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, params.id!))
		.limit(1);
	if (!content) return json({ error: 'Not found' }, { status: 404 });

	const rows = await db.select()
		.from(adminMessages)
		.where(eq(adminMessages.contentId, content.id))
		.orderBy(asc(adminMessages.createdAt));

	// Resolve sender names: for admin posts the sender is adminId, for
	// creator replies it's creatorId. One unique-id query covers both sides.
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

	return json({
		content: { id: content.id, title: content.title, creatorId: content.creatorId },
		messages
	});
};

export const POST: RequestHandler = async ({ params, locals, request }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const body = await request.json().catch(() => ({})) as {
		message?: string;
		subject?: string;
		attachments?: string[];
	};
	const message = body.message?.trim();
	if (!message) return json({ error: 'message is required' }, { status: 400 });

	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId,
		title: mediaLibrary.title
	})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, params.id!))
		.limit(1);
	if (!content) return json({ error: 'Not found' }, { status: 404 });
	if (!content.creatorId) return json({ error: 'Content has no creator' }, { status: 400 });

	const subject = body.subject?.trim() || `Note on "${content.title.slice(0, 80)}"`;
	const attachments = Array.isArray(body.attachments)
		? body.attachments.filter((a) => typeof a === 'string')
		: [];

	const [inserted] = await db.insert(adminMessages).values({
		contentId: content.id,
		creatorId: content.creatorId,
		adminId: locals.user!.id,
		subject,
		message,
		type: 'thread',
		status: 'sent',
		isFromAdmin: true,
		attachments
	}).returning({ id: adminMessages.id });

	notify({
		userId: content.creatorId,
		kind: 'admin_message',
		title: `Note from admin on "${content.title.slice(0, 50)}"`,
		message: message.slice(0, 140),
		actionUrl: `/creator/content/${content.id}?tab=thread`
	}).catch(() => undefined);

	// Real-time push to anyone watching this content's thread.
	publish(`thread:${content.id}`, {
		type: 'new-message',
		messageId: inserted.id,
		isFromAdmin: true
	});

	return json({ success: true, id: inserted.id });
};
