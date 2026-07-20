import { Ct as attr_style, Et as derived, St as attr_class, Wt as escape_html } from "./ui-libs.js";
//#region src/lib/components/portal/PortalHero.svelte
function PortalHero($$renderer, $$props) {
	/**
	* Portal hero — the full-width gradient block that opens every
	* dashboard. Replaces PageHeader on /admin and /creator landing
	* pages. Designed to feel cinematic: large title, ambient gradient,
	* optional pulsing status indicator, big icon glyph on the right.
	*
	* The gradient is driven by --portal-gradient-hero so admin and
	* creator each get a distinct identity without any portal-aware
	* logic here.
	*/
	let { eyebrow, title, subtitle, statusDot, statusText, statusTone = "neutral", icon, compact = false, actions, children } = $$props;
	const IconGlyph = derived(() => icon);
	const toneClasses = derived(() => statusTone === "success" ? "text-[hsl(var(--portal-success))] bg-[hsl(var(--portal-success)/0.15)]" : statusTone === "warning" ? "text-[hsl(var(--portal-warning))] bg-[hsl(var(--portal-warning)/0.15)]" : statusTone === "danger" ? "text-[hsl(var(--portal-danger))] bg-[hsl(var(--portal-danger)/0.15)]" : "text-[hsl(var(--portal-text-muted))] bg-[hsl(var(--portal-bg-elevated)/0.6)]");
	$$renderer.push(`<section class="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[hsl(var(--portal-border)/0.5)] portal-fade-up" style="background: var(--portal-gradient-hero);"><div aria-hidden="true" class="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-40 blur-3xl" style="background: radial-gradient(circle, hsl(var(--portal-accent)/0.6) 0%, transparent 70%);"></div> <div${attr_class(`relative flex items-center justify-between gap-6 ${compact ? "p-5 md:p-6" : "p-6 md:p-10"}`)}><div class="min-w-0 flex-1 space-y-2">`);
	if (eyebrow) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-semibold text-[hsl(var(--portal-accent))]">${escape_html(eyebrow)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> <h1${attr_class(`${compact ? "text-2xl md:text-3xl" : "text-3xl md:text-5xl"} font-bold tracking-tight text-[hsl(var(--portal-text))]`)}>${escape_html(title)}</h1> `);
	if (subtitle) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-sm md:text-base text-[hsl(var(--portal-text-muted))] max-w-2xl">${escape_html(subtitle)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	if (statusText) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div${attr_class(`inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full text-xs font-medium ${toneClasses()}`)}>`);
		if (statusDot) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="inline-block w-2 h-2 rounded-full portal-pulse-dot"${attr_style("", { "background-color": statusTone === "success" ? "hsl(var(--portal-success))" : statusTone === "warning" ? "hsl(var(--portal-warning))" : statusTone === "danger" ? "hsl(var(--portal-danger))" : "hsl(var(--portal-text-muted))" })}></span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> ${escape_html(statusText)}</div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	if (children) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="pt-2">`);
		children($$renderer);
		$$renderer.push(`<!----></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div> <div class="hidden md:flex items-start gap-3 shrink-0">`);
	if (actions) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center gap-2">`);
		actions($$renderer);
		$$renderer.push(`<!----></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	if (IconGlyph()) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="relative flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-2xl border border-[hsl(var(--portal-accent)/0.3)]" style="background: hsl(var(--portal-bg-elevated)/0.4); backdrop-filter: blur(12px);">`);
		if (IconGlyph()) {
			$$renderer.push("<!--[-->");
			IconGlyph()($$renderer, { class: "w-9 h-9 lg:w-10 lg:h-10 text-[hsl(var(--portal-accent))]" });
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div></div> `);
	if (actions) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="md:hidden px-5 pb-5"><div class="flex items-center gap-2 flex-wrap">`);
		actions($$renderer);
		$$renderer.push(`<!----></div></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></section>`);
}
//#endregion
export { PortalHero as t };
