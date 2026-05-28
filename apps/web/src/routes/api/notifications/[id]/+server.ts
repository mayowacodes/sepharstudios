import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { notifications } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';

// DELETE /api/notifications/:id — ownership-checked delete.
export const DELETE: RequestHandler = async ({ locals, params }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

  if (!params.id) return json({ error: 'id required' }, { status: 400 });

  const result = await db
    .delete(notifications)
    .where(and(eq(notifications.id, params.id), eq(notifications.userId, session.user.id)))
    .returning({ id: notifications.id });

  if (result.length === 0) return json({ error: 'Not found' }, { status: 404 });
  return new Response(null, { status: 204 });
};
