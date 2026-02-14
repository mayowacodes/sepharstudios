import './index-client-DVey9PBT.js';
import { e as isWritableSymbol, B as BoxSymbol, f as boxFrom, b as boxWith, g as boxFlatten, t as toReadonlyBox, h as isBox, j as isWritableBox } from './create-id-ozwDP4rH.js';
import { w as watch } from './watch.svelte-ALR66MkX.js';
import { i as ssr_context, K as lifecycle_function_unavailable } from './index-C14HL8mA.js';

function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function mount() {
  lifecycle_function_unavailable("mount");
}
function unmount() {
  lifecycle_function_unavailable("unmount");
}
async function tick() {
}
function box(initialValue) {
  let current = initialValue;
  return {
    [BoxSymbol]: true,
    [isWritableSymbol]: true,
    get current() {
      return current;
    },
    set current(v) {
      current = v;
    }
  };
}
box.from = boxFrom;
box.with = boxWith;
box.flatten = boxFlatten;
box.readonly = toReadonlyBox;
box.isBox = isBox;
box.isWritableBox = isWritableBox;
function afterTick(fn) {
  tick().then(fn);
}
const ARROW_DOWN = "ArrowDown";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const ARROW_UP = "ArrowUp";
const END = "End";
const ENTER = "Enter";
const ESCAPE = "Escape";
const HOME = "Home";
const PAGE_DOWN = "PageDown";
const PAGE_UP = "PageUp";
const SPACE = " ";
const TAB = "Tab";
const p = "p";
const n = "n";
const j = "j";
const k = "k";
const h = "h";
const l = "l";
function getElemDirection(elem) {
  const style = window.getComputedStyle(elem);
  const direction = style.getPropertyValue("direction");
  return direction;
}
function getNextKey(dir = "ltr", orientation = "horizontal") {
  return {
    horizontal: dir === "rtl" ? ARROW_LEFT : ARROW_RIGHT,
    vertical: ARROW_DOWN
  }[orientation];
}
function getPrevKey(dir = "ltr", orientation = "horizontal") {
  return {
    horizontal: dir === "rtl" ? ARROW_RIGHT : ARROW_LEFT,
    vertical: ARROW_UP
  }[orientation];
}
function getDirectionalKeys(dir = "ltr", orientation = "horizontal") {
  if (!["ltr", "rtl"].includes(dir))
    dir = "ltr";
  if (!["horizontal", "vertical"].includes(orientation))
    orientation = "horizontal";
  return {
    nextKey: getNextKey(dir, orientation),
    prevKey: getPrevKey(dir, orientation)
  };
}
const isBrowser = typeof document !== "undefined";
const isIOS = getIsIOS();
function getIsIOS() {
  return isBrowser && window?.navigator?.userAgent && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || // The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
  window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function isHTMLElement(element) {
  return element instanceof HTMLElement;
}
function isElement(element) {
  return element instanceof Element;
}
function isElementOrSVGElement(element) {
  return element instanceof Element || element instanceof SVGElement;
}
function isTouch(e) {
  return e.pointerType === "touch";
}
function isFocusVisible(element) {
  return element.matches(":focus-visible");
}
function isNotNull(value) {
  return value !== null;
}
function isSelectableInput(element) {
  return element instanceof HTMLInputElement && "select" in element;
}
class RovingFocusGroup {
  #opts;
  #currentTabStopId = box(null);
  constructor(opts) {
    this.#opts = opts;
  }
  getCandidateNodes() {
    return [];
  }
  focusFirstCandidate() {
    const items = this.getCandidateNodes();
    if (!items.length)
      return;
    items[0]?.focus();
  }
  handleKeydown(node, e, both = false) {
    const rootNode = this.#opts.rootNode.current;
    if (!rootNode || !node)
      return;
    const items = this.getCandidateNodes();
    if (!items.length)
      return;
    const currentIndex = items.indexOf(node);
    const dir = getElemDirection(rootNode);
    const { nextKey, prevKey } = getDirectionalKeys(dir, this.#opts.orientation.current);
    const loop = this.#opts.loop.current;
    const keyToIndex = {
      [nextKey]: currentIndex + 1,
      [prevKey]: currentIndex - 1,
      [HOME]: 0,
      [END]: items.length - 1
    };
    if (both) {
      const altNextKey = nextKey === ARROW_DOWN ? ARROW_RIGHT : ARROW_DOWN;
      const altPrevKey = prevKey === ARROW_UP ? ARROW_LEFT : ARROW_UP;
      keyToIndex[altNextKey] = currentIndex + 1;
      keyToIndex[altPrevKey] = currentIndex - 1;
    }
    let itemIndex = keyToIndex[e.key];
    if (itemIndex === void 0)
      return;
    e.preventDefault();
    if (itemIndex < 0 && loop) {
      itemIndex = items.length - 1;
    } else if (itemIndex === items.length && loop) {
      itemIndex = 0;
    }
    const itemToFocus = items[itemIndex];
    if (!itemToFocus)
      return;
    itemToFocus.focus();
    this.#currentTabStopId.current = itemToFocus.id;
    this.#opts.onCandidateFocus?.(itemToFocus);
    return itemToFocus;
  }
  getTabIndex(node) {
    const items = this.getCandidateNodes();
    const anyActive = this.#currentTabStopId.current !== null;
    if (node && !anyActive && items[0] === node) {
      this.#currentTabStopId.current = node.id;
      return 0;
    } else if (node?.id === this.#currentTabStopId.current) {
      return 0;
    }
    return -1;
  }
  setCurrentTabStopId(id) {
    this.#currentTabStopId.current = id;
  }
  focusCurrentTabStop() {
    const currentTabStopId = this.#currentTabStopId.current;
    if (!currentTabStopId)
      return;
    const currentTabStop = this.#opts.rootNode.current?.querySelector(`#${currentTabStopId}`);
    if (!currentTabStop || !isHTMLElement(currentTabStop))
      return;
    currentTabStop.focus();
  }
}
class AnimationsComplete {
  #opts;
  #currentFrame = null;
  constructor(opts) {
    this.#opts = opts;
  }
  #cleanup() {
    if (!this.#currentFrame)
      return;
    window.cancelAnimationFrame(this.#currentFrame);
    this.#currentFrame = null;
  }
  run(fn) {
    this.#cleanup();
    const node = this.#opts.ref.current;
    if (!node)
      return;
    if (typeof node.getAnimations !== "function") {
      this.#executeCallback(fn);
      return;
    }
    this.#currentFrame = window.requestAnimationFrame(() => {
      const animations = node.getAnimations();
      if (animations.length === 0) {
        this.#executeCallback(fn);
        return;
      }
      Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
        this.#executeCallback(fn);
      });
    });
  }
  #executeCallback(fn) {
    const execute = () => {
      fn();
    };
    if (this.#opts.afterTick) {
      afterTick(execute);
    } else {
      execute();
    }
  }
}
class PresenceManager {
  #opts;
  #enabled;
  #afterAnimations;
  #shouldRender = false;
  constructor(opts) {
    this.#opts = opts;
    this.#shouldRender = opts.open.current;
    this.#enabled = opts.enabled ?? true;
    this.#afterAnimations = new AnimationsComplete({ ref: this.#opts.ref, afterTick: this.#opts.open });
    watch(() => this.#opts.open.current, (isOpen) => {
      if (isOpen) this.#shouldRender = true;
      if (!this.#enabled) return;
      this.#afterAnimations.run(() => {
        if (isOpen === this.#opts.open.current) {
          if (!this.#opts.open.current) {
            this.#shouldRender = false;
          }
          this.#opts.onComplete?.();
        }
      });
    });
  }
  get shouldRender() {
    return this.#shouldRender;
  }
}
function noop() {
}

export { ARROW_LEFT as A, isNotNull as B, ENTER as E, HOME as H, PresenceManager as P, RovingFocusGroup as R, SPACE as S, TAB as T, isElement as a, afterTick as b, isTouch as c, END as d, ARROW_UP as e, ARROW_RIGHT as f, ARROW_DOWN as g, h, isFocusVisible as i, j, k, l, n as m, noop as n, onDestroy as o, p, PAGE_UP as q, PAGE_DOWN as r, isIOS as s, isBrowser as t, isHTMLElement as u, isElementOrSVGElement as v, ESCAPE as w, isSelectableInput as x, mount as y, unmount as z };
//# sourceMappingURL=noop-JjG5qwPG.js.map
