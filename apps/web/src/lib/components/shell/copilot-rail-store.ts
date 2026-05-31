import { writable, get } from 'svelte/store';

/**
 * Copilot conversation state shared between the portal shell, the rail,
 * and the command palette's "Ask Copilot" hand-off.
 *
 * Keeping this in a store (vs. inside the rail component) means:
 *   - Closing the rail doesn't drop the conversation.
 *   - The command palette can seed a question and instantly hand off
 *     without re-fetching.
 *   - Page navigation preserves the conversation thread.
 *
 * The store is reset only when the user clicks "New chat" or signs out.
 */

export interface CopilotMessage {
	id: string;
	role: 'user' | 'assistant' | 'tool';
	content: string;
	toolName?: string;
	toolOutput?: unknown;
}

export interface PendingApproval {
	actionId: string;
	tool: string;
	preview: unknown;
}

export interface CopilotState {
	conversationId: string | null;
	messages: CopilotMessage[];
	pending: PendingApproval | null;
	sending: boolean;
	/** Last seed query passed in from the command palette — the rail
	 *  consumes this on first mount/open and clears it. */
	queuedQuery: string | null;
}

const initial: CopilotState = {
	conversationId: null,
	messages: [],
	pending: null,
	sending: false,
	queuedQuery: null
};

export const copilotState = writable<CopilotState>(initial);

export function resetCopilot(): void {
	copilotState.set(initial);
}

export function queueCopilotQuery(text: string): void {
	copilotState.update((s) => ({ ...s, queuedQuery: text.trim() }));
}

export function clearQueuedQuery(): void {
	copilotState.update((s) => ({ ...s, queuedQuery: null }));
}

export function getCopilotState(): CopilotState {
	return get(copilotState);
}
