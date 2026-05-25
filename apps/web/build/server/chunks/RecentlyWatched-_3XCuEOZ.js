import { b as push_element, d as pop_element, e as ensure_array_like, F as FILENAME } from './ui-libs-Yf6h8PPk.js';

RecentlyWatched[FILENAME] = "src/lib/components/sections/dashboard/RecentlyWatched.svelte";
function RecentlyWatched($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<section>`);
      push_element($$renderer2, "section", 38, 0);
      $$renderer2.push(`<h2 class="text-xl font-semibold mb-4">`);
      push_element($$renderer2, "h2", 39, 2);
      $$renderer2.push(`Continue Watching</h2>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex gap-4">`);
        push_element($$renderer2, "div", 42, 4);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like([1, 2, 3]);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          each_array[$$index];
          $$renderer2.push(`<div class="w-44 shrink-0 space-y-2">`);
          push_element($$renderer2, "div", 44, 8);
          $$renderer2.push(`<div class="aspect-video bg-white/5 rounded-lg animate-pulse">`);
          push_element($$renderer2, "div", 45, 10);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="h-3 bg-white/5 rounded w-3/4 animate-pulse">`);
          push_element($$renderer2, "div", 46, 10);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></section>`);
      pop_element();
    },
    RecentlyWatched
  );
}
RecentlyWatched.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { RecentlyWatched as R };
//# sourceMappingURL=RecentlyWatched-_3XCuEOZ.js.map
