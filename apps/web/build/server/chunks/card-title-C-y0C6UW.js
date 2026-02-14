import { h as attributes, l as clsx, H as bind_props } from './index-C14HL8mA.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

Card[FILENAME] = "src/lib/components/ui/card/card.svelte";
function Card($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<div${attributes({
        "data-slot": "card",
        class: clsx(cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Card
  );
}
Card.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Card_content[FILENAME] = "src/lib/components/ui/card/card-content.svelte";
function Card_content($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<div${attributes({
        "data-slot": "card-content",
        class: clsx(cn("px-6", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Card_content
  );
}
Card_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Card_description[FILENAME] = "src/lib/components/ui/card/card-description.svelte";
function Card_description($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<p${attributes({
        "data-slot": "card-description",
        class: clsx(cn("text-muted-foreground text-sm", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "p", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></p>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Card_description
  );
}
Card_description.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Card_header[FILENAME] = "src/lib/components/ui/card/card-header.svelte";
function Card_header($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<div${attributes({
        "data-slot": "card-header",
        class: clsx(cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Card_header
  );
}
Card_header.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Card_title[FILENAME] = "src/lib/components/ui/card/card-title.svelte";
function Card_title($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<div${attributes({
        "data-slot": "card-title",
        class: clsx(cn("leading-none font-semibold", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Card_title
  );
}
Card_title.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Card as C, Card_header as a, Card_title as b, Card_content as c, Card_description as d };
//# sourceMappingURL=card-title-C-y0C6UW.js.map
