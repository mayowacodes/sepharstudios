import { a as push_element, b as pop_element, i as ensure_array_like, e as escape_html, n as attr, F as FILENAME, m as attr_style, o as head } from "../../../../../../chunks/ui-libs.js";
TimelockQueueTable[FILENAME] = "src/lib/components/admin/governance/TimelockQueueTable.svelte";
function TimelockQueueTable($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { items, onExecute } = $$props;
      function isReady(eta) {
        return !!eta && Date.now() >= Date.parse(eta);
      }
      $$renderer2.push(`<div class="overflow-x-auto rounded-xl border border-white/10">`);
      push_element($$renderer2, "div", 22, 0);
      $$renderer2.push(`<table class="w-full text-sm">`);
      push_element($$renderer2, "table", 23, 1);
      $$renderer2.push(`<thead class="bg-white/5 text-gray-300">`);
      push_element($$renderer2, "thead", 24, 2);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 25, 3);
      $$renderer2.push(`<th class="text-left px-4 py-3">`);
      push_element($$renderer2, "th", 26, 4);
      $$renderer2.push(`Proposal</th>`);
      pop_element();
      $$renderer2.push(`<th class="text-left px-4 py-3">`);
      push_element($$renderer2, "th", 27, 4);
      $$renderer2.push(`Type</th>`);
      pop_element();
      $$renderer2.push(`<th class="text-left px-4 py-3">`);
      push_element($$renderer2, "th", 28, 4);
      $$renderer2.push(`ETA</th>`);
      pop_element();
      $$renderer2.push(`<th class="text-left px-4 py-3">`);
      push_element($$renderer2, "th", 29, 4);
      $$renderer2.push(`Status</th>`);
      pop_element();
      $$renderer2.push(`<th class="text-left px-4 py-3">`);
      push_element($$renderer2, "th", 30, 4);
      $$renderer2.push(`Action</th>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`</thead>`);
      pop_element();
      $$renderer2.push(`<tbody>`);
      push_element($$renderer2, "tbody", 33, 2);
      if (items.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 35, 4);
        $$renderer2.push(`<td colspan="5" class="px-4 py-6 text-center text-gray-400">`);
        push_element($$renderer2, "td", 36, 5);
        $$renderer2.push(`No queued actions.</td>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(items);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let item = each_array[$$index];
          $$renderer2.push(`<tr class="border-t border-white/10">`);
          push_element($$renderer2, "tr", 40, 5);
          $$renderer2.push(`<td class="px-4 py-3 text-white">`);
          push_element($$renderer2, "td", 41, 6);
          $$renderer2.push(`${escape_html(item.title)}</td>`);
          pop_element();
          $$renderer2.push(`<td class="px-4 py-3 text-gray-300">`);
          push_element($$renderer2, "td", 42, 6);
          $$renderer2.push(`${escape_html(item.type)}</td>`);
          pop_element();
          $$renderer2.push(`<td class="px-4 py-3 text-gray-300">`);
          push_element($$renderer2, "td", 43, 6);
          $$renderer2.push(`${escape_html(item.eta ? new Date(item.eta).toLocaleString() : "-")}</td>`);
          pop_element();
          $$renderer2.push(`<td class="px-4 py-3">`);
          push_element($$renderer2, "td", 44, 6);
          $$renderer2.push(`<span class="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">`);
          push_element($$renderer2, "span", 45, 7);
          $$renderer2.push(`${escape_html(item.status)}</span>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td class="px-4 py-3">`);
          push_element($$renderer2, "td", 47, 6);
          $$renderer2.push(`<button class="px-3 py-1 rounded text-xs bg-green-600 hover:bg-green-700 disabled:opacity-40"${attr("disabled", !isReady(item.eta), true)}>`);
          push_element($$renderer2, "button", 48, 7);
          $$renderer2.push(`Execute</button>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`</tr>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></tbody>`);
      pop_element();
      $$renderer2.push(`</table>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    TimelockQueueTable
  );
}
TimelockQueueTable.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
MultisigApprovalsPanel[FILENAME] = "src/lib/components/admin/governance/MultisigApprovalsPanel.svelte";
function MultisigApprovalsPanel($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { approvals, required } = $$props;
      const pct = required > 0 ? Math.min(100, Math.round(approvals / required * 100)) : 0;
      $$renderer2.push(`<div class="rounded-lg border border-white/10 bg-black/30 p-3">`);
      push_element($$renderer2, "div", 11, 0);
      $$renderer2.push(`<div class="flex items-center justify-between text-xs text-gray-300">`);
      push_element($$renderer2, "div", 12, 1);
      $$renderer2.push(`<span>`);
      push_element($$renderer2, "span", 13, 2);
      $$renderer2.push(`Multisig approvals</span>`);
      pop_element();
      $$renderer2.push(` <span>`);
      push_element($$renderer2, "span", 14, 2);
      $$renderer2.push(`${escape_html(approvals)}/${escape_html(required)}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-2 h-2 rounded bg-white/10 overflow-hidden">`);
      push_element($$renderer2, "div", 16, 1);
      $$renderer2.push(`<div class="h-full bg-cyan-500"${attr_style(`width:${pct}%`)}>`);
      push_element($$renderer2, "div", 17, 2);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    MultisigApprovalsPanel
  );
}
MultisigApprovalsPanel.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(admin)/admin/governance/execution/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let loading = true;
      let submitted = [];
      let queue = [];
      let message = "";
      async function load() {
        loading = true;
        try {
          const [proposalsRes, queueRes] = await Promise.all([
            fetch("/api/admin/governance/proposals"),
            fetch("/api/admin/governance/timelock-queue")
          ]);
          if (proposalsRes.ok) {
            const all = await proposalsRes.json();
            submitted = all.filter((p) => p.status === "submitted");
          }
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
      head("1s2fzhj", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Governance Execution - Admin</title>`);
        });
      });
      $$renderer2.push(`<div class="container mx-auto px-4 py-8 space-y-6">`);
      push_element($$renderer2, "div", 79, 0);
      $$renderer2.push(`<h1 class="text-2xl font-bold text-white">`);
      push_element($$renderer2, "h1", 80, 1);
      $$renderer2.push(`Timelock Queue &amp; Execution</h1>`);
      pop_element();
      $$renderer2.push(` `);
      if (message) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-cyan-300">`);
        push_element($$renderer2, "p", 83, 2);
        $$renderer2.push(`${escape_html(message)}</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="rounded-xl border border-white/10 bg-white/5 p-4">`);
      push_element($$renderer2, "div", 86, 1);
      $$renderer2.push(`<h2 class="text-lg font-semibold text-white mb-3">`);
      push_element($$renderer2, "h2", 87, 2);
      $$renderer2.push(`Submitted Proposals</h2>`);
      pop_element();
      $$renderer2.push(` `);
      if (loading) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-gray-400">`);
        push_element($$renderer2, "p", 89, 3);
        $$renderer2.push(`Loading...</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        if (submitted.length === 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="text-sm text-gray-400">`);
          push_element($$renderer2, "p", 91, 3);
          $$renderer2.push(`No submitted proposals awaiting queue.</p>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="space-y-2">`);
          push_element($$renderer2, "div", 93, 3);
          $$renderer2.push(`<!--[-->`);
          const each_array = ensure_array_like(submitted);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let p = each_array[$$index];
            $$renderer2.push(`<div class="rounded-lg bg-black/30 border border-white/10 px-3 py-2">`);
            push_element($$renderer2, "div", 95, 5);
            $$renderer2.push(`<div class="flex items-center justify-between gap-3">`);
            push_element($$renderer2, "div", 96, 6);
            $$renderer2.push(`<div class="space-y-1">`);
            push_element($$renderer2, "div", 97, 7);
            $$renderer2.push(`<p class="text-white text-sm">`);
            push_element($$renderer2, "p", 98, 7);
            $$renderer2.push(`${escape_html(p.title)}</p>`);
            pop_element();
            $$renderer2.push(` <p class="text-xs text-gray-400">`);
            push_element($$renderer2, "p", 99, 7);
            $$renderer2.push(`${escape_html(p.type)}</p>`);
            pop_element();
            $$renderer2.push(` `);
            if ((p.guardrailWarnings?.length ?? 0) > 0) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<p class="text-xs text-amber-300">`);
              push_element($$renderer2, "p", 101, 8);
              $$renderer2.push(`Has guardrail warnings</p>`);
              pop_element();
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--></div>`);
            pop_element();
            $$renderer2.push(` <div class="flex items-center gap-2">`);
            push_element($$renderer2, "div", 104, 7);
            $$renderer2.push(`<button class="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-xs">`);
            push_element($$renderer2, "button", 105, 8);
            $$renderer2.push(`Approve</button>`);
            pop_element();
            $$renderer2.push(` <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-xs disabled:opacity-40"${attr("disabled", (p.approvals?.length ?? 0) < (p.requiredApprovals ?? 4), true)}>`);
            push_element($$renderer2, "button", 106, 8);
            $$renderer2.push(`Queue</button>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(` <div class="mt-3">`);
            push_element($$renderer2, "div", 115, 6);
            MultisigApprovalsPanel($$renderer2, {
              approvals: p.approvals?.length ?? 0,
              required: p.requiredApprovals ?? 4
            });
            $$renderer2.push(`<!----></div>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 127, 1);
      $$renderer2.push(`<h2 class="text-lg font-semibold text-white mb-3">`);
      push_element($$renderer2, "h2", 128, 2);
      $$renderer2.push(`Queued Actions</h2>`);
      pop_element();
      $$renderer2.push(` `);
      TimelockQueueTable($$renderer2, { items: queue, onExecute: execute });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
