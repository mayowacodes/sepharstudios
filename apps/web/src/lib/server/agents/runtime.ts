import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { agentRuns } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';

/**
 * AI Layer 3 — autonomous agent runtime (R+4).
 *
 * Each agent is a plain async function that takes a `RunContext` and
 * returns an `AgentResult`. The runtime:
 *   - Honors the `AI_AGENTS_ENABLED=true` kill-switch (default OFF)
 *   - Opens an `agent_runs` row, writes status updates, closes it on finish
 *   - Bounds step count + cost so a runaway agent can't drain budget
 *
 * Agents should NEVER directly mutate user-facing state in this round.
 * Their job is to produce findings; humans approve actions. (Later we can
 * graduate specific low-risk actions to auto-execute once they prove out.)
 */

export interface AgentResult {
	itemsProcessed: number;
	itemsActioned: number;
	summary: string;
}

export interface RunContext {
	runId: string;
	maxSteps: number;
	maxCostCents: number;
	addCost(cents: number): void;
	step(label?: string): void;
	stepsRemaining(): number;
	costRemaining(): number;
}

export interface AgentDescriptor {
	name: string;
	description: string;
	defaultMaxSteps: number;
	defaultMaxCostCents: number;
	run: (ctx: RunContext) => Promise<AgentResult>;
}

export function agentsEnabled(): boolean {
	return env.AI_AGENTS_ENABLED === 'true';
}

/**
 * Execute an agent end-to-end with bounded resources + persistent audit.
 * Returns the agent_runs row id so callers can correlate.
 */
export async function executeAgent(agent: AgentDescriptor): Promise<{
	runId: string;
	status: 'completed' | 'failed' | 'killed';
	result?: AgentResult;
	error?: string;
}> {
	const [run] = await db.insert(agentRuns).values({
		agent: agent.name,
		status: 'running'
	}).returning({ id: agentRuns.id });

	let steps = 0;
	let costCents = 0;
	let result: AgentResult | null = null;
	let error: string | null = null;

	const ctx: RunContext = {
		runId: run.id,
		maxSteps: agent.defaultMaxSteps,
		maxCostCents: agent.defaultMaxCostCents,
		addCost(cents: number) {
			costCents += cents;
			if (costCents >= agent.defaultMaxCostCents) {
				throw new Error(`Cost cap reached at $${(costCents / 100).toFixed(2)}`);
			}
		},
		step(label?: string) {
			steps += 1;
			if (steps > agent.defaultMaxSteps) {
				throw new Error(`Step cap reached (${steps})${label ? ` at ${label}` : ''}`);
			}
		},
		stepsRemaining: () => Math.max(0, agent.defaultMaxSteps - steps),
		costRemaining: () => Math.max(0, agent.defaultMaxCostCents - costCents)
	};

	try {
		result = await agent.run(ctx);
		await db.update(agentRuns)
			.set({
				status: 'completed',
				finishedAt: new Date(),
				steps,
				costCents,
				itemsProcessed: result.itemsProcessed,
				itemsActioned: result.itemsActioned,
				summary: result.summary.slice(0, 4000)
			})
			.where(eq(agentRuns.id, run.id));
		return { runId: run.id, status: 'completed', result };
	} catch (err) {
		error = err instanceof Error ? err.message : String(err);
		const isKill = error.includes('cap reached');
		await db.update(agentRuns)
			.set({
				status: isKill ? 'killed' : 'failed',
				finishedAt: new Date(),
				steps,
				costCents,
				error
			})
			.where(eq(agentRuns.id, run.id));
		return { runId: run.id, status: isKill ? 'killed' : 'failed', error };
	}
}
