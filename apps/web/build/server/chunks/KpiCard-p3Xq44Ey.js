import { ah as attr, aO as spread_props, ai as attr_class, aR as stringify, au as escape_html, aj as attr_style, ap as derived, an as clsx$1 } from './ui-libs-BjzLDLAh.js';
import { I as Icon } from './Icon-CM89Lxh4.js';
import { S as Skeleton } from './skeleton-DCiPgxrC.js';

//#region ../../node_modules/@lucide/svelte/dist/icons/arrow-down-right.svelte
function Arrow_down_right($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "arrow-down-right" },
		props,
		{ iconNode: [["path", { "d": "m7 7 10 10" }], ["path", { "d": "M17 7v10H7" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/arrow-up-right.svelte
function Arrow_up_right($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "arrow-up-right" },
		props,
		{ iconNode: [["path", { "d": "M7 7h10v10" }], ["path", { "d": "M7 17 17 7" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/minus.svelte
function Minus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "minus" },
		props,
		{ iconNode: [["path", { "d": "M5 12h14" }]] }
	]));
}
//#endregion
//#region src/lib/components/dashboard/Sparkline.svelte
function Sparkline($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Tiny inline SVG sparkline — meant for KpiCard, not for full charts.
		* Auto-scales min/max from the data points; renders a smooth polyline with
		* an optional area gradient underneath.
		*
		* Lighter than pulling in layerchart for a 30-point line: zero deps,
		* inlines into the parent card with no layout shift.
		*/
		let { data, stroke, fillGradient = true, height = 32, width = 120, class: klass = "" } = $$props;
		const id = derived(() => `spark-grad-${Math.abs(data.length * 37 + (data[0] ?? 0))}`);
		const path = derived(() => {
			if (!data || data.length === 0) return {
				line: "",
				area: ""
			};
			if (data.length === 1) {
				const y = height / 2;
				return {
					line: `M0 ${y} L${width} ${y}`,
					area: ""
				};
			}
			const min = Math.min(...data);
			const range = Math.max(...data) - min || 1;
			const step = width / (data.length - 1);
			const line = data.map((v, i) => {
				return [i * step, height - (v - min) / range * (height - 2) - 1];
			}).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
			return {
				line,
				area: `${line} L${width} ${height} L0 ${height} Z`
			};
		});
		$$renderer.push(`<svg${attr("viewBox", `0 0 ${width} ${height}`)} width="100%"${attr("height", height)} preserveAspectRatio="none"${attr_class(clsx$1(klass))} aria-hidden="true">`);
		if (fillGradient) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<defs><linearGradient${attr("id", id())} x1="0" y1="0" x2="0" y2="1"><stop offset="0%"${attr("stop-color", stroke ?? "currentColor")} stop-opacity="0.35"></stop><stop offset="100%"${attr("stop-color", stroke ?? "currentColor")} stop-opacity="0"></stop></linearGradient></defs>`);
			if (path().area) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<path${attr("d", path().area)}${attr("fill", `url(#${id()})`)}></path>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		if (path().line) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path${attr("d", path().line)} fill="none"${attr("stroke", stroke ?? "currentColor")} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region src/lib/components/dashboard/KpiCard.svelte
function KpiCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** Used to stagger entrance — caller passes the index in its grid. */
		let { label, value, icon: Icon, href, delta = null, deltaLabel, sparkline, accent = "purple", variant = "default", loading = false, index = 0 } = $$props;
		const ACCENT = {
			purple: {
				bar: "bg-purple-500",
				text: "text-purple-300",
				spark: "rgb(168 85 247)"
			},
			blue: {
				bar: "bg-blue-500",
				text: "text-blue-300",
				spark: "rgb(59 130 246)"
			},
			green: {
				bar: "bg-green-500",
				text: "text-green-300",
				spark: "rgb(34 197 94)"
			},
			yellow: {
				bar: "bg-yellow-500",
				text: "text-yellow-300",
				spark: "rgb(234 179 8)"
			},
			red: {
				bar: "bg-red-500",
				text: "text-red-300",
				spark: "rgb(239 68 68)"
			},
			orange: {
				bar: "bg-orange-500",
				text: "text-orange-300",
				spark: "rgb(249 115 22)"
			},
			gray: {
				bar: "bg-gray-500",
				text: "text-gray-300",
				spark: "rgb(156 163 175)"
			}
		};
		const a = derived(() => ACCENT[accent]);
		const compact = derived(() => variant === "compact");
		function deltaClass(d) {
			if (d === null || d === void 0) return "text-gray-400";
			if (d > 0) return "text-green-400";
			if (d < 0) return "text-red-400";
			return "text-gray-400";
		}
		function body($$renderer) {
			$$renderer.push(`<div${attr_class(`surface-2 relative overflow-hidden rounded-xl ${compact() ? "p-4" : "p-5"} transition-colors hover:bg-foreground/5`)}><span${attr_class(`absolute inset-y-0 left-0 w-1 ${stringify(a().bar)}`)}></span> <div class="flex items-start justify-between gap-2"><div class="text-xs uppercase tracking-wide text-muted-foreground">${escape_html(label)}</div> `);
			if (Icon) {
				$$renderer.push("<!--[0-->");
				if (Icon) {
					$$renderer.push("<!--[-->");
					Icon($$renderer, { class: `w-4 h-4 ${stringify(a().text)}` });
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="mt-2 flex items-baseline gap-2">`);
			if (loading) {
				$$renderer.push("<!--[0-->");
				Skeleton($$renderer, { class: compact() ? "h-6 w-20" : "h-8 w-28" });
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div${attr_class(`${compact() ? "text-xl" : "text-2xl"} font-semibold text-foreground tabular-nums`)}>${escape_html(value)}</div>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (!loading && (delta !== null && delta !== void 0 || sparkline)) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mt-3 flex items-end justify-between gap-3"><div${attr_class(`flex items-center gap-1 text-xs ${stringify(deltaClass(delta))}`)}>`);
				if (delta === null || delta === void 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-muted-foreground">—</span>`);
				} else if (delta > 0) {
					$$renderer.push("<!--[1-->");
					Arrow_up_right($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----> <span class="font-medium">+${escape_html(delta.toFixed(1))}%</span>`);
				} else if (delta < 0) {
					$$renderer.push("<!--[2-->");
					Arrow_down_right($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----> <span class="font-medium">${escape_html(delta.toFixed(1))}%</span>`);
				} else {
					$$renderer.push("<!--[-1-->");
					Minus($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----> <span class="font-medium">0%</span>`);
				}
				$$renderer.push(`<!--]--> `);
				if (deltaLabel) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-muted-foreground ml-1">${escape_html(deltaLabel)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> `);
				if (sparkline && sparkline.length > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="w-24 h-8"${attr_style(`color: ${stringify(a().spark)}`)}>`);
					Sparkline($$renderer, { data: sparkline });
					$$renderer.push(`<!----></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		if (href) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a${attr("href", href)} class="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl">`);
			body($$renderer);
			$$renderer.push(`<!----></a>`);
		} else {
			$$renderer.push("<!--[-1-->");
			body($$renderer);
		}
		$$renderer.push(`<!--]-->`);
	});
}

export { Arrow_up_right as A, KpiCard as K };
//# sourceMappingURL=KpiCard-p3Xq44Ey.js.map
