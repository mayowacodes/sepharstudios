import { h as head, b as push_element, d as pop_element, e as ensure_array_like, F as FILENAME } from './ui-libs-Yf6h8PPk.js';

_page[FILENAME] = "src/routes/(admin)/admin/governance/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      head("1vxzpf4", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Governance - Admin</title>`);
        });
      });
      $$renderer2.push(`<div class="container mx-auto px-4 py-8 space-y-6">`);
      push_element($$renderer2, "div", 37, 0);
      $$renderer2.push(`<div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 38, 1);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white">`);
      push_element($$renderer2, "h1", 39, 2);
      $$renderer2.push(`Governance Control Center</h1>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/governance/create" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">`);
      push_element($$renderer2, "a", 40, 2);
      $$renderer2.push(`New Proposal</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="grid md:grid-cols-4 gap-4">`);
        push_element($$renderer2, "div", 44, 2);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like([1, 2, 3, 4]);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          each_array[$$index];
          $$renderer2.push(`<div class="h-24 rounded-xl bg-white/5 animate-pulse">`);
          push_element($$renderer2, "div", 46, 4);
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> <div class="grid md:grid-cols-3 gap-4">`);
      push_element($$renderer2, "div", 79, 1);
      $$renderer2.push(`<a href="/admin/governance/proposals" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">`);
      push_element($$renderer2, "a", 80, 2);
      $$renderer2.push(`<h3 class="text-white font-semibold">`);
      push_element($$renderer2, "h3", 81, 3);
      $$renderer2.push(`Proposals</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-gray-400 mt-1">`);
      push_element($$renderer2, "p", 82, 3);
      $$renderer2.push(`View and review governance proposals</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/governance/execution" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">`);
      push_element($$renderer2, "a", 84, 2);
      $$renderer2.push(`<h3 class="text-white font-semibold">`);
      push_element($$renderer2, "h3", 85, 3);
      $$renderer2.push(`Execution</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-gray-400 mt-1">`);
      push_element($$renderer2, "p", 86, 3);
      $$renderer2.push(`Queue and execute timelock actions</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/governance/treasury" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">`);
      push_element($$renderer2, "a", 88, 2);
      $$renderer2.push(`<h3 class="text-white font-semibold">`);
      push_element($$renderer2, "h3", 89, 3);
      $$renderer2.push(`Treasury</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-gray-400 mt-1">`);
      push_element($$renderer2, "p", 90, 3);
      $$renderer2.push(`Monitor pools, inflows and runway</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/governance/emergency" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">`);
      push_element($$renderer2, "a", 92, 2);
      $$renderer2.push(`<h3 class="text-white font-semibold">`);
      push_element($$renderer2, "h3", 93, 3);
      $$renderer2.push(`Emergency</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-gray-400 mt-1">`);
      push_element($$renderer2, "p", 94, 3);
      $$renderer2.push(`Pause controls and incident logs</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/governance/roles" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">`);
      push_element($$renderer2, "a", 96, 2);
      $$renderer2.push(`<h3 class="text-white font-semibold">`);
      push_element($$renderer2, "h3", 97, 3);
      $$renderer2.push(`Roles</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-gray-400 mt-1">`);
      push_element($$renderer2, "p", 98, 3);
      $$renderer2.push(`Permissions matrix and admin roster</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/governance/reports" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">`);
      push_element($$renderer2, "a", 100, 2);
      $$renderer2.push(`<h3 class="text-white font-semibold">`);
      push_element($$renderer2, "h3", 101, 3);
      $$renderer2.push(`Reports</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-gray-400 mt-1">`);
      push_element($$renderer2, "p", 102, 3);
      $$renderer2.push(`Generate governance transparency reports</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
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
//# sourceMappingURL=_page.svelte-C0pzMhd5.js.map
