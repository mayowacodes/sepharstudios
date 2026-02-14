import { H as bind_props, I as props_id, p as prevent_snippet_stringification, h as attributes, F as derived, g as spread_props } from './index-C14HL8mA.js';
import { b as boxWith, c as createId, m as mergeProps, d as createBitsAttrs, a as attachRef, n as getDataOpenClosed, o as boolToStr, k as boolToEmptyStrOrUndef } from './create-id-ozwDP4rH.js';
import { p as push_element, a as pop_element, v as validate_snippet_args } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { n as noop, P as PresenceManager, S as SPACE, E as ENTER } from './noop-JjG5qwPG.js';
import { C as Context, w as watch } from './watch.svelte-ALR66MkX.js';
import { F as Focus_scope, E as Escape_layer, f as Dismissible_layer, T as Text_selection_layer, S as Scroll_lock } from './scroll-lock-BKaGX-xL.js';

const dialogAttrs = createBitsAttrs({
  component: "dialog",
  parts: [
    "content",
    "trigger",
    "overlay",
    "title",
    "description",
    "close",
    "cancel",
    "action"
  ]
});
const DialogRootContext = new Context("Dialog.Root | AlertDialog.Root");
class DialogRootState {
  static create(opts) {
    const parent = DialogRootContext.getOr(null);
    return DialogRootContext.set(new DialogRootState(opts, parent));
  }
  opts;
  triggerNode = null;
  contentNode = null;
  overlayNode = null;
  descriptionNode = null;
  contentId = void 0;
  titleId = void 0;
  triggerId = void 0;
  descriptionId = void 0;
  cancelNode = null;
  nestedOpenCount = 0;
  depth;
  parent;
  contentPresence;
  overlayPresence;
  constructor(opts, parent) {
    this.opts = opts;
    this.parent = parent;
    this.depth = parent ? parent.depth + 1 : 0;
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.contentPresence = new PresenceManager({
      ref: boxWith(() => this.contentNode),
      open: this.opts.open,
      enabled: true,
      onComplete: () => {
        this.opts.onOpenChangeComplete.current(this.opts.open.current);
      }
    });
    this.overlayPresence = new PresenceManager({
      ref: boxWith(() => this.overlayNode),
      open: this.opts.open,
      enabled: true
    });
    watch(
      () => this.opts.open.current,
      (isOpen) => {
        if (!this.parent) return;
        if (isOpen) {
          this.parent.incrementNested();
        } else {
          this.parent.decrementNested();
        }
      },
      { lazy: true }
    );
  }
  handleOpen() {
    if (this.opts.open.current) return;
    this.opts.open.current = true;
  }
  handleClose() {
    if (!this.opts.open.current) return;
    this.opts.open.current = false;
  }
  getBitsAttr = (part) => {
    return dialogAttrs.getAttr(part, this.opts.variant.current);
  };
  incrementNested() {
    this.nestedOpenCount++;
    this.parent?.incrementNested();
  }
  decrementNested() {
    if (this.nestedOpenCount === 0) return;
    this.nestedOpenCount--;
    this.parent?.decrementNested();
  }
  #sharedProps = derived(() => ({ "data-state": getDataOpenClosed(this.opts.open.current) }));
  get sharedProps() {
    return this.#sharedProps();
  }
  set sharedProps($$value) {
    return this.#sharedProps($$value);
  }
}
class DialogTriggerState {
  static create(opts) {
    return new DialogTriggerState(opts, DialogRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref, (v) => {
      this.root.triggerNode = v;
      this.root.triggerId = v?.id;
    });
    this.onclick = this.onclick.bind(this);
    this.onkeydown = this.onkeydown.bind(this);
  }
  onclick(e) {
    if (this.opts.disabled.current) return;
    if (e.button > 0) return;
    this.root.handleOpen();
  }
  onkeydown(e) {
    if (this.opts.disabled.current) return;
    if (e.key === SPACE || e.key === ENTER) {
      e.preventDefault();
      this.root.handleOpen();
    }
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "aria-haspopup": "dialog",
    "aria-expanded": boolToStr(this.root.opts.open.current),
    "aria-controls": this.root.contentId,
    [this.root.getBitsAttr("trigger")]: "",
    onkeydown: this.onkeydown,
    onclick: this.onclick,
    disabled: this.opts.disabled.current ? true : void 0,
    ...this.root.sharedProps,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class DialogCloseState {
  static create(opts) {
    return new DialogCloseState(opts, DialogRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref);
    this.onclick = this.onclick.bind(this);
    this.onkeydown = this.onkeydown.bind(this);
  }
  onclick(e) {
    if (this.opts.disabled.current) return;
    if (e.button > 0) return;
    this.root.handleClose();
  }
  onkeydown(e) {
    if (this.opts.disabled.current) return;
    if (e.key === SPACE || e.key === ENTER) {
      e.preventDefault();
      this.root.handleClose();
    }
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [this.root.getBitsAttr(this.opts.variant.current)]: "",
    onclick: this.onclick,
    onkeydown: this.onkeydown,
    disabled: this.opts.disabled.current ? true : void 0,
    tabindex: 0,
    ...this.root.sharedProps,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class DialogTitleState {
  static create(opts) {
    return new DialogTitleState(opts, DialogRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.root.titleId = this.opts.id.current;
    this.attachment = attachRef(this.opts.ref);
    watch.pre(() => this.opts.id.current, (id) => {
      this.root.titleId = id;
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "heading",
    "aria-level": this.opts.level.current,
    [this.root.getBitsAttr("title")]: "",
    ...this.root.sharedProps,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class DialogDescriptionState {
  static create(opts) {
    return new DialogDescriptionState(opts, DialogRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.root.descriptionId = this.opts.id.current;
    this.attachment = attachRef(this.opts.ref, (v) => {
      this.root.descriptionNode = v;
    });
    watch.pre(() => this.opts.id.current, (id) => {
      this.root.descriptionId = id;
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [this.root.getBitsAttr("description")]: "",
    ...this.root.sharedProps,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class DialogContentState {
  static create(opts) {
    return new DialogContentState(opts, DialogRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref, (v) => {
      this.root.contentNode = v;
      this.root.contentId = v?.id;
    });
  }
  #snippetProps = derived(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: this.root.opts.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
    "aria-modal": "true",
    "aria-describedby": this.root.descriptionId,
    "aria-labelledby": this.root.titleId,
    [this.root.getBitsAttr("content")]: "",
    style: {
      pointerEvents: "auto",
      outline: this.root.opts.variant.current === "alert-dialog" ? "none" : void 0,
      "--bits-dialog-depth": this.root.depth,
      "--bits-dialog-nested-count": this.root.nestedOpenCount
    },
    tabindex: this.root.opts.variant.current === "alert-dialog" ? -1 : void 0,
    "data-nested-open": boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
    "data-nested": boolToEmptyStrOrUndef(this.root.parent !== null),
    ...this.root.sharedProps,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  get shouldRender() {
    return this.root.contentPresence.shouldRender;
  }
}
class DialogOverlayState {
  static create(opts) {
    return new DialogOverlayState(opts, DialogRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref, (v) => this.root.overlayNode = v);
  }
  #snippetProps = derived(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [this.root.getBitsAttr("overlay")]: "",
    style: {
      pointerEvents: "auto",
      "--bits-dialog-depth": this.root.depth,
      "--bits-dialog-nested-count": this.root.nestedOpenCount
    },
    "data-nested-open": boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
    "data-nested": boolToEmptyStrOrUndef(this.root.parent !== null),
    ...this.root.sharedProps,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  get shouldRender() {
    return this.root.overlayPresence.shouldRender;
  }
}
Dialog_title[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/dialog/components/dialog-title.svelte";
function Dialog_title($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        child,
        children,
        level = 2,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const titleState = DialogTitleState.create({
        id: boxWith(() => id),
        level: boxWith(() => level),
        ref: boxWith(() => ref, (v) => ref = v)
      });
      const mergedProps = mergeProps(restProps, titleState.props);
      if (child) {
        $$renderer2.push("<!--[-->");
        child($$renderer2, { props: mergedProps });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div${attributes({ ...mergedProps })}>`);
        push_element($$renderer2, "div", 33, 1);
        children?.($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Dialog_title
  );
}
Dialog_title.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog_overlay[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/dialog/components/dialog-overlay.svelte";
function Dialog_overlay($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        forceMount = false,
        child,
        children,
        ref = null,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const overlayState = DialogOverlayState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v)
      });
      const mergedProps = mergeProps(restProps, overlayState.props);
      if (overlayState.shouldRender || forceMount) {
        $$renderer2.push("<!--[-->");
        if (child) {
          $$renderer2.push("<!--[-->");
          child($$renderer2, { props: mergeProps(mergedProps), ...overlayState.snippetProps });
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div${attributes({ ...mergeProps(mergedProps) })}>`);
          push_element($$renderer2, "div", 33, 2);
          children?.($$renderer2, overlayState.snippetProps);
          $$renderer2.push(`<!----></div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Dialog_overlay
  );
}
Dialog_overlay.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog_description[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/dialog/components/dialog-description.svelte";
function Dialog_description($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        children,
        child,
        ref = null,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const descriptionState = DialogDescriptionState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v)
      });
      const mergedProps = mergeProps(restProps, descriptionState.props);
      if (child) {
        $$renderer2.push("<!--[-->");
        child($$renderer2, { props: mergedProps });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div${attributes({ ...mergedProps })}>`);
        push_element($$renderer2, "div", 31, 1);
        children?.($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Dialog_description
  );
}
Dialog_description.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte";
function Dialog($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        open = false,
        onOpenChange = noop,
        onOpenChangeComplete = noop,
        children
      } = $$props;
      DialogRootState.create({
        variant: boxWith(() => "dialog"),
        open: boxWith(() => open, (v) => {
          open = v;
          onOpenChange(v);
        }),
        onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
      });
      children?.($$renderer2);
      $$renderer2.push(`<!---->`);
      bind_props($$props, { open });
    },
    Dialog
  );
}
Dialog.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog_close[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/dialog/components/dialog-close.svelte";
function Dialog_close($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        children,
        child,
        id = createId(uid),
        ref = null,
        disabled = false,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const closeState = DialogCloseState.create({
        variant: boxWith(() => "close"),
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        disabled: boxWith(() => Boolean(disabled))
      });
      const mergedProps = mergeProps(restProps, closeState.props);
      if (child) {
        $$renderer2.push("<!--[-->");
        child($$renderer2, { props: mergedProps });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<button${attributes({ ...mergedProps })}>`);
        push_element($$renderer2, "button", 34, 1);
        children?.($$renderer2);
        $$renderer2.push(`<!----></button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Dialog_close
  );
}
Dialog_close.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Dialog_content[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/dialog/components/dialog-content.svelte";
function Dialog_content($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        children,
        child,
        ref = null,
        forceMount = false,
        onCloseAutoFocus = noop,
        onOpenAutoFocus = noop,
        onEscapeKeydown = noop,
        onInteractOutside = noop,
        trapFocus = true,
        preventScroll = true,
        restoreScrollDelay = null,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const contentState = DialogContentState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v)
      });
      const mergedProps = mergeProps(restProps, contentState.props);
      if (contentState.shouldRender || forceMount) {
        $$renderer2.push("<!--[-->");
        {
          let focusScope = function($$renderer3, { props: focusScopeProps }) {
            validate_snippet_args($$renderer3);
            Escape_layer($$renderer3, spread_props([
              mergedProps,
              {
                enabled: contentState.root.opts.open.current,
                ref: contentState.opts.ref,
                onEscapeKeydown: (e) => {
                  onEscapeKeydown(e);
                  if (e.defaultPrevented) return;
                  contentState.root.handleClose();
                },
                children: prevent_snippet_stringification(($$renderer4) => {
                  Dismissible_layer($$renderer4, spread_props([
                    mergedProps,
                    {
                      ref: contentState.opts.ref,
                      enabled: contentState.root.opts.open.current,
                      onInteractOutside: (e) => {
                        onInteractOutside(e);
                        if (e.defaultPrevented) return;
                        contentState.root.handleClose();
                      },
                      children: prevent_snippet_stringification(($$renderer5) => {
                        Text_selection_layer($$renderer5, spread_props([
                          mergedProps,
                          {
                            ref: contentState.opts.ref,
                            enabled: contentState.root.opts.open.current,
                            children: prevent_snippet_stringification(($$renderer6) => {
                              if (child) {
                                $$renderer6.push("<!--[-->");
                                if (contentState.root.opts.open.current) {
                                  $$renderer6.push("<!--[-->");
                                  Scroll_lock($$renderer6, { preventScroll, restoreScrollDelay });
                                } else {
                                  $$renderer6.push("<!--[!-->");
                                }
                                $$renderer6.push(`<!--]--> `);
                                child($$renderer6, {
                                  props: mergeProps(mergedProps, focusScopeProps),
                                  ...contentState.snippetProps
                                });
                                $$renderer6.push(`<!---->`);
                              } else {
                                $$renderer6.push("<!--[!-->");
                                Scroll_lock($$renderer6, { preventScroll });
                                $$renderer6.push(`<!----> <div${attributes({ ...mergeProps(mergedProps, focusScopeProps) })}>`);
                                push_element($$renderer6, "div", 86, 7);
                                children?.($$renderer6);
                                $$renderer6.push(`<!----></div>`);
                                pop_element();
                              }
                              $$renderer6.push(`<!--]-->`);
                            }),
                            $$slots: { default: true }
                          }
                        ]));
                      }),
                      $$slots: { default: true }
                    }
                  ]));
                }),
                $$slots: { default: true }
              }
            ]));
          };
          prevent_snippet_stringification(focusScope);
          Focus_scope($$renderer2, {
            ref: contentState.opts.ref,
            loop: true,
            trapFocus,
            enabled: contentState.root.opts.open.current,
            onOpenAutoFocus,
            onCloseAutoFocus,
            focusScope
          });
        }
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Dialog_content
  );
}
Dialog_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Dialog as D, Dialog_content as a, Dialog_close as b, DialogTriggerState as c, Dialog_overlay as d, Dialog_title as e, Dialog_description as f };
//# sourceMappingURL=dialog-content-DGfSWKw7.js.map
