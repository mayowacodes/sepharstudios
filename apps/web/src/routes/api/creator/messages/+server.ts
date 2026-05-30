import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminMessages, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';

/**
 * GET /api/creator/messages?status=unread|read|archived|all&countOnly=1
 *
 * Returns admin → creator messages addressed to the current signed-in user.
 * `status='sent'` is the unread state in `admin_messages`; this endpoint maps
 * the URL filter to that storage convention.
 */

const STATUS_MAP: Record<string, string | null> = {
	unread: 'sent',
	read: 'read',
	archived: 'archived',
	all: null
};

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const requested = url.searchParams.get('status') ?? 'all';
	const wantCountOnly = url.searchParams.get('countOnly') === '1';
	const storageStatus = STATUS_MAP[requested] ?? null;

	const conds = [eq(adminMessages.creatorId, session.user.id)];
	if (storageStatus) conds.push(eq(adminMessages.status, storageStatus));

	if (wantCountOnly) {
		const [row] = await db
			.select({ count: sql<number>`count(*)::int` })
			.from(adminMessages)
			.where(and(...conds));
		return json({ count: Number(row?.count ?? 0) });
	}

	const rows = await db
		.select({
			id: adminMessages.id,
			subject: adminMessages.subject,
			message: adminMessages.message,
			type: adminMessages.type,
			status: adminMessages.status,
			isFromAdmin: adminMessages.isFromAdmin,
			attachments: adminMessages.attachments,
			contentId: adminMessages.contentId,
			contentTitle: mediaLibrary.title,
			adminId: adminMessages.adminId,
			adminName: user.name,
			createdAt: adminMessages.createdAt
		})
		.from(adminMessages)
		.leftJoin(mediaLibrary, eq(mediaLibrary.id, adminMessages.contentId))
		.leftJoin(user, eq(user.id, adminMessages.adminId))
		.where(and(...conds))
		.orderBy(desc(adminMessages.createdAt))
		.limit(100);

	return json({ messages: rows });
};
