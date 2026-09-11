import { d as db, h as aiCostLedger, i as aiBudgetPeriods } from './drizzle-C3SH12nS.js';
import { r as requireAdmin } from './admin-auth-C5lShqv4.js';
import { j as json } from './index.js-CxPEndTa.js';
import { sql, and, gte, eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/ai-costs/+server.ts
/**
* GET  /api/admin/ai-costs?days=30  → spend by category, by operation, budgets
* PUT  /api/admin/ai-costs          → set a budget ceiling
*
* Money is stored as micro-dollars (1e-6 USD) integers; this endpoint converts
* to dollars at the boundary so the UI never does the division and never
* accumulates float error.
*/
var GET = async ({ locals, url }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	const days = Math.min(365, Math.max(1, Number(url.searchParams.get("days") ?? 30)));
	const since = /* @__PURE__ */ new Date(Date.now() - days * 864e5);
	const byCategory = await db.select({
		category: aiCostLedger.category,
		calls: sql`count(*)::int`,
		microUsd: sql`coalesce(sum(coalesce(${aiCostLedger.actualMicroUsd}, ${aiCostLedger.estimatedMicroUsd})), 0)::bigint`
	}).from(aiCostLedger).where(and(gte(aiCostLedger.createdAt, since), sql`${aiCostLedger.status} <> 'refused'`)).groupBy(aiCostLedger.category);
	const byOperation = await db.select({
		operation: aiCostLedger.operation,
		calls: sql`count(*)::int`,
		microUsd: sql`coalesce(sum(coalesce(${aiCostLedger.actualMicroUsd}, ${aiCostLedger.estimatedMicroUsd})), 0)::bigint`
	}).from(aiCostLedger).where(and(gte(aiCostLedger.createdAt, since), sql`${aiCostLedger.status} <> 'refused'`)).groupBy(aiCostLedger.operation).orderBy(sql`2 desc`).limit(50);
	const [refusals] = await db.select({ count: sql`count(*)::int` }).from(aiCostLedger).where(and(gte(aiCostLedger.createdAt, since), eq(aiCostLedger.status, "refused")));
	const budgets = await db.select().from(aiBudgetPeriods).limit(200);
	const toUsd = (micro) => Number(micro ?? 0) / 1e6;
	return json({
		days,
		byCategory: byCategory.map((r) => ({
			...r,
			usd: toUsd(r.microUsd)
		})),
		byOperation: byOperation.map((r) => ({
			...r,
			usd: toUsd(r.microUsd)
		})),
		refusedCalls: refusals?.count ?? 0,
		budgets: budgets.map((b) => ({
			scope: b.scope,
			scopeId: b.scopeId,
			periodStart: b.periodStart,
			spentUsd: toUsd(b.spentMicroUsd),
			limitUsd: b.limitMicroUsd === null ? null : toUsd(b.limitMicroUsd)
		}))
	});
};
/** PUT body: { scope, scopeId, limitUsd } — `limitUsd: null` removes the cap. */
var PUT = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	const body = await request.json().catch(() => null);
	const scope = body?.scope;
	const scopeId = body?.scopeId;
	if (!scope || ![
		"user",
		"creator",
		"platform"
	].includes(scope)) return json({ error: "scope must be user, creator or platform" }, { status: 400 });
	if (!scopeId) return json({ error: "scopeId is required" }, { status: 400 });
	const limitMicroUsd = body?.limitUsd === null || body?.limitUsd === void 0 ? null : Math.round(Number(body.limitUsd) * 1e6);
	if (limitMicroUsd !== null && (!Number.isFinite(limitMicroUsd) || limitMicroUsd < 0)) return json({ error: "limitUsd must be a non-negative number or null" }, { status: 400 });
	const now = /* @__PURE__ */ new Date();
	const periodStart = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
	await db.insert(aiBudgetPeriods).values({
		scope,
		scopeId,
		periodStart,
		limitMicroUsd
	}).onConflictDoUpdate({
		target: [
			aiBudgetPeriods.scope,
			aiBudgetPeriods.scopeId,
			aiBudgetPeriods.periodStart
		],
		set: {
			limitMicroUsd,
			updatedAt: now
		}
	});
	return json({ ok: true });
};

export { GET, PUT };
//# sourceMappingURL=_server.ts-RqMNDMkN.js.map
