import { H as bind_props, g as spread_props, I as props_id, h as attributes, F as derived } from './index-C14HL8mA.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { c as createId, b as boxWith, m as mergeProps, a as attachRef, d as createBitsAttrs } from './create-id-ozwDP4rH.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { C as Context, w as watch } from './watch.svelte-ALR66MkX.js';
import { D as DOMContext } from './dom-context.svelte-DOhd7vND.js';

const avatarAttrs = createBitsAttrs({ component: "avatar", parts: ["root", "image", "fallback"] });
const AvatarRootContext = new Context("Avatar.Root");
class AvatarRootState {
  static create(opts) {
    return AvatarRootContext.set(new AvatarRootState(opts));
  }
  opts;
  domContext;
  attachment;
  constructor(opts) {
    this.opts = opts;
    this.domContext = new DOMContext(this.opts.ref);
    this.loadImage = this.loadImage.bind(this);
    this.attachment = attachRef(this.opts.ref);
  }
  loadImage(src, crossorigin, referrerPolicy) {
    if (this.opts.loadingStatus.current === "loaded") return;
    let imageTimerId;
    const image = new Image();
    image.src = src;
    if (crossorigin !== void 0) image.crossOrigin = crossorigin;
    if (referrerPolicy) image.referrerPolicy = referrerPolicy;
    this.opts.loadingStatus.current = "loading";
    image.onload = () => {
      imageTimerId = this.domContext.setTimeout(
        () => {
          this.opts.loadingStatus.current = "loaded";
        },
        this.opts.delayMs.current
      );
    };
    image.onerror = () => {
      this.opts.loadingStatus.current = "error";
    };
    return () => {
      if (!imageTimerId) return;
      this.domContext.clearTimeout(imageTimerId);
    };
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [avatarAttrs.root]: "",
    "data-status": this.opts.loadingStatus.current,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class AvatarImageState {
  static create(opts) {
    return new AvatarImageState(opts, AvatarRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref);
    watch.pre(
      [
        () => this.opts.src.current,
        () => this.opts.crossOrigin.current
      ],
      ([src, crossOrigin]) => {
        if (!src) {
          this.root.opts.loadingStatus.current = "error";
          return;
        }
        this.root.loadImage(src, crossOrigin, this.opts.referrerPolicy.current);
      }
    );
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    style: {
      display: this.root.opts.loadingStatus.current === "loaded" ? "block" : "none"
    },
    "data-status": this.root.opts.loadingStatus.current,
    [avatarAttrs.image]: "",
    src: this.opts.src.current,
    crossorigin: this.opts.crossOrigin.current,
    referrerpolicy: this.opts.referrerPolicy.current,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class AvatarFallbackState {
  static create(opts) {
    return new AvatarFallbackState(opts, AvatarRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref);
  }
  #style = derived(() => this.root.opts.loadingStatus.current === "loaded" ? { display: "none" } : void 0);
  get style() {
    return this.#style();
  }
  set style($$value) {
    return this.#style($$value);
  }
  #props = derived(() => ({
    style: this.style,
    "data-status": this.root.opts.loadingStatus.current,
    [avatarAttrs.fallback]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
Avatar$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/avatar/components/avatar.svelte";
function Avatar$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        delayMs = 0,
        loadingStatus = "loading",
        onLoadingStatusChange,
        child,
        children,
        id = createId(uid),
        ref = null,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const rootState = AvatarRootState.create({
        delayMs: boxWith(() => delayMs),
        loadingStatus: boxWith(() => loadingStatus, (v) => {
          if (loadingStatus !== v) {
            loadingStatus = v;
            onLoadingStatusChange?.(v);
          }
        }),
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v)
      });
      const mergedProps = mergeProps(restProps, rootState.props);
      if (child) {
        $$renderer2.push("<!--[-->");
        child($$renderer2, { props: mergedProps });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div${attributes({ ...mergedProps })}>`);
        push_element($$renderer2, "div", 44, 1);
        children?.($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { loadingStatus, ref });
    },
    Avatar$1
  );
}
Avatar$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Avatar_image$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/avatar/components/avatar-image.svelte";
function Avatar_image$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        src,
        child,
        id = createId(uid),
        ref = null,
        crossorigin = void 0,
        referrerpolicy = void 0,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const imageState = AvatarImageState.create({
        src: boxWith(() => src),
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        crossOrigin: boxWith(() => crossorigin),
        referrerPolicy: boxWith(() => referrerpolicy)
      });
      const mergedProps = mergeProps(restProps, imageState.props);
      if (child) {
        $$renderer2.push("<!--[-->");
        child($$renderer2, { props: mergedProps });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<img${attributes({ ...mergedProps, src })} onload="this.__e=event" onerror="this.__e=event"/>`);
        push_element($$renderer2, "img", 36, 1);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Avatar_image$1
  );
}
Avatar_image$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Avatar_fallback$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/avatar/components/avatar-fallback.svelte";
function Avatar_fallback$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        children,
        child,
        id = createId(uid),
        ref = null,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const fallbackState = AvatarFallbackState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v)
      });
      const mergedProps = mergeProps(restProps, fallbackState.props);
      if (child) {
        $$renderer2.push("<!--[-->");
        child($$renderer2, { props: mergedProps });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<span${attributes({ ...mergedProps })}>`);
        push_element($$renderer2, "span", 31, 1);
        children?.($$renderer2);
        $$renderer2.push(`<!----></span>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Avatar_fallback$1
  );
}
Avatar_fallback$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
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

export { Avatar as A, Avatar_image as a, Avatar_fallback as b };
//# sourceMappingURL=avatar-fallback-Sz8ic2oI.js.map
