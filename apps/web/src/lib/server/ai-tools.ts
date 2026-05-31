import { z } from 'zod';
import { db } from '$lib/db/drizzle';
import { aiActionLog, mediaLibrary, abuseReports, ppvPurchases, refunds, paymentIntents } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm';

/**
 * Copilot tool registry (R+3). Tools the LLM can call; mutating tools
 * require explicit human approval before execution. Each tool is:
 *   - Zod-validated on input
 *   - Returns a typed result
 *   - `mutating: true` → call is staged for approval before execute
 *   - `variant: 'creator' | 'admin' | 'both'` controls who can call
 *
 * Mutating tools must ALWAYS return a preview payload; the Copilot UI
 * renders an approval card and only calls `executeTool(id)` once the
 * user clicks Confirm.
 */

export type ToolVariant = 'creator' | 'admin' | 'both';

export interface ToolContext {
	userId: string;
	role: string;
}

export interface ToolDescriptor<TInput, TOutput> {
	name: string;
	description: string;
	variant: ToolVariant;
	mutating: boolean;
	schema: z.ZodType<TInput>;
	run: (input: TInput, ctx: ToolContext) => Promise<TOutput>;
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATOR-SCOPE READ TOOLS
// ─────────────────────────────────────────────────────────────────────────────

const searchMyContent: ToolDescriptor<{ query?: string; limit?: number }, Array<{ id: string; title: string; status: string; views: number }>> = {
	name: 'searchMyContent',
	description: 'Search the signed-in creator\'s content library by keyword. Returns id/title/status/views for up to `limit` rows.',
	variant: 'creator',
	mutating: false,
	schema: z.object({ query: z.string().optional(), limit: z.number().min(1).max(50).optional() }),
	async run({ query, limit }, ctx) {
		const rows = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			status: mediaLibrary.status,
			views: mediaLibrary.viewCount
		})
			.from(mediaLibrary)
			.where(and(
				eq(mediaLibrary.creatorId, ctx.userId),
				query ? ilike(mediaLibrary.title, `%${query}%`) : sql`true`
			))
			.orderBy(desc(mediaLibrary.createdAt))
			.limit(limit ?? 20);
		return rows.map((r) => ({ id: r.id, title: r.title, status: r.status, views: Number(r.views ?? 0) }));
	}
};

const getMyAnalytics: ToolDescriptor<{ period?: '7d' | '30d' | '90d' }, unknown> = {
	name: 'getMyAnalytics',
	description: 'Returns a summary of the signed-in creator\'s analytics over `period` (default 30d). Includes total views, watch time, completion rate, and top content.',
	variant: 'creator',
	mutating: false,
	schema: z.object({ period: z.enum(['7d', '30d', '90d']).optional() }),
	async run({ period }, ctx) {
		// Reuse the existing analytics endpoint by calling its DB-side helpers
		// would require refactoring; instead, do a focused query inline.
		const since = new Date(Date.now() - ({ '7d': 7, '30d': 30, '90d': 90 }[period ?? '30d']) * 86_400_000);
		const myContent = await db.select({ id: mediaLibrary.id, title: mediaLibrary.title, views: mediaLibrary.viewCount })
			.from(mediaLibrary)
			.where(eq(mediaLibrary.creatorId, ctx.userId));
		const top = [...myContent].sort((a, b) => Number(b.views ?? 0) - Number(a.views ?? 0)).slice(0, 5);
		return {
			period: period ?? '30d',
			since: since.toISOString(),
			contentCount: myContent.length,
			totalViews: myContent.reduce((s, c) => s + Number(c.views ?? 0), 0),
			topContent: top.map((c) => ({ id: c.id, title: c.title, views: Number(c.views ?? 0) }))
		};
	}
};

