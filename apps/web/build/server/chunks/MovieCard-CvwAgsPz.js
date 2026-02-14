import { O as fallback, u as attr, E as escape_html, m as ensure_array_like, C as attr_class, H as bind_props } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { w as writable } from './index3-CnQVvK5M.js';
import './client2-BtPpI286.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

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
      const genreColor = (genre) => {
        switch (genre.toLowerCase()) {
          case "drama":
            return "bg-purple-600 text-white";
          case "action":
            return "bg-red-600 text-white";
          case "comedy":
            return "bg-yellow-400 text-black";
          case "animation":
            return "bg-pink-500 text-white";
          case "documentary":
            return "bg-blue-500 text-white";
          case "family":
            return "bg-green-500 text-white";
          case "faith":
          case "christian":
            return "bg-indigo-600 text-white";
          default:
            return "bg-gray-600 text-white";
        }
      };
      $$renderer2.push(`<div role="button" tabindex="0" class="relative group w-40 sm:w-48 lg:w-52 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none">`);
      push_element($$renderer2, "div", 75, 0);
      $$renderer2.push(`<div class="relative aspect-[2/3] bg-muted rounded-xl overflow-hidden">`);
      push_element($$renderer2, "div", 84, 2);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<img${attr("src", movie.thumbnail || "/placeholder-vertical.jpg")}${attr("alt", movie.title)} class="w-full h-full object-cover" loading="lazy"/>`);
        push_element($$renderer2, "img", 95, 6);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (movie.isNew) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute top-2 left-2 bg-green-600 dark:bg-green-400 text-white dark:text-black text-xs px-2 py-0.5 rounded-full z-30">`);
        push_element($$renderer2, "div", 105, 4);
        $$renderer2.push(`New Episode</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0">`);
      push_element($$renderer2, "div", 110, 2);
      $$renderer2.push(`<h3 class="text-sm font-semibold line-clamp-2 text-gray-900 dark:text-white">`);
      push_element($$renderer2, "h3", 111, 4);
      $$renderer2.push(`${escape_html(movie.title)}</h3>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs mt-1 flex flex-wrap gap-1 text-gray-700 dark:text-gray-300">`);
      push_element($$renderer2, "div", 113, 4);
      if (movie.rating) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">`);
        push_element($$renderer2, "span", 114, 24);
        $$renderer2.push(`${escape_html(movie.rating)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (movie.duration) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 115, 26);
        $$renderer2.push(`${escape_html(movie.duration)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (movie.quality) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 116, 25);
        $$renderer2.push(`${escape_html(movie.quality)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (movie.genres?.length) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mt-2 flex flex-wrap gap-1">`);
        push_element($$renderer2, "div", 120, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(movie.genres);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let genre = each_array[$$index];
          $$renderer2.push(`<span${attr_class(`text-[10px] px-2 py-0.5 rounded-full ${genreColor(genre)}`)}>`);
          push_element($$renderer2, "span", 122, 10);
          $$renderer2.push(`${escape_html(genre)}</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <p class="text-xs mt-2 text-white-700 dark:text-gray-300 line-clamp-3 transition-opacity duration-300">`);
      push_element($$renderer2, "p", 129, 4);
      $$renderer2.push(`${escape_html(movie.description)}</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
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
//# sourceMappingURL=MovieCard-CvwAgsPz.js.map
