import { h as head, b as push_element, d as pop_element, l as escape_html, g as attr, e as ensure_array_like, F as FILENAME } from './ui-libs-Yf6h8PPk.js';

_page[FILENAME] = "src/routes/(admin)/admin/governance/emergency/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let reason = "";
      let history = [];
      head("16r52sy", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Governance Emergency - Admin</title>`);
        });
      });
      $$renderer2.push(`<div class="container mx-auto px-4 py-8 space-y-6">`);
      push_element($$renderer2, "div", 57, 0);
      $$renderer2.push(`<h1 class="text-2xl font-bold text-white">`);
      push_element($$renderer2, "h1", 58, 1);
      $$renderer2.push(`Emergency Controls</h1>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">`);
      push_element($$renderer2, "div", 60, 1);
      $$renderer2.push(`<h2 class="text-lg text-white font-semibold">`);
      push_element($$renderer2, "h2", 61, 2);
      $$renderer2.push(`Trigger Emergency Pause</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-gray-400">`);
      push_element($$renderer2, "p", 62, 2);
      $$renderer2.push(`Use only for security incidents. Reason is mandatory and audited.</p>`);
      pop_element();
      $$renderer2.push(` <textarea class="w-full min-h-24 bg-black/40 border border-white/15 rounded px-3 py-2 text-white">`);
      push_element($$renderer2, "textarea", 63, 2);
      const $$body = escape_html(reason);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea>`);
      pop_element();
      $$renderer2.push(` <button class="px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50"${attr("disabled", false, true)}>`);
      push_element($$renderer2, "button", 64, 2);
      $$renderer2.push(`${escape_html("Trigger Pause")}</button>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-xl border border-white/10 bg-white/5 p-4">`);
      push_element($$renderer2, "div", 71, 1);
      $$renderer2.push(`<h2 class="text-lg text-white font-semibold mb-2">`);
      push_element($$renderer2, "h2", 72, 2);
      $$renderer2.push(`Active Incident</h2>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<p class="text-sm text-green-300">`);
        push_element($$renderer2, "p", 77, 3);
        $$renderer2.push(`No active emergency pause.</p>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-xl border border-white/10 bg-white/5 p-4">`);
      push_element($$renderer2, "div", 81, 1);
      $$renderer2.push(`<h2 class="text-lg text-white font-semibold mb-2">`);
      push_element($$renderer2, "h2", 82, 2);
      $$renderer2.push(`Pause History</h2>`);
      pop_element();
      $$renderer2.push(` `);
      if (history.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-gray-400">`);
        push_element($$renderer2, "p", 84, 3);
        $$renderer2.push(`No incidents logged.</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<ul class="space-y-2">`);
        push_element($$renderer2, "ul", 86, 3);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(history);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let evt = each_array[$$index];
          $$renderer2.push(`<li class="text-sm text-gray-300 border-t border-white/10 pt-2">`);
          push_element($$renderer2, "li", 88, 5);
          $$renderer2.push(`<p>`);
          push_element($$renderer2, "p", 89, 6);
          $$renderer2.push(`${escape_html(evt.reason)}</p>`);
          pop_element();
          $$renderer2.push(` <p class="text-xs text-gray-500">`);
          push_element($$renderer2, "p", 90, 6);
          $$renderer2.push(`By ${escape_html(evt.triggeredByName)} at ${escape_html(new Date(evt.triggeredAt).toLocaleString())}</p>`);
          pop_element();
          $$renderer2.push(`</li>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></ul>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-CPstqJxR.js.map
