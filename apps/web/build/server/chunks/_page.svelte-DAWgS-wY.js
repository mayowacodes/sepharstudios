import { at as head, aa as attr, an as escape_html, al as ensure_array_like } from './ui-libs-TtGtWAGI.js';
import './rolldown-runtime-pTpnEGsq.js';

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
		$$renderer.push(`<div class="container mx-auto px-4 py-8 max-w-3xl space-y-4"><h1 class="text-2xl font-bold text-white">Create Governance Proposal</h1> <div class="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4"><div><label for="proposal-title" class="text-xs text-gray-300">Title</label> <input id="proposal-title" class="mt-1 w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-white"${attr("value", title)}/></div> <div><label for="proposal-type" class="text-xs text-gray-300">Type</label> `);
		$$renderer.select({
			id: "proposal-type",
			class: "mt-1 w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-white",
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
		$$renderer.push(`</div> <div><label for="proposal-description" class="text-xs text-gray-300">Description</label> <textarea id="proposal-description" class="mt-1 w-full min-h-24 bg-black/40 border border-white/15 rounded px-3 py-2 text-white">`);
		const $$body = escape_html(description);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></div> <div><label for="proposal-payload" class="text-xs text-gray-300">Payload (JSON)</label> <textarea id="proposal-payload" class="mt-1 w-full min-h-32 bg-black/40 border border-white/15 rounded px-3 py-2 text-white font-mono text-xs">`);
		const $$body_1 = escape_html(payloadText);
		if ($$body_1) $$renderer.push(`${$$body_1}`);
		$$renderer.push(`</textarea></div> `);
		GuardrailValidator($$renderer, { warnings: evaluateGuardrails() });
		$$renderer.push(`<!----> <div class="flex items-center gap-3"><button class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"${attr("disabled", saving, true)}>${escape_html("Create Proposal")}</button> <a href="/admin/governance/proposals" class="text-sm text-gray-300 hover:text-white">Back to proposals</a></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DAWgS-wY.js.map
