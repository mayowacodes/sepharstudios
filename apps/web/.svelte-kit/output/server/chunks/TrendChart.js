import { Ct as attr_style, Et as derived, Ht as attr, Ot as ensure_array_like, Pt as stringify, Wt as escape_html } from "./ui-libs.js";
//#region src/lib/components/dashboard/TrendChart.svelte
function TrendChart($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Lightweight area chart for dashboard analytics. Inline SVG, no chart-lib
		* dependency — same approach as Sparkline, scaled up with axis labels +
		* hover tooltip. For richer charts (multi-series, axes legends, brushing),
		* use layerchart directly via the `chart-*` primitives.
		*/
		let { data, label, accent = "portal", height = 220, formatValue = (v) => v.toLocaleString() } = $$props;
		const ACCENT = {
			portal: "hsl(var(--portal-accent, 175 60% 48%))",
			purple: "rgb(168 85 247)",
			blue: "rgb(59 130 246)",
			green: "rgb(34 197 94)",
			yellow: "rgb(234 179 8)",
			red: "rgb(239 68 68)",
			orange: "rgb(249 115 22)",
			gray: "rgb(156 163 175)"
		};
		const color = derived(() => ACCENT[accent]);
		const W = 600;
		const H = 200;
		const PAD = {
			top: 12,
			right: 12,
			bottom: 28,
			left: 40
		};
		const parsed = derived(() => data.map((p) => ({
			date: p.date instanceof Date ? p.date : new Date(p.date),
			value: Number(p.value) || 0
		})));
		const scales = derived(() => {
			if (parsed().length === 0) return null;
			const values = parsed().map((p) => p.value);
			return {
				min: Math.min(0, ...values),
				max: Math.max(...values, 1),
				xStep: (W - PAD.left - PAD.right) / Math.max(1, parsed().length - 1)
			};
		});
		const linePath = derived(() => {
			if (!scales()) return {
				line: "",
				area: ""
			};
			const { min, max, xStep } = scales();
			const range = max - min || 1;
			const pts = parsed().map((p, i) => {
				return [PAD.left + i * xStep, PAD.top + (1 - (p.value - min) / range) * (H - PAD.top - PAD.bottom)];
			});
			const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
			return {
				line,
				area: `${line} L${pts[pts.length - 1][0]} ${H - PAD.bottom} L${pts[0][0]} ${H - PAD.bottom} Z`
			};
		});
		function tickValues() {
			if (!scales()) return [];
			return [
				scales().min,
				(scales().min + scales().max) / 2,
				scales().max
			];
		}
		function fmtDate(d) {
			return d.toLocaleDateString(void 0, {
				month: "short",
				day: "numeric"
			});
		}
		$$renderer.push(`<div class="rounded-xl p-5 border" style="background: hsl(var(--portal-bg-elevated, 222 22% 11%)/0.55); border-color: hsl(var(--portal-border, 215 14% 27%)); backdrop-filter: blur(8px);"><div class="flex items-center justify-between mb-3"><h3 class="text-sm font-medium" style="color: hsl(var(--portal-text, 210 30% 92%));">${escape_html(label)}</h3> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (parsed().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-sm py-10 text-center"${attr_style(`height: ${stringify(height)}px; color: hsl(var(--portal-text-muted, 210 15% 60%));`)}>No data yet.</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<svg${attr("viewBox", `0 0 ${W} ${H}`)} width="100%"${attr("height", height)} preserveAspectRatio="none" role="img"${attr("aria-label", label)}><defs><linearGradient${attr("id", `trend-grad-${accent}`)} x1="0" y1="0" x2="0" y2="1"><stop offset="0%"${attr("stop-color", color())} stop-opacity="0.4"></stop><stop offset="100%"${attr("stop-color", color())} stop-opacity="0"></stop></linearGradient></defs><!--[-->`);
			const each_array = ensure_array_like(tickValues());
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				each_array[i];
				const y = PAD.top + i / (tickValues().length - 1) * (H - PAD.top - PAD.bottom);
				$$renderer.push(`<line${attr("x1", PAD.left)}${attr("x2", W - PAD.right)}${attr("y1", y)}${attr("y2", y)} stroke="rgba(255,255,255,0.07)" stroke-width="1"></line><text${attr("x", PAD.left - 6)}${attr("y", y + 3)} text-anchor="end" fill="hsl(var(--portal-text-muted, 210 15% 60%))" font-size="10">${escape_html(formatValue(tickValues()[tickValues().length - 1 - i]))}</text>`);
			}
			$$renderer.push(`<!--]-->`);
			if (linePath().area) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<path${attr("d", linePath().area)}${attr("fill", `url(#trend-grad-${accent})`)}></path>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
			if (linePath().line) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<path${attr("d", linePath().line)} fill="none"${attr("stroke", color())} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
			if (parsed().length > 0) {
				$$renderer.push("<!--[0-->");
				const ticks = [
					0,
					Math.floor(parsed().length / 2),
					parsed().length - 1
				];
				$$renderer.push(`<!--[-->`);
				const each_array_1 = ensure_array_like(ticks);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let ti = each_array_1[$$index_1];
					const x = PAD.left + ti * (scales()?.xStep ?? 0);
					$$renderer.push(`<text${attr("x", x)}${attr("y", H - PAD.bottom + 16)} text-anchor="middle" fill="hsl(var(--portal-text-muted, 210 15% 60%))" font-size="10">${escape_html(fmtDate(parsed()[ti].date))}</text>`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></svg>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { TrendChart as t };
