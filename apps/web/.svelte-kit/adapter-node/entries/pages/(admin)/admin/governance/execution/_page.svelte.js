import { _t as head, dt as attr_style, gt as ensure_array_like, jt as escape_html, kt as attr, mt as derived } from "../../../../../../chunks/ui-libs.js";
//#region src/lib/components/admin/governance/TimelockQueueTable.svelte
function TimelockQueueTable($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { items, onExecute } = $$props;
		function isReady(eta) {
			return !!eta && Date.now() >= Date.parse(eta);
		}
		$$renderer.push(`<div class="overflow-x-auto rounded-xl border border-white/10"><table class="w-full text-sm"><thead class="bg-white/5 text-gray-300"><tr><th class="text-left px-4 py-3">Proposal</th><th class="text-left px-4 py-3">Type</th><th class="text-left px-4 py-3">ETA</th><th class="text-left px-4 py-3">Status</th><th class="text-left px-4 py-3">Action</th></tr></thead><tbody>`);
		if (items.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<tr><td colspan="5" class="px-4 py-6 text-center text-gray-400">No queued actions.</td></tr>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(items);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				$$renderer.push(`<tr class="border-t border-white/10"><td class="px-4 py-3 text-white">${escape_html(item.title)}</td><td class="px-4 py-3 text-gray-300">${escape_html(item.type)}</td><td class="px-4 py-3 text-gray-300">${escape_html(item.eta ? new Date(item.eta).toLocaleString() : "-")}</td><td class="px-4 py-3"><span class="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">${escape_html(item.status)}</span></td><td class="px-4 py-3"><button class="px-3 py-1 rounded text-xs bg-green-600 hover:bg-green-700 disabled:opacity-40"${attr("disabled", !isReady(item.eta), true)}>Execute</button></td></tr>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></tbody></table></div>`);
	});
}
//#endregion
//#region src/lib/components/admin/governance/MultisigApprovalsPanel.svelte
function MultisigApprovalsPanel($$renderer, $$props) {
	let { approvals, required } = $$props;
	const pct = derived(() => required > 0 ? Math.min(100, Math.round(approvals / required * 100)) : 0);
	$$renderer.push(`<div class="rounded-lg border border-white/10 bg-black/30 p-3"><div class="flex items-center justify-between text-xs text-gray-300"><span>Multisig approvals</span> <span>${escape_html(approvals)}/${escape_html(required)}</span></div> <div class="mt-2 h-2 rounded bg-white/10 overflow-hidden"><div class="h-full bg-cyan-500"${attr_style(`width:${pct()}%`)}></div></div></div>`);
}
//#endregion
//#region src/routes/(admin)/admin/governance/execution/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let loading = true;
		let submitted = [];
		let queue = [];
		let message = "";
		async function load() {
			loading = true;
			try {
				const [proposalsRes, queueRes] = await Promise.all([fetch("/api/admin/governance/proposals"), fetch("/api/admin/governance/timelock-queue")]);
				if (proposalsRes.ok) submitted = (await proposalsRes.json()).filter((p) => p.status === "submitted");
				if (queueRes.ok) queue = await queueRes.json();
			} finally {
				loading = false;
			}
		}
		async function execute(id) {
			const res = await fetch("/api/admin/governance/execute", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ proposalId: id })
			});
			const data = await res.json().catch(() => ({}));
			message = res.ok ? `Executed: ${data.title}` : data.error ?? "Execute failed";
			await load();
		}
		head("1s2fzhj", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Execution - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 space-y-6"><h1 class="text-2xl font-bold text-white">Timelock Queue &amp; Execution</h1> `);
		if (message) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-cyan-300">${escape_html(message)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="rounded-xl border border-white/10 bg-white/5 p-4"><h2 class="text-lg font-semibold text-white mb-3">Submitted Proposals</h2> `);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-gray-400">Loading...</p>`);
		} else if (submitted.length === 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<p class="text-sm text-gray-400">No submitted proposals awaiting queue.</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array = ensure_array_like(submitted);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let p = each_array[$$index];
				$$renderer.push(`<div class="rounded-lg bg-black/30 border border-white/10 px-3 py-2"><div class="flex items-center justify-between gap-3"><div class="space-y-1"><p class="text-white text-sm">${escape_html(p.title)}</p> <p class="text-xs text-gray-400">${escape_html(p.type)}</p> `);
				if ((p.guardrailWarnings?.length ?? 0) > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-xs text-amber-300">Has guardrail warnings</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="flex items-center gap-2"><button class="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-xs">Approve</button> <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-xs disabled:opacity-40"${attr("disabled", (p.approvals?.length ?? 0) < (p.requiredApprovals ?? 4), true)}>Queue</button></div></div> <div class="mt-3">`);
				MultisigApprovalsPanel($$renderer, {
					approvals: p.approvals?.length ?? 0,
					required: p.requiredApprovals ?? 4
				});
				$$renderer.push(`<!----></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> <div><h2 class="text-lg font-semibold text-white mb-3">Queued Actions</h2> `);
		TimelockQueueTable($$renderer, {
			items: queue,
			onExecute: execute
		});
		$$renderer.push(`<!----></div></div>`);
	});
}
//#endregion
export { _page as default };
