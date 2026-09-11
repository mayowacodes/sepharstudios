import { q as escape_html, ae as attr_style, v as stringify, f as derived } from './index.js-CxPEndTa.js';
import { C as Coins } from './coins-HZ1N_e-W.js';
import { S as Sparkles } from './sparkles-DUEEirDg.js';

//#region src/lib/components/widgets/StreakStcWidget.svelte
function StreakStcWidget($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** compact = small nav chip; detailed = full card with progress bar */
		let { variant = "compact" } = $$props;
		let balance = 0;
		let hoursWatched = 0;
		let hoursToNextToken = 20;
		let hoursPerToken = 20;
		let dailyCapRemaining = 5;
		const pct = derived(() => Math.min(100, Math.round((hoursPerToken - hoursToNextToken) / hoursPerToken * 100)));
		if (variant === "compact") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-3 text-sm"><span class="flex items-center gap-1" title="Watching streak">`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></span> <span class="flex items-center gap-1" title="STC balance">`);
			Coins($$renderer, { class: "w-4 h-4 text-yellow-400" });
			$$renderer.push(`<!----> <span class="text-white font-semibold">${escape_html(balance)}</span></span></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="rounded-2xl border border-border bg-card/60 p-5 space-y-4"><div class="flex items-center justify-between"><div class="flex items-center gap-2">`);
			$$renderer.push("<!--[-1-->");
			Sparkles($$renderer, { class: "w-5 h-5 text-muted-foreground" });
			$$renderer.push(`<!----> <div class="text-sm text-muted-foreground">No streak yet — start watching!</div>`);
			$$renderer.push(`<!--]--></div> <div class="flex items-center gap-1.5 text-yellow-400">`);
			Coins($$renderer, { class: "w-5 h-5" });
			$$renderer.push(`<!----> <span class="text-lg font-bold text-white">${escape_html(balance)}</span> <span class="text-xs text-muted-foreground">STC</span></div></div> <div><div class="flex items-center justify-between text-xs text-muted-foreground mb-1.5"><span>${escape_html(`${hoursToNextToken.toFixed(1)}h to next STC token`)}</span> <span>${escape_html(hoursWatched.toFixed(1))}h watched</span></div> <div class="h-2.5 w-full rounded-full bg-white/10 overflow-hidden"><div class="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"${attr_style(`width: ${stringify(pct())}%`)}></div></div> <div class="mt-1.5 text-[11px] text-muted-foreground">1 STC per ${escape_html(hoursPerToken)}h watched · max ${escape_html(dailyCapRemaining)} more today</div></div></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}

export { StreakStcWidget as S };
//# sourceMappingURL=StreakStcWidget-DhXW7V8C.js.map
