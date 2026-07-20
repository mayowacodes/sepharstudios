import { Ct as attr_style, Et as derived, Ht as attr, St as attr_class, Wt as escape_html, jt as spread_props, vt as onDestroy, wt as attributes } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/arrow-down.svelte
function Arrow_down($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "arrow-down" },
		props,
		{ iconNode: [["path", { "d": "M12 5v14" }], ["path", { "d": "m19 12-7 7-7-7" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/arrow-up.svelte
function Arrow_up($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "arrow-up" },
		props,
		{ iconNode: [["path", { "d": "m5 12 7-7 7 7" }], ["path", { "d": "M12 19V5" }]] }
	]));
}
//#endregion
//#region src/lib/components/portal/PortalCard.svelte
function PortalCard($$renderer, $$props) {
	/**
	* Portal-scoped glass card. Replaces the ad-hoc surface-1/surface-2
	* div wrappers across portal pages so:
	*   - The hover treatment is consistent (subtle lift + accent ring)
	*   - The portal accent stripe can be opted-in with one prop
	*   - Three sizes pick up consistent padding + radius
	*/
	let { size = "default", accent = false, interactive = false, class: className = "", children, $$slots, $$events, ...rest } = $$props;
	const sizeClasses = {
		compact: "rounded-xl p-3",
		default: "rounded-2xl p-5",
		hero: "rounded-3xl p-6 md:p-8"
	};
	const base = "relative overflow-hidden backdrop-blur-md bg-[hsl(var(--portal-bg-card)/0.7)] border border-[hsl(var(--portal-border)/0.6)] transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]";
	const interactiveClasses = derived(() => interactive ? "cursor-pointer hover:-translate-y-0.5 hover:border-[hsl(var(--portal-accent)/0.6)] hover:shadow-[var(--portal-accent-glow)]" : "");
	$$renderer.push(`<div${attributes({
		class: `${base} ${sizeClasses[size]} ${interactiveClasses()} ${className}`,
		...rest
	})}>`);
	if (accent) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<span class="pointer-events-none absolute left-0 top-4 bottom-4 w-0.75 rounded-r-full bg-[hsl(var(--portal-accent))]" aria-hidden="true"></span>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	children?.($$renderer);
	$$renderer.push(`<!----></div>`);
}
//#endregion
//#region src/lib/components/portal/PortalKpi.svelte
function PortalKpi($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Portal KPI tile. Animates a count-up on mount, hides the sparkline
		* until hover so the card breathes at rest, and pulses a positive
		* delta pill once on arrival. Replaces the older KpiCard.svelte
		* inside the portal scope.
		*
		* Numbers are reset + re-animated whenever `value` changes (e.g. when
		* the parent re-fetches stats), so this stays responsive to live
		* data without the parent needing to remount the card.
		*/
		let { label, value, href, icon, delta, deltaLabel, sparkline, formatValue } = $$props;
		let displayed = 0;
		onDestroy(() => void 0);
		const formattedNumber = derived(() => typeof value === "number" ? formatValue ? formatValue(displayed) : displayed.toLocaleString() : value);
		const deltaTone = derived(() => typeof delta === "number" && delta > 0 ? "pos" : typeof delta === "number" && delta < 0 ? "neg" : "neutral");
		const sparkPath = derived(() => {
			if (!sparkline?.length) return "";
			const w = 100;
			const h = 28;
			const min = Math.min(...sparkline);
			const span = Math.max(...sparkline) - min || 1;
			return sparkline.map((v, i) => {
				const x = i / Math.max(1, sparkline.length - 1) * w;
				const y = h - (v - min) / span * h;
				return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
			}).join(" ");
		});
		const Icon = derived(() => icon);
		let mounted = false;
		function body($$renderer) {
			PortalCard($$renderer, {
				accent: true,
				interactive: !!href,
				class: "group portal-fade-up",
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex items-start justify-between gap-3 mb-3"><span class="text-[10px] uppercase tracking-[0.18em] font-semibold text-[hsl(var(--portal-text-muted))]">${escape_html(label)}</span> `);
					if (Icon()) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="text-[hsl(var(--portal-accent))] opacity-70 group-hover:opacity-100 transition-opacity">`);
						if (Icon()) {
							$$renderer.push("<!--[-->");
							Icon()($$renderer, { class: "h-4 w-4" });
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(`</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> <div class="text-3xl md:text-4xl font-bold text-[hsl(var(--portal-text))] tracking-tight tabular-nums">${escape_html(formattedNumber())}</div> `);
					if (typeof delta === "number" || deltaLabel) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="mt-2 flex items-center gap-1.5 text-[11px]">`);
						if (typeof delta === "number") {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<span${attr_class("inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-semibold", void 0, { "bg-emerald-500-15": deltaTone() === "pos" })}${attr_style("", {
								background: deltaTone() === "pos" ? "hsl(var(--portal-success)/0.18)" : deltaTone() === "neg" ? "hsl(var(--portal-danger)/0.18)" : "hsl(var(--portal-text-muted)/0.12)",
								color: deltaTone() === "pos" ? "hsl(var(--portal-success))" : deltaTone() === "neg" ? "hsl(var(--portal-danger))" : "hsl(var(--portal-text-muted))"
							})}>`);
							if (deltaTone() === "pos") {
								$$renderer.push("<!--[0-->");
								Arrow_up($$renderer, { class: "w-2.5 h-2.5" });
							} else if (deltaTone() === "neg") {
								$$renderer.push("<!--[1-->");
								Arrow_down($$renderer, { class: "w-2.5 h-2.5" });
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> ${escape_html(Math.abs(delta).toFixed(1))}%</span>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (deltaLabel) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<span class="text-[hsl(var(--portal-text-muted))]">${escape_html(deltaLabel)}</span>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (sparkPath() && mounted);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
		}
		if (href) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a${attr("href", href)} class="block focus-visible:outline-none">`);
			body($$renderer);
			$$renderer.push(`<!----></a>`);
		} else {
			$$renderer.push("<!--[-1-->");
			body($$renderer);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { PortalKpi as t };
