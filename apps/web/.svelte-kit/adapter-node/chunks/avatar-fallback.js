import { f as bind_props, B as Avatar$1, s as spread_props, F as FILENAME, C as Avatar_image$1, D as Avatar_fallback$1 } from "./ui-libs.js";
import { c as cn } from "./utils2.js";
Avatar[FILENAME] = "src/lib/components/ui/avatar/avatar.svelte";
function Avatar($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        loadingStatus = "loading",
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Avatar$1($$renderer3, spread_props([
          {
            "data-slot": "avatar",
            class: cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)
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
            get loadingStatus() {
              return loadingStatus;
            },
            set loadingStatus($$value) {
              loadingStatus = $$value;
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
      bind_props($$props, { ref, loadingStatus });
    },
    Avatar
  );
}
Avatar.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Avatar_image[FILENAME] = "src/lib/components/ui/avatar/avatar-image.svelte";
function Avatar_image($$renderer, $$props) {
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
        Avatar_image$1($$renderer3, spread_props([
          {
            "data-slot": "avatar-image",
            class: cn("aspect-square size-full", className)
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
    Avatar_image
  );
}
Avatar_image.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Avatar_fallback[FILENAME] = "src/lib/components/ui/avatar/avatar-fallback.svelte";
function Avatar_fallback($$renderer, $$props) {
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
        Avatar_fallback$1($$renderer3, spread_props([
          {
            "data-slot": "avatar-fallback",
            class: cn("bg-muted flex size-full items-center justify-center rounded-full", className)
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
    Avatar_fallback
  );
}
Avatar_fallback.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Avatar as A,
  Avatar_image as a,
  Avatar_fallback as b
};
