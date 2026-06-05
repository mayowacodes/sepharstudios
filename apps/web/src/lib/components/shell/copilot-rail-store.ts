import { writable, get } from 'svelte/store';

/**
 * Cross-component plumbing between the command palette and the Copilot
 * rail. Used for ONE thing now: when a user invokes the palette's "Ask
 * Copilot…" action, the palette stashes the query here so the rail can
 * consume it on next mount/open.
 *
 * Before the AI SDK migration this store also held the live conversation
 * state (messages, pending approval, sending flag, conversationId). All
 * of that now lives inside the `@ai-sdk/svelte` `Chat` instance owned by
 * `CopilotRail.svelte` directly — which gives us streaming, abort,
 * regenerate, and message-parts for free. Keep this file thin and
 * single-purpose.
 */

interface CopilotRailQueueState {
	/** Pending palette query waiting to be replayed when the rail mounts.
	 *  Cleared by `clearQueuedQuery()` once the rail has consumed it. */
	queuedQuery: string | null;
}

const initial: CopilotRailQueueState = {
	queuedQuery: null
};

export const copilotState = writable<CopilotRailQueueState>(initial);

export function queueCopilotQuery(text: string): void {
	copilotState.update((s) => ({ ...s, queuedQuery: text.trim() }));
}

export function clearQueuedQuery(): void {
	copilotState.update((s) => ({ ...s, queuedQuery: null }));
}

export function getCopilotState(): CopilotRailQueueState {
	return get(copilotState);
}

/**
 * Compat re-export. `resetCopilot()` is no longer used internally — the
 * rail's "New chat" button now clears messages on the Chat instance
 * directly — but this is kept exported so any future consumer that
 * needs to drop the queued query has a one-call entry point.
 */
export function resetCopilot(): void {
	copilotState.set(initial);
}
