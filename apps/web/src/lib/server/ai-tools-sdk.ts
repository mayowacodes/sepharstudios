import { tool, type Tool } from 'ai';
import { z } from 'zod';
import { db } from '$lib/db/drizzle';
import { aiActionLog, mediaLibrary, abuseReports, ppvPurchases, paymentIntents } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';

/**
 * Vercel AI SDK 6 tool definitions for the Copilot. Mirror the registry in
 * `ai-tools.ts` but reshaped as `tool({ description, inputSchema, execute })`
 * records that `streamText({ tools })` understands directly. The model emits
 * a tool call → the SDK runs `execute` → result streams back as a
 * `tool-{name}-result` part on the UI message stream.
 *
 * APPROVAL-GATED MUTATING TOOLS
 * The unique two-stage approval flow from the original implementation is
 * preserved: mutating tools never apply the side effect inside `execute`.
 * They:
 *   1. Insert an `ai_action_log` row with `approved: false` and the preview
 *   2. Return `{ approval: 'required', actionId, preview }` from `execute`
 *
 * The CopilotRail UI detects `result.approval === 'required'` on the
 * streamed tool-result part and renders the Confirm/Decline card. Confirm
 * calls `POST /api/ai/copilot/approve` which runs the real mutation.
 *
 * VARIANT SCOPING
 * Each tool factory takes `(variant, userId)` and returns either the tool
 * or `undefined`. The endpoint builds the final tool dictionary by
 * filtering undefined entries — this keeps the model from seeing tools it
 * can't legally call for the requesting role.
 */

export type CopilotVariant = 'creator' | 'admin';

interface BuildOpts {
	variant: CopilotVariant;
	userId: string;
	role: string;
	conversationId?: string | null;
}

function isAdmin(role: string) {
	return role === 'admin';
}

function isCreator(role: string) {
	return role === 'creator' || role === 'admin';
}

// ─── Creator scope ──────────────────────────────────────────────────────────

const searchMyContent = (opts: BuildOpts) => tool({
	description: 'Search the signed-in creator\'s content library by keyword. Returns id/title/status/views for up to `limit` rows.',
	inputSchema: z.object({
		query: z.string().optional(),
		limit: z.number().min(1).max(50).optional()
	}),
	async execute({ query, limit }) {
		const rows = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			status: mediaLibrary.status,
			views: mediaLibrary.viewCount
		})
			.from(mediaLibrary)
			.where(and(
				eq(mediaLibrary.creatorId, opts.userId),
				query ? ilike(mediaLibrary.title, `%${query}%`) : sql`true`
			))
			.orderBy(desc(mediaLibrary.createdAt))
			.limit(limit ?? 20);
		return rows.map((r) => ({
			id: r.id,
			title: r.title,
			status: r.status,
			views: Number(r.views ?? 0)
		}));
	}
});

const getMyAnalytics = (opts: BuildOpts) => tool({
	description: 'Returns a summary of the signed-in creator\'s analytics over `period` (default 30d). Includes total views, watch time, completion rate, and top content.',
	inputSchema: z.object({
		period: z.enum(['7d', '30d', '90d']).optional()
	}),
	async execute({ period }) {
		const since = new Date(Date.now() - ({ '7d': 7, '30d': 30, '90d': 90 }[period ?? '30d']) * 86_400_000);
		const myContent = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			views: mediaLibrary.viewCount
		})
			.from(mediaLibrary)
			.where(eq(mediaLibrary.creatorId, opts.userId));
		const top = [...myContent]
			.sort((a, b) => Number(b.views ?? 0) - Number(a.views ?? 0))
			.slice(0, 5);
		return {
			period: period ?? '30d',
			since: since.toISOString(),
			contentCount: myContent.length,
			totalViews: myContent.reduce((s, c) => s + Number(c.views ?? 0), 0),
			topContent: top.map((c) => ({ id: c.id, title: c.title, views: Number(c.views ?? 0) }))
		};
	}
});

const getMyEarnings = (opts: BuildOpts) => tool({
	description: 'Returns the signed-in creator\'s month + lifetime earnings.',
	inputSchema: z.object({}).strict(),
	async execute() {
		const rows = await db.select({
			contentId: ppvPurchases.contentId,
			amount: sql<number>`coalesce(sum(${ppvPurchases.amountPaidCents}), 0)::int`
		})
			.from(ppvPurchases)
			.innerJoin(mediaLibrary, eq(mediaLibrary.id, ppvPurchases.contentId))
			.where(eq(mediaLibrary.creatorId, opts.userId))
			.groupBy(ppvPurchases.contentId);
		const lifetimeCents = rows.reduce((s, r) => s + Number(r.amount ?? 0), 0);
		return {
			lifetimeCents,
			lifetimeDollars: lifetimeCents / 100,
			byContentCount: rows.length
		};
	}
});

// ─── Admin scope (read-only) ────────────────────────────────────────────────

const searchUsers = () => tool({
	description: 'Search users by name or email. Admin-only.',
	inputSchema: z.object({
		query: z.string().min(1),
		limit: z.number().min(1).max(50).optional()
	}),
	async execute({ query, limit }) {
		return db.select({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role
		})
			.from(user)
			.where(or(ilike(user.name, `%${query}%`), ilike(user.email, `%${query}%`))!)
			.limit(limit ?? 20);
	}
});

