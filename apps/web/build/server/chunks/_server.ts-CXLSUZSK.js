import { j as json } from './index-BcOZ6EV9.js';
import { d as db, E as profiles, G as familyAddons } from './drizzle-CW7hPjGG.js';
import { eq, desc } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const userProfiles = await db.select({
    id: profiles.id,
    name: profiles.name,
    type: profiles.type,
    avatarColor: profiles.avatarColor,
    avatarEmoji: profiles.avatarEmoji,
    contentRating: profiles.contentRating,
    safeModeEnabled: profiles.safeModeEnabled,
    isKidsMode: profiles.isKidsMode,
    isDefault: profiles.isDefault,
    hasPin: profiles.pin
  }).from(profiles).where(eq(profiles.userId, session.user.id)).orderBy(desc(profiles.isDefault));
  return json(userProfiles.map((p) => ({ ...p, hasPin: !!p.hasPin })));
};
const POST = async ({ request, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;
  const existing = await db.select().from(profiles).where(eq(profiles.userId, userId));
  const [addon] = await db.select().from(familyAddons).where(eq(familyAddons.userId, userId)).limit(1);
  const maxProfiles = addon?.status === "active" ? addon.maxProfiles ?? 8 : 2;
  if (existing.length >= maxProfiles) {
    return json({
      error: `Profile limit reached. Add the Family Add-on to create up to 8 profiles.`,
      limit: maxProfiles
    }, { status: 403 });
  }
  const { name, type, avatarColor, avatarEmoji, isKidsMode } = await request.json();
  const [profile] = await db.insert(profiles).values({
    userId,
    name,
    type: type ?? "adult",
    avatarColor: avatarColor ?? "#6366f1",
    avatarEmoji: avatarEmoji ?? "😊",
    isKidsMode: isKidsMode ?? type === "kids",
    isDefault: existing.length === 0
  }).returning();
  return json(profile, { status: 201 });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-CXLSUZSK.js.map
