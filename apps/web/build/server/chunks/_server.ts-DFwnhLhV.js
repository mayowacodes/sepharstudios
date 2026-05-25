import { j as json } from './index-BcOZ6EV9.js';
import { d as db, H as playlists } from './drizzle-CW7hPjGG.js';
import { eq, desc } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const userPlaylists = await db.select().from(playlists).where(eq(playlists.userId, session.user.id)).orderBy(desc(playlists.isDefault));
  return json(userPlaylists);
};
const POST = async ({ request, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const { name, description } = await request.json();
  const [playlist] = await db.insert(playlists).values({
    userId: session.user.id,
    name: name ?? "My List",
    description,
    isDefault: !name
  }).returning();
  return json(playlist, { status: 201 });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-DFwnhLhV.js.map