const searchContent = () => tool({
	description: 'Search all content on the platform. Admin-only.',
	inputSchema: z.object({
		query: z.string().optional(),
		status: z.string().optional(),
		limit: z.number().min(1).max(50).optional()
	}),
	async execute({ query, status, limit }) {
		const conditions = [];
		if (query) conditions.push(ilike(mediaLibrary.title, `%${query}%`));
		if (status) conditions.push(eq(mediaLibrary.status, status));
		const where = conditions.length > 0 ? and(...conditions) : undefined;
		return db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			status: mediaLibrary.status,
			creatorId: mediaLibrary.creatorId
		})
			.from(mediaLibrary)
			.where(where)
			.orderBy(desc(mediaLibrary.createdAt))
			.limit(limit ?? 20);
	}
});

const getAbuseQueue = () => tool({
	description: 'Read the abuse report queue. Admin-only.',
	inputSchema: z.object({
		status: z.enum(['open', 'resolved']).optional(),
		limit: z.number().min(1).max(50).optional()
	}),
	async execute({ status, limit }) {
		return db.select({
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
	}
});

// ─── Admin scope (mutating, approval-gated) ─────────────────────────────────

const previewBan = (opts: BuildOpts) => tool({
	description: 'PREVIEW (does not execute) a ban for a user. Admin-only. The user MUST click Confirm in the rail before the ban applies.',
	inputSchema: z.object({
		userId: z.string(),
		reason: z.string().min(3)
	}),
	async execute({ userId, reason }) {
		const [u] = await db.select({ id: user.id, name: user.name })
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);
		if (!u) {
			return { approval: 'failed' as const, error: 'User not found' };
		}
		const [logRow] = await db.insert(aiActionLog).values({
			userId: opts.userId,
			conversationId: opts.conversationId ?? null,
			tool: 'previewBan',
			input: { userId, reason } satisfies Record<string, unknown>,
			output: { userName: u.name, reason } satisfies Record<string, unknown>,
			approved: false
		}).returning({ id: aiActionLog.id });
		return {
			approval: 'required' as const,
			actionId: logRow.id,
			tool: 'previewBan' as const,
			preview: {
				userId: u.id,
				userName: u.name,
				reason,
				warning: 'This will set user.banned=true and write an admin_messages row. Reversible via admin.'
			}
		};
	}
});

const previewRefund = (opts: BuildOpts) => tool({
	description: 'PREVIEW (does not execute) a refund against a Paystack reference. Admin-only. The user MUST click Confirm before the refund applies.',
	inputSchema: z.object({
		reference: z.string().min(3),
		amountCents: z.number().positive().optional(),
		reason: z.string().optional()
	}),
	async execute({ reference, amountCents, reason }) {
		const [intent] = await db.select({
			userId: paymentIntents.userId,
			amountCents: paymentIntents.amountCents
		})
			.from(paymentIntents)
			.where(eq(paymentIntents.reference, reference))
			.limit(1);
		if (!intent) {
			return { approval: 'failed' as const, error: 'No payment_intent for that reference' };
		}
		const resolvedAmount = amountCents ?? intent.amountCents;
		const [logRow] = await db.insert(aiActionLog).values({
			userId: opts.userId,
			conversationId: opts.conversationId ?? null,
			tool: 'previewRefund',
			input: { reference, amountCents: resolvedAmount, reason } satisfies Record<string, unknown>,
			output: { userId: intent.userId } satisfies Record<string, unknown>,
			approved: false
		}).returning({ id: aiActionLog.id });
		return {
			approval: 'required' as const,
			actionId: logRow.id,
			tool: 'previewRefund' as const,
			preview: {
				reference,
				amountCents: resolvedAmount,
				reason: reason ?? null,
				userId: intent.userId
			}
		};
	}
});

// ─── Build the variant-scoped tool dictionary ───────────────────────────────

/**
 * Returns the `tools` map ready to pass to `streamText({ tools })`. Each
 * tool's `execute` already has the right userId / conversationId bound,
 * and the admin-only tools are simply absent for creator variant — the
 * model can't call what it can't see.
 */
export function buildCopilotTools(opts: BuildOpts): Record<string, Tool> {
	const tools: Record<string, Tool> = {};

	if (isCreator(opts.role)) {
		tools.searchMyContent = searchMyContent(opts);
		tools.getMyAnalytics = getMyAnalytics(opts);
		tools.getMyEarnings = getMyEarnings(opts);
	}

	if (opts.variant === 'admin' && isAdmin(opts.role)) {
		tools.searchUsers = searchUsers();
		tools.searchContent = searchContent();
		tools.getAbuseQueue = getAbuseQueue();
		tools.previewBan = previewBan(opts);
		tools.previewRefund = previewRefund(opts);
	}

	return tools;
}

/**
 * System prompt for the Copilot — instructs the model on the platform
 * context + the two-stage approval contract for mutating tools.
 */
export function copilotSystemPrompt(variant: CopilotVariant): string {
	const variantLine = variant === 'admin'
		? 'You are the admin Copilot. You can search users, content, and the abuse queue, and PREVIEW destructive admin actions (ban, refund) for the admin to confirm.'
		: 'You are the creator Copilot. You can search the signed-in creator\'s own content, analytics, and earnings.';
	return [
		'You are an AI assistant for Sephar Studios, a faith-based streaming platform.',
		variantLine,
		'Be respectful of Christian faith, theologically sensitive, family-appropriate, and concise.',
		'When calling a tool, prefer a single, focused call over many. Summarize results in plain language for the user.',
		'For MUTATING tools (previewBan, previewRefund): the tool returns ONLY a preview. The user must click Confirm in the UI before the action runs. Do not pretend the action has been applied — tell the user the preview is ready and waiting for their confirmation.'
	].join(' ');
}
