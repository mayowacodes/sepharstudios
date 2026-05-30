import { jt as escape_html, mt as derived, ut as attr_class } from "./ui-libs.js";
//#region src/lib/components/admin/governance/GovernanceStatusCard.svelte
function GovernanceStatusCard($$renderer, $$props) {
	let { title, value, subtitle = "", tone = "default" } = $$props;
	const toneClass = derived(() => tone === "good" ? "text-green-400" : tone === "warn" ? "text-amber-400" : tone === "danger" ? "text-red-400" : "text-white");
	$$renderer.push(`<div class="bg-white/5 border border-white/10 rounded-xl p-4"><p class="text-xs uppercase tracking-wide text-gray-400">${escape_html(title)}</p> <p${attr_class(`text-2xl font-bold mt-1 ${toneClass()}`)}>${escape_html(value)}</p> `);
	if (subtitle) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-xs text-gray-400 mt-2">${escape_html(subtitle)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
export { GovernanceStatusCard as t };
