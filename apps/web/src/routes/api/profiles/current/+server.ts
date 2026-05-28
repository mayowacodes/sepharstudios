import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { profiles } from '$lib/db/schema/sepharstudios';
import { and, eq, desc } from 'drizzle-orm';

// GET /api/profiles/current — returns the user's active profile (cookie-pinned) or default.
export const GET: RequestHandler = async ({ locals, cookies }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

  const activeId = cookies.get('activeProfileId');
  const userId = session.user.id;

  let row;
  if (activeId) {
    [row] = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.userId, userId), eq(profiles.id, activeId)))
      .limit(1);
  }
  if (!row) {
    [row] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .orderBy(desc(profiles.isDefault))
      .limit(1);
  }

  if (!row) return json({ error: 'No profile found' }, { status: 404 });
  return json({ ...row, hasPin: !!row.pin });
};

// PATCH /api/profiles/current — update the active profile.
export const PATCH: RequestHandler = async ({ locals, cookies, request }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

  const activeId = cookies.get('activeProfileId');
  if (!activeId) return json({ error: 'No active profile selected' }, { status: 400 });

  const payload = (await request.json().catch(() => ({}))) as Partial<{
    name: string;
    avatarColor: string;
    avatarEmoji: string;
    contentRating: string;
    safeModeEnabled: boolean;
  }>;

  const updates: Record<string, unknown> = {};
  if (payload.name !== undefined) updates.name = payload.name;
  if (payload.avatarColor !== undefined) updates.avatarColor = payload.avatarColor;
  if (payload.avatarEmoji !== undefined) updates.avatarEmoji = payload.avatarEmoji;
  if (payload.contentRating !== undefined) updates.contentRating = payload.contentRating;
  if (payload.safeModeEnabled !== undefined) updates.safeModeEnabled = payload.safeModeEnabled;

  if (Object.keys(updates).length === 0) {
    return json({ error: 'Nothing to update' }, { status: 400 });
  }

  const [updated] = await db
    .update(profiles)
    .set(updates)
    .where(and(eq(profiles.userId, session.user.id), eq(profiles.id, activeId)))
    .returning();

  if (!updated) return json({ error: 'Profile not found' }, { status: 404 });
  return json({ ...updated, hasPin: !!updated.pin });
};
