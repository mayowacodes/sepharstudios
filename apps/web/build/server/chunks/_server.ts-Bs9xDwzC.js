import { n as db, _ as transactions } from './drizzle-BjmsPAPl.js';
import { j as json } from './index-5kYmxIr9.js';
import { sql, and, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/users/me/stc-balance/+server.ts
/**
* GET /api/users/me/stc-balance
*
* Returns the current user's STC balance broken down by status:
*   - pending:   earned but not yet settled (no on-chain transfer yet)
*   - completed: settled (would be on-chain once treasury custody is wired)
*
* For now everything is pending because we don't yet have a server-side
* settlement mechanism. The shape is forward-compatible — once settlement
* lands, the `completed` total starts reflecting on-chain balance.
*/
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const rows = await db.select({
		status: transactions.status,
		total: sql`coalesce(sum(${transactions.amount}), 0)`
	}).from(transactions).where(and(eq(transactions.userId, session.user.id), eq(transactions.currency, "STC"), eq(transactions.type, "earn"))).groupBy(transactions.status);
	const balance = {
		pending: 0,
		completed: 0,
		failed: 0
	};
	for (const row of rows) {
		const total = Number(row.total ?? 0);
		if (row.status === "pending") balance.pending = total;
		else if (row.status === "completed") balance.completed = total;
		else if (row.status === "failed") balance.failed = total;
	}
	return json({
		currency: "STC",
		pending: balance.pending,
		completed: balance.completed,
		total: balance.pending + balance.completed
	});
};

export { GET };
//# sourceMappingURL=_server.ts-Bs9xDwzC.js.map
