import { t as private_env } from "../../../../../../chunks/shared-server.js";
import { H as mediaLibrary, T as creators, U as mediaWatchProgress, Y as payouts, a as user, m as agentRuns, o as abuseReports, t as db } from "../../../../../../chunks/drizzle.js";
import { t as notify } from "../../../../../../chunks/notify.js";
import { i as SiteMeta } from "../../../../../../chunks/constants.js";
import { t as sendEmailAction } from "../../../../../../chunks/server2.js";
import { n as tryParseJson, t as runAi } from "../../../../../../chunks/ai.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, gte, sql } from "drizzle-orm";
//#region src/lib/server/agents/runtime.ts
function agentsEnabled() {
	return private_env.AI_AGENTS_ENABLED === "true";
}
/**
* Execute an agent end-to-end with bounded resources + persistent audit.
* Returns the agent_runs row id so callers can correlate.
*/
async function executeAgent(agent) {
	const [run] = await db.insert(agentRuns).values({
		agent: agent.name,
		status: "running"
	}).returning({ id: agentRuns.id });
	let steps = 0;
	let costCents = 0;
	let result = null;
	let error = null;
	const ctx = {
		runId: run.id,
		maxSteps: agent.defaultMaxSteps,
		maxCostCents: agent.defaultMaxCostCents,
		addCost(cents) {
			costCents += cents;
			if (costCents >= agent.defaultMaxCostCents) throw new Error(`Cost cap reached at $${(costCents / 100).toFixed(2)}`);
		},
		step(label) {
			steps += 1;
			if (steps > agent.defaultMaxSteps) throw new Error(`Step cap reached (${steps})${label ? ` at ${label}` : ""}`);
		},
		stepsRemaining: () => Math.max(0, agent.defaultMaxSteps - steps),
		costRemaining: () => Math.max(0, agent.defaultMaxCostCents - costCents)
	};
	try {
		result = await agent.run(ctx);
		await db.update(agentRuns).set({
			status: "completed",
			finishedAt: /* @__PURE__ */ new Date(),
			steps,
			costCents,
			itemsProcessed: result.itemsProcessed,
			itemsActioned: result.itemsActioned,
			summary: result.summary.slice(0, 4e3)
		}).where(eq(agentRuns.id, run.id));
		return {
			runId: run.id,
			status: "completed",
			result
		};
	} catch (err) {
		error = err instanceof Error ? err.message : String(err);
		const isKill = error.includes("cap reached");
		await db.update(agentRuns).set({
			status: isKill ? "killed" : "failed",
			finishedAt: /* @__PURE__ */ new Date(),
			steps,
			costCents,
			error
		}).where(eq(agentRuns.id, run.id));
		return {
			runId: run.id,
			status: isKill ? "killed" : "failed",
			error
		};
	}
}
//#endregion
//#region src/lib/server/agents/abuse-triage.ts
async function previewFor(targetType, targetId) {
	return `[${targetType}:${targetId.slice(0, 8)}]`;
}
var abuseTriageAgent = {
	name: "abuse-triage",
	description: "Triages open abuse reports nightly. Auto-dismisses obvious spam; leaves rest open with suggestion summary.",
	defaultMaxSteps: 100,
	defaultMaxCostCents: 50,
	async run(ctx) {
		ctx.step("load");
		const open = await db.select({
			id: abuseReports.id,
			category: abuseReports.category,
			description: abuseReports.description,
			targetType: abuseReports.targetType,
			targetId: abuseReports.targetId
		}).from(abuseReports).where(eq(abuseReports.status, "open")).orderBy(desc(abuseReports.createdAt)).limit(50);
		const findings = [];
		let actioned = 0;
		for (const r of open) {
			if (ctx.stepsRemaining() <= 1 || ctx.costRemaining() <= 1) break;
			ctx.step(`classify:${r.id.slice(0, 6)}`);
			const preview = await previewFor(r.targetType, r.targetId) ?? "";
			const result = await runAi({
				userId: null,
				surface: "agent:abuse-triage",
				modelType: "agent",
				temperature: .1,
				maxTokens: 256,
				messages: [{
					role: "system",
					content: "You triage abuse reports on a Christian streaming platform. Be conservative on auto-action — only dismiss obvious spam."
				}, {
					role: "user",
					content: `Triage this report.

Category: ${r.category}
Note: """${(r.description ?? "").slice(0, 400)}"""
Target: ${preview}

Return ONLY this JSON:
{
  "severity": "low|med|high|critical",
  "action": "dismiss|leave|escalate",
  "confidence": 0.0-1.0,
  "rationale": "short reason"
}

Use action='dismiss' ONLY for very obvious spam reports with high confidence (>0.8). Otherwise action='leave' (default) or 'escalate' for critical content.`
				}]
			});
			if (!result.ok) {
				findings.push({
					id: r.id,
					severity: "unknown",
					rationale: result.message,
					action: "leave"
				});
				continue;
			}
			ctx.addCost(result.costCents);
			const parsed = tryParseJson(result.content);
			const severity = parsed?.severity ?? "low";
			const action = parsed?.action ?? "leave";
			const confidence = typeof parsed?.confidence === "number" ? parsed.confidence : 0;
			const rationale = parsed?.rationale ?? "";
			findings.push({
				id: r.id,
				severity,
				rationale,
				action
			});
			if (action === "dismiss" && severity === "low" && confidence > .8) {
				await db.update(abuseReports).set({
					status: "dismissed",
					resolution: "no_action",
					resolvedAt: /* @__PURE__ */ new Date()
				}).where(and(eq(abuseReports.id, r.id), eq(abuseReports.status, "open")));
				actioned += 1;
			}
		}
		const counts = findings.reduce((acc, f) => {
			acc[f.severity] = (acc[f.severity] ?? 0) + 1;
			return acc;
		}, {});
		const summary = [
			`Processed ${findings.length} open reports.`,
			`Auto-dismissed ${actioned} as obvious spam.`,
			`Severity breakdown: ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(", ") || "none"}.`
		].join(" ");
		return {
			itemsProcessed: findings.length,
			itemsActioned: actioned,
			summary
		};
	}
};
//#endregion
//#region src/lib/server/agents/anomaly-watch.ts
async function userSignupWindow() {
	const hourStart = /* @__PURE__ */ new Date(Date.now() - 3600 * 1e3);
	const dayStart = /* @__PURE__ */ new Date(Date.now() - 1440 * 60 * 1e3);
	const [hourly] = await db.select({ c: sql`count(*)::int` }).from(user).where(gte(user.createdAt, hourStart));
	const [daily] = await db.select({ c: sql`count(*)::int` }).from(user).where(gte(user.createdAt, dayStart));
	return {
		hourly: Number(hourly?.c ?? 0),
		dailyAvgHourly: Number(daily?.c ?? 0) / 24
	};
}
async function encoderFailureRate() {
	const hourStart = /* @__PURE__ */ new Date(Date.now() - 3600 * 1e3);
	const [totals] = await db.select({
		total: sql`count(*)::int`,
		failed: sql`sum(case when ${mediaLibrary.processingStatus} = 'failed' then 1 else 0 end)::int`
	}).from(mediaLibrary).where(gte(mediaLibrary.updatedAt, hourStart));
	const total = Number(totals?.total ?? 0);
	const failed = Number(totals?.failed ?? 0);
	return {
		failed,
		total,
		rate: total > 0 ? failed / total : 0
	};
}
async function payoutFailureCount() {
	const hourStart = /* @__PURE__ */ new Date(Date.now() - 3600 * 1e3);
	const [row] = await db.select({ c: sql`count(*)::int` }).from(payouts).where(and(eq(payouts.status, "failed"), gte(payouts.createdAt, hourStart)));
	return Number(row?.c ?? 0);
}
async function abuseReportWindow() {
	const hourStart = /* @__PURE__ */ new Date(Date.now() - 3600 * 1e3);
	const dayStart = /* @__PURE__ */ new Date(Date.now() - 1440 * 60 * 1e3);
	const [hourly] = await db.select({ c: sql`count(*)::int` }).from(abuseReports).where(gte(abuseReports.createdAt, hourStart));
	const [daily] = await db.select({ c: sql`count(*)::int` }).from(abuseReports).where(gte(abuseReports.createdAt, dayStart));
	return {
		hourly: Number(hourly?.c ?? 0),
		dailyAvgHourly: Number(daily?.c ?? 0) / 24
	};
}
var anomalyWatchAgent = {
	name: "anomaly-watch",
	description: "Hourly anomaly scan. Surfaces traffic spikes, encoder failure clusters, payout failures, abuse spikes.",
	defaultMaxSteps: 20,
	defaultMaxCostCents: 5,
	async run(ctx) {
		const flags = [];
		let processed = 0;
		ctx.step("users");
		const signups = await userSignupWindow();
		processed += 1;
		if (signups.hourly > 5 && signups.hourly > signups.dailyAvgHourly * 3) flags.push(`🚀 user signup spike: ${signups.hourly} this hour vs ~${signups.dailyAvgHourly.toFixed(1)}/h baseline`);
		ctx.step("encoder");
		const enc = await encoderFailureRate();
		processed += 1;
		if (enc.total >= 5 && enc.rate > .25) flags.push(`🎬 encoder failure rate ${(enc.rate * 100).toFixed(0)}% (${enc.failed}/${enc.total}) this hour`);
		ctx.step("payouts");
		const payFails = await payoutFailureCount();
		processed += 1;
		if (payFails > 0) flags.push(`💸 payout failures: ${payFails} this hour`);
		ctx.step("abuse");
		const ab = await abuseReportWindow();
		processed += 1;
		if (ab.hourly > 3 && ab.hourly > ab.dailyAvgHourly * 3) flags.push(`🚨 abuse report spike: ${ab.hourly} this hour vs ~${ab.dailyAvgHourly.toFixed(1)}/h baseline`);
		const summary = flags.length > 0 ? flags.join(" | ") : "All clear. No anomalies detected.";
		return {
			itemsProcessed: processed,
			itemsActioned: flags.length,
			summary
		};
	}
};
//#endregion
//#region src/lib/server/agents/content-quality-auditor.ts
async function topCreators(limit) {
	return (await db.select({
		id: creators.id,
		userId: creators.userId,
		displayName: creators.displayName,
		email: user.email,
		name: user.name,
		count: sql`count(${mediaLibrary.id})::int`
	}).from(creators).innerJoin(mediaLibrary, eq(mediaLibrary.creatorId, creators.userId)).innerJoin(user, eq(user.id, creators.userId)).where(eq(mediaLibrary.isActive, true)).groupBy(creators.id, creators.userId, creators.displayName, user.email, user.name).orderBy(desc(sql`count(${mediaLibrary.id})`)).limit(limit)).map((r) => ({
		id: r.id,
		userId: r.userId,
		displayName: r.displayName,
		email: r.email,
		name: r.name
	}));
}
async function libraryAggregate(userId) {
	return (await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		views: mediaLibrary.viewCount,
		avgCompletion: sql`coalesce(avg(${mediaWatchProgress.completionPercent}), 0)::numeric`
	}).from(mediaLibrary).leftJoin(mediaWatchProgress, eq(mediaWatchProgress.contentId, mediaLibrary.id)).where(and(eq(mediaLibrary.creatorId, userId), eq(mediaLibrary.isActive, true))).groupBy(mediaLibrary.id, mediaLibrary.title, mediaLibrary.viewCount).orderBy(desc(mediaLibrary.viewCount)).limit(50)).map((r) => ({
		id: r.id,
		title: r.title,
		views: Number(r.views ?? 0),
		avgCompletion: Number(r.avgCompletion ?? 0)
	}));
}
var contentQualityAuditorAgent = {
	name: "content-quality-auditor",
	description: "Picks ~10 active creators and drafts personalized coaching notes for their underperforming content.",
	defaultMaxSteps: 30,
	defaultMaxCostCents: 200,
	async run(ctx) {
		ctx.step("select-creators");
		const targets = await topCreators(10);
		let actioned = 0;
		for (const c of targets) {
			if (ctx.stepsRemaining() <= 1 || ctx.costRemaining() <= 1) break;
			ctx.step(`audit:${c.displayName ?? c.userId.slice(0, 6)}`);
			const lib = await libraryAggregate(c.userId);
			if (lib.length === 0) continue;
			const worst = [...lib].sort((a, b) => a.views * (a.avgCompletion + 1) - b.views * (b.avgCompletion + 1)).slice(0, 3);
			const result = await runAi({
				userId: null,
				surface: "agent:content-quality-auditor",
				modelType: "chat",
				temperature: .4,
				maxTokens: 400,
				messages: [{
					role: "system",
					content: "You write encouraging coaching notes to creators on a Christian streaming platform. Be warm, specific, and actionable."
				}, {
					role: "user",
					content: `Draft a short (3-4 sentence) coaching note to creator "${c.displayName ?? "creator"}" about these underperforming videos. Mention specific titles. Suggest one or two concrete things they could try.

Underperformers:
${worst.map((w, i) => `${i + 1}. "${w.title}" — ${w.views} views, ${Math.round(w.avgCompletion)}% avg completion`).join("\n")}

Library size: ${lib.length} active videos.
Top performer: "${lib[0]?.title}" with ${lib[0]?.views ?? 0} views.

Plain text. No JSON. No greeting. Direct + warm.`
				}]
			});
			if (!result.ok) continue;
			ctx.addCost(result.costCents);
			const note = result.content.trim().slice(0, 2e3);
			await notify({
				userId: c.userId,
				kind: "system",
				title: "Quarterly content review",
				message: note.slice(0, 1e3),
				actionUrl: "/creator/analytics"
			}).catch(() => void 0);
			if (c.email) try {
				await sendEmailAction({
					to: c.email,
					subject: `Your quarterly content review on ${SiteMeta.name}`,
					meta: {
						description: `Hi ${c.name ?? c.displayName ?? "there"},\n\n${note}\n\nReply or open your analytics page for more details.`,
						link: `${SiteMeta.link}/creator/analytics`
					}
				});
			} catch (err) {
				console.warn("[content-quality-auditor] email send failed:", c.email, err);
			}
			actioned += 1;
		}
		return {
			itemsProcessed: targets.length,
			itemsActioned: actioned,
			summary: `Reviewed ${targets.length} creators, sent ${actioned} coaching notes.`
		};
	}
};
//#endregion
//#region src/lib/server/agents/theology-monitor.ts
/**
* Theology monitor agent (R+4).
*
* Daily. Re-evaluates recently published content against the platform's
* core belief statement (passed via the `PLATFORM_BELIEF_STATEMENT` env
* var). Flags any title whose AI-evaluated alignment score drops below a
* threshold. Flags surface in the agent_run summary; no auto-action.
*
* Keeps the platform aligned to its statement of faith without an admin
* needing to manually re-review existing content each time the statement
* is updated.
*/
var DEFAULT_BELIEF_STATEMENT = `Sephar Studios platform standard: content should align with mainstream historical Christian doctrine — the divinity of Jesus Christ, the authority of Scripture, salvation through faith. Family-safe; reverent tone; no doctrinal contradiction.`;
//#endregion
//#region src/routes/api/cron/agents/[name]/+server.ts
/**
* POST /api/cron/agents/[name]
*
* Single entry point for all autonomous agents. Each cron job hits a
* distinct name. Bearer-gated by CRON_SECRET; additionally gated by the
* AI_AGENTS_ENABLED=true kill-switch (defaults OFF).
*
* Recommended schedule:
*   abuse-triage             — daily 02:00 UTC
*   anomaly-watch            — hourly
*   theology-monitor         — daily 03:00 UTC
*   content-quality-auditor  — quarterly (cron with @reboot+monthly skip)
*/
var REGISTRY = {
	"abuse-triage": abuseTriageAgent,
	"anomaly-watch": anomalyWatchAgent,
	"content-quality-auditor": contentQualityAuditorAgent,
	"theology-monitor": {
		name: "theology-monitor",
		description: "Daily. Re-evaluates recently published content against the platform belief statement. Flags doctrinal drift.",
		defaultMaxSteps: 60,
		defaultMaxCostCents: 100,
		async run(ctx) {
			ctx.step("load");
			const belief = private_env.PLATFORM_BELIEF_STATEMENT?.trim() || DEFAULT_BELIEF_STATEMENT;
			const since = /* @__PURE__ */ new Date(Date.now() - 1440 * 60 * 1e3);
			const recent = await db.select({
				id: mediaLibrary.id,
				title: mediaLibrary.title,
				description: mediaLibrary.description,
				genres: mediaLibrary.genres,
				bibleReference: mediaLibrary.bibleReference
			}).from(mediaLibrary).where(and(eq(mediaLibrary.status, "published"), gte(mediaLibrary.updatedAt, since))).orderBy(desc(mediaLibrary.updatedAt)).limit(50);
			const flags = [];
			for (const r of recent) {
				if (ctx.stepsRemaining() <= 1 || ctx.costRemaining() <= 1) break;
				ctx.step(`eval:${r.id.slice(0, 6)}`);
				const result = await runAi({
					userId: null,
					surface: "agent:theology-monitor",
					modelType: "agent",
					temperature: .1,
					maxTokens: 256,
					messages: [{
						role: "system",
						content: "You evaluate Christian-platform content for doctrinal alignment. Be charitable but precise."
					}, {
						role: "user",
						content: `Belief statement:
"""${belief}"""

Content under review:
Title: "${r.title}"
Description: """${(r.description ?? "").slice(0, 800)}"""
Genres: ${Array.isArray(r.genres) ? r.genres.join(", ") : ""}
Bible reference: ${r.bibleReference ?? "—"}

Return ONLY this JSON:
{ "score": 0-10, "concern": "short reason or empty string" }

Score guide:
- 9-10: clearly aligned
- 6-8: aligned, minor questions
- 3-5: meaningful concerns (false teaching, sensationalism)
- 0-2: directly contradicts core doctrine

Only flag (score <= 6) when there is real doctrinal concern, not stylistic differences.`
					}]
				});
				if (!result.ok) continue;
				ctx.addCost(result.costCents);
				const parsed = tryParseJson(result.content);
				const score = Number(parsed?.score ?? 10);
				const reason = parsed?.concern ?? "";
				if (score <= 6) flags.push({
					id: r.id,
					title: r.title,
					score,
					reason
				});
			}
			const summary = flags.length > 0 ? `Flagged ${flags.length}/${recent.length} recent titles: ${flags.slice(0, 5).map((f) => `"${f.title}" (${f.score}/10)`).join("; ")}${flags.length > 5 ? "…" : ""}` : `Scanned ${recent.length} recent titles. No doctrinal drift detected.`;
			return {
				itemsProcessed: recent.length,
				itemsActioned: flags.length,
				summary
			};
		}
	}
};
var POST = async ({ params, request }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	if (!agentsEnabled()) return json({
		skipped: true,
		reason: "AI_AGENTS_ENABLED is not true"
	});
	const name = params.name;
	const agent = name ? REGISTRY[name] : void 0;
	if (!agent) return json({ error: `Unknown agent: ${name}` }, { status: 404 });
	return json(await executeAgent(agent));
};
//#endregion
export { POST };
