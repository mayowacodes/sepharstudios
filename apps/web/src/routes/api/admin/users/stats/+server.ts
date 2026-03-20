import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { user } from '$lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [adminUser] = await db
		.select({ role: user.role })
		.from(user)
		.where(eq(user.id, session.user.id));
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const now = new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const startOfWeek = new Date(startOfToday);
	startOfWeek.setDate(startOfWeek.getDate() - 6);

	const [agg] = await db
		.select({
			totalUsers: sql<number>`count(*)`,
			creators: sql<number>`sum(case when ${user.role} = 'creator' then 1 else 0 end)`,
			admins: sql<number>`sum(case when ${user.role} = 'admin' then 1 else 0 end)`,
			editors: sql<number>`sum(case when ${user.role} = 'editor' then 1 else 0 end)`,
			banned: sql<number>`sum(case when ${user.banned} = true then 1 else 0 end)`,
			newToday: sql<number>`sum(case when ${user.createdAt} >= ${startOfToday} then 1 else 0 end)`,
			newWeek: sql<number>`sum(case when ${user.createdAt} >= ${startOfWeek} then 1 else 0 end)`
		})
		.from(user);

	return json({
		totalUsers: Number(agg?.totalUsers ?? 0),
		creators: Number(agg?.creators ?? 0),
		admins: Number(agg?.admins ?? 0),
		editors: Number(agg?.editors ?? 0),
		banned: Number(agg?.banned ?? 0),
		newToday: Number(agg?.newToday ?? 0),
		newWeek: Number(agg?.newWeek ?? 0)
	});
};
