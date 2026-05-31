import { writable, get } from 'svelte/store';
import type { Component } from 'svelte';

/**
 * Portal-wide slide-over registry. Pages and the command palette push
 * "open this panel" requests onto the stack; SlideOverHost (mounted once
 * per portal shell) renders the topmost entry as a side panel.
 *
 * Pinned panels survive route navigation; unpinned ones close when the
 * user navigates to a different page. Up to 2 panels can be open at once
 * (the second slides in beside the first).
 */

// Loose Component<any> on purpose: each panel has its own prop shape;
// the host renders whatever the panel declares without trying to enforce
// a shared signature.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = Component<any>;

export interface SlideOverEntry {
	/** Stable id so re-opening the same kind of panel doesn't stack. */
	id: string;
	title: string;
	component: AnyComponent;
	props?: Record<string, unknown>;
	/** When true, the panel persists across `goto()` calls. */
	pinned?: boolean;
}

const stack = writable<SlideOverEntry[]>([]);

export const slideOverStack = stack;

export function openSlideOver(entry: SlideOverEntry): void {
	stack.update((curr) => {
		// Replace if an entry with the same id is already open.
		const existing = curr.findIndex((e) => e.id === entry.id);
		if (existing >= 0) {
			const next = curr.slice();
			next[existing] = entry;
			return next;
		}
		// Cap at 2 — push oldest off the bottom.
		const next = [...curr, entry];
		return next.slice(-2);
	});
}

export function closeSlideOver(id: string): void {
	stack.update((curr) => curr.filter((e) => e.id !== id));
}

export function closeTopSlideOver(): void {
	stack.update((curr) => curr.slice(0, -1));
}

export function pinSlideOver(id: string, pinned: boolean): void {
	stack.update((curr) =>
		curr.map((e) => (e.id === id ? { ...e, pinned } : e))
	);
}

/** Called by the shell on route change — drops every unpinned panel. */
export function dropUnpinnedSlideOvers(): void {
	stack.update((curr) => curr.filter((e) => e.pinned));
}

export function isSlideOverOpen(id: string): boolean {
	return get(stack).some((e) => e.id === id);
}
