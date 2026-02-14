import { p as styleToString } from './create-id-ozwDP4rH.js';
import { H as bind_props, h as attributes, l as clsx, g as spread_props, p as prevent_snippet_stringification } from './index-C14HL8mA.js';
import { P as Portal } from './scroll-lock-BKaGX-xL.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { D as Dialog$1, a as Dialog_content$1, b as Dialog_close, e as Dialog_title$1, f as Dialog_description$1, d as Dialog_overlay$1 } from './dialog-content-DGfSWKw7.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { X } from './x-DGP1viX5.js';

const srOnlyStyles = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
  transform: "translateX(-100%)"
};
const srOnlyStylesString = styleToString(srOnlyStyles);
Dialog[FILENAME] = "src/lib/components/ui/dialog/dialog.svelte";
function Dialog($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { open = false, $$slots, $$events, ...restProps } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Dialog$1($$renderer3, spread_props([
          restProps,
          {
            get open() {
              return open;
            },
            set open($$value) {
              open = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { open });
    },
    Dialog
  );
}
Dialog.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog_portal[FILENAME] = "src/lib/components/ui/dialog/dialog-portal.svelte";
function Dialog_portal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...restProps } = $$props;
      $$renderer2.push(`<!---->`);
      Portal($$renderer2, spread_props([restProps]));
      $$renderer2.push(`<!---->`);
    },
    Dialog_portal
  );
}
Dialog_portal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog_title[FILENAME] = "src/lib/components/ui/dialog/dialog-title.svelte";
function Dialog_title($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Dialog_title$1($$renderer3, spread_props([
          {
            "data-slot": "dialog-title",
            class: cn("text-lg leading-none font-semibold", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Dialog_title
  );
}
Dialog_title.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog_footer[FILENAME] = "src/lib/components/ui/dialog/dialog-footer.svelte";
function Dialog_footer($$renderer, $$props) {
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
        "data-slot": "dialog-footer",
        class: clsx(cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Dialog_footer
  );
}
Dialog_footer.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog_header[FILENAME] = "src/lib/components/ui/dialog/dialog-header.svelte";
function Dialog_header($$renderer, $$props) {
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
        "data-slot": "dialog-header",
        class: clsx(cn("flex flex-col gap-2 text-center sm:text-start", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Dialog_header
  );
}
Dialog_header.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog_overlay[FILENAME] = "src/lib/components/ui/dialog/dialog-overlay.svelte";
function Dialog_overlay($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Dialog_overlay$1($$renderer3, spread_props([
          {
            "data-slot": "dialog-overlay",
            class: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Dialog_overlay
  );
}
Dialog_overlay.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog_content[FILENAME] = "src/lib/components/ui/dialog/dialog-content.svelte";
function Dialog_content($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        portalProps,
        children,
        showCloseButton = true,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Dialog_portal($$renderer3, spread_props([
          portalProps,
          {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Dialog_overlay($$renderer4, {});
              $$renderer4.push(`<!----> <!---->`);
              Dialog_content$1($$renderer4, spread_props([
                {
                  "data-slot": "dialog-content",
                  class: cn("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className)
                },
                restProps,
                {
                  get ref() {
                    return ref;
                  },
                  set ref($$value) {
                    ref = $$value;
                    $$settled = false;
                  },
                  children: prevent_snippet_stringification(($$renderer5) => {
                    children?.($$renderer5);
                    $$renderer5.push(`<!----> `);
                    if (showCloseButton) {
                      $$renderer5.push("<!--[-->");
                      $$renderer5.push(`<!---->`);
                      Dialog_close($$renderer5, {
                        class: "ring-offset-background focus:ring-ring absolute end-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                        children: prevent_snippet_stringification(($$renderer6) => {
                          X($$renderer6, {});
                          $$renderer6.push(`<!----> <span class="sr-only">`);
                          push_element($$renderer6, "span", 41, 4);
                          $$renderer6.push(`Close</span>`);
                          pop_element();
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!---->`);
                    } else {
                      $$renderer5.push("<!--[!-->");
                    }
                    $$renderer5.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                }
              ]));
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          }
        ]));
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Dialog_content
  );
}
Dialog_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog_description[FILENAME] = "src/lib/components/ui/dialog/dialog-description.svelte";
function Dialog_description($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Dialog_description$1($$renderer3, spread_props([
          {
            "data-slot": "dialog-description",
            class: cn("text-muted-foreground text-sm", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Dialog_description
  );
}
Dialog_description.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Dialog as D, srOnlyStylesString as a, Dialog_content as b, Dialog_header as c, Dialog_title as d, Dialog_description as e, Dialog_footer as f, srOnlyStyles as s };
//# sourceMappingURL=dialog-description-D46lQxwM.js.map
