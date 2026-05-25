import { json } from "@sveltejs/kit";
import { d as db, B as playlists } from "../../../../chunks/drizzle.js";
import { eq, desc } from "drizzle-orm";
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
export {
  GET,
  POST
};
