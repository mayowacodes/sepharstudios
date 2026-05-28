import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { notifications } from '$lib/db/schema/sepharstudios';
import { eq, desc } from 'drizzle-orm';

// GET /api/notifications — list current user's notifications, most recent first.
export const GET: RequestHandler = async ({ locals, url }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 200);

  const rows = await db
    .select({
      id: notifications.id,
      kind: notifications.kind,
      title: notifications.title,
      message: notifications.message,
      actionUrl: notifications.actionUrl,
      read: notifications.read,
      createdAt: notifications.createdAt
    })
    .from(notifications)
    .where(eq(notifications.userId, session.user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);

  return json(rows);
};
