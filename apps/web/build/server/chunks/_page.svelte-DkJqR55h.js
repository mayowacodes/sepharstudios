import { m as ensure_array_like, C as attr_class, E as escape_html, u as attr, x as stringify } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(app)/press/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const pressItems = [
        {
          title: "Sephar Studios Wins Best Family Film Award",
          date: "2023-10-10",
          description: "Our film 'The Light Within' won Best Family Film at the International Christian Film Festival.",
          link: "/press/sephar-studios-wins-best-family-film-award",
          type: "award"
        },
        {
          title: "New Animated Series for Kids: 'Bible Heroes Adventures'",
          date: "2023-09-20",
          description: "Sephar Studios is excited to announce a new animated series for kids, set to premiere in 2024.",
          link: "/press/bible-heroes-adventures-animated-series",
          type: "kids-teens"
        },
        {
          title: "Behind the Scenes of 'The Journey of Faith'",
          date: "2023-09-15",
          description: "Take a sneak peek into the making of our upcoming original series.",
          link: "/press/journey-of-faith-behind-the-scenes",
          type: "behind-the-scenes"
        },
        {
          title: "Sephar Studios Sponsors New Animated Film",
          date: "2023-08-30",
          description: "We are proud to sponsor 'The Adventures of Noah,' a new animated film for kids.",
          link: "/press/adventures-of-noah-sponsorship",
          type: "sponsorship"
        },
        {
          title: "Join Us for the Premiere of 'The Light Within'",
          date: "2023-11-05",
          description: "Don't miss the premiere of our latest film in Los Angeles.",
          link: "/press/light-within-premiere-event",
          type: "event"
        }
      ];
      function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      }
      $$renderer2.push(`<div class="max-w-6xl mx-auto px-4 py-12">`);
      push_element($$renderer2, "div", 57, 0);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-[#FF5E0E] mb-8 text-center">`);
      push_element($$renderer2, "h1", 58, 2);
      $$renderer2.push(`Press</h1>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`);
      push_element($$renderer2, "div", 63, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(pressItems);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<article class="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">`);
        push_element($$renderer2, "article", 65, 6);
        $$renderer2.push(`<div class="p-6">`);
        push_element($$renderer2, "div", 66, 8);
        if (item.type) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span${attr_class("inline-block px-3 py-1 rounded-full text-sm font-semibold text-white", void 0, {
            "bg-[#FFBF00]": item.type === "press-release",
            "bg-[#AF6E4D]": item.type === "media-coverage",
            "bg-[#FF5E0E]": item.type === "award",
            "bg-purple-500": item.type === "upcoming-project",
            "bg-green-500": item.type === "sponsorship",
            "bg-blue-500": item.type === "testimonial",
            "bg-pink-500": item.type === "behind-the-scenes",
            "bg-teal-500": item.type === "kids-teens",
            "bg-indigo-500": item.type === "event"
          })}>`);
          push_element($$renderer2, "span", 69, 12);
          $$renderer2.push(`${escape_html(item.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()))}</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <header>`);
        push_element($$renderer2, "header", 86, 10);
        $$renderer2.push(`<h2 class="text-xl font-bold text-[#AF6E4D] mt-2">`);
        push_element($$renderer2, "h2", 87, 12);
        $$renderer2.push(`${escape_html(item.title)}</h2>`);
        pop_element();
        $$renderer2.push(`</header>`);
        pop_element();
        $$renderer2.push(` <p class="text-sm text-gray-500 mt-1">`);
        push_element($$renderer2, "p", 93, 10);
        $$renderer2.push(`${escape_html(formatDate(item.date))}</p>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-700 mt-3">`);
        push_element($$renderer2, "p", 98, 10);
        $$renderer2.push(`${escape_html(item.description)}</p>`);
        pop_element();
        $$renderer2.push(` `);
        if (item.link) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<a${attr("href", item.link)} class="inline-block text-[#FF5E0E] font-semibold hover:underline mt-4"${attr("aria-label", `Read more about ${stringify(item.title)}`)}>`);
          push_element($$renderer2, "a", 104, 12);
          $$renderer2.push(`Read More →</a>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</article>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-16 text-center">`);
      push_element($$renderer2, "div", 118, 2);
      $$renderer2.push(`<h2 class="text-3xl font-bold text-[#FF5E0E] mb-4">`);
      push_element($$renderer2, "h2", 119, 4);
      $$renderer2.push(`Press Kit</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-700 mb-6">`);
      push_element($$renderer2, "p", 122, 4);
      $$renderer2.push(`Download our press kit for logos, brand guidelines, and other resources.</p>`);
      pop_element();
      $$renderer2.push(` <a href="/press/press-kit-download" class="inline-block bg-[#FF5E0E] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#FF5E0E]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5E0E]/50" aria-label="Download Press Kit">`);
      push_element($$renderer2, "a", 125, 4);
      $$renderer2.push(`Download Press Kit</a>`);
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
//# sourceMappingURL=_page.svelte-DkJqR55h.js.map
