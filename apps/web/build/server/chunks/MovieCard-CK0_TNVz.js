import { C as fallback, b as push_element, g as attr, d as pop_element, l as escape_html, B as bind_props, x as writable, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import './client2-D3ciM3yf.js';
import { P as Play, B as Bookmark } from './play-Ba0LGIvv.js';

const { subscribe, update, set } = writable({
  isOpen: false,
  media: null
});
const mediaModalStore = {
  subscribe,
  open: (media) => update(() => ({
    isOpen: true,
    media
  })),
  close: () => set({
    isOpen: false,
    media: null
  })
};
MovieCard[FILENAME] = "src/lib/components/MovieCard.svelte";
function MovieCard($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let movie = $$props["movie"];
      let onClick = fallback($$props["onClick"], () => {
      });
      let onHover = fallback($$props["onHover"], () => {
      });
      $$renderer2.push(`<div role="button" tabindex="0" class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none hover:scale-[1.02]">`);
      push_element($$renderer2, "div", 48, 0);
      $$renderer2.push(`<div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card">`);
      push_element($$renderer2, "div", 60, 2);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<img${attr("src", movie.thumbnail || "/placeholder-vertical.jpg")}${attr("alt", movie.title)} class="w-full h-full object-cover" loading="lazy"/>`);
        push_element($$renderer2, "img", 71, 6);
        pop_element();
      }
      $$renderer2.push(`<!--]--> <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">`);
      push_element($$renderer2, "div", 78, 4);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (movie.isNew) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute top-2 left-2 bg-[#FFBF00] text-black text-xs px-2 py-0.5 rounded-full z-30">`);
        push_element($$renderer2, "div", 82, 4);
        $$renderer2.push(`New Episode</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">`);
      push_element($$renderer2, "div", 87, 2);
      $$renderer2.push(`<h3 class="text-sm font-semibold line-clamp-2 text-white">`);
      push_element($$renderer2, "h3", 88, 4);
      $$renderer2.push(`${escape_html(movie.title)}</h3>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs mt-1 flex flex-wrap gap-2 text-white/70">`);
      push_element($$renderer2, "div", 90, 4);
      if (movie.rating) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">`);
        push_element($$renderer2, "span", 91, 24);
        $$renderer2.push(`${escape_html(movie.rating)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (movie.duration) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 92, 26);
        $$renderer2.push(`${escape_html(movie.duration)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (movie.quality) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 93, 25);
        $$renderer2.push(`${escape_html(movie.quality)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-3 flex items-center gap-2">`);
      push_element($$renderer2, "div", 96, 4);
      $$renderer2.push(`<button class="inline-flex items-center gap-1 rounded-full bg-[#FF5E0E] px-3 py-1 text-xs font-semibold text-white shadow-[0_0_16px_rgba(255,94,14,0.4)] hover:bg-[#FF5E0E]/90 transition"${attr("aria-label", `Play ${movie.title}`)}>`);
      push_element($$renderer2, "button", 97, 6);
      Play($$renderer2, { class: "h-3.5 w-3.5" });
      $$renderer2.push(`<!----> Play</button>`);
      pop_element();
      $$renderer2.push(` <button class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition"${attr("aria-label", `Add ${movie.title} to My List`)}>`);
      push_element($$renderer2, "button", 105, 6);
      Bookmark($$renderer2, { class: "h-3.5 w-3.5" });
      $$renderer2.push(`<!----> My List</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { movie, onClick, onHover });
    },
    MovieCard
  );
}
MovieCard.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { MovieCard as M, mediaModalStore as m };
//# sourceMappingURL=MovieCard-CK0_TNVz.js.map
