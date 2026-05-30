import { et as transactions, t as db } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
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
//#endregion
export { GET };
