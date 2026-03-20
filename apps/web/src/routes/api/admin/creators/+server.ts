import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creators as creatorsTable, mediaLibrary, transactions } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const users = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image,
			createdAt: user.createdAt,
			banned: user.banned
		})
		.from(user)
		.where(eq(user.role, 'creator'));

	const creatorProfiles = await db
		.select({
			userId: creatorsTable.userId,
			displayName: creatorsTable.displayName,
			avatarUrl: creatorsTable.avatarUrl,
			isVerified: creatorsTable.isVerified
		})
		.from(creatorsTable);

	const contentAgg = await db
		.select({
			creatorId: mediaLibrary.creatorId,
			contentCount: sql<number>`count(*)`,
			totalViews: sql<number>`coalesce(sum(${mediaLibrary.viewCount}), 0)`,
			lastActivity: sql<Date>`max(${mediaLibrary.updatedAt})`
		})
		.from(mediaLibrary)
		.where(sql`${mediaLibrary.creatorId} is not null`)
		.groupBy(mediaLibrary.creatorId);

	const now = new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const earningsAgg = await db
		.select({
			userId: transactions.userId,
			monthlyEarnings: sql<number>`coalesce(sum(${transactions.amount}), 0)`
		})
		.from(transactions)
		.where(and(eq(transactions.type, 'earn'), sql`${transactions.createdAt} >= ${monthStart}`))
		.groupBy(transactions.userId);

	const profileByUser = new Map(creatorProfiles.map(p => [p.userId, p]));
	const contentByUser = new Map(contentAgg.map(c => [c.creatorId, c]));
	const earningsByUser = new Map(earningsAgg.map(e => [e.userId, e]));

	const payload = users.map((u) => {
		const profile = profileByUser.get(u.id);
		const content = contentByUser.get(u.id);
		const earnings = earningsByUser.get(u.id);
		const name = profile?.displayName || u.name;
		return {
			id: u.id,
			name,
			email: u.email,
			ministryName: profile?.displayName || name,
			joinDate: u.createdAt,
			status: u.banned ? 'suspended' : 'active',
			contentCount: Number(content?.contentCount ?? 0),
			totalViews: Number(content?.totalViews ?? 0),
			monthlyEarnings: Number(earnings?.monthlyEarnings ?? 0),
			lastActivity: (content?.lastActivity ?? u.createdAt).toISOString(),
			verificationStatus: profile?.isVerified ? 'verified' : 'pending',
			avatar: profile?.avatarUrl || u.image || '',
			paymentPreference: 'fiat',
			revenueShare: 30,
			tier: 'standard'
		};
	});

	return json(payload);
};

export const PATCH: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const { id, status } = await request.json() as { id: string; status: 'active' | 'suspended' };
	if (!id || !status) return json({ error: 'Missing payload' }, { status: 400 });

	await db.update(user).set({ banned: status === 'suspended' }).where(eq(user.id, id));
	return json({ success: true });
};
