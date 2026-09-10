import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { aiCostLedger, aiBudgetPeriods } from '$lib/db/schema/sepharstudios';
import { and, eq, gte, sql } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

/**
 * GET  /api/admin/ai-costs?days=30  → spend by category, by operation, budgets
 * PUT  /api/admin/ai-costs          → set a budget ceiling
 *
 * Money is stored as micro-dollars (1e-6 USD) integers; this endpoint converts
 * to dollars at the boundary so the UI never does the division and never
 * accumulates float error.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const days = Math.min(365, Math.max(1, Number(url.searchParams.get('days') ?? 30)));
	const since = new Date(Date.now() - days * 86400_000);

	const byCategory = await db
		.select({
			category: aiCostLedger.category,
			calls: sql<number>`count(*)::int`,
			// Settled rows carry the real cost; reserved ones only an estimate.
			// COALESCE means an in-flight call still shows up rather than
			// silently reading as free.
			microUsd: sql<number>`coalesce(sum(coalesce(${aiCostLedger.actualMicroUsd}, ${aiCostLedger.estimatedMicroUsd})), 0)::bigint`
		})
		.from(aiCostLedger)
		.where(and(gte(aiCostLedger.createdAt, since), sql`${aiCostLedger.status} <> 'refused'`))
		.groupBy(aiCostLedger.category);

	const byOperation = await db
		.select({
			operation: aiCostLedger.operation,
			calls: sql<number>`count(*)::int`,
			microUsd: sql<number>`coalesce(sum(coalesce(${aiCostLedger.actualMicroUsd}, ${aiCostLedger.estimatedMicroUsd})), 0)::bigint`
		})
		.from(aiCostLedger)
		.where(and(gte(aiCostLedger.createdAt, since), sql`${aiCostLedger.status} <> 'refused'`))
		.groupBy(aiCostLedger.operation)
		.orderBy(sql`2 desc`)
		.limit(50);

	// Refusals are reported separately and never folded into spend. They cost
	// nothing, but a rising refusal count is the signal that a ceiling is too
	// low — which looks identical to "usage fell" if you only chart spend.
	const [refusals] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(aiCostLedger)
		.where(and(gte(aiCostLedger.createdAt, since), eq(aiCostLedger.status, 'refused')));

	const budgets = await db.select().from(aiBudgetPeriods).limit(200);

	const toUsd = (micro: number | string | null) => Number(micro ?? 0) / 1e6;

	return json({
		days,
		byCategory: byCategory.map((r) => ({ ...r, usd: toUsd(r.microUsd) })),
		byOperation: byOperation.map((r) => ({ ...r, usd: toUsd(r.microUsd) })),
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
export const PUT: RequestHandler = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const body = (await request.json().catch(() => null)) as {
		scope?: string;
		scopeId?: string;
		limitUsd?: number | null;
	} | null;

	const scope = body?.scope;
	const scopeId = body?.scopeId;
	if (!scope || !['user', 'creator', 'platform'].includes(scope)) {
		return json({ error: 'scope must be user, creator or platform' }, { status: 400 });
	}
	if (!scopeId) return json({ error: 'scopeId is required' }, { status: 400 });

	// null removes the ceiling; 0 would mean "cannot spend anything". Keep them
	// distinct — conflating them disables every AI feature for that scope.
	const limitMicroUsd =
		body?.limitUsd === null || body?.limitUsd === undefined
			? null
			: Math.round(Number(body.limitUsd) * 1e6);

	if (limitMicroUsd !== null && (!Number.isFinite(limitMicroUsd) || limitMicroUsd < 0)) {
		return json({ error: 'limitUsd must be a non-negative number or null' }, { status: 400 });
	}

	const now = new Date();
	const periodStart = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-01`;

	await db
		.insert(aiBudgetPeriods)
		.values({ scope, scopeId, periodStart, limitMicroUsd })
		.onConflictDoUpdate({
			target: [aiBudgetPeriods.scope, aiBudgetPeriods.scopeId, aiBudgetPeriods.periodStart],
			set: { limitMicroUsd, updatedAt: now }
		});

	return json({ ok: true });
};
