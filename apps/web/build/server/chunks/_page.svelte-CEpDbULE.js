import { M as store_get, E as escape_html, p as prevent_snippet_stringification, m as ensure_array_like, g as spread_props, h as attributes, l as clsx, H as bind_props, C as attr_class, I as props_id, F as derived, N as unsubscribe_stores } from './index-C14HL8mA.js';
import { B as Button, t as tv } from './button-B5TxIyzE.js';
import { I as Input } from './input-BHRan7UY.js';
import { a as srOnlyStylesString, D as Dialog, b as Dialog_content, c as Dialog_header, d as Dialog_title, e as Dialog_description, f as Dialog_footer } from './dialog-description-D46lQxwM.js';
import './label-Bh2yW0Jf.js';
import { a as Floating_layer_anchor, P as Popper_layer_force_mount, b as Popper_layer, F as Floating_layer, g as getFloatingContentCSSVars } from './popper-layer-force-mount-DvMEtyRB.js';
import { n as noop$1, e as ARROW_UP, g as ARROW_DOWN, E as ENTER, S as SPACE, T as TAB, q as PAGE_UP, H as HOME, r as PAGE_DOWN, d as END, s as isIOS, b as afterTick, P as PresenceManager } from './noop-JjG5qwPG.js';
import { w as watch$1, C as Context } from './watch.svelte-ALR66MkX.js';
import { o as on } from './events-DndNBaun.js';
import { P as Portal, j as DOMTypeahead, n as next, p as prev, k as forward, l as backward, m as boxAutoReset, o as getNextMatch, h as afterSleep } from './scroll-lock-BKaGX-xL.js';
import { b as boxWith, c as createId, m as mergeProps, a as attachRef, d as createBitsAttrs, k as boolToEmptyStrOrUndef, n as getDataOpenClosed, o as boolToStr, q as boolToTrueOrUndef, l as boolToStrTrueOrUndef } from './create-id-ozwDP4rH.js';
import { D as DOMContext } from './dom-context.svelte-DOhd7vND.js';
import { p as push_element, a as pop_element, v as validate_snippet_args } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { C as Check } from './check-BwxT_uMO.js';
import { I as Icon } from './Icon-DLeFNkXp.js';
import { C as Chevron_down } from './chevron-down-BiSp9fvd.js';
import './separator-C0wSgEAM.js';
import { p as page } from './index2-DN4t2Pgp.js';
import { c as adminRoles } from './index4-Cnd3Rmm9.js';
import { g as getRoleBadgeVariant, r as roles } from './fxn-BOos7yUf.js';
import { L as Loading_spinner } from './loading-spinner-BYlcQqmo.js';
import { a as toast } from './toast-state.svelte-CJQQ3D3L.js';
import { B as Badge } from './badge-DBgw54iF.js';
import { format } from 'date-fns';
import { b as admin } from './auth-client-BmG0Nu2w.js';
import { A as Avatar, a as Avatar_image, b as Avatar_fallback } from './avatar-fallback-Sz8ic2oI.js';
import { i as infiniteScroll } from './use-infinite-scroll.svelte-Bi-Tdt_C.js';
import { c as createSubscriber } from './index-server-_G0R5Qhl.js';
import { S as Search } from './search-D7TjZ0xz.js';
import { C as Circle_alert } from './circle-alert-CjEH9fu-.js';
import './dialog-content-DGfSWKw7.js';
import './x-DGP1viX5.js';
import './client-CreTuECU.js';
import './client2-BtPpI286.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';
import './users-CMHMaCG6.js';
import './user-CU8eWwNU.js';
import './defu-BDNAzC90.js';
import 'zod';
import './shared-server-BeisX7n9.js';

