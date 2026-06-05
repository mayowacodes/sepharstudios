import { aA as head, ah as attr, au as escape_html, as as ensure_array_like, aO as spread_props } from './ui-libs-BjzLDLAh.js';
import { I as Icon } from './Icon-CM89Lxh4.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region ../../node_modules/@lucide/svelte/dist/icons/file-plus-corner.svelte
function File_plus_corner($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "file-plus-corner" },
		props,
		{ iconNode: [
			["path", { "d": "M11.35 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5.35" }],
			["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
			["path", { "d": "M14 19h6" }],
			["path", { "d": "M17 16v6" }]
		] }
	]));
}
//#endregion
//#region src/lib/components/admin/governance/GuardrailValidator.svelte
function GuardrailValidator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { warnings } = $$props;
		if (warnings.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3"><p class="text-xs font-semibold text-amber-300 mb-1">Guardrail Warnings</p> <ul class="text-xs text-amber-200 space-y-1"><!--[-->`);
			const each_array = ensure_array_like(warnings);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let warning = each_array[$$index];
				$$renderer.push(`<li>- ${escape_html(warning)}</li>`);
			}
			$$renderer.push(`<!--]--></ul></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="rounded-lg border border-green-500/30 bg-green-500/10 p-3"><p class="text-xs text-green-200">No guardrail issues detected.</p></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/(admin)/admin/governance/create/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let title = "";
		let description = "";
		let type = "parameter_update";
		let payloadText = "{\n  \"changePercent\": 5\n}";
		let saving = false;
		function evaluateGuardrails() {
			const warnings = [];
			try {
				const parsed = JSON.parse(payloadText);
				const percent = Number(parsed.changePercent ?? 0);
				if (Number.isFinite(percent) && Math.abs(percent) > 10) warnings.push("Change exceeds 10%; governance supermajority is recommended.");
				if (Number.isFinite(percent) && Math.abs(percent) > 25) warnings.push("Change exceeds 25%; likely outside policy guardrails.");
			} catch {
				warnings.push("Payload JSON is invalid.");
			}
			return warnings;
		}
		head("r0oezv", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Create Governance Proposal - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 max-w-3xl space-y-4">`);
		PageHeader($$renderer, {
			icon: File_plus_corner,
			title: "Create Proposal",
			subtitle: "Draft a new governance proposal for the DAO."
		});
		$$renderer.push(`<!----> <div class="rounded-xl border border-border/40 surface-1 p-5 space-y-4"><div><label for="proposal-title" class="text-xs text-foreground/80">Title</label> <input id="proposal-title" class="mt-1 w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-foreground"${attr("value", title)}/></div> <div><label for="proposal-type" class="text-xs text-foreground/80">Type</label> `);
		$$renderer.select({
			id: "proposal-type",
			class: "mt-1 w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-foreground",
			value: type
		}, ($$renderer) => {
			$$renderer.option({ value: "parameter_update" }, ($$renderer) => {
				$$renderer.push(`parameter_update`);
			});
			$$renderer.option({ value: "treasury_action" }, ($$renderer) => {
				$$renderer.push(`treasury_action`);
			});
			$$renderer.option({ value: "policy_change" }, ($$renderer) => {
				$$renderer.push(`policy_change`);
			});
			$$renderer.option({ value: "emergency_action" }, ($$renderer) => {
				$$renderer.push(`emergency_action`);
			});
		});
		$$renderer.push(`</div> <div><label for="proposal-description" class="text-xs text-foreground/80">Description</label> <textarea id="proposal-description" class="mt-1 w-full min-h-24 bg-black/40 border border-white/15 rounded px-3 py-2 text-foreground">`);
		const $$body = escape_html(description);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></div> <div><label for="proposal-payload" class="text-xs text-foreground/80">Payload (JSON)</label> <textarea id="proposal-payload" class="mt-1 w-full min-h-32 bg-black/40 border border-white/15 rounded px-3 py-2 text-foreground font-mono text-xs">`);
		const $$body_1 = escape_html(payloadText);
		if ($$body_1) $$renderer.push(`${$$body_1}`);
		$$renderer.push(`</textarea></div> `);
		GuardrailValidator($$renderer, { warnings: evaluateGuardrails() });
		$$renderer.push(`<!----> <div class="flex items-center gap-3"><button class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"${attr("disabled", saving, true)}>${escape_html("Create Proposal")}</button> <a href="/admin/governance/proposals" class="text-sm text-foreground/80 hover:text-foreground">Back to proposals</a></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-3tC1RBe1.js.map
