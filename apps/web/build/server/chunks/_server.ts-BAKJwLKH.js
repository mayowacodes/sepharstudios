import { w as db, X as playlists } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/playlists/+server.ts
var GET = async ({ locals }) => {
	try {
		const session = await locals.auth.getSession();
		if (!session) return json({ error: "Unauthorized" }, { status: 401 });
		return json(await db.select().from(playlists).where(eq(playlists.userId, session.user.id)).orderBy(desc(playlists.isDefault)));
	} catch (e) {
		console.error("GET /api/playlists failed", e);
		return json({ error: "Failed to load playlists" }, { status: 500 });
	}
};
var POST = async ({ request, locals }) => {
	try {
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
	} catch (e) {
		console.error("POST /api/playlists failed", e);
		return json({ error: "Failed to create playlist" }, { status: 500 });
	}
};

export { GET, POST };
//# sourceMappingURL=_server.ts-BAKJwLKH.js.map