Chevron_up[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/chevron-up.svelte";
function Chevron_up($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [["path", { "d": "m18 15-6-6-6 6" }]];
      Icon($$renderer2, spread_props([
        { name: "chevron-up" },
        /**
         * @component @name ChevronUp
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTggMTUtNi02LTYgNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-up
         * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
         *
         * @param {Object} props - Lucide icons props and any valid SVG attribute
         * @returns {FunctionalComponent} Svelte component
         *
         */
        props,
        {
          iconNode,
          children: prevent_snippet_stringification(($$renderer3) => {
            props.children?.($$renderer3);
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    Chevron_up
  );
}
Chevron_up.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Loader_circle[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/loader-circle.svelte";
function Loader_circle($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]];
      Icon($$renderer2, spread_props([
        { name: "loader-circle" },
        /**
         * @component @name LoaderCircle
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJhOSA5IDAgMSAxLTYuMjE5LTguNTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/loader-circle
         * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
         *
         * @param {Object} props - Lucide icons props and any valid SVG attribute
         * @returns {FunctionalComponent} Svelte component
         *
         */
        props,
        {
          iconNode,
          children: prevent_snippet_stringification(($$renderer3) => {
            props.children?.($$renderer3);
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    Loader_circle
  );
}
Loader_circle.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Trash_2[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/trash-2.svelte";
function Trash_2($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        ["path", { "d": "M10 11v6" }],
        ["path", { "d": "M14 11v6" }],
        ["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
        ["path", { "d": "M3 6h18" }],
        ["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "trash-2" },
        /**
         * @component @name Trash2
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTQgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTkgNnYxNGEyIDIgMCAwIDEtMiAySDdhMiAyIDAgMCAxLTItMlY2IiAvPgogIDxwYXRoIGQ9Ik0zIDZoMTgiIC8+CiAgPHBhdGggZD0iTTggNlY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/trash-2
         * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
         *
         * @param {Object} props - Lucide icons props and any valid SVG attribute
         * @returns {FunctionalComponent} Svelte component
         *
         */
        props,
        {
          iconNode,
          children: prevent_snippet_stringification(($$renderer3) => {
            props.children?.($$renderer3);
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    Trash_2
  );
}
Trash_2.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Triangle_alert[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/triangle-alert.svelte";
function Triangle_alert($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
          }
        ],
        ["path", { "d": "M12 9v4" }],
        ["path", { "d": "M12 17h.01" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "triangle-alert" },
        /**
         * @component @name TriangleAlert
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40OCAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTMiIC8+CiAgPHBhdGggZD0iTTEyIDl2NCIgLz4KICA8cGF0aCBkPSJNMTIgMTdoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/triangle-alert
         * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
         *
         * @param {Object} props - Lucide icons props and any valid SVG attribute
         * @returns {FunctionalComponent} Svelte component
         *
         */
        props,
        {
          iconNode,
          children: prevent_snippet_stringification(($$renderer3) => {
            props.children?.($$renderer3);
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    Triangle_alert
  );
}
Triangle_alert.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
class Previous {
  #previousCallback = () => void 0;
  #previous = derived(() => this.#previousCallback());
  constructor(getter, initialValue) {
    let actualPrevious = void 0;
    if (initialValue !== void 0) actualPrevious = initialValue;
    this.#previousCallback = () => {
      try {
        return actualPrevious;
      } finally {
        actualPrevious = getter();
      }
    };
  }
  get current() {
    return this.#previous();
  }
}
Hidden_input[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte";
function Hidden_input($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { value = void 0, $$slots, $$events, ...restProps } = $$props;
      const mergedProps = mergeProps(restProps, {
        "aria-hidden": "true",
        tabindex: -1,
        style: srOnlyStylesString
      });
      if (mergedProps.type === "checkbox") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<input${attributes({ ...mergedProps, value }, void 0, void 0, void 0, 4)}/>`);
        push_element($$renderer2, "input", 17, 1);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<input${attributes({ value, ...mergedProps }, void 0, void 0, void 0, 4)}/>`);
        push_element($$renderer2, "input", 19, 1);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { value });
    },
    Hidden_input
  );
}
Hidden_input.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
class DataTypeahead {
  #opts;
  #candidateValues = derived(() => this.#opts.candidateValues());
  #search;
  constructor(opts) {
    this.#opts = opts;
    this.#search = boxAutoReset("", { afterMs: 1e3, getWindow: this.#opts.getWindow });
    this.handleTypeaheadSearch = this.handleTypeaheadSearch.bind(this);
    this.resetTypeahead = this.resetTypeahead.bind(this);
  }
  handleTypeaheadSearch(key) {
    if (!this.#opts.enabled() || !this.#candidateValues().length) return;
    this.#search.current = this.#search.current + key;
    const currentItem = this.#opts.getCurrentItem();
    const currentMatch = this.#candidateValues().find((item) => item === currentItem) ?? "";
    const values = this.#candidateValues().map((item) => item ?? "");
    const nextMatch = getNextMatch(values, this.#search.current, currentMatch);
    const newItem = this.#candidateValues().find((item) => item === nextMatch);
    if (newItem) {
      this.#opts.onMatch(newItem);
    }
    return newItem;
  }
  resetTypeahead() {
    this.#search.current = "";
  }
}
const FIRST_KEYS = [ARROW_DOWN, PAGE_UP, HOME];
const LAST_KEYS = [ARROW_UP, PAGE_DOWN, END];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
const selectAttrs = createBitsAttrs({
  component: "select",
  parts: [
    "trigger",
    "content",
    "item",
    "viewport",
    "scroll-up-button",
    "scroll-down-button",
    "group",
    "group-label",
    "separator",
    "arrow",
    "input",
    "content-wrapper",
    "item-text",
    "value"
  ]
});
const SelectRootContext = new Context("Select.Root | Combobox.Root");
const SelectGroupContext = new Context("Select.Group | Combobox.Group");
const SelectContentContext = new Context("Select.Content | Combobox.Content");
class SelectBaseRootState {
  opts;
  touchedInput = false;
  inputNode = null;
  contentNode = null;
  contentPresence;
  viewportNode = null;
  triggerNode = null;
  valueId = "";
  highlightedNode = null;
  #highlightedValue = derived(() => {
    if (!this.highlightedNode) return null;
    return this.highlightedNode.getAttribute("data-value");
  });
  get highlightedValue() {
    return this.#highlightedValue();
  }
  set highlightedValue($$value) {
    return this.#highlightedValue($$value);
  }
  #highlightedId = derived(() => {
    if (!this.highlightedNode) return void 0;
    return this.highlightedNode.id;
  });
  get highlightedId() {
    return this.#highlightedId();
  }
  set highlightedId($$value) {
    return this.#highlightedId($$value);
  }
  #highlightedLabel = derived(() => {
    if (!this.highlightedNode) return null;
    return this.highlightedNode.getAttribute("data-label");
  });
  get highlightedLabel() {
    return this.#highlightedLabel();
  }
  set highlightedLabel($$value) {
    return this.#highlightedLabel($$value);
  }
  isUsingKeyboard = false;
  isCombobox = false;
  domContext = new DOMContext(() => null);
  constructor(opts) {
    this.opts = opts;
    this.isCombobox = opts.isCombobox;
    this.contentPresence = new PresenceManager({
      ref: boxWith(() => this.contentNode),
      open: this.opts.open,
      onComplete: () => {
        this.opts.onOpenChangeComplete.current(this.opts.open.current);
      }
    });
  }
  setHighlightedNode(node, initial = false) {
    this.highlightedNode = node;
    if (node && (this.isUsingKeyboard || initial)) {
      node.scrollIntoView({ block: this.opts.scrollAlignment.current });
    }
  }
  getCandidateNodes() {
    const node = this.contentNode;
    if (!node) return [];
    return Array.from(node.querySelectorAll(`[${this.getBitsAttr("item")}]:not([data-disabled])`));
  }
  setHighlightedToFirstCandidate(initial = false) {
    this.setHighlightedNode(null);
    let nodes = this.getCandidateNodes();
    if (!nodes.length) return;
    if (this.viewportNode) {
      const viewportRect = this.viewportNode.getBoundingClientRect();
      nodes = nodes.filter((node) => {
        if (!this.viewportNode) return false;
        const nodeRect = node.getBoundingClientRect();
        const isNodeFullyVisible = nodeRect.right < viewportRect.right && nodeRect.left > viewportRect.left && nodeRect.bottom < viewportRect.bottom && nodeRect.top > viewportRect.top;
        return isNodeFullyVisible;
      });
    }
    this.setHighlightedNode(nodes[0], initial);
  }
  getNodeByValue(value) {
    const candidateNodes = this.getCandidateNodes();
    return candidateNodes.find((node) => node.dataset.value === value) ?? null;
  }
  setOpen(open) {
    this.opts.open.current = open;
  }
  toggleOpen() {
    this.opts.open.current = !this.opts.open.current;
  }
  handleOpen() {
    this.setOpen(true);
  }
  handleClose() {
    this.setHighlightedNode(null);
    this.setOpen(false);
  }
  toggleMenu() {
    this.toggleOpen();
  }
  getBitsAttr = (part) => {
    return selectAttrs.getAttr(part, this.isCombobox ? "combobox" : void 0);
  };
}
class SelectSingleRootState extends SelectBaseRootState {
  opts;
  isMulti = false;
  #hasValue = derived(() => this.opts.value.current !== "");
  get hasValue() {
    return this.#hasValue();
  }
  set hasValue($$value) {
    return this.#hasValue($$value);
  }
  #currentLabel = derived(() => {
    if (!this.opts.items.current.length) return "";
    return this.opts.items.current.find((item) => item.value === this.opts.value.current)?.label ?? "";
  });
  get currentLabel() {
    return this.#currentLabel();
  }
  set currentLabel($$value) {
    return this.#currentLabel($$value);
  }
  #candidateLabels = derived(() => {
    if (!this.opts.items.current.length) return [];
    const filteredItems = this.opts.items.current.filter((item) => !item.disabled);
    return filteredItems.map((item) => item.label);
  });
  get candidateLabels() {
    return this.#candidateLabels();
  }
  set candidateLabels($$value) {
    return this.#candidateLabels($$value);
  }
  #dataTypeaheadEnabled = derived(() => {
    if (this.isMulti) return false;
    if (this.opts.items.current.length === 0) return false;
    return true;
  });
  get dataTypeaheadEnabled() {
    return this.#dataTypeaheadEnabled();
  }
  set dataTypeaheadEnabled($$value) {
    return this.#dataTypeaheadEnabled($$value);
  }
  constructor(opts) {
    super(opts);
    this.opts = opts;
    watch$1(() => this.opts.open.current, () => {
      if (!this.opts.open.current) return;
      this.setInitialHighlightedNode();
    });
  }
  includesItem(itemValue) {
    return this.opts.value.current === itemValue;
  }
  toggleItem(itemValue, itemLabel = itemValue) {
    const newValue = this.includesItem(itemValue) ? "" : itemValue;
    this.opts.value.current = newValue;
    if (newValue !== "") {
      this.opts.inputValue.current = itemLabel;
    }
  }
  setInitialHighlightedNode() {
    afterTick(() => {
      if (this.highlightedNode && this.domContext.getDocument().contains(this.highlightedNode)) return;
      if (this.opts.value.current !== "") {
        const node = this.getNodeByValue(this.opts.value.current);
        if (node) {
          this.setHighlightedNode(node, true);
          return;
        }
      }
      this.setHighlightedToFirstCandidate(true);
    });
  }
}
class SelectMultipleRootState extends SelectBaseRootState {
  opts;
  isMulti = true;
  #hasValue = derived(() => this.opts.value.current.length > 0);
  get hasValue() {
    return this.#hasValue();
  }
  set hasValue($$value) {
    return this.#hasValue($$value);
  }
  constructor(opts) {
    super(opts);
    this.opts = opts;
    watch$1(() => this.opts.open.current, () => {
      if (!this.opts.open.current) return;
      this.setInitialHighlightedNode();
    });
  }
  includesItem(itemValue) {
    return this.opts.value.current.includes(itemValue);
  }
  toggleItem(itemValue, itemLabel = itemValue) {
    if (this.includesItem(itemValue)) {
      this.opts.value.current = this.opts.value.current.filter((v) => v !== itemValue);
    } else {
      this.opts.value.current = [...this.opts.value.current, itemValue];
    }
    this.opts.inputValue.current = itemLabel;
  }
  setInitialHighlightedNode() {
    afterTick(() => {
      if (!this.domContext) return;
      if (this.highlightedNode && this.domContext.getDocument().contains(this.highlightedNode)) return;
      if (this.opts.value.current.length && this.opts.value.current[0] !== "") {
        const node = this.getNodeByValue(this.opts.value.current[0]);
        if (node) {
          this.setHighlightedNode(node, true);
          return;
        }
      }
      this.setHighlightedToFirstCandidate(true);
    });
  }
}
class SelectRootState {
  static create(props) {
    const { type, ...rest } = props;
    const rootState = type === "single" ? new SelectSingleRootState(rest) : new SelectMultipleRootState(rest);
    return SelectRootContext.set(rootState);
  }
}
class SelectTriggerState {
  static create(opts) {
    return new SelectTriggerState(opts, SelectRootContext.get());
  }
  opts;
  root;
  attachment;
  #domTypeahead;
  #dataTypeahead;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(opts.ref, (v) => this.root.triggerNode = v);
    this.root.domContext = new DOMContext(opts.ref);
    this.#domTypeahead = new DOMTypeahead({
      getCurrentItem: () => this.root.highlightedNode,
      onMatch: (node) => {
        this.root.setHighlightedNode(node);
      },
      getActiveElement: () => this.root.domContext.getActiveElement(),
      getWindow: () => this.root.domContext.getWindow()
    });
    this.#dataTypeahead = new DataTypeahead({
      getCurrentItem: () => {
        if (this.root.isMulti) return "";
        return this.root.currentLabel;
      },
      onMatch: (label) => {
        if (this.root.isMulti) return;
        if (!this.root.opts.items.current) return;
        const matchedItem = this.root.opts.items.current.find((item) => item.label === label);
        if (!matchedItem) return;
        this.root.opts.value.current = matchedItem.value;
      },
      enabled: () => !this.root.isMulti && this.root.dataTypeaheadEnabled,
      candidateValues: () => this.root.isMulti ? [] : this.root.candidateLabels,
      getWindow: () => this.root.domContext.getWindow()
    });
    this.onkeydown = this.onkeydown.bind(this);
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointerup = this.onpointerup.bind(this);
    this.onclick = this.onclick.bind(this);
  }
  #handleOpen() {
    this.root.opts.open.current = true;
    this.#dataTypeahead.resetTypeahead();
    this.#domTypeahead.resetTypeahead();
  }
  #handlePointerOpen(_) {
    this.#handleOpen();
  }
  /**
   * Logic used to handle keyboard selection/deselection.
   *
   * If it returns true, it means the item was selected and whatever is calling
   * this function should return early
   *
   */
  #handleKeyboardSelection() {
    const isCurrentSelectedValue = this.root.highlightedValue === this.root.opts.value.current;
    if (!this.root.opts.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
      this.root.handleClose();
      return true;
    }
    if (this.root.highlightedValue !== null) {
      this.root.toggleItem(this.root.highlightedValue, this.root.highlightedLabel ?? void 0);
    }
    if (!this.root.isMulti && !isCurrentSelectedValue) {
      this.root.handleClose();
      return true;
    }
    return false;
  }
  onkeydown(e) {
    this.root.isUsingKeyboard = true;
    if (e.key === ARROW_UP || e.key === ARROW_DOWN) e.preventDefault();
    if (!this.root.opts.open.current) {
      if (e.key === ENTER || e.key === SPACE || e.key === ARROW_DOWN || e.key === ARROW_UP) {
        e.preventDefault();
        this.root.handleOpen();
      } else if (!this.root.isMulti && this.root.dataTypeaheadEnabled) {
        this.#dataTypeahead.handleTypeaheadSearch(e.key);
        return;
      }
      if (this.root.hasValue) return;
      const candidateNodes2 = this.root.getCandidateNodes();
      if (!candidateNodes2.length) return;
      if (e.key === ARROW_DOWN) {
        const firstCandidate = candidateNodes2[0];
        this.root.setHighlightedNode(firstCandidate);
      } else if (e.key === ARROW_UP) {
        const lastCandidate = candidateNodes2[candidateNodes2.length - 1];
        this.root.setHighlightedNode(lastCandidate);
      }
      return;
    }
    if (e.key === TAB) {
      this.root.handleClose();
      return;
    }
    if ((e.key === ENTER || // if we're currently "typing ahead", we don't want to select the item
    // just yet as the item the user is trying to get to may have a space in it,
    // so we defer handling the close for this case until further down
    e.key === SPACE && this.#domTypeahead.search === "") && !e.isComposing) {
      e.preventDefault();
      const shouldReturn = this.#handleKeyboardSelection();
      if (shouldReturn) return;
    }
    if (e.key === ARROW_UP && e.altKey) {
      this.root.handleClose();
    }
    if (FIRST_LAST_KEYS.includes(e.key)) {
      e.preventDefault();
      const candidateNodes2 = this.root.getCandidateNodes();
      const currHighlightedNode = this.root.highlightedNode;
      const currIndex = currHighlightedNode ? candidateNodes2.indexOf(currHighlightedNode) : -1;
      const loop = this.root.opts.loop.current;
      let nextItem;
      if (e.key === ARROW_DOWN) {
        nextItem = next(candidateNodes2, currIndex, loop);
      } else if (e.key === ARROW_UP) {
        nextItem = prev(candidateNodes2, currIndex, loop);
      } else if (e.key === PAGE_DOWN) {
        nextItem = forward(candidateNodes2, currIndex, 10, loop);
      } else if (e.key === PAGE_UP) {
        nextItem = backward(candidateNodes2, currIndex, 10, loop);
      } else if (e.key === HOME) {
        nextItem = candidateNodes2[0];
      } else if (e.key === END) {
        nextItem = candidateNodes2[candidateNodes2.length - 1];
      }
      if (!nextItem) return;
      this.root.setHighlightedNode(nextItem);
      return;
    }
    const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
    const isCharacterKey = e.key.length === 1;
    const isSpaceKey = e.key === SPACE;
    const candidateNodes = this.root.getCandidateNodes();
    if (e.key === TAB) return;
    if (!isModifierKey && (isCharacterKey || isSpaceKey)) {
      const matchedNode = this.#domTypeahead.handleTypeaheadSearch(e.key, candidateNodes);
      if (!matchedNode && isSpaceKey) {
        e.preventDefault();
        this.#handleKeyboardSelection();
      }
      return;
    }
    if (!this.root.highlightedNode) {
      this.root.setHighlightedToFirstCandidate();
    }
  }
  onclick(e) {
    const currTarget = e.currentTarget;
    currTarget.focus();
  }
  onpointerdown(e) {
    if (this.root.opts.disabled.current) return;
    if (e.pointerType === "touch") return e.preventDefault();
    const target = e.target;
    if (target?.hasPointerCapture(e.pointerId)) {
      target?.releasePointerCapture(e.pointerId);
    }
    if (e.button === 0 && e.ctrlKey === false) {
      if (this.root.opts.open.current === false) {
        this.#handlePointerOpen(e);
      } else {
        this.root.handleClose();
      }
    }
  }
  onpointerup(e) {
    if (this.root.opts.disabled.current) return;
    e.preventDefault();
    if (e.pointerType === "touch") {
      if (this.root.opts.open.current === false) {
        this.#handlePointerOpen(e);
      } else {
        this.root.handleClose();
      }
    }
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    disabled: this.root.opts.disabled.current ? true : void 0,
    "aria-haspopup": "listbox",
    "aria-expanded": boolToStr(this.root.opts.open.current),
    "aria-activedescendant": this.root.highlightedId,
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    "data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
    "data-placeholder": this.root.hasValue ? void 0 : "",
    [this.root.getBitsAttr("trigger")]: "",
    onpointerdown: this.onpointerdown,
    onkeydown: this.onkeydown,
    onclick: this.onclick,
    onpointerup: this.onpointerup,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SelectContentState {
  static create(opts) {
    return SelectContentContext.set(new SelectContentState(opts, SelectRootContext.get()));
  }
  opts;
  root;
  attachment;
  isPositioned = false;
  domContext;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(opts.ref, (v) => this.root.contentNode = v);
    this.domContext = new DOMContext(this.opts.ref);
    if (this.root.domContext === null) {
      this.root.domContext = this.domContext;
    }
    watch$1(() => this.root.opts.open.current, () => {
      if (this.root.opts.open.current) return;
      this.isPositioned = false;
    });
    this.onpointermove = this.onpointermove.bind(this);
  }
  onpointermove(_) {
    this.root.isUsingKeyboard = false;
  }
  #styles = derived(() => {
    return getFloatingContentCSSVars(this.root.isCombobox ? "combobox" : "select");
  });
  onInteractOutside = (e) => {
    if (e.target === this.root.triggerNode || e.target === this.root.inputNode) {
      e.preventDefault();
      return;
    }
    this.opts.onInteractOutside.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onEscapeKeydown = (e) => {
    this.opts.onEscapeKeydown.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onOpenAutoFocus = (e) => {
    e.preventDefault();
  };
  onCloseAutoFocus = (e) => {
    e.preventDefault();
  };
  get shouldRender() {
    return this.root.contentPresence.shouldRender;
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
    role: "listbox",
    "aria-multiselectable": this.root.isMulti ? "true" : void 0,
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    [this.root.getBitsAttr("content")]: "",
    style: {
      display: "flex",
      flexDirection: "column",
      outline: "none",
      boxSizing: "border-box",
      pointerEvents: "auto",
      ...this.#styles()
    },
    onpointermove: this.onpointermove,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  popperProps = {
    onInteractOutside: this.onInteractOutside,
    onEscapeKeydown: this.onEscapeKeydown,
    onOpenAutoFocus: this.onOpenAutoFocus,
    onCloseAutoFocus: this.onCloseAutoFocus,
    trapFocus: false,
    loop: false,
    onPlaced: () => {
      if (this.root.opts.open.current) {
        this.isPositioned = true;
      }
    }
  };
}
class SelectItemState {
  static create(opts) {
    return new SelectItemState(opts, SelectRootContext.get());
  }
  opts;
  root;
  attachment;
  #isSelected = derived(() => this.root.includesItem(this.opts.value.current));
  get isSelected() {
    return this.#isSelected();
  }
  set isSelected($$value) {
    return this.#isSelected($$value);
  }
  #isHighlighted = derived(() => this.root.highlightedValue === this.opts.value.current);
  get isHighlighted() {
    return this.#isHighlighted();
  }
  set isHighlighted($$value) {
    return this.#isHighlighted($$value);
  }
  prevHighlighted = new Previous(() => this.isHighlighted);
  mounted = false;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(opts.ref);
    watch$1([() => this.isHighlighted, () => this.prevHighlighted.current], () => {
      if (this.isHighlighted) {
        this.opts.onHighlight.current();
      } else if (this.prevHighlighted.current) {
        this.opts.onUnhighlight.current();
      }
    });
    watch$1(() => this.mounted, () => {
      if (!this.mounted) return;
      this.root.setInitialHighlightedNode();
    });
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointerup = this.onpointerup.bind(this);
    this.onpointermove = this.onpointermove.bind(this);
  }
  handleSelect() {
    if (this.opts.disabled.current) return;
    const isCurrentSelectedValue = this.opts.value.current === this.root.opts.value.current;
    if (!this.root.opts.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
      this.root.handleClose();
      return;
    }
    this.root.toggleItem(this.opts.value.current, this.opts.label.current);
    if (!this.root.isMulti && !isCurrentSelectedValue) {
      this.root.handleClose();
    }
  }
  #snippetProps = derived(() => ({ selected: this.isSelected, highlighted: this.isHighlighted }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  onpointerdown(e) {
    e.preventDefault();
  }
  /**
   * Using `pointerup` instead of `click` allows power users to pointerdown
   * the trigger, then release pointerup on an item to select it vs having to do
   * multiple clicks.
   */
  onpointerup(e) {
    if (e.defaultPrevented || !this.opts.ref.current) return;
    if (e.pointerType === "touch" && !isIOS) {
      on(
        this.opts.ref.current,
        "click",
        () => {
          this.handleSelect();
          this.root.setHighlightedNode(this.opts.ref.current);
        },
        { once: true }
      );
      return;
    }
    e.preventDefault();
    this.handleSelect();
    if (e.pointerType === "touch") {
      this.root.setHighlightedNode(this.opts.ref.current);
    }
  }
  onpointermove(e) {
    if (e.pointerType === "touch") return;
    if (this.root.highlightedNode !== this.opts.ref.current) {
      this.root.setHighlightedNode(this.opts.ref.current);
    }
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "option",
    "aria-selected": this.root.includesItem(this.opts.value.current) ? "true" : void 0,
    "data-value": this.opts.value.current,
    "data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
    "data-highlighted": this.root.highlightedValue === this.opts.value.current && !this.opts.disabled.current ? "" : void 0,
    "data-selected": this.root.includesItem(this.opts.value.current) ? "" : void 0,
    "data-label": this.opts.label.current,
    [this.root.getBitsAttr("item")]: "",
    onpointermove: this.onpointermove,
    onpointerdown: this.onpointerdown,
    onpointerup: this.onpointerup,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SelectGroupState {
  static create(opts) {
    return SelectGroupContext.set(new SelectGroupState(opts, SelectRootContext.get()));
  }
  opts;
  root;
  labelNode = null;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(opts.ref);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "group",
    [this.root.getBitsAttr("group")]: "",
    "aria-labelledby": this.labelNode?.id ?? void 0,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SelectHiddenInputState {
  static create(opts) {
    return new SelectHiddenInputState(opts, SelectRootContext.get());
  }
  opts;
  root;
  #shouldRender = derived(() => this.root.opts.name.current !== "");
  get shouldRender() {
    return this.#shouldRender();
  }
  set shouldRender($$value) {
    return this.#shouldRender($$value);
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.onfocus = this.onfocus.bind(this);
  }
  onfocus(e) {
    e.preventDefault();
    if (!this.root.isCombobox) {
      this.root.triggerNode?.focus();
    } else {
      this.root.inputNode?.focus();
    }
  }
  #props = derived(() => ({
    disabled: boolToTrueOrUndef(this.root.opts.disabled.current),
    required: boolToTrueOrUndef(this.root.opts.required.current),
    name: this.root.opts.name.current,
    value: this.opts.value.current,
    onfocus: this.onfocus
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SelectViewportState {
  static create(opts) {
    return new SelectViewportState(opts, SelectContentContext.get());
  }
  opts;
  content;
  root;
  attachment;
  prevScrollTop = 0;
  constructor(opts, content) {
    this.opts = opts;
    this.content = content;
    this.root = content.root;
    this.attachment = attachRef(opts.ref, (v) => {
      this.root.viewportNode = v;
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "presentation",
    [this.root.getBitsAttr("viewport")]: "",
    style: {
      // we use position: 'relative' here on the `viewport` so that when we call
      // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
      // (independent of the scrollUpButton).
      position: "relative",
      flex: 1,
      overflow: "auto"
    },
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SelectScrollButtonImplState {
  opts;
  content;
  root;
  attachment;
  autoScrollTimer = null;
  userScrollTimer = -1;
  isUserScrolling = false;
  onAutoScroll = noop$1;
  mounted = false;
  constructor(opts, content) {
    this.opts = opts;
    this.content = content;
    this.root = content.root;
    this.attachment = attachRef(opts.ref);
    watch$1([() => this.mounted], () => {
      if (!this.mounted) {
        this.isUserScrolling = false;
        return;
      }
      if (this.isUserScrolling) return;
    });
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointermove = this.onpointermove.bind(this);
    this.onpointerleave = this.onpointerleave.bind(this);
  }
  handleUserScroll() {
    this.content.domContext.clearTimeout(this.userScrollTimer);
    this.isUserScrolling = true;
    this.userScrollTimer = this.content.domContext.setTimeout(
      () => {
        this.isUserScrolling = false;
      },
      200
    );
  }
  clearAutoScrollInterval() {
    if (this.autoScrollTimer === null) return;
    this.content.domContext.clearTimeout(this.autoScrollTimer);
    this.autoScrollTimer = null;
  }
  onpointerdown(_) {
    if (this.autoScrollTimer !== null) return;
    const autoScroll = (tick) => {
      this.onAutoScroll();
      this.autoScrollTimer = this.content.domContext.setTimeout(() => autoScroll(tick + 1), this.opts.delay.current(tick));
    };
    this.autoScrollTimer = this.content.domContext.setTimeout(() => autoScroll(1), this.opts.delay.current(0));
  }
  onpointermove(e) {
    this.onpointerdown(e);
  }
  onpointerleave(_) {
    this.clearAutoScrollInterval();
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "aria-hidden": boolToStrTrueOrUndef(true),
    style: { flexShrink: 0 },
    onpointerdown: this.onpointerdown,
    onpointermove: this.onpointermove,
    onpointerleave: this.onpointerleave,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SelectScrollDownButtonState {
  static create(opts) {
    return new SelectScrollDownButtonState(new SelectScrollButtonImplState(opts, SelectContentContext.get()));
  }
  scrollButtonState;
  content;
  root;
  canScrollDown = false;
  scrollIntoViewTimer = null;
  constructor(scrollButtonState) {
    this.scrollButtonState = scrollButtonState;
    this.content = scrollButtonState.content;
    this.root = scrollButtonState.root;
    this.scrollButtonState.onAutoScroll = this.handleAutoScroll;
    watch$1(
      [
        () => this.root.viewportNode,
        () => this.content.isPositioned
      ],
      () => {
        if (!this.root.viewportNode || !this.content.isPositioned) return;
        this.handleScroll(true);
        return on(this.root.viewportNode, "scroll", () => this.handleScroll());
      }
    );
    watch$1(
      [
        () => this.root.opts.inputValue.current,
        () => this.root.viewportNode,
        () => this.content.isPositioned
      ],
      () => {
        if (!this.root.viewportNode || !this.content.isPositioned) return;
        this.handleScroll(true);
      }
    );
    watch$1(() => this.scrollButtonState.mounted, () => {
      if (!this.scrollButtonState.mounted) return;
      if (this.scrollIntoViewTimer) {
        clearTimeout(this.scrollIntoViewTimer);
      }
      this.scrollIntoViewTimer = afterSleep(5, () => {
        const activeItem = this.root.highlightedNode;
        activeItem?.scrollIntoView({ block: this.root.opts.scrollAlignment.current });
      });
    });
  }
  /**
   * @param manual - if true, it means the function was invoked manually outside of an event
   * listener, so we don't call `handleUserScroll` to prevent the auto scroll from kicking in.
   */
  handleScroll = (manual = false) => {
    if (!manual) {
      this.scrollButtonState.handleUserScroll();
    }
    if (!this.root.viewportNode) return;
    const maxScroll = this.root.viewportNode.scrollHeight - this.root.viewportNode.clientHeight;
    const paddingTop = Number.parseInt(getComputedStyle(this.root.viewportNode).paddingTop, 10);
    this.canScrollDown = Math.ceil(this.root.viewportNode.scrollTop) < maxScroll - paddingTop;
  };
  handleAutoScroll = () => {
    const viewport = this.root.viewportNode;
    const selectedItem = this.root.highlightedNode;
    if (!viewport || !selectedItem) return;
    viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
  };
  #props = derived(() => ({
    ...this.scrollButtonState.props,
    [this.root.getBitsAttr("scroll-down-button")]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SelectScrollUpButtonState {
  static create(opts) {
    return new SelectScrollUpButtonState(new SelectScrollButtonImplState(opts, SelectContentContext.get()));
  }
  scrollButtonState;
  content;
  root;
  canScrollUp = false;
  constructor(scrollButtonState) {
    this.scrollButtonState = scrollButtonState;
    this.content = scrollButtonState.content;
    this.root = scrollButtonState.root;
    this.scrollButtonState.onAutoScroll = this.handleAutoScroll;
    watch$1(
      [
        () => this.root.viewportNode,
        () => this.content.isPositioned
      ],
      () => {
        if (!this.root.viewportNode || !this.content.isPositioned) return;
        this.handleScroll(true);
        return on(this.root.viewportNode, "scroll", () => this.handleScroll());
      }
    );
  }
  /**
   * @param manual - if true, it means the function was invoked manually outside of an event
   * listener, so we don't call `handleUserScroll` to prevent the auto scroll from kicking in.
   */
  handleScroll = (manual = false) => {
    if (!manual) {
      this.scrollButtonState.handleUserScroll();
    }
    if (!this.root.viewportNode) return;
    const paddingTop = Number.parseInt(getComputedStyle(this.root.viewportNode).paddingTop, 10);
    this.canScrollUp = this.root.viewportNode.scrollTop - paddingTop > 0.1;
  };
  handleAutoScroll = () => {
    if (!this.root.viewportNode || !this.root.highlightedNode) return;
    this.root.viewportNode.scrollTop = this.root.viewportNode.scrollTop - this.root.highlightedNode.offsetHeight;
  };
  #props = derived(() => ({
    ...this.scrollButtonState.props,
    [this.root.getBitsAttr("scroll-up-button")]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
Select_hidden_input[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/select/components/select-hidden-input.svelte";
function Select_hidden_input($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { value = void 0, autocomplete } = $$props;
      const hiddenInputState = SelectHiddenInputState.create({ value: boxWith(() => value) });
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        if (hiddenInputState.shouldRender) {
          $$renderer3.push("<!--[-->");
          Hidden_input($$renderer3, spread_props([
            hiddenInputState.props,
            {
              autocomplete,
              get value() {
                return value;
              },
              set value($$value) {
                value = $$value;
                $$settled = false;
              }
            }
          ]));
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { value });
    },
    Select_hidden_input
  );
}
Select_hidden_input.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_content$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/select/components/select-content.svelte";
function Select_content$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        forceMount = false,
        side = "bottom",
        onInteractOutside = noop$1,
        onEscapeKeydown = noop$1,
        children,
        child,
        preventScroll = false,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const contentState = SelectContentState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        onInteractOutside: boxWith(() => onInteractOutside),
        onEscapeKeydown: boxWith(() => onEscapeKeydown)
      });
      const mergedProps = mergeProps(restProps, contentState.props);
      if (forceMount) {
        $$renderer2.push("<!--[-->");
        {
          let popper = function($$renderer3, { props, wrapperProps }) {
            validate_snippet_args($$renderer3);
            const finalProps = mergeProps(props, { style: contentState.props.style });
            if (child) {
              $$renderer3.push("<!--[-->");
              child($$renderer3, {
                props: finalProps,
                wrapperProps,
                ...contentState.snippetProps
              });
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<div${attributes({ ...wrapperProps })}>`);
              push_element($$renderer3, "div", 55, 4);
              $$renderer3.push(`<div${attributes({ ...finalProps })}>`);
              push_element($$renderer3, "div", 56, 5);
              children?.($$renderer3);
              $$renderer3.push(`<!----></div>`);
              pop_element();
              $$renderer3.push(`</div>`);
              pop_element();
            }
            $$renderer3.push(`<!--]-->`);
          };
          prevent_snippet_stringification(popper);
          Popper_layer_force_mount($$renderer2, spread_props([
            mergedProps,
            contentState.popperProps,
            {
              ref: contentState.opts.ref,
              side,
              enabled: contentState.root.opts.open.current,
              id,
              preventScroll,
              forceMount: true,
              shouldRender: contentState.shouldRender,
              popper,
              $$slots: { popper: true }
            }
          ]));
        }
      } else {
        $$renderer2.push("<!--[!-->");
        if (!forceMount) {
          $$renderer2.push("<!--[-->");
          {
            let popper = function($$renderer3, { props, wrapperProps }) {
              validate_snippet_args($$renderer3);
              const finalProps = mergeProps(props, { style: contentState.props.style });
              if (child) {
                $$renderer3.push("<!--[-->");
                child($$renderer3, {
                  props: finalProps,
                  wrapperProps,
                  ...contentState.snippetProps
                });
                $$renderer3.push(`<!---->`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`<div${attributes({ ...wrapperProps })}>`);
                push_element($$renderer3, "div", 80, 4);
                $$renderer3.push(`<div${attributes({ ...finalProps })}>`);
                push_element($$renderer3, "div", 81, 5);
                children?.($$renderer3);
                $$renderer3.push(`<!----></div>`);
                pop_element();
                $$renderer3.push(`</div>`);
                pop_element();
              }
              $$renderer3.push(`<!--]-->`);
            };
            prevent_snippet_stringification(popper);
            Popper_layer($$renderer2, spread_props([
              mergedProps,
              contentState.popperProps,
              {
                ref: contentState.opts.ref,
                side,
                open: contentState.root.opts.open.current,
                id,
                preventScroll,
                forceMount: false,
                shouldRender: contentState.shouldRender,
                popper,
                $$slots: { popper: true }
              }
            ]));
          }
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Select_content$1
  );
}
Select_content$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Mounted[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/utilities/mounted.svelte";
function Mounted($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { mounted = false, onMountedChange = noop$1 } = $$props;
      bind_props($$props, { mounted });
    },
    Mounted
  );
}
Mounted.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_item$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/select/components/select-item.svelte";
function Select_item$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        value,
        label = value,
        disabled = false,
        children,
        child,
        onHighlight = noop$1,
        onUnhighlight = noop$1,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const itemState = SelectItemState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        value: boxWith(() => value),
        disabled: boxWith(() => disabled),
        label: boxWith(() => label),
        onHighlight: boxWith(() => onHighlight),
        onUnhighlight: boxWith(() => onUnhighlight)
      });
      const mergedProps = mergeProps(restProps, itemState.props);
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        if (child) {
          $$renderer3.push("<!--[-->");
          child($$renderer3, { props: mergedProps, ...itemState.snippetProps });
          $$renderer3.push(`<!---->`);
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<div${attributes({ ...mergedProps })}>`);
          push_element($$renderer3, "div", 43, 1);
          children?.($$renderer3, itemState.snippetProps);
          $$renderer3.push(`<!----></div>`);
          pop_element();
        }
        $$renderer3.push(`<!--]--> `);
        Mounted($$renderer3, {
          get mounted() {
            return itemState.mounted;
          },
          set mounted($$value) {
            itemState.mounted = $$value;
            $$settled = false;
          }
        });
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
    Select_item$1
  );
}
Select_item$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_group$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/select/components/select-group.svelte";
function Select_group$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        children,
        child,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const groupState = SelectGroupState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v)
      });
      const mergedProps = mergeProps(restProps, groupState.props);
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
    Select_group$1
  );
}
Select_group$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_viewport[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/select/components/select-viewport.svelte";
function Select_viewport($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        children,
        child,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const viewportState = SelectViewportState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v)
      });
      const mergedProps = mergeProps(restProps, viewportState.props);
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
    Select_viewport
  );
}
Select_viewport.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_scroll_down_button$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/select/components/select-scroll-down-button.svelte";
function Select_scroll_down_button$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        delay = () => 50,
        child,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const scrollButtonState = SelectScrollDownButtonState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        delay: boxWith(() => delay)
      });
      const mergedProps = mergeProps(restProps, scrollButtonState.props);
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        if (scrollButtonState.canScrollDown) {
          $$renderer3.push("<!--[-->");
          Mounted($$renderer3, {
            get mounted() {
              return scrollButtonState.scrollButtonState.mounted;
            },
            set mounted($$value) {
              scrollButtonState.scrollButtonState.mounted = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----> `);
          if (child) {
            $$renderer3.push("<!--[-->");
            child($$renderer3, { props: restProps });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<div${attributes({ ...mergedProps })}>`);
            push_element($$renderer3, "div", 36, 2);
            children?.($$renderer3);
            $$renderer3.push(`<!----></div>`);
            pop_element();
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Select_scroll_down_button$1
  );
}
Select_scroll_down_button$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_scroll_up_button$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/select/components/select-scroll-up-button.svelte";
function Select_scroll_up_button$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        delay = () => 50,
        child,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const scrollButtonState = SelectScrollUpButtonState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        delay: boxWith(() => delay)
      });
      const mergedProps = mergeProps(restProps, scrollButtonState.props);
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        if (scrollButtonState.canScrollUp) {
          $$renderer3.push("<!--[-->");
          Mounted($$renderer3, {
            get mounted() {
              return scrollButtonState.scrollButtonState.mounted;
            },
            set mounted($$value) {
              scrollButtonState.scrollButtonState.mounted = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----> `);
          if (child) {
            $$renderer3.push("<!--[-->");
            child($$renderer3, { props: restProps });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<div${attributes({ ...mergedProps })}>`);
            push_element($$renderer3, "div", 36, 2);
            children?.($$renderer3);
            $$renderer3.push(`<!----></div>`);
            pop_element();
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Select_scroll_up_button$1
  );
}
Select_scroll_up_button$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/select/components/select.svelte";
function Select$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        value = void 0,
        onValueChange = noop$1,
        name = "",
        disabled = false,
        type,
        open = false,
        onOpenChange = noop$1,
        onOpenChangeComplete = noop$1,
        loop = false,
        scrollAlignment = "nearest",
        required = false,
        items = [],
        allowDeselect = false,
        autocomplete,
        children
      } = $$props;
      function handleDefaultValue() {
        if (value !== void 0) return;
        value = type === "single" ? "" : [];
      }
      handleDefaultValue();
      watch$1.pre(() => value, () => {
        handleDefaultValue();
      });
      let inputValue = "";
      const rootState = SelectRootState.create({
        type,
        value: boxWith(() => value, (v) => {
          value = v;
          onValueChange(v);
        }),
        disabled: boxWith(() => disabled),
        required: boxWith(() => required),
        open: boxWith(() => open, (v) => {
          open = v;
          onOpenChange(v);
        }),
        loop: boxWith(() => loop),
        scrollAlignment: boxWith(() => scrollAlignment),
        name: boxWith(() => name),
        isCombobox: false,
        items: boxWith(() => items),
        allowDeselect: boxWith(() => allowDeselect),
        inputValue: boxWith(() => inputValue, (v) => inputValue = v),
        onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
      });
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Floating_layer($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            children?.($$renderer4);
            $$renderer4.push(`<!---->`);
          })
        });
        $$renderer3.push(`<!----> `);
        if (Array.isArray(rootState.opts.value.current)) {
          $$renderer3.push("<!--[-->");
          if (rootState.opts.value.current.length === 0) {
            $$renderer3.push("<!--[-->");
            Select_hidden_input($$renderer3, { autocomplete });
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<!--[-->`);
            const each_array = ensure_array_like(rootState.opts.value.current);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let item = each_array[$$index];
              Select_hidden_input($$renderer3, { value: item, autocomplete });
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[!-->");
          Select_hidden_input($$renderer3, {
            autocomplete,
            get value() {
              return rootState.opts.value.current;
            },
            set value($$value) {
              rootState.opts.value.current = $$value;
              $$settled = false;
            }
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { value, open });
    },
    Select$1
  );
}
Select$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_trigger$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/select/components/select-trigger.svelte";
function Select_trigger$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        child,
        children,
        type = "button",
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const triggerState = SelectTriggerState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v)
      });
      const mergedProps = mergeProps(restProps, triggerState.props, { type });
      $$renderer2.push(`<!---->`);
      Floating_layer_anchor($$renderer2, {
        id,
        ref: triggerState.opts.ref,
        children: prevent_snippet_stringification(($$renderer3) => {
          if (child) {
            $$renderer3.push("<!--[-->");
            child($$renderer3, { props: mergedProps });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<button${attributes({ ...mergedProps })}>`);
            push_element($$renderer3, "button", 34, 2);
            children?.($$renderer3);
            $$renderer3.push(`<!----></button>`);
            pop_element();
          }
          $$renderer3.push(`<!--]-->`);
        })
      });
      $$renderer2.push(`<!---->`);
      bind_props($$props, { ref });
    },
    Select_trigger$1
  );
}
Select_trigger$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select[FILENAME] = "src/lib/components/ui/select/select.svelte";
function Select($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        open = false,
        value = void 0,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Select$1($$renderer3, spread_props([
          restProps,
          {
            get open() {
              return open;
            },
            set open($$value) {
              open = $$value;
              $$settled = false;
            },
            get value() {
              return value;
            },
            set value($$value) {
              value = $$value;
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
      bind_props($$props, { open, value });
    },
    Select
  );
}
Select.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_group[FILENAME] = "src/lib/components/ui/select/select-group.svelte";
function Select_group($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { ref = null, $$slots, $$events, ...restProps } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Select_group$1($$renderer3, spread_props([
          { "data-slot": "select-group" },
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
    Select_group
  );
}
Select_group.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_item[FILENAME] = "src/lib/components/ui/select/select-item.svelte";
function Select_item($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        value,
        label,
        children: childrenProp,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        {
          let children = function($$renderer4, { selected, highlighted }) {
            validate_snippet_args($$renderer4);
            $$renderer4.push(`<span class="absolute end-2 flex size-3.5 items-center justify-center">`);
            push_element($$renderer4, "span", 27, 2);
            if (selected) {
              $$renderer4.push("<!--[-->");
              Check($$renderer4, { class: "size-4" });
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></span>`);
            pop_element();
            $$renderer4.push(` `);
            if (childrenProp) {
              $$renderer4.push("<!--[-->");
              childrenProp($$renderer4, { selected, highlighted });
              $$renderer4.push(`<!---->`);
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`${escape_html(label || value)}`);
            }
            $$renderer4.push(`<!--]-->`);
          };
          prevent_snippet_stringification(children);
          Select_item$1($$renderer3, spread_props([
            {
              value,
              "data-slot": "select-item",
              class: cn("data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className)
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
              children,
              $$slots: { default: true }
            }
          ]));
        }
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
    Select_item
  );
}
Select_item.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_portal[FILENAME] = "src/lib/components/ui/select/select-portal.svelte";
function Select_portal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...restProps } = $$props;
      $$renderer2.push(`<!---->`);
      Portal($$renderer2, spread_props([restProps]));
      $$renderer2.push(`<!---->`);
    },
    Select_portal
  );
}
Select_portal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_scroll_up_button[FILENAME] = "src/lib/components/ui/select/select-scroll-up-button.svelte";
function Select_scroll_up_button($$renderer, $$props) {
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
        Select_scroll_up_button$1($$renderer3, spread_props([
          {
            "data-slot": "select-scroll-up-button",
            class: cn("flex cursor-default items-center justify-center py-1", className)
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
            children: prevent_snippet_stringification(($$renderer4) => {
              Chevron_up($$renderer4, { class: "size-4" });
            }),
            $$slots: { default: true }
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
    Select_scroll_up_button
  );
}
Select_scroll_up_button.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_scroll_down_button[FILENAME] = "src/lib/components/ui/select/select-scroll-down-button.svelte";
function Select_scroll_down_button($$renderer, $$props) {
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
        Select_scroll_down_button$1($$renderer3, spread_props([
          {
            "data-slot": "select-scroll-down-button",
            class: cn("flex cursor-default items-center justify-center py-1", className)
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
            children: prevent_snippet_stringification(($$renderer4) => {
              Chevron_down($$renderer4, { class: "size-4" });
            }),
            $$slots: { default: true }
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
    Select_scroll_down_button
  );
}
Select_scroll_down_button.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_content[FILENAME] = "src/lib/components/ui/select/select-content.svelte";
function Select_content($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        sideOffset = 4,
        portalProps,
        children,
        preventScroll = true,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Select_portal($$renderer3, spread_props([
          portalProps,
          {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Select_content$1($$renderer4, spread_props([
                {
                  sideOffset,
                  preventScroll,
                  "data-slot": "select-content",
                  class: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--bits-select-content-available-height) min-w-[8rem] origin-(--bits-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className)
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
                    Select_scroll_up_button($$renderer5, {});
                    $$renderer5.push(`<!----> <!---->`);
                    Select_viewport($$renderer5, {
                      class: cn("h-(--bits-select-anchor-height) w-full min-w-(--bits-select-anchor-width) scroll-my-1 p-1"),
                      children: prevent_snippet_stringification(($$renderer6) => {
                        children?.($$renderer6);
                        $$renderer6.push(`<!---->`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> `);
                    Select_scroll_down_button($$renderer5, {});
                    $$renderer5.push(`<!---->`);
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
    Select_content
  );
}
Select_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_trigger[FILENAME] = "src/lib/components/ui/select/select-trigger.svelte";
function Select_trigger($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        children,
        size = "default",
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Select_trigger$1($$renderer3, spread_props([
          {
            "data-slot": "select-trigger",
            "data-size": size,
            class: cn("border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none select-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
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
            children: prevent_snippet_stringification(($$renderer4) => {
              children?.($$renderer4);
              $$renderer4.push(`<!----> `);
              Chevron_down($$renderer4, { class: "size-4 opacity-50" });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
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
    Select_trigger
  );
}
Select_trigger.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Select_component[FILENAME] = "src/routes/(protected)/users/components/select-component.svelte";
function Select_component($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        options = [],
        value = "",
        placeholder,
        class: className,
        name,
        disabled = false,
        onValueChange
      } = $$props;
      const triggerContent = options.find((f) => f.value === value)?.label ?? placeholder;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Select($$renderer3, {
          type: "single",
          name,
          disabled,
          onValueChange,
          get value() {
            return value;
          },
          set value($$value) {
            value = $$value;
            $$settled = false;
          },
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->`);
            Select_trigger($$renderer4, {
              class: cn("w-[180px]", className),
              "aria-label": name,
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<!---->${escape_html(triggerContent)}`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> <!---->`);
            Select_content($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                $$renderer5.push(`<!---->`);
                Select_group($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!--[-->`);
                    const each_array = ensure_array_like(options);
                    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                      let option = each_array[$$index];
                      $$renderer6.push(`<!---->`);
                      Select_item($$renderer6, {
                        value: option.value,
                        label: option.label,
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->${escape_html(option.label)}`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!---->`);
                    }
                    $$renderer6.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { value });
    },
    Select_component
  );
}
Select_component.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
DeleteDialog[FILENAME] = "src/routes/(protected)/users/components/DeleteDialog.svelte";
function DeleteDialog($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { user, open, onOpenChange } = $$props;
      const me = page.data.user;
      let isLoading = false;
      const handleDelete = async () => {
        isLoading = true;
        try {
          const url = `/api/users/${user.id}`;
          const options = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ me, data: null })
          };
          const response = await fetch(url, options);
          const { status, message } = await response.json();
          if (status === "error") throw new Error(message);
          toast.success("Success Alert", { description: `Successfully deleted ${user.name}` });
          location.reload();
        } catch (err) {
          console.error("Failed to delete user:", err);
          toast.error("Error Alert", { description: err.message || "Failed to delete user" });
        } finally {
          isLoading = false;
        }
      };
      const handleOpenChange = (newOpen) => {
        if (!isLoading) onOpenChange(newOpen);
      };
      Dialog($$renderer2, {
        open,
        onOpenChange: handleOpenChange,
        children: prevent_snippet_stringification(($$renderer3) => {
          Dialog_content($$renderer3, {
            class: "sm:max-w-md",
            children: prevent_snippet_stringification(($$renderer4) => {
              Dialog_header($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  Dialog_title($$renderer5, {
                    class: "flex items-center gap-2 text-red-600",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Triangle_alert($$renderer6, { class: "h-5 w-5" });
                      $$renderer6.push(`<!---->Delete User`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Dialog_description($$renderer5, {
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->This action cannot be undone. This will permanently delete the user.`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> <div class="space-y-2 rounded-lg border bg-gray-50 p-4 dark:bg-secondary">`);
              push_element($$renderer4, "div", 54, 4);
              $$renderer4.push(`<div class="flex items-center justify-between">`);
              push_element($$renderer4, "div", 55, 6);
              $$renderer4.push(`<span class="text-sm font-medium">`);
              push_element($$renderer4, "span", 55, 53);
              $$renderer4.push(`Name:</span>`);
              pop_element();
              $$renderer4.push(`<span class="text-sm">`);
              push_element($$renderer4, "span", 55, 99);
              $$renderer4.push(`${escape_html(user.name)}</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-center justify-between">`);
              push_element($$renderer4, "div", 56, 6);
              $$renderer4.push(`<span class="text-sm font-medium">`);
              push_element($$renderer4, "span", 56, 53);
              $$renderer4.push(`Role:</span>`);
              pop_element();
              $$renderer4.push(`<span class="text-sm capitalize">`);
              push_element($$renderer4, "span", 56, 99);
              $$renderer4.push(`${escape_html(user.role)}</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` `);
              Dialog_footer($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  Button($$renderer5, {
                    type: "button",
                    variant: "outline",
                    class: "cursor-pointer",
                    onclick: () => handleOpenChange(false),
                    disabled: isLoading,
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->Cancel`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  if (isLoading) {
                    $$renderer5.push("<!--[-->");
                    Button($$renderer5, {
                      disabled: isLoading,
                      children: prevent_snippet_stringification(($$renderer6) => {
                        Loading_spinner($$renderer6, { class: "text-white" });
                        $$renderer6.push(`<!----><span>`);
                        push_element($$renderer6, "span", 61, 74);
                        $$renderer6.push(`Deleting...</span>`);
                        pop_element();
                      }),
                      $$slots: { default: true }
                    });
                  } else {
                    $$renderer5.push("<!--[!-->");
                    Button($$renderer5, {
                      type: "button",
                      variant: "destructive",
                      onclick: handleDelete,
                      disabled: isLoading,
                      class: "cursor-pointer",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->Delete User`);
                      }),
                      $$slots: { default: true }
                    });
                  }
                  $$renderer5.push(`<!--]-->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
    },
    DeleteDialog
  );
}
DeleteDialog.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table[FILENAME] = "src/lib/components/ui/table/table.svelte";
function Table($$renderer, $$props) {
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
      $$renderer2.push(`<div data-slot="table-container" class="relative w-full overflow-x-auto">`);
      push_element($$renderer2, "div", 13, 0);
      $$renderer2.push(`<table${attributes({
        "data-slot": "table",
        class: clsx(cn("w-full caption-bottom text-sm", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "table", 14, 1);
      children?.($$renderer2);
      $$renderer2.push(`<!----></table>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table
  );
}
Table.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table_body[FILENAME] = "src/lib/components/ui/table/table-body.svelte";
function Table_body($$renderer, $$props) {
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
      $$renderer2.push(`<tbody${attributes({
        "data-slot": "table-body",
        class: clsx(cn("[&_tr:last-child]:border-0", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "tbody", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></tbody>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table_body
  );
}
Table_body.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table_cell[FILENAME] = "src/lib/components/ui/table/table-cell.svelte";
function Table_cell($$renderer, $$props) {
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
      $$renderer2.push(`<td${attributes({
        "data-slot": "table-cell",
        class: clsx(cn("bg-clip-padding p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "td", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></td>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table_cell
  );
}
Table_cell.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table_head[FILENAME] = "src/lib/components/ui/table/table-head.svelte";
function Table_head($$renderer, $$props) {
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
      $$renderer2.push(`<th${attributes({
        "data-slot": "table-head",
        class: clsx(cn("text-foreground h-10 bg-clip-padding px-2 text-start align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pe-0", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "th", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></th>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table_head
  );
}
Table_head.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table_header[FILENAME] = "src/lib/components/ui/table/table-header.svelte";
function Table_header($$renderer, $$props) {
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
      $$renderer2.push(`<thead${attributes({
        "data-slot": "table-header",
        class: clsx(cn("[&_tr]:border-b", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "thead", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></thead>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table_header
  );
}
Table_header.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Table_row[FILENAME] = "src/lib/components/ui/table/table-row.svelte";
function Table_row($$renderer, $$props) {
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
      $$renderer2.push(`<tr${attributes({
        "data-slot": "table-row",
        class: clsx(cn("hover:[&,&>svelte-css-wrapper]:[&>th,td]:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "tr", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></tr>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Table_row
  );
}
Table_row.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Identity[FILENAME] = "src/lib/authentication/ui/user/Identity.svelte";
function Identity($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { user, class: className, direction = "left" } = $$props;
      if (user) {
        $$renderer2.push("<!--[-->");
        if (direction === "left") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div${attr_class(clsx(cn("flex items-center gap-2 px-1 py-1.5 text-left text-sm", className)))}>`);
          push_element($$renderer2, "div", 10, 2);
          $$renderer2.push(`<!---->`);
          Avatar($$renderer2, {
            class: "size-8 rounded-lg",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->`);
              Avatar_image($$renderer3, { src: user?.image, alt: user?.name });
              $$renderer3.push(`<!----> <!---->`);
              Avatar_fallback($$renderer3, {
                class: "rounded-lg uppercase",
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(user?.name?.slice(0, 2))}`);
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!----> <div class="grid flex-1 text-left text-sm leading-tight">`);
          push_element($$renderer2, "div", 15, 3);
          $$renderer2.push(`<span class="truncate font-medium">`);
          push_element($$renderer2, "span", 16, 4);
          $$renderer2.push(`${escape_html(user?.name)}</span>`);
          pop_element();
          $$renderer2.push(` <span class="truncate text-xs text-muted-foreground">`);
          push_element($$renderer2, "span", 17, 4);
          $$renderer2.push(`${escape_html(user?.email)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (direction === "right") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div${attr_class(clsx(cn("flex items-center justify-end gap-2 px-1 py-1.5 text-sm", className)))}>`);
          push_element($$renderer2, "div", 22, 2);
          $$renderer2.push(`<div class="grid flex-1 text-right text-sm leading-tight">`);
          push_element($$renderer2, "div", 23, 3);
          $$renderer2.push(`<span class="truncate font-medium">`);
          push_element($$renderer2, "span", 24, 4);
          $$renderer2.push(`${escape_html(user?.name)}</span>`);
          pop_element();
          $$renderer2.push(` <span class="truncate text-xs text-muted-foreground">`);
          push_element($$renderer2, "span", 25, 4);
          $$renderer2.push(`${escape_html(user?.email)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <!---->`);
          Avatar($$renderer2, {
            class: "size-8 rounded-lg",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->`);
              Avatar_image($$renderer3, { src: user?.image, alt: user?.name });
              $$renderer3.push(`<!----> <!---->`);
              Avatar_fallback($$renderer3, {
                class: "rounded-lg uppercase",
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(user?.name?.slice(0, 2))}`);
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!----></div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    Identity
  );
}
Identity.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ListCard[FILENAME] = "src/routes/(protected)/users/components/ListCard.svelte";
function ListCard($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { user, i, onDelete, screen } = $$props;
      let updating = null;
      const me = page.data.user;
      const isAdmin = adminRoles.includes(me.role);
      const num = i + 1;
      const roleVariant = getRoleBadgeVariant(user?.role);
      const updateUserRole = async (profile, newRole) => {
        if (!adminRoles.includes(me.role)) {
          toast.error("Access Denied", { description: "Only administrators can change user roles." });
          return;
        }
        updating = profile.id;
        try {
          const canChangeRole = await admin.hasPermission({ permissions: { user: ["set-role"] } });
          if (!canChangeRole.data?.success) throw new Error("Forbidden");
          await admin.setRole({ userId: profile.id, role: newRole });
          toast.success("Success", { description: "User role updated successfully." });
          location.reload();
        } catch (error) {
          console.error("Error updating user role:", error);
          toast.error("Error", { description: "Failed to update user role. Please try again." });
        } finally {
          updating = null;
        }
      };
      const onValueChange = async (profile, val) => {
        await updateUserRole(profile, val);
      };
      if (screen === "desktop") {
        $$renderer2.push("<!--[-->");
        Table_row($$renderer2, {
          class: "cursor-pointer hover:bg-muted/50",
          children: prevent_snippet_stringification(($$renderer3) => {
            Table_cell($$renderer3, {
              class: "font-medium",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(num)}.`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Table_cell($$renderer3, {
              class: "font-medium",
              children: prevent_snippet_stringification(($$renderer4) => {
                Identity($$renderer4, { user });
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Table_cell($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Badge($$renderer4, {
                  variant: roleVariant,
                  class: "capitalize",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(user.role)}`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Table_cell($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(format(new Date(user.createdAt), "MMM dd, yyyy"))}`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Table_cell($$renderer3, {
              class: "flex h-full items-center justify-end gap-2 text-right",
              children: prevent_snippet_stringification(($$renderer4) => {
                if (isAdmin && me.id !== user?.id) {
                  $$renderer4.push("<!--[-->");
                  Select_component($$renderer4, {
                    disabled: updating === user.id,
                    value: user.role,
                    options: roles,
                    class: "h-full w-32 flex-1",
                    name: "role",
                    onValueChange: (val) => onValueChange(user, val),
                    placeholder: "Select role"
                  });
                  $$renderer4.push(`<!----> `);
                  Button($$renderer4, {
                    disabled: updating === user.id,
                    variant: "ghost",
                    size: "sm",
                    onclick: (e) => {
                      e.stopPropagation();
                      onDelete(user);
                    },
                    class: "h-8 w-8 cursor-pointer p-0 text-red-600 hover:bg-red-50 hover:text-red-700",
                    children: prevent_snippet_stringification(($$renderer5) => {
                      Trash_2($$renderer5, { class: "h-4 w-4" });
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer4.push(`<!---->`);
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`<span class="text-sm text-muted-foreground">`);
                  push_element($$renderer4, "span", 67, 8);
                  $$renderer4.push(`${escape_html(me.id === user?.id ? "You" : "No access")}</span>`);
                  pop_element();
                }
                $$renderer4.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="rounded-lg border bg-white shadow-sm dark:bg-secondary/50">`);
        push_element($$renderer2, "div", 72, 2);
        $$renderer2.push(`<div class="border-b p-3">`);
        push_element($$renderer2, "div", 73, 4);
        $$renderer2.push(`<div class="flex items-start justify-between gap-2">`);
        push_element($$renderer2, "div", 74, 6);
        $$renderer2.push(`<div class="min-w-0 flex-1">`);
        push_element($$renderer2, "div", 75, 8);
        Identity($$renderer2, { user, class: "px-0" });
        $$renderer2.push(`<!----> <div class="mt-1 flex flex-wrap items-center gap-1.5">`);
        push_element($$renderer2, "div", 77, 10);
        Badge($$renderer2, {
          class: "text-xs",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(num)}`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        Badge($$renderer2, {
          variant: roleVariant,
          class: "text-xs capitalize",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(user.role)}`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-2 p-3">`);
        push_element($$renderer2, "div", 84, 4);
        $$renderer2.push(`<div class="flex items-center justify-between text-xs">`);
        push_element($$renderer2, "div", 85, 6);
        $$renderer2.push(`<span class="text-muted-foreground">`);
        push_element($$renderer2, "span", 86, 8);
        $$renderer2.push(`Created ${escape_html(format(new Date(user.createdAt), "MMM dd, yyyy"))}</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center justify-between border-t bg-muted/30 px-3 py-2">`);
        push_element($$renderer2, "div", 89, 4);
        if (isAdmin && me.id !== user?.id) {
          $$renderer2.push("<!--[-->");
          Select_component($$renderer2, {
            disabled: updating === user.id,
            value: user.role,
            options: roles,
            class: "h-8 flex-1 text-xs",
            name: "role",
            onValueChange: (val) => onValueChange(user, val),
            placeholder: "Select role"
          });
          $$renderer2.push(`<!----> `);
          Button($$renderer2, {
            disabled: updating === user.id,
            variant: "outline",
            size: "sm",
            onclick: () => onDelete(user),
            class: "ml-1.5 size-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700",
            children: prevent_snippet_stringification(($$renderer3) => {
              Trash_2($$renderer3, { class: "size-3.5" });
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<span class="text-xs text-muted-foreground">`);
          push_element($$renderer2, "span", 94, 8);
          $$renderer2.push(`${escape_html(me.id === user?.id ? "You" : "No access")}</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
    },
    ListCard
  );
}
ListCard.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const defaultWindow = void 0;
function getActiveElement(document) {
  let activeElement = document.activeElement;
  while (activeElement?.shadowRoot) {
    const node = activeElement.shadowRoot.activeElement;
    if (node === activeElement)
      break;
    else
      activeElement = node;
  }
  return activeElement;
}
class ActiveElement {
  #document;
  #subscribe;
  constructor(options = {}) {
    const { window = defaultWindow, document = window?.document } = options;
    if (window === void 0) return;
    this.#document = document;
    this.#subscribe = createSubscriber();
  }
  get current() {
    this.#subscribe?.();
    if (!this.#document) return null;
    return getActiveElement(this.#document);
  }
}
new ActiveElement();
function noop() {
}
function useDebounce(callback, wait = 250) {
  let context = null;
  function debounced(...args) {
    if (context) {
      if (context.timeout) {
        clearTimeout(context.timeout);
      }
    } else {
      let resolve;
      let reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      context = { timeout: null, runner: null, promise, resolve, reject };
    }
    context.runner = async () => {
      if (!context) return;
      const ctx = context;
      context = null;
      try {
        ctx.resolve(await callback.apply(this, args));
      } catch (error) {
        ctx.reject(error);
      }
    };
    context.timeout = setTimeout(context.runner, typeof wait === "function" ? wait() : wait);
    return context.promise;
  }
  debounced.cancel = async () => {
    if (!context || context.timeout === null) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!context || context.timeout === null) return;
    }
    clearTimeout(context.timeout);
    context.reject("Cancelled");
    context = null;
  };
  debounced.runScheduledNow = async () => {
    if (!context || !context.timeout) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!context || !context.timeout) return;
    }
    clearTimeout(context.timeout);
    context.timeout = null;
    await context.runner?.();
  };
  Object.defineProperty(debounced, "pending", {
    enumerable: true,
    get() {
      return !!context?.timeout;
    }
  });
  return debounced;
}
function runWatcher(sources, flush, effect, options = {}) {
  const { lazy = false } = options;
}
function watch(sources, effect, options) {
  runWatcher(sources, "post", effect, options);
}
function watchPre(sources, effect, options) {
  runWatcher(sources, "pre", effect, options);
}
watch.pre = watchPre;
class Debounced {
  #current;
  #debounceFn;
  /**
   * @param getter A function that returns the state to watch.
   * @param wait The length of time to wait in ms, defaults to 250.
   */
  constructor(getter, wait = 250) {
    this.#current = getter();
    this.cancel = this.cancel.bind(this);
    this.setImmediately = this.setImmediately.bind(this);
    this.updateImmediately = this.updateImmediately.bind(this);
    this.#debounceFn = useDebounce(
      () => {
        this.#current = getter();
      },
      wait
    );
    watch(getter, () => {
      this.#debounceFn().catch(noop);
    });
  }
  /**
   * Get the current value.
   */
  get current() {
    return this.#current;
  }
  /**
   * Cancel the latest timer.
   */
  cancel() {
    this.#debounceFn.cancel();
  }
  /**
   * Run the debounced function immediately.
   */
  updateImmediately() {
    return this.#debounceFn.runScheduledNow();
  }
  /**
   * Set the `current` value without waiting.
   */
  setImmediately(v) {
    this.cancel();
    this.#current = v;
  }
}
Alert[FILENAME] = "src/lib/components/ui/alert/alert.svelte";
const alertVariants = tv({
  base: "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  variants: {
    variant: {
      default: "bg-card text-card-foreground",
      destructive: "text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current"
    }
  },
  defaultVariants: { variant: "default" }
});
function Alert($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        variant = "default",
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<div${attributes({
        "data-slot": "alert",
        class: clsx(cn(alertVariants({ variant }), className)),
        ...restProps,
        role: "alert"
      })}>`);
      push_element($$renderer2, "div", 36, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Alert
  );
}
Alert.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Alert_description[FILENAME] = "src/lib/components/ui/alert/alert-description.svelte";
function Alert_description($$renderer, $$props) {
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
        "data-slot": "alert-description",
        class: clsx(cn("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Alert_description
  );
}
Alert_description.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Alert_title[FILENAME] = "src/lib/components/ui/alert/alert-title.svelte";
function Alert_title($$renderer, $$props) {
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
        "data-slot": "alert-title",
        class: clsx(cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "div", 13, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      bind_props($$props, { ref });
    },
    Alert_title
  );
}
Alert_title.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(protected)/users/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let deletingUser = null;
      const onDelete = async (user) => deletingUser = user;
      let handleInput = "";
      const debouncedHandle = new Debounced(() => handleInput, 500);
      const usersQuery = infiniteScroll.listQuery(debouncedHandle.current, page.url.origin, "users");
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="flex flex-col gap-4">`);
        push_element($$renderer3, "div", 26, 0);
        $$renderer3.push(`<div class="flex flex-col gap-4">`);
        push_element($$renderer3, "div", 27, 2);
        $$renderer3.push(`<h1 class="text-2xl font-bold sm:text-3xl">`);
        push_element($$renderer3, "h1", 28, 4);
        $$renderer3.push(`Users (`);
        if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).isPending) {
          $$renderer3.push("<!--[-->");
          Loader_circle($$renderer3, { class: "inline h-4 w-4 animate-spin" });
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`${escape_html(store_get($$store_subs ??= {}, "$usersQuery", usersQuery)?.data?.total ?? 0)}`);
        }
        $$renderer3.push(`<!--]-->)</h1>`);
        pop_element();
        $$renderer3.push(` <p class="mt-2 text-muted-foreground">`);
        push_element($$renderer3, "p", 31, 4);
        $$renderer3.push(`Manage users</p>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="flex flex-col items-center justify-between gap-4 md:flex-row">`);
        push_element($$renderer3, "div", 34, 2);
        $$renderer3.push(`<div class="relative grid w-full sm:max-w-md">`);
        push_element($$renderer3, "div", 35, 4);
        Search($$renderer3, {
          class: "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
        });
        $$renderer3.push(`<!----> `);
        Input($$renderer3, {
          placeholder: "Search users...",
          class: "px-10",
          get value() {
            return handleInput;
          },
          set value($$value) {
            handleInput = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).isPending) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="p-6">`);
          push_element($$renderer3, "div", 42, 4);
          $$renderer3.push(`<div class="flex h-80 items-center justify-center">`);
          push_element($$renderer3, "div", 42, 21);
          $$renderer3.push(`<div class="size-20 animate-spin rounded-full border-b-2 border-primary">`);
          push_element($$renderer3, "div", 42, 72);
          $$renderer3.push(`</div>`);
          pop_element();
          $$renderer3.push(`</div>`);
          pop_element();
          $$renderer3.push(`</div>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).error) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<!---->`);
          Alert($$renderer3, {
            variant: "destructive",
            children: prevent_snippet_stringification(($$renderer4) => {
              Circle_alert($$renderer4, {});
              $$renderer4.push(`<!----> <!---->`);
              Alert_title($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(store_get($$store_subs ??= {}, "$usersQuery", usersQuery).error.name)}`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> <!---->`);
              Alert_description($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(store_get($$store_subs ??= {}, "$usersQuery", usersQuery).error.cause)}<br/>`);
                  push_element($$renderer5, "br", 49, 50);
                  pop_element();
                  $$renderer5.push(`${escape_html(store_get($$store_subs ??= {}, "$usersQuery", usersQuery).error.message)}`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).isSuccess) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div>`);
          push_element($$renderer3, "div", 54, 4);
          $$renderer3.push(`<div class="hidden overflow-x-auto border bg-white lg:block dark:bg-background">`);
          push_element($$renderer3, "div", 56, 6);
          Table($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Table_header($$renderer4, {
                class: "sticky top-0 z-10 border-b bg-white dark:bg-secondary",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Table_row($$renderer5, {
                    children: prevent_snippet_stringification(($$renderer6) => {
                      Table_head($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->S/N`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      Table_head($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->User`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      Table_head($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->Role`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      Table_head($$renderer6, {
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->Joined`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!----> `);
                      Table_head($$renderer6, {
                        class: "text-right",
                        children: prevent_snippet_stringification(($$renderer7) => {
                          $$renderer7.push(`<!---->Actions`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer6.push(`<!---->`);
                    }),
                    $$slots: { default: true }
                  });
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Table_body($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!--[-->`);
                  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$usersQuery", usersQuery).data.results);
                  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                    let user = each_array[i];
                    ListCard($$renderer5, { onDelete, screen: "desktop", i, user });
                  }
                  $$renderer5.push(`<!--]-->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
          pop_element();
          $$renderer3.push(` <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">`);
          push_element($$renderer3, "div", 76, 6);
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$usersQuery", usersQuery).data.results);
          for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
            let user = each_array_1[i];
            ListCard($$renderer3, { onDelete, screen: "mobile", i, user });
          }
          $$renderer3.push(`<!--]--></div>`);
          pop_element();
          $$renderer3.push(`</div>`);
          pop_element();
          $$renderer3.push(` <div>`);
          push_element($$renderer3, "div", 83, 4);
          if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).isFetching) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="flex items-center justify-center">`);
            push_element($$renderer3, "div", 85, 8);
            Loader_circle($$renderer3, { class: "h-6 w-6 animate-spin text-muted-foreground" });
            $$renderer3.push(`<!----> <span class="ml-2 text-muted-foreground">`);
            push_element($$renderer3, "span", 87, 10);
            $$renderer3.push(`Loading more...</span>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
          } else {
            $$renderer3.push("<!--[!-->");
            if (store_get($$store_subs ??= {}, "$usersQuery", usersQuery).hasNextPage) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="justify-center">`);
              push_element($$renderer3, "div", 90, 8);
              Button($$renderer3, {
                class: "w-full sm:w-fit",
                onclick: () => store_get($$store_subs ??= {}, "$usersQuery", usersQuery).fetchNextPage(),
                disabled: !store_get($$store_subs ??= {}, "$usersQuery", usersQuery).hasNextPage || store_get($$store_subs ??= {}, "$usersQuery", usersQuery).isFetchingNextPage,
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->Load More`);
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!----></div>`);
              pop_element();
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<p class="text-center text-sm text-muted-foreground">`);
              push_element($$renderer3, "p", 94, 8);
              $$renderer3.push(`Nothing more to load</p>`);
              pop_element();
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]--></div>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (deletingUser) {
          $$renderer3.push("<!--[-->");
          DeleteDialog($$renderer3, {
            user: deletingUser,
            open: !!deletingUser,
            onOpenChange: (open) => !open && (deletingUser = null)
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-CEpDbULE.js.map