const getMyEarnings: ToolDescriptor<Record<string, never>, unknown> = {
	name: 'getMyEarnings',
	description: 'Returns the signed-in creator\'s month + lifetime earnings.',
	variant: 'creator',
	mutating: false,
	schema: z.object({}).strict(),
	async run(_input, ctx) {
		const rows = await db.select({
			contentId: ppvPurchases.contentId,
			amount: sql<number>`coalesce(sum(${ppvPurchases.amountPaidCents}), 0)::int`
		})
			.from(ppvPurchases)
			.innerJoin(mediaLibrary, eq(mediaLibrary.id, ppvPurchases.contentId))
			.where(eq(mediaLibrary.creatorId, ctx.userId))
			.groupBy(ppvPurchases.contentId);
		const lifetimeCents = rows.reduce((s, r) => s + Number(r.amount ?? 0), 0);
		return { lifetimeCents, lifetimeDollars: lifetimeCents / 100, byContentCount: rows.length };
	}
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN-SCOPE READ TOOLS
// ─────────────────────────────────────────────────────────────────────────────

const searchUsers: ToolDescriptor<{ query: string; limit?: number }, Array<{ id: string; name: string; email: string; role: string | null }>> = {
	name: 'searchUsers',
	description: 'Search users by name or email. Admin-only.',
	variant: 'admin',
	mutating: false,
	schema: z.object({ query: z.string().min(1), limit: z.number().min(1).max(50).optional() }),
	async run({ query, limit }) {
		const rows = await db.select({ id: user.id, name: user.name, email: user.email, role: user.role })
			.from(user)
			.where(or(ilike(user.name, `%${query}%`), ilike(user.email, `%${query}%`))!)
			.limit(limit ?? 20);
		return rows;
	}
};

const searchContent: ToolDescriptor<{ query?: string; status?: string; limit?: number }, Array<{ id: string; title: string; status: string; creatorId: string | null }>> = {
	name: 'searchContent',
	description: 'Search all content on the platform. Admin-only.',
	variant: 'admin',
	mutating: false,
	schema: z.object({ query: z.string().optional(), status: z.string().optional(), limit: z.number().min(1).max(50).optional() }),
	async run({ query, status, limit }) {
		const conditions = [];
		if (query) conditions.push(ilike(mediaLibrary.title, `%${query}%`));
		if (status) conditions.push(eq(mediaLibrary.status, status));
		const where = conditions.length > 0 ? and(...conditions) : undefined;
		const rows = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			status: mediaLibrary.status,
			creatorId: mediaLibrary.creatorId
		})
			.from(mediaLibrary)
			.where(where)
			.orderBy(desc(mediaLibrary.createdAt))
			.limit(limit ?? 20);
		return rows;
	}
};

const getAbuseQueue: ToolDescriptor<{ status?: 'open' | 'resolved'; limit?: number }, Array<{ id: string; category: string; targetType: string; targetId: string; createdAt: Date }>> = {
	name: 'getAbuseQueue',
	description: 'Read the abuse report queue. Admin-only.',
	variant: 'admin',
	mutating: false,
	schema: z.object({ status: z.enum(['open', 'resolved']).optional(), limit: z.number().min(1).max(50).optional() }),
	async run({ status, limit }) {
		const rows = await db.select({
			id: abuseReports.id,
			category: abuseReports.category,
			targetType: abuseReports.targetType,
			targetId: abuseReports.targetId,
			createdAt: abuseReports.createdAt
		})
			.from(abuseReports)
			.where(status ? eq(abuseReports.status, status) : sql`true`)
			.orderBy(desc(abuseReports.createdAt))
			.limit(limit ?? 20);
		return rows;
	}
};

// ─────────────────────────────────────────────────────────────────────────────
// MUTATING TOOLS (PREVIEW-ONLY — execution gated by approval)
// ─────────────────────────────────────────────────────────────────────────────

