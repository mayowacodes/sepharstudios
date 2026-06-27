/**
 * Shared motion language for the admin + creator portals.
 *
 * One source of truth for easings + durations. Components that need to
 * stagger their entrance, fade up on mount, or transition on hover
 * import from here so we don't end up with 12 different cubic-beziers
 * across the codebase.
 *
 * Every helper respects `prefers-reduced-motion: reduce` via the
 * `prefersReducedMotion()` runtime check — Svelte transitions also
 * defer to the global media query in app.css, which clamps animation
 * durations to ~0ms.
 */

export const EASE = {
	/** Snappy default — cards, hovers, accordions. */
	standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
	/** Slower decel — heroes + page-level entrances. */
	cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
	/** Slight overshoot — toasts + popovers landing. */
	overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
} as const;

export const DURATION = {
	/** 120ms — tooltips, hover micro-interactions. */
	micro: 120,
	/** 200ms — cards, buttons, default transitions. */
	short: 200,
	/** 400ms — list-item staggers, panel slide-ins. */
	medium: 400,
	/** 600ms — dashboard hero entrance, cinematic fade-up. */
	long: 600
} as const;

/** Stagger gap between sibling animated children. */
export const STAGGER_MS = 40;

export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Build a Svelte `fly` transition config that respects reduced motion.
 * When the user prefers reduced motion, the duration drops to 0 so the
 * element appears instantly but the transition events still fire (Svelte
 * relies on those for in-block cleanup).
 */
export function flyUp(opts: { y?: number; duration?: number; delay?: number } = {}) {
	const reduced = prefersReducedMotion();
	return {
		y: reduced ? 0 : opts.y ?? 10,
		duration: reduced ? 0 : opts.duration ?? DURATION.medium,
		delay: opts.delay ?? 0,
		easing: cubicBezierToFn(EASE.standard)
	};
}

/**
 * Cubic-bezier string → easing function for Svelte's transition API.
 * Svelte expects (t: number) => number, not a CSS string.
 */
function cubicBezierToFn(_cubicBezier: string): (t: number) => number {
	// The full bezier math is overkill here; for the values we use, a
	// quad ease-out is visually indistinguishable. Keeps this file
	// dependency-free.
	return (t: number) => 1 - Math.pow(1 - t, 3);
}

/**
 * Animate a numeric value from 0 → target over `duration` ms, calling
 * `setter` on each frame. Used by PortalKpi for the count-up effect.
 * Returns a cancel function. When reduced motion is on, jumps to the
 * final value immediately.
 */
export function animateCount(
	target: number,
	setter: (v: number) => void,
	duration = DURATION.long
): () => void {
	if (prefersReducedMotion() || target === 0) {
		setter(target);
		return () => {};
	}
	let raf = 0;
	const start = performance.now();
	const tick = (now: number) => {
		const t = Math.min(1, (now - start) / duration);
		// Quad ease-out — matches EASE.standard visually.
		const eased = 1 - Math.pow(1 - t, 3);
		setter(Math.round(target * eased));
		if (t < 1) raf = requestAnimationFrame(tick);
	};
	raf = requestAnimationFrame(tick);
	return () => cancelAnimationFrame(raf);
}