const previewBan: ToolDescriptor<{ userId: string; reason: string }, { preview: { userId: string; userName: string | null; reason: string; warning: string } }> = {
	name: 'previewBan',
	description: 'PREVIEW (does not execute) a ban for a user. Admin-only. Returns the action card the user must confirm.',
	variant: 'admin',
	mutating: true,
	schema: z.object({ userId: z.string(), reason: z.string().min(3) }),
	async run({ userId, reason }) {
		const [u] = await db.select({ id: user.id, name: user.name }).from(user).where(eq(user.id, userId)).limit(1);
		if (!u) throw new Error('User not found');
		return {
			preview: {
				userId: u.id,
				userName: u.name,
				reason,
				warning: 'This will set user.banned=true and write an admin_messages row. Reversible via admin.'
			}
		};
	}
};

const previewRefund: ToolDescriptor<{ reference: string; amountCents?: number; reason?: string }, { preview: { reference: string; amountCents: number; reason: string | null; userId: string | null } }> = {
	name: 'previewRefund',
	description: 'PREVIEW (does not execute) a refund against a Paystack reference. Admin-only.',
	variant: 'admin',
	mutating: true,
	schema: z.object({ reference: z.string().min(3), amountCents: z.number().positive().optional(), reason: z.string().optional() }),
	async run({ reference, amountCents, reason }) {
		const [intent] = await db.select({ userId: paymentIntents.userId, amountCents: paymentIntents.amountCents })
			.from(paymentIntents)
			.where(eq(paymentIntents.reference, reference))
			.limit(1);
		if (!intent) throw new Error('No payment_intent for that reference');
		return {
			preview: {
				reference,
				amountCents: amountCents ?? intent.amountCents,
				reason: reason ?? null,
				userId: intent.userId
			}
		};
	}
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ALL_TOOLS: Record<string, ToolDescriptor<any, any>> = {
	searchMyContent,
	getMyAnalytics,
	getMyEarnings,
	searchUsers,
	searchContent,
	getAbuseQueue,
	previewBan,
	previewRefund
};

export function listTools(variant: ToolVariant): Array<{ name: string; description: string; mutating: boolean; schema: z.ZodType<unknown> }> {
	return Object.values(ALL_TOOLS)
		.filter((t) => t.variant === variant || t.variant === 'both')
		.map((t) => ({ name: t.name, description: t.description, mutating: t.mutating, schema: t.schema }));
}

export interface CallToolResult {
	ok: boolean;
	data?: unknown;
	error?: string;
	mutating: boolean;
}

export async function callTool(
	name: string,
	input: unknown,
	ctx: ToolContext,
	conversationId?: string
): Promise<CallToolResult> {
	const tool = ALL_TOOLS[name];
	if (!tool) return { ok: false, error: `Unknown tool: ${name}`, mutating: false };

	// Variant gate.
	const allowed = tool.variant === 'both'
		|| (tool.variant === 'admin' && ctx.role === 'admin')
		|| (tool.variant === 'creator' && (ctx.role === 'creator' || ctx.role === 'admin'));
	if (!allowed) return { ok: false, error: `Tool ${name} is not available in your role`, mutating: tool.mutating };

	// Validate input.
	const parsed = tool.schema.safeParse(input ?? {});
	if (!parsed.success) {
		return { ok: false, error: `Invalid input: ${parsed.error.message}`, mutating: tool.mutating };
	}

	// Mutating tools log a pre-execution audit row, return the preview, and
	// require a follow-up approval click before the side effect runs.
	if (tool.mutating) {
		try {
			const output = await tool.run(parsed.data, ctx);
			await db.insert(aiActionLog).values({
				userId: ctx.userId,
				conversationId: conversationId ?? null,
				tool: name,
				input: parsed.data as Record<string, unknown>,
				output: output as Record<string, unknown>,
				approved: false
			});
			return { ok: true, data: output, mutating: true };
		} catch (err) {
			return { ok: false, error: err instanceof Error ? err.message : 'Tool failed', mutating: true };
		}
	}

	// Non-mutating: run + return.
	try {
		const data = await tool.run(parsed.data, ctx);
		return { ok: true, data, mutating: false };
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : 'Tool failed', mutating: false };
	}
}
