import { H as bind_props, p as prevent_snippet_stringification, E as escape_html, m as ensure_array_like, u as attr, O as fallback, C as attr_class, g as spread_props, I as props_id, h as attributes, F as derived, Q as state_snapshot_uncloneable, S as is_array, T as get_prototype_of, U as object_prototype } from './index-C14HL8mA.js';
import './client2-BtPpI286.js';
import { C as Check } from './check-BwxT_uMO.js';
import { C as Circle_alert } from './circle-alert-CjEH9fu-.js';
import { X } from './x-DGP1viX5.js';
import { p as push_element, a as pop_element, v as validate_snippet_args } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { B as Button } from './button-B5TxIyzE.js';
import { I as Input } from './input-BHRan7UY.js';
import { T as Textarea } from './textarea-CG5A7MHl.js';
import { C as Context, w as watch } from './watch.svelte-ALR66MkX.js';
import { b as boxWith, c as createId, m as mergeProps, a as attachRef, d as createBitsAttrs, o as boolToStr, k as boolToEmptyStrOrUndef, n as getDataOpenClosed } from './create-id-ozwDP4rH.js';
import { n as noop, P as PresenceManager, c as isTouch, E as ENTER, S as SPACE, a as isElement, b as afterTick, d as END, H as HOME, A as ARROW_LEFT, e as ARROW_UP, h, k, p, f as ARROW_RIGHT, g as ARROW_DOWN, l, j, m as n } from './noop-JjG5qwPG.js';
import { S as SafePolygon } from './safe-polygon.svelte-BTVDPgBw.js';
import { P as Portal, i as isTabbable, g as getFirstNonCommentChild, h as afterSleep } from './scroll-lock-BKaGX-xL.js';
import { D as DOMContext } from './dom-context.svelte-DOhd7vND.js';
import { F as Floating_layer, a as Floating_layer_anchor, P as Popper_layer_force_mount, b as Popper_layer, g as getFloatingContentCSSVars } from './popper-layer-force-mount-DvMEtyRB.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { s as srOnlyStyles } from './dialog-description-D46lQxwM.js';
import { S as Search } from './search-D7TjZ0xz.js';
import { C as Chevron_down } from './chevron-down-BiSp9fvd.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';
import './Icon-DLeFNkXp.js';
import './index-server-_G0R5Qhl.js';
import './events-DndNBaun.js';
import './dialog-content-DGfSWKw7.js';

const empty = [];
function snapshot(value, skip_warning = false, no_tojson = false) {
  if (!skip_warning) {
    const paths = [];
    const copy = clone(value, /* @__PURE__ */ new Map(), "", paths, null, no_tojson);
    if (paths.length === 1 && paths[0] === "") {
      state_snapshot_uncloneable();
    } else if (paths.length > 0) {
      const slice = paths.length > 10 ? paths.slice(0, 7) : paths.slice(0, 10);
      const excess = paths.length - slice.length;
      let uncloned = slice.map((path) => `- <value>${path}`).join("\n");
      if (excess > 0) uncloned += `
- ...and ${excess} more`;
      state_snapshot_uncloneable(uncloned);
    }
    return copy;
  }
  return clone(value, /* @__PURE__ */ new Map(), "", empty, null, no_tojson);
}
function clone(value, cloned, path, paths, original = null, no_tojson = false) {
  if (typeof value === "object" && value !== null) {
    var unwrapped = cloned.get(value);
    if (unwrapped !== void 0) return unwrapped;
    if (value instanceof Map) return (
      /** @type {Snapshot<T>} */
      new Map(value)
    );
    if (value instanceof Set) return (
      /** @type {Snapshot<T>} */
      new Set(value)
    );
    if (is_array(value)) {
      var copy = (
        /** @type {Snapshot<any>} */
        Array(value.length)
      );
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var i = 0; i < value.length; i += 1) {
        var element = value[i];
        if (i in value) {
          copy[i] = clone(element, cloned, `${path}[${i}]`, paths, null, no_tojson);
        }
      }
      return copy;
    }
    if (get_prototype_of(value) === object_prototype) {
      copy = {};
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var key in value) {
        copy[key] = clone(
          // @ts-expect-error
          value[key],
          cloned,
          `${path}.${key}`,
          paths,
          null,
          no_tojson
        );
      }
      return copy;
    }
    if (value instanceof Date) {
      return (
        /** @type {Snapshot<T>} */
        structuredClone(value)
      );
    }
    if (typeof /** @type {T & { toJSON?: any } } */
    value.toJSON === "function" && !no_tojson) {
      return clone(
        /** @type {T & { toJSON(): any } } */
        value.toJSON(),
        cloned,
        `${path}.toJSON()`,
        paths,
        // Associate the instance with the toJSON clone
        value
      );
    }
  }
  if (value instanceof EventTarget) {
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
  try {
    return (
      /** @type {Snapshot<T>} */
      structuredClone(value)
    );
  } catch (e) {
    {
      paths.push(path);
    }
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
}
function findNextSibling(el, selector) {
  let sibling = el.nextElementSibling;
  while (sibling) {
    if (sibling.matches(selector))
      return sibling;
    sibling = sibling.nextElementSibling;
  }
}
function findPreviousSibling(el, selector) {
  let sibling = el.previousElementSibling;
  while (sibling) {
    if (sibling.matches(selector))
      return sibling;
    sibling = sibling.previousElementSibling;
  }
}
function cssEscape(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  const length = value.length;
  let index = -1;
  let codeUnit;
  let result = "";
  const firstCodeUnit = value.charCodeAt(0);
  if (length === 1 && firstCodeUnit === 45)
    return "\\" + value;
  while (++index < length) {
    codeUnit = value.charCodeAt(index);
    if (codeUnit === 0) {
      result += "�";
      continue;
    }
    if (
      // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is U+007F
      codeUnit >= 1 && codeUnit <= 31 || codeUnit === 127 || // If the character is the first character and is in the range [0-9] (U+0030 to U+0039)
      index === 0 && codeUnit >= 48 && codeUnit <= 57 || // If the character is the second character and is in the range [0-9] (U+0030 to U+0039)
      // and the first character is a `-` (U+002D)
      index === 1 && codeUnit >= 48 && codeUnit <= 57 && firstCodeUnit === 45
    ) {
      result += "\\" + codeUnit.toString(16) + " ";
      continue;
    }
    if (codeUnit >= 128 || codeUnit === 45 || codeUnit === 95 || codeUnit >= 48 && codeUnit <= 57 || codeUnit >= 65 && codeUnit <= 90 || codeUnit >= 97 && codeUnit <= 122) {
      result += value.charAt(index);
      continue;
    }
    result += "\\" + value.charAt(index);
  }
  return result;
}
const COMMAND_VALUE_ATTR = "data-value";
const commandAttrs = createBitsAttrs({
  component: "command",
  parts: [
    "root",
    "list",
    "input",
    "separator",
    "loading",
    "empty",
    "group",
    "group-items",
    "group-heading",
    "item",
    "viewport",
    "input-label"
  ]
});
const COMMAND_GROUP_SELECTOR = commandAttrs.selector("group");
const COMMAND_GROUP_ITEMS_SELECTOR = commandAttrs.selector("group-items");
const COMMAND_GROUP_HEADING_SELECTOR = commandAttrs.selector("group-heading");
const COMMAND_ITEM_SELECTOR = commandAttrs.selector("item");
const COMMAND_VALID_ITEM_SELECTOR = `${commandAttrs.selector("item")}:not([aria-disabled="true"])`;
const CommandRootContext = new Context("Command.Root");
const CommandListContext = new Context("Command.List");
const CommandGroupContainerContext = new Context("Command.Group");
const defaultState = {
  search: "",
  value: "",
  filtered: { count: 0, items: /* @__PURE__ */ new Map(), groups: /* @__PURE__ */ new Set() }
};
class CommandRootState {
  static create(opts) {
    return CommandRootContext.set(new CommandRootState(opts));
  }
  opts;
  attachment;
  #updateScheduled = false;
  #isInitialMount = true;
  sortAfterTick = false;
  sortAndFilterAfterTick = false;
  allItems = /* @__PURE__ */ new Set();
  allGroups = /* @__PURE__ */ new Map();
  allIds = /* @__PURE__ */ new Map();
  // attempt to prevent the harsh delay when user is typing fast
  key = 0;
  viewportNode = null;
  inputNode = null;
  labelNode = null;
  // published state that the components and other things can react to
  commandState = defaultState;
  // internal state that we mutate in batches and publish to the `state` at once
  _commandState = defaultState;
  #snapshot() {
    return snapshot(this._commandState);
  }
  #scheduleUpdate() {
    if (this.#updateScheduled) return;
    this.#updateScheduled = true;
    afterTick(() => {
      this.#updateScheduled = false;
      const currentState = this.#snapshot();
      const hasStateChanged = !Object.is(this.commandState, currentState);
      if (hasStateChanged) {
        this.commandState = currentState;
        this.opts.onStateChange?.current?.(currentState);
      }
    });
  }
  setState(key, value, preventScroll) {
    if (Object.is(this._commandState[key], value)) return;
    this._commandState[key] = value;
    if (key === "search") {
      this.#filterItems();
      this.#sort();
    } else if (key === "value") {
      if (!preventScroll) this.#scrollSelectedIntoView();
    }
    this.#scheduleUpdate();
  }
  constructor(opts) {
    this.opts = opts;
    this.attachment = attachRef(this.opts.ref);
    const defaults = { ...this._commandState, value: this.opts.value.current ?? "" };
    this._commandState = defaults;
    this.commandState = defaults;
    this.onkeydown = this.onkeydown.bind(this);
  }
  /**
   * Calculates score for an item based on search text and keywords.
   * Higher score = better match.
   *
   * @param value - Item's display text
   * @param keywords - Optional keywords to boost scoring
   * @returns Score from 0-1, where 0 = no match
   */
  #score(value, keywords) {
    const filter = this.opts.filter.current ?? computeCommandScore;
    const score = value ? filter(value, this._commandState.search, keywords) : 0;
    return score;
  }
  /**
   * Sorts items and groups based on search scores.
   * Groups are sorted by their highest scoring item.
   * When no search active, selects first item.
   */
  #sort() {
    if (!this._commandState.search || this.opts.shouldFilter.current === false) {
      if (!this._commandState.value || !this.#isInitialMount) {
        this.#selectFirstItem();
      } else if (this.#isInitialMount && this._commandState.value) {
        this.#scrollInitialValue();
      }
      return;
    }
    const scores = this._commandState.filtered.items;
    const groups = [];
    for (const value of this._commandState.filtered.groups) {
      const items = this.allGroups.get(value);
      let max = 0;
      if (!items) {
        groups.push([value, max]);
        continue;
      }
      for (const item of items) {
        const score = scores.get(item);
        max = Math.max(score ?? 0, max);
      }
      groups.push([value, max]);
    }
    const listInsertionElement = this.viewportNode;
    const sorted = this.getValidItems().sort((a, b) => {
      const valueA = a.getAttribute("data-value");
      const valueB = b.getAttribute("data-value");
      const scoresA = scores.get(valueA) ?? 0;
      const scoresB = scores.get(valueB) ?? 0;
      return scoresB - scoresA;
    });
    for (const item of sorted) {
      const group = item.closest(COMMAND_GROUP_ITEMS_SELECTOR);
      if (group) {
        const itemToAppend = item.parentElement === group ? item : item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);
        if (itemToAppend) {
          group.appendChild(itemToAppend);
        }
      } else {
        const itemToAppend = item.parentElement === listInsertionElement ? item : item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);
        if (itemToAppend) {
          listInsertionElement?.appendChild(itemToAppend);
        }
      }
    }
    const sortedGroups = groups.sort((a, b) => b[1] - a[1]);
    for (const group of sortedGroups) {
      const element = listInsertionElement?.querySelector(`${COMMAND_GROUP_SELECTOR}[${COMMAND_VALUE_ATTR}="${cssEscape(group[0])}"]`);
      element?.parentElement?.appendChild(element);
    }
    this.#selectFirstItem();
  }
  /**
   * Sets current value and triggers re-render if cleared.
   *
   * @param value - New value to set
   */
  setValue(value, opts) {
    if (value !== this.opts.value.current && value === "") {
      afterTick(() => {
        this.key++;
      });
    }
    this.setState("value", value, opts);
    this.opts.value.current = value;
  }
  /**
   * Selects first non-disabled item on next tick.
   */
  #selectFirstItem() {
    afterTick(() => {
      const item = this.getValidItems().find((item2) => item2.getAttribute("aria-disabled") !== "true");
      const value = item?.getAttribute(COMMAND_VALUE_ATTR);
      const shouldPreventScroll = this.#isInitialMount && this.opts.disableInitialScroll.current;
      this.setValue(value ?? "", shouldPreventScroll);
      this.#isInitialMount = false;
    });
  }
  /**
   * Scrolls the initial value into view if it exists and is not the first item.
   * Called during initial mount when a value is provided.
   */
  #scrollInitialValue() {
    afterTick(() => {
      const shouldPreventScroll = this.opts.disableInitialScroll.current;
      if (!shouldPreventScroll) {
        this.#scrollSelectedIntoView();
      }
      this.#isInitialMount = false;
    });
  }
  /**
   * Updates filtered items/groups based on search.
   * Recalculates scores and filtered count.
   */
  #filterItems() {
    if (!this._commandState.search || this.opts.shouldFilter.current === false) {
      this._commandState.filtered.count = this.allItems.size;
      return;
    }
    this._commandState.filtered.groups = /* @__PURE__ */ new Set();
    let itemCount = 0;
    for (const id of this.allItems) {
      const value = this.allIds.get(id)?.value ?? "";
      const keywords = this.allIds.get(id)?.keywords ?? [];
      const rank = this.#score(value, keywords);
      this._commandState.filtered.items.set(id, rank);
      if (rank > 0) itemCount++;
    }
    for (const [groupId, group] of this.allGroups) {
      for (const itemId of group) {
        const currItem = this._commandState.filtered.items.get(itemId);
        if (currItem && currItem > 0) {
          this._commandState.filtered.groups.add(groupId);
          break;
        }
      }
    }
    this._commandState.filtered.count = itemCount;
  }
  /**
   * Gets all non-disabled, visible command items.
   *
   * @returns Array of valid item elements
   * @remarks Exposed for direct item access and bound checking
   */
  getValidItems() {
    const node = this.opts.ref.current;
    if (!node) return [];
    const validItems = Array.from(node.querySelectorAll(COMMAND_VALID_ITEM_SELECTOR)).filter((el) => !!el);
    return validItems;
  }
  /**
   * Gets all visible command items.
   *
   * @returns Array of valid item elements
   * @remarks Exposed for direct item access and bound checking
   */
  getVisibleItems() {
    const node = this.opts.ref.current;
    if (!node) return [];
    const visibleItems = Array.from(node.querySelectorAll(COMMAND_ITEM_SELECTOR)).filter((el) => !!el);
    return visibleItems;
  }
  /** Returns all visible items in a matrix structure
   *
   * @remarks Returns empty if the command isn't configured as a grid
   *
   * @returns
   */
  get itemsGrid() {
    if (!this.isGrid) return [];
    const columns = this.opts.columns.current ?? 1;
    const items = this.getVisibleItems();
    const grid = [[]];
    let currentGroup = items[0]?.getAttribute("data-group");
    let column = 0;
    let row = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemGroup = item?.getAttribute("data-group");
      if (currentGroup !== itemGroup) {
        currentGroup = itemGroup;
        column = 1;
        row++;
        grid.push([{ index: i, firstRowOfGroup: true, ref: item }]);
      } else {
        column++;
        if (column > columns) {
          row++;
          column = 1;
          grid.push([]);
        }
        grid[row]?.push({
          index: i,
          firstRowOfGroup: grid[row]?.[0]?.firstRowOfGroup ?? i === 0,
          ref: item
        });
      }
    }
    return grid;
  }
  /**
   * Gets currently selected command item.
   *
   * @returns Selected element or undefined
   */
  #getSelectedItem() {
    const node = this.opts.ref.current;
    if (!node) return;
    const selectedNode = node.querySelector(`${COMMAND_VALID_ITEM_SELECTOR}[data-selected]`);
    if (!selectedNode) return;
    return selectedNode;
  }
  /**
   * Scrolls selected item into view.
   * Special handling for first items in groups.
   */
  #scrollSelectedIntoView() {
    afterTick(() => {
      const item = this.#getSelectedItem();
      if (!item) return;
      const grandparent = item.parentElement?.parentElement;
      if (!grandparent) return;
      if (this.isGrid) {
        const isFirstRowOfGroup = this.#itemIsFirstRowOfGroup(item);
        item.scrollIntoView({ block: "nearest" });
        if (isFirstRowOfGroup) {
          const closestGroupHeader = item?.closest(COMMAND_GROUP_SELECTOR)?.querySelector(COMMAND_GROUP_HEADING_SELECTOR);
          closestGroupHeader?.scrollIntoView({ block: "nearest" });
          return;
        }
      } else {
        const firstChildOfParent = getFirstNonCommentChild(grandparent);
        if (firstChildOfParent && firstChildOfParent.dataset?.value === item.dataset?.value) {
          const closestGroupHeader = item?.closest(COMMAND_GROUP_SELECTOR)?.querySelector(COMMAND_GROUP_HEADING_SELECTOR);
          closestGroupHeader?.scrollIntoView({ block: "nearest" });
          return;
        }
      }
      item.scrollIntoView({ block: "nearest" });
    });
  }
  #itemIsFirstRowOfGroup(item) {
    const grid = this.itemsGrid;
    if (grid.length === 0) return false;
    for (let r = 0; r < grid.length; r++) {
      const row = grid[r];
      if (row === void 0) continue;
      for (let c = 0; c < row.length; c++) {
        const column = row[c];
        if (column === void 0 || column.ref !== item) continue;
        return column.firstRowOfGroup;
      }
    }
    return false;
  }
  /**
   * Sets selection to item at specified index in valid items array.
   * If index is out of bounds, does nothing.
   *
   * @param index - Zero-based index of item to select
   * @remarks
   * Uses `getValidItems()` to get selectable items, filtering out disabled/hidden ones.
   * Access valid items directly via `getValidItems()` to check bounds before calling.
   *
   * @example
   * // get valid items length for bounds check
   * const items = getValidItems()
   * if (index < items.length) {
   *   updateSelectedToIndex(index)
   * }
   */
  updateSelectedToIndex(index) {
    const item = this.getValidItems()[index];
    if (!item) return;
    this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
  }
  /**
   * Updates selected item by moving up/down relative to current selection.
   * Handles wrapping when loop option is enabled.
   *
   * @param change - Direction to move: 1 for next item, -1 for previous item
   * @remarks
   * The loop behavior wraps:
   * - From last item to first when moving next
   * - From first item to last when moving previous
   *
   * Uses `getValidItems()` to get all selectable items, which filters out disabled/hidden items.
   * You can call `getValidItems()` directly to get the current valid items array.
   *
   * @example
   * // select next item
   * updateSelectedByItem(1)
   *
   * // get all valid items
   * const items = getValidItems()
   */
  updateSelectedByItem(change) {
    const selected = this.#getSelectedItem();
    const items = this.getValidItems();
    const index = items.findIndex((item) => item === selected);
    let newSelected = items[index + change];
    if (this.opts.loop.current) {
      newSelected = index + change < 0 ? items[items.length - 1] : index + change === items.length ? items[0] : items[index + change];
    }
    if (newSelected) {
      this.setValue(newSelected.getAttribute(COMMAND_VALUE_ATTR) ?? "");
    }
  }
  /**
   * Moves selection to the first valid item in the next/previous group.
   * If no group is found, falls back to selecting the next/previous item globally.
   *
   * @param change - Direction to move: 1 for next group, -1 for previous group
   * @example
   * // move to first item in next group
   * updateSelectedByGroup(1)
   *
   * // move to first item in previous group
   * updateSelectedByGroup(-1)
   */
  updateSelectedByGroup(change) {
    const selected = this.#getSelectedItem();
    let group = selected?.closest(COMMAND_GROUP_SELECTOR);
    let item;
    while (group && !item) {
      group = change > 0 ? findNextSibling(group, COMMAND_GROUP_SELECTOR) : findPreviousSibling(group, COMMAND_GROUP_SELECTOR);
      item = group?.querySelector(COMMAND_VALID_ITEM_SELECTOR);
    }
    if (item) {
      this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
    } else {
      this.updateSelectedByItem(change);
    }
  }
  /**
   * Maps item id to display value and search keywords.
   * Returns cleanup function to remove mapping.
   *
   * @param id - Unique item identifier
   * @param value - Display text
   * @param keywords - Optional search boost terms
   * @returns Cleanup function
   */
  registerValue(value, keywords) {
    if (!(value && value === this.allIds.get(value)?.value)) {
      this.allIds.set(value, { value, keywords });
    }
    this._commandState.filtered.items.set(value, this.#score(value, keywords));
    if (!this.sortAfterTick) {
      this.sortAfterTick = true;
      afterTick(() => {
        this.#sort();
        this.sortAfterTick = false;
      });
    }
    return () => {
      this.allIds.delete(value);
    };
  }
  /**
   * Registers item in command list and its group.
   * Handles filtering, sorting and selection updates.
   *
   * @param id - Item identifier
   * @param groupId - Optional group to add item to
   * @returns Cleanup function that handles selection
   */
  registerItem(id, groupId) {
    this.allItems.add(id);
    if (groupId) {
      if (!this.allGroups.has(groupId)) {
        this.allGroups.set(groupId, /* @__PURE__ */ new Set([id]));
      } else {
        this.allGroups.get(groupId).add(id);
      }
    }
    if (!this.sortAndFilterAfterTick) {
      this.sortAndFilterAfterTick = true;
      afterTick(() => {
        this.#filterItems();
        this.#sort();
        this.sortAndFilterAfterTick = false;
      });
    }
    this.#scheduleUpdate();
    return () => {
      const selectedItem = this.#getSelectedItem();
      this.allItems.delete(id);
      this.commandState.filtered.items.delete(id);
      this.#filterItems();
      if (selectedItem?.getAttribute("id") === id) {
        this.#selectFirstItem();
      }
      this.#scheduleUpdate();
    };
  }
  /**
   * Creates empty group if not exists.
   *
   * @param id - Group identifier
   * @returns Cleanup function
   */
  registerGroup(id) {
    if (!this.allGroups.has(id)) {
      this.allGroups.set(id, /* @__PURE__ */ new Set());
    }
    return () => {
      this.allIds.delete(id);
      this.allGroups.delete(id);
    };
  }
  get isGrid() {
    return this.opts.columns.current !== null;
  }
  /**
   * Selects last valid item.
   */
  #last() {
    return this.updateSelectedToIndex(this.getValidItems().length - 1);
  }
  /**
   * Handles next item selection:
   * - Meta: Jump to last
   * - Alt: Next group
   * - Default: Next item
   *
   * @param e - Keyboard event
   */
  #next(e) {
    e.preventDefault();
    if (e.metaKey) {
      this.#last();
    } else if (e.altKey) {
      this.updateSelectedByGroup(1);
    } else {
      this.updateSelectedByItem(1);
    }
  }
  #down(e) {
    if (this.opts.columns.current === null) return;
    e.preventDefault();
    if (e.metaKey) {
      this.updateSelectedByGroup(1);
    } else {
      this.updateSelectedByItem(this.#nextRowColumnOffset(e));
    }
  }
  #getColumn(item, grid) {
    if (grid.length === 0) return null;
    for (let r = 0; r < grid.length; r++) {
      const row = grid[r];
      if (row === void 0) continue;
      for (let c = 0; c < row.length; c++) {
        const column = row[c];
        if (column === void 0 || column.ref !== item) continue;
        return { columnIndex: c, rowIndex: r };
      }
    }
    return null;
  }
  #nextRowColumnOffset(e) {
    const grid = this.itemsGrid;
    const selected = this.#getSelectedItem();
    if (!selected) return 0;
    const column = this.#getColumn(selected, grid);
    if (!column) return 0;
    let newItem = null;
    const skipRows = e.altKey ? 1 : 0;
    if (e.altKey && column.rowIndex === grid.length - 2 && !this.opts.loop.current) {
      newItem = this.#findNextNonDisabledItem({
        start: grid.length - 1,
        end: grid.length,
        expectedColumnIndex: column.columnIndex,
        grid
      });
    } else if (column.rowIndex === grid.length - 1) {
      if (!this.opts.loop.current) return 0;
      newItem = this.#findNextNonDisabledItem({
        start: 0 + skipRows,
        end: column.rowIndex,
        expectedColumnIndex: column.columnIndex,
        grid
      });
    } else {
      newItem = this.#findNextNonDisabledItem({
        start: column.rowIndex + 1 + skipRows,
        end: grid.length,
        expectedColumnIndex: column.columnIndex,
        grid
      });
      if (newItem === null && this.opts.loop.current) {
        newItem = this.#findNextNonDisabledItem({
          start: 0,
          end: column.rowIndex,
          expectedColumnIndex: column.columnIndex,
          grid
        });
      }
    }
    return this.#calculateOffset(selected, newItem);
  }
  /** Attempts to find the next non-disabled column that matches the expected column.
   *
   * @remarks
   * - Skips over disabled columns
   * - When a row is shorter than the expected column it defaults to the last item in the row
   *
   * @param param0
   * @returns
   */
  #findNextNonDisabledItem({ start, end, grid, expectedColumnIndex }) {
    let newItem = null;
    for (let r = start; r < end; r++) {
      const row = grid[r];
      newItem = row[expectedColumnIndex]?.ref ?? null;
      if (newItem !== null && itemIsDisabled(newItem)) {
        newItem = null;
        continue;
      }
      if (newItem === null) {
        for (let i = row.length - 1; i >= 0; i--) {
          const item = row[row.length - 1];
          if (item === void 0 || itemIsDisabled(item.ref)) continue;
          newItem = item.ref;
          break;
        }
      }
      break;
    }
    return newItem;
  }
  #calculateOffset(selected, newSelected) {
    if (newSelected === null) return 0;
    const items = this.getValidItems();
    const ogIndex = items.findIndex((item) => item === selected);
    const newIndex = items.findIndex((item) => item === newSelected);
    return newIndex - ogIndex;
  }
  #up(e) {
    if (this.opts.columns.current === null) return;
    e.preventDefault();
    if (e.metaKey) {
      this.updateSelectedByGroup(-1);
    } else {
      this.updateSelectedByItem(this.#previousRowColumnOffset(e));
    }
  }
  #previousRowColumnOffset(e) {
    const grid = this.itemsGrid;
    const selected = this.#getSelectedItem();
    if (selected === void 0) return 0;
    const column = this.#getColumn(selected, grid);
    if (column === null) return 0;
    let newItem = null;
    const skipRows = e.altKey ? 1 : 0;
    if (e.altKey && column.rowIndex === 1 && this.opts.loop.current === false) {
      newItem = this.#findNextNonDisabledItemDesc({
        start: 0,
        end: 0,
        expectedColumnIndex: column.columnIndex,
        grid
      });
    } else if (column.rowIndex === 0) {
      if (this.opts.loop.current === false) return 0;
      newItem = this.#findNextNonDisabledItemDesc({
        start: grid.length - 1 - skipRows,
        end: column.rowIndex + 1,
        expectedColumnIndex: column.columnIndex,
        grid
      });
    } else {
      newItem = this.#findNextNonDisabledItemDesc({
        start: column.rowIndex - 1 - skipRows,
        end: 0,
        expectedColumnIndex: column.columnIndex,
        grid
      });
      if (newItem === null && this.opts.loop.current) {
        newItem = this.#findNextNonDisabledItemDesc({
          start: grid.length - 1,
          end: column.rowIndex + 1,
          expectedColumnIndex: column.columnIndex,
          grid
        });
      }
    }
    return this.#calculateOffset(selected, newItem);
  }
  /**
   * Attempts to find the next non-disabled column that matches the expected column.
   *
   * @remarks
   * - Skips over disabled columns
   * - When a row is shorter than the expected column it defaults to the last item in the row
   */
  #findNextNonDisabledItemDesc({ start, end, grid, expectedColumnIndex }) {
    let newItem = null;
    for (let r = start; r >= end; r--) {
      const row = grid[r];
      if (row === void 0) continue;
      newItem = row[expectedColumnIndex]?.ref ?? null;
      if (newItem !== null && itemIsDisabled(newItem)) {
        newItem = null;
        continue;
      }
      if (newItem === null) {
        for (let i = row.length - 1; i >= 0; i--) {
          const item = row[row.length - 1];
          if (item === void 0 || itemIsDisabled(item.ref)) continue;
          newItem = item.ref;
          break;
        }
      }
      break;
    }
    return newItem;
  }
  /**
   * Handles previous item selection:
   * - Meta: Jump to first
   * - Alt: Previous group
   * - Default: Previous item
   *
   * @param e - Keyboard event
   */
  #prev(e) {
    e.preventDefault();
    if (e.metaKey) {
      this.updateSelectedToIndex(0);
    } else if (e.altKey) {
      this.updateSelectedByGroup(-1);
    } else {
      this.updateSelectedByItem(-1);
    }
  }
  onkeydown(e) {
    const isVim = this.opts.vimBindings.current && e.ctrlKey;
    switch (e.key) {
      case n:
      case j: {
        if (isVim) {
          if (this.isGrid) {
            this.#down(e);
          } else {
            this.#next(e);
          }
        }
        break;
      }
      case l: {
        if (isVim) {
          if (this.isGrid) {
            this.#next(e);
          }
        }
        break;
      }
      case ARROW_DOWN:
        if (this.isGrid) {
          this.#down(e);
        } else {
          this.#next(e);
        }
        break;
      case ARROW_RIGHT:
        if (!this.isGrid) break;
        this.#next(e);
        break;
      case p:
      case k: {
        if (isVim) {
          if (this.isGrid) {
            this.#up(e);
          } else {
            this.#prev(e);
          }
        }
        break;
      }
      case h: {
        if (isVim && this.isGrid) {
          this.#prev(e);
        }
        break;
      }
      case ARROW_UP:
        if (this.isGrid) {
          this.#up(e);
        } else {
          this.#prev(e);
        }
        break;
      case ARROW_LEFT:
        if (!this.isGrid) break;
        this.#prev(e);
        break;
      case HOME:
        e.preventDefault();
        this.updateSelectedToIndex(0);
        break;
      case END:
        e.preventDefault();
        this.#last();
        break;
      case ENTER: {
        if (!e.isComposing && e.keyCode !== 229) {
          e.preventDefault();
          const item = this.#getSelectedItem();
          if (item) {
            item?.click();
          }
        }
      }
    }
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "application",
    [commandAttrs.root]: "",
    tabindex: -1,
    onkeydown: this.onkeydown,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function itemIsDisabled(item) {
  return item.getAttribute("aria-disabled") === "true";
}
class CommandEmptyState {
  static create(opts) {
    return new CommandEmptyState(opts, CommandRootContext.get());
  }
  opts;
  root;
  attachment;
  #shouldRender = derived(() => {
    return this.root._commandState.filtered.count === 0 && this.#isInitialRender === false || this.opts.forceMount.current;
  });
  get shouldRender() {
    return this.#shouldRender();
  }
  set shouldRender($$value) {
    return this.#shouldRender($$value);
  }
  #isInitialRender = true;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "presentation",
    [commandAttrs.empty]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class CommandInputState {
  static create(opts) {
    return new CommandInputState(opts, CommandRootContext.get());
  }
  opts;
  root;
  attachment;
  #selectedItemId = derived(() => {
    const item = this.root.viewportNode?.querySelector(`${COMMAND_ITEM_SELECTOR}[${COMMAND_VALUE_ATTR}="${cssEscape(this.root.opts.value.current)}"]`);
    if (item === void 0 || item === null) return;
    return item.getAttribute("id") ?? void 0;
  });
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref, (v) => this.root.inputNode = v);
    watch(() => this.opts.ref.current, () => {
      const node = this.opts.ref.current;
      if (node && this.opts.autofocus.current) {
        afterSleep(10, () => node.focus());
      }
    });
    watch(() => this.opts.value.current, () => {
      if (this.root.commandState.search !== this.opts.value.current) {
        this.root.setState("search", this.opts.value.current);
      }
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    type: "text",
    [commandAttrs.input]: "",
    autocomplete: "off",
    autocorrect: "off",
    spellcheck: false,
    "aria-autocomplete": "list",
    role: "combobox",
    "aria-expanded": boolToStr(true),
    "aria-controls": this.root.viewportNode?.id ?? void 0,
    "aria-labelledby": this.root.labelNode?.id ?? void 0,
    "aria-activedescendant": this.#selectedItemId(),
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class CommandItemState {
  static create(opts) {
    const group = CommandGroupContainerContext.getOr(null);
    return new CommandItemState({ ...opts, group }, CommandRootContext.get());
  }
  opts;
  root;
  attachment;
  #group = null;
  #trueForceMount = derived(() => {
    return this.opts.forceMount.current || this.#group?.opts.forceMount.current === true;
  });
  #shouldRender = derived(() => {
    this.opts.ref.current;
    if (this.#trueForceMount() || this.root.opts.shouldFilter.current === false || !this.root.commandState.search) {
      return true;
    }
    const currentScore = this.root.commandState.filtered.items.get(this.trueValue);
    if (currentScore === void 0) return false;
    return currentScore > 0;
  });
  get shouldRender() {
    return this.#shouldRender();
  }
  set shouldRender($$value) {
    return this.#shouldRender($$value);
  }
  #isSelected = derived(() => this.root.opts.value.current === this.trueValue && this.trueValue !== "");
  get isSelected() {
    return this.#isSelected();
  }
  set isSelected($$value) {
    return this.#isSelected($$value);
  }
  trueValue = "";
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.#group = CommandGroupContainerContext.getOr(null);
    this.trueValue = opts.value.current;
    this.attachment = attachRef(this.opts.ref);
    watch(
      [
        () => this.trueValue,
        () => this.#group?.trueValue,
        () => this.opts.forceMount.current
      ],
      () => {
        if (this.opts.forceMount.current || !this.trueValue) return;
        return this.root.registerItem(this.trueValue, this.#group?.trueValue);
      }
    );
    watch([() => this.opts.value.current, () => this.opts.ref.current], () => {
      if (this.opts.value.current) {
        this.trueValue = this.opts.value.current;
      } else if (this.opts.ref.current?.textContent) {
        this.trueValue = this.opts.ref.current.textContent.trim();
      }
      if (this.trueValue) {
        this.root.registerValue(this.trueValue, opts.keywords.current.map((kw) => kw.trim()));
        this.opts.ref.current?.setAttribute(COMMAND_VALUE_ATTR, this.trueValue);
      }
    });
    this.onclick = this.onclick.bind(this);
    this.onpointermove = this.onpointermove.bind(this);
  }
  #onSelect() {
    if (this.opts.disabled.current) return;
    this.#select();
    this.opts.onSelect?.current();
  }
  #select() {
    if (this.opts.disabled.current) return;
    this.root.setValue(this.trueValue, true);
  }
  onpointermove(_) {
    if (this.opts.disabled.current || this.root.opts.disablePointerSelection.current) return;
    this.#select();
  }
  onclick(_) {
    if (this.opts.disabled.current) return;
    this.#onSelect();
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "aria-disabled": boolToStr(this.opts.disabled.current),
    "aria-selected": boolToStr(this.isSelected),
    "data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
    "data-selected": boolToEmptyStrOrUndef(this.isSelected),
    "data-value": this.trueValue,
    "data-group": this.#group?.trueValue,
    [commandAttrs.item]: "",
    role: "option",
    onpointermove: this.onpointermove,
    onclick: this.onclick,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class CommandListState {
  static create(opts) {
    return CommandListContext.set(new CommandListState(opts, CommandRootContext.get()));
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "listbox",
    "aria-label": this.opts.ariaLabel.current,
    [commandAttrs.list]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class CommandLabelState {
  static create(opts) {
    return new CommandLabelState(opts, CommandRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref, (v) => this.root.labelNode = v);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [commandAttrs["input-label"]]: "",
    for: this.opts.for?.current,
    style: srOnlyStyles,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
_command_label[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/command/components/_command-label.svelte";
function _command_label($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const labelState = CommandLabelState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v)
      });
      const mergedProps = mergeProps(restProps, labelState.props);
      $$renderer2.push(`<label${attributes({ ...mergedProps })}>`);
      push_element($$renderer2, "label", 29, 0);
      children?.($$renderer2);
      $$renderer2.push(`<!----></label>`);
      pop_element();
      bind_props($$props, { ref });
    },
    _command_label
  );
}
_command_label.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/command/components/command.svelte";
function Command$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        value = "",
        onValueChange = noop,
        onStateChange = noop,
        loop = false,
        shouldFilter = true,
        filter = computeCommandScore,
        label = "",
        vimBindings = true,
        disablePointerSelection = false,
        disableInitialScroll = false,
        columns = null,
        children,
        child,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const rootState = CommandRootState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        filter: boxWith(() => filter),
        shouldFilter: boxWith(() => shouldFilter),
        loop: boxWith(() => loop),
        value: boxWith(() => value, (v) => {
          if (value !== v) {
            value = v;
            onValueChange(v);
          }
        }),
        vimBindings: boxWith(() => vimBindings),
        disablePointerSelection: boxWith(() => disablePointerSelection),
        disableInitialScroll: boxWith(() => disableInitialScroll),
        onStateChange: boxWith(() => onStateChange),
        columns: boxWith(() => columns)
      });
      const updateSelectedToIndex = (i) => rootState.updateSelectedToIndex(i);
      const updateSelectedByGroup = (c) => rootState.updateSelectedByGroup(c);
      const updateSelectedByItem = (c) => rootState.updateSelectedByItem(c);
      const getValidItems = () => rootState.getValidItems();
      const mergedProps = mergeProps(restProps, rootState.props);
      prevent_snippet_stringification(Label);
      function Label($$renderer3) {
        validate_snippet_args($$renderer3);
        _command_label($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(label)}`);
          }),
          $$slots: { default: true }
        });
      }
      if (child) {
        $$renderer2.push("<!--[-->");
        Label($$renderer2);
        $$renderer2.push(`<!----> `);
        child($$renderer2, { props: mergedProps });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div${attributes({ ...mergedProps })}>`);
        push_element($$renderer2, "div", 133, 1);
        Label($$renderer2);
        $$renderer2.push(`<!----> `);
        children?.($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, {
        ref,
        value,
        updateSelectedToIndex,
        updateSelectedByGroup,
        updateSelectedByItem,
        getValidItems
      });
    },
    Command$1
  );
}
Command$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_empty$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/command/components/command-empty.svelte";
function Command_empty$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        children,
        child,
        forceMount = false,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const emptyState = CommandEmptyState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        forceMount: boxWith(() => forceMount)
      });
      const mergedProps = mergeProps(emptyState.props, restProps);
      if (emptyState.shouldRender) {
        $$renderer2.push("<!--[-->");
        if (child) {
          $$renderer2.push("<!--[-->");
          child($$renderer2, { props: mergedProps });
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div${attributes({ ...mergedProps })}>`);
          push_element($$renderer2, "div", 34, 2);
          children?.($$renderer2);
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
    Command_empty$1
  );
}
Command_empty$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_input$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/command/components/command-input.svelte";
function Command_input$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        value = "",
        autofocus = false,
        id = createId(uid),
        ref = null,
        child,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const inputState = CommandInputState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        value: boxWith(() => value, (v) => {
          value = v;
        }),
        autofocus: boxWith(() => autofocus ?? false)
      });
      const mergedProps = mergeProps(restProps, inputState.props);
      if (child) {
        $$renderer2.push("<!--[-->");
        child($$renderer2, { props: mergedProps });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<input${attributes({ ...mergedProps, value }, void 0, void 0, void 0, 4)}/>`);
        push_element($$renderer2, "input", 39, 1);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { value, ref });
    },
    Command_input$1
  );
}
Command_input$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_item$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/command/components/command-item.svelte";
function Command_item$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        value = "",
        disabled = false,
        children,
        child,
        onSelect = noop,
        forceMount = false,
        keywords = [],
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const itemState = CommandItemState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        value: boxWith(() => value),
        disabled: boxWith(() => disabled),
        onSelect: boxWith(() => onSelect),
        forceMount: boxWith(() => forceMount),
        keywords: boxWith(() => keywords)
      });
      const mergedProps = mergeProps(restProps, itemState.props);
      $$renderer2.push(`<!---->`);
      {
        $$renderer2.push(`<div style="display: contents;" data-item-wrapper=""${attr("data-value", itemState.trueValue)}>`);
        push_element($$renderer2, "div", 40, 1);
        if (itemState.shouldRender) {
          $$renderer2.push("<!--[-->");
          if (child) {
            $$renderer2.push("<!--[-->");
            child($$renderer2, { props: mergedProps });
            $$renderer2.push(`<!---->`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div${attributes({ ...mergedProps })}>`);
            push_element($$renderer2, "div", 45, 4);
            children?.($$renderer2);
            $$renderer2.push(`<!----></div>`);
            pop_element();
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!---->`);
      bind_props($$props, { ref });
    },
    Command_item$1
  );
}
Command_item$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_list$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/command/components/command-list.svelte";
function Command_list$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        child,
        children,
        "aria-label": ariaLabel,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const listState = CommandListState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        ariaLabel: boxWith(() => ariaLabel ?? "Suggestions...")
      });
      const mergedProps = mergeProps(restProps, listState.props);
      $$renderer2.push(`<!---->`);
      {
        if (child) {
          $$renderer2.push("<!--[-->");
          child($$renderer2, { props: mergedProps });
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div${attributes({ ...mergedProps })}>`);
          push_element($$renderer2, "div", 34, 2);
          children?.($$renderer2);
          $$renderer2.push(`<!----></div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!---->`);
      bind_props($$props, { ref });
    },
    Command_list$1
  );
}
Command_list$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const SCORE_CONTINUE_MATCH = 1;
const SCORE_SPACE_WORD_JUMP = 0.9;
const SCORE_NON_SPACE_WORD_JUMP = 0.8;
const SCORE_CHARACTER_JUMP = 0.17;
const SCORE_TRANSPOSITION = 0.1;
const PENALTY_SKIPPED = 0.999;
const PENALTY_CASE_MISMATCH = 0.9999;
const PENALTY_NOT_COMPLETE = 0.99;
const IS_GAP_REGEXP = /[\\/_+.#"@[({&]/;
const COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g;
const IS_SPACE_REGEXP = /[\s-]/;
const COUNT_SPACE_REGEXP = /[\s-]/g;
function computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, stringIndex, abbreviationIndex, memoizedResults) {
  if (abbreviationIndex === abbreviation.length) {
    if (stringIndex === string.length)
      return SCORE_CONTINUE_MATCH;
    return PENALTY_NOT_COMPLETE;
  }
  const memoizeKey = `${stringIndex},${abbreviationIndex}`;
  if (memoizedResults[memoizeKey] !== void 0)
    return memoizedResults[memoizeKey];
  const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
  let index = lowerString.indexOf(abbreviationChar, stringIndex);
  let highScore = 0;
  let score, transposedScore, wordBreaks, spaceBreaks;
  while (index >= 0) {
    score = computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 1, memoizedResults);
    if (score > highScore) {
      if (index === stringIndex) {
        score *= SCORE_CONTINUE_MATCH;
      } else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_NON_SPACE_WORD_JUMP;
        wordBreaks = string.slice(stringIndex, index - 1).match(COUNT_GAPS_REGEXP);
        if (wordBreaks && stringIndex > 0) {
          score *= PENALTY_SKIPPED ** wordBreaks.length;
        }
      } else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_SPACE_WORD_JUMP;
        spaceBreaks = string.slice(stringIndex, index - 1).match(COUNT_SPACE_REGEXP);
        if (spaceBreaks && stringIndex > 0) {
          score *= PENALTY_SKIPPED ** spaceBreaks.length;
        }
      } else {
        score *= SCORE_CHARACTER_JUMP;
        if (stringIndex > 0) {
          score *= PENALTY_SKIPPED ** (index - stringIndex);
        }
      }
      if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) {
        score *= PENALTY_CASE_MISMATCH;
      }
    }
    if (score < SCORE_TRANSPOSITION && lowerString.charAt(index - 1) === lowerAbbreviation.charAt(abbreviationIndex + 1) || lowerAbbreviation.charAt(abbreviationIndex + 1) === lowerAbbreviation.charAt(abbreviationIndex) && lowerString.charAt(index - 1) !== lowerAbbreviation.charAt(abbreviationIndex)) {
      transposedScore = computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 2, memoizedResults);
      if (transposedScore * SCORE_TRANSPOSITION > score) {
        score = transposedScore * SCORE_TRANSPOSITION;
      }
    }
    if (score > highScore) {
      highScore = score;
    }
    index = lowerString.indexOf(abbreviationChar, index + 1);
  }
  memoizedResults[memoizeKey] = highScore;
  return highScore;
}
function formatInput(string) {
  return string.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");
}
function computeCommandScore(command, search, commandKeywords) {
  command = commandKeywords && commandKeywords.length > 0 ? `${`${command} ${commandKeywords?.join(" ")}`}` : command;
  return computeCommandScoreInner(command, search, formatInput(command), formatInput(search), 0, 0, {});
}
const popoverAttrs = createBitsAttrs({
  component: "popover",
  parts: ["root", "trigger", "content", "close", "overlay"]
});
const PopoverRootContext = new Context("Popover.Root");
class PopoverRootState {
  static create(opts) {
    return PopoverRootContext.set(new PopoverRootState(opts));
  }
  opts;
  contentNode = null;
  contentPresence;
  triggerNode = null;
  overlayNode = null;
  overlayPresence;
  // hover tracking state
  openedViaHover = false;
  hasInteractedWithContent = false;
  hoverCooldown = false;
  closeDelay = 0;
  #closeTimeout = null;
  #domContext = null;
  constructor(opts) {
    this.opts = opts;
    this.contentPresence = new PresenceManager({
      ref: boxWith(() => this.contentNode),
      open: this.opts.open,
      onComplete: () => {
        this.opts.onOpenChangeComplete.current(this.opts.open.current);
      }
    });
    this.overlayPresence = new PresenceManager({ ref: boxWith(() => this.overlayNode), open: this.opts.open });
    watch(() => this.opts.open.current, (isOpen) => {
      if (!isOpen) {
        this.openedViaHover = false;
        this.hasInteractedWithContent = false;
        this.#clearCloseTimeout();
      }
    });
  }
  setDomContext(ctx) {
    this.#domContext = ctx;
  }
  #clearCloseTimeout() {
    if (this.#closeTimeout !== null && this.#domContext) {
      this.#domContext.clearTimeout(this.#closeTimeout);
      this.#closeTimeout = null;
    }
  }
  toggleOpen() {
    this.#clearCloseTimeout();
    this.opts.open.current = !this.opts.open.current;
  }
  handleClose() {
    this.#clearCloseTimeout();
    if (!this.opts.open.current) return;
    this.opts.open.current = false;
  }
  handleHoverOpen() {
    this.#clearCloseTimeout();
    if (this.opts.open.current) return;
    this.openedViaHover = true;
    this.opts.open.current = true;
  }
  handleHoverClose() {
    if (!this.opts.open.current) return;
    if (this.openedViaHover && !this.hasInteractedWithContent) {
      this.opts.open.current = false;
    }
  }
  handleDelayedHoverClose() {
    if (!this.opts.open.current) return;
    if (!this.openedViaHover || this.hasInteractedWithContent) return;
    this.#clearCloseTimeout();
    if (this.closeDelay <= 0) {
      this.opts.open.current = false;
    } else if (this.#domContext) {
      this.#closeTimeout = this.#domContext.setTimeout(
        () => {
          if (this.openedViaHover && !this.hasInteractedWithContent) {
            this.opts.open.current = false;
          }
          this.#closeTimeout = null;
        },
        this.closeDelay
      );
    }
  }
  cancelDelayedClose() {
    this.#clearCloseTimeout();
  }
  markInteraction() {
    this.hasInteractedWithContent = true;
    this.#clearCloseTimeout();
  }
}
class PopoverTriggerState {
  static create(opts) {
    return new PopoverTriggerState(opts, PopoverRootContext.get());
  }
  opts;
  root;
  attachment;
  domContext;
  #openTimeout = null;
  #closeTimeout = null;
  #isHovering = false;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref, (v) => this.root.triggerNode = v);
    this.domContext = new DOMContext(opts.ref);
    this.root.setDomContext(this.domContext);
    this.onclick = this.onclick.bind(this);
    this.onkeydown = this.onkeydown.bind(this);
    this.onpointerenter = this.onpointerenter.bind(this);
    this.onpointerleave = this.onpointerleave.bind(this);
    watch(() => this.opts.closeDelay.current, (delay) => {
      this.root.closeDelay = delay;
    });
  }
  #clearOpenTimeout() {
    if (this.#openTimeout !== null) {
      this.domContext.clearTimeout(this.#openTimeout);
      this.#openTimeout = null;
    }
  }
  #clearCloseTimeout() {
    if (this.#closeTimeout !== null) {
      this.domContext.clearTimeout(this.#closeTimeout);
      this.#closeTimeout = null;
    }
  }
  #clearAllTimeouts() {
    this.#clearOpenTimeout();
    this.#clearCloseTimeout();
  }
  onpointerenter(e) {
    if (this.opts.disabled.current) return;
    if (!this.opts.openOnHover.current) return;
    if (isTouch(e)) return;
    this.#isHovering = true;
    this.#clearCloseTimeout();
    this.root.cancelDelayedClose();
    if (this.root.opts.open.current || this.root.hoverCooldown) return;
    const delay = this.opts.openDelay.current;
    if (delay <= 0) {
      this.root.handleHoverOpen();
    } else {
      this.#openTimeout = this.domContext.setTimeout(
        () => {
          this.root.handleHoverOpen();
          this.#openTimeout = null;
        },
        delay
      );
    }
  }
  onpointerleave(e) {
    if (this.opts.disabled.current) return;
    if (!this.opts.openOnHover.current) return;
    if (isTouch(e)) return;
    this.#isHovering = false;
    this.#clearOpenTimeout();
    this.root.hoverCooldown = false;
  }
  onclick(e) {
    if (this.opts.disabled.current) return;
    if (e.button !== 0) return;
    this.#clearAllTimeouts();
    if (this.#isHovering && this.root.opts.open.current && this.root.openedViaHover) {
      this.root.openedViaHover = false;
      this.root.hasInteractedWithContent = true;
      return;
    }
    if (this.#isHovering && this.opts.openOnHover.current && this.root.opts.open.current) {
      this.root.hoverCooldown = true;
    }
    if (this.root.hoverCooldown && !this.root.opts.open.current) {
      this.root.hoverCooldown = false;
    }
    this.root.toggleOpen();
  }
  onkeydown(e) {
    if (this.opts.disabled.current) return;
    if (!(e.key === ENTER || e.key === SPACE)) return;
    e.preventDefault();
    this.#clearAllTimeouts();
    this.root.toggleOpen();
  }
  #getAriaControls() {
    if (this.root.opts.open.current && this.root.contentNode?.id) {
      return this.root.contentNode?.id;
    }
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "aria-haspopup": "dialog",
    "aria-expanded": boolToStr(this.root.opts.open.current),
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    "aria-controls": this.#getAriaControls(),
    [popoverAttrs.trigger]: "",
    disabled: this.opts.disabled.current,
    //
    onkeydown: this.onkeydown,
    onclick: this.onclick,
    onpointerenter: this.onpointerenter,
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
class PopoverContentState {
  static create(opts) {
    return new PopoverContentState(opts, PopoverRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref, (v) => this.root.contentNode = v);
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onfocusin = this.onfocusin.bind(this);
    this.onpointerenter = this.onpointerenter.bind(this);
    this.onpointerleave = this.onpointerleave.bind(this);
    new SafePolygon({
      triggerNode: () => this.root.triggerNode,
      contentNode: () => this.root.contentNode,
      enabled: () => this.root.opts.open.current && this.root.openedViaHover && !this.root.hasInteractedWithContent,
      onPointerExit: () => {
        this.root.handleDelayedHoverClose();
      }
    });
  }
  onpointerdown(_) {
    this.root.markInteraction();
  }
  onfocusin(e) {
    const target = e.target;
    if (isElement(target) && isTabbable(target)) {
      this.root.markInteraction();
    }
  }
  onpointerenter(e) {
    if (isTouch(e)) return;
    this.root.cancelDelayedClose();
  }
  onpointerleave(e) {
    if (isTouch(e)) return;
  }
  onInteractOutside = (e) => {
    this.opts.onInteractOutside.current(e);
    if (e.defaultPrevented) return;
    if (!isElement(e.target)) return;
    const closestTrigger = e.target.closest(popoverAttrs.selector("trigger"));
    if (closestTrigger && closestTrigger === this.root.triggerNode) return;
    if (this.opts.customAnchor.current) {
      if (isElement(this.opts.customAnchor.current)) {
        if (this.opts.customAnchor.current.contains(e.target)) return;
      } else if (typeof this.opts.customAnchor.current === "string") {
        const el = document.querySelector(this.opts.customAnchor.current);
        if (el && el.contains(e.target)) return;
      }
    }
    this.root.handleClose();
  };
  onEscapeKeydown = (e) => {
    this.opts.onEscapeKeydown.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  get shouldRender() {
    return this.root.contentPresence.shouldRender;
  }
  get shouldTrapFocus() {
    if (this.root.openedViaHover && !this.root.hasInteractedWithContent) return false;
    return true;
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
    tabindex: -1,
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    [popoverAttrs.content]: "",
    style: { pointerEvents: "auto" },
    onpointerdown: this.onpointerdown,
    onfocusin: this.onfocusin,
    onpointerenter: this.onpointerenter,
    onpointerleave: this.onpointerleave,
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
    onEscapeKeydown: this.onEscapeKeydown
  };
}
Popover_content$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/popover/components/popover-content.svelte";
function Popover_content$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        child,
        children,
        ref = null,
        id = createId(uid),
        forceMount = false,
        onOpenAutoFocus = noop,
        onCloseAutoFocus = noop,
        onEscapeKeydown = noop,
        onInteractOutside = noop,
        trapFocus = true,
        preventScroll = false,
        customAnchor = null,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const contentState = PopoverContentState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        onInteractOutside: boxWith(() => onInteractOutside),
        onEscapeKeydown: boxWith(() => onEscapeKeydown),
        customAnchor: boxWith(() => customAnchor)
      });
      const mergedProps = mergeProps(restProps, contentState.props);
      const effectiveTrapFocus = trapFocus && contentState.shouldTrapFocus;
      function handleOpenAutoFocus(e) {
        if (!contentState.shouldTrapFocus) {
          e.preventDefault();
        }
        onOpenAutoFocus(e);
      }
      if (forceMount) {
        $$renderer2.push("<!--[-->");
        {
          let popper = function($$renderer3, { props, wrapperProps }) {
            validate_snippet_args($$renderer3);
            const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("popover") });
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
              push_element($$renderer3, "div", 77, 4);
              $$renderer3.push(`<div${attributes({ ...finalProps })}>`);
              push_element($$renderer3, "div", 78, 5);
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
              enabled: contentState.root.opts.open.current,
              id,
              trapFocus: effectiveTrapFocus,
              preventScroll,
              loop: true,
              forceMount: true,
              customAnchor,
              onOpenAutoFocus: handleOpenAutoFocus,
              onCloseAutoFocus,
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
              const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("popover") });
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
                push_element($$renderer3, "div", 108, 4);
                $$renderer3.push(`<div${attributes({ ...finalProps })}>`);
                push_element($$renderer3, "div", 109, 5);
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
                open: contentState.root.opts.open.current,
                id,
                trapFocus: effectiveTrapFocus,
                preventScroll,
                loop: true,
                forceMount: false,
                customAnchor,
                onOpenAutoFocus: handleOpenAutoFocus,
                onCloseAutoFocus,
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
    Popover_content$1
  );
}
Popover_content$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Popover_trigger$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/popover/components/popover-trigger.svelte";
function Popover_trigger$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        children,
        child,
        id = createId(uid),
        ref = null,
        type = "button",
        disabled = false,
        openOnHover = false,
        openDelay = 700,
        closeDelay = 300,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const triggerState = PopoverTriggerState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        disabled: boxWith(() => Boolean(disabled)),
        openOnHover: boxWith(() => openOnHover),
        openDelay: boxWith(() => openDelay),
        closeDelay: boxWith(() => closeDelay)
      });
      const mergedProps = mergeProps(restProps, triggerState.props, { type });
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
            push_element($$renderer3, "button", 42, 2);
            children?.($$renderer3);
            $$renderer3.push(`<!----></button>`);
            pop_element();
          }
          $$renderer3.push(`<!--]-->`);
        })
      });
      bind_props($$props, { ref });
    },
    Popover_trigger$1
  );
}
Popover_trigger$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Popover$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/popover/components/popover.svelte";
function Popover$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        open = false,
        onOpenChange = noop,
        onOpenChangeComplete = noop,
        children
      } = $$props;
      PopoverRootState.create({
        open: boxWith(() => open, (v) => {
          open = v;
          onOpenChange(v);
        }),
        onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
      });
      Floating_layer($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        })
      });
      bind_props($$props, { open });
    },
    Popover$1
  );
}
Popover$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Notifications[FILENAME] = "src/lib/components/Notifications.svelte";
function Notifications($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let type = fallback($$props["type"], "success");
      let message = $$props["message"];
      let duration = fallback($$props["duration"], 5e3);
      let visible = true;
      if (duration > 0) {
        setTimeout(
          () => {
            visible = false;
          },
          duration
        );
      }
      if (visible) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="fixed top-4 right-4 z-50">`);
        push_element($$renderer2, "div", 19, 2);
        $$renderer2.push(`<div${attr_class("flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg", void 0, {
          "bg-green-500": type === "success",
          "bg-red-500": type === "error"
        })}>`);
        push_element($$renderer2, "div", 23, 4);
        if (type === "success") {
          $$renderer2.push("<!--[-->");
          Check($$renderer2, { class: "w-5 h-5 text-white" });
        } else {
          $$renderer2.push("<!--[!-->");
          Circle_alert($$renderer2, { class: "w-5 h-5 text-white" });
        }
        $$renderer2.push(`<!--]--> <p class="text-white">`);
        push_element($$renderer2, "p", 34, 6);
        $$renderer2.push(`${escape_html(message)}</p>`);
        pop_element();
        $$renderer2.push(` <button class="ml-2 text-white hover:text-white/80">`);
        push_element($$renderer2, "button", 36, 6);
        X($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { type, message, duration });
    },
    Notifications
  );
}
Notifications.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Popover[FILENAME] = "src/lib/components/ui/popover/popover.svelte";
function Popover($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { open = false, $$slots, $$events, ...restProps } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Popover$1($$renderer3, spread_props([
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
    Popover
  );
}
Popover.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Popover_portal[FILENAME] = "src/lib/components/ui/popover/popover-portal.svelte";
function Popover_portal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...restProps } = $$props;
      $$renderer2.push(`<!---->`);
      Portal($$renderer2, spread_props([restProps]));
      $$renderer2.push(`<!---->`);
    },
    Popover_portal
  );
}
Popover_portal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Popover_content[FILENAME] = "src/lib/components/ui/popover/popover-content.svelte";
function Popover_content($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        sideOffset = 4,
        align = "center",
        portalProps,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Popover_portal($$renderer3, spread_props([
          portalProps,
          {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Popover_content$1($$renderer4, spread_props([
                {
                  "data-slot": "popover-content",
                  sideOffset,
                  align,
                  class: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--bits-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden", className)
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
    Popover_content
  );
}
Popover_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Popover_trigger[FILENAME] = "src/lib/components/ui/popover/popover-trigger.svelte";
function Popover_trigger($$renderer, $$props) {
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
        Popover_trigger$1($$renderer3, spread_props([
          { "data-slot": "popover-trigger", class: cn("", className) },
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
    Popover_trigger
  );
}
Popover_trigger.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command[FILENAME] = "src/lib/components/ui/command/command.svelte";
function Command($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        api = null,
        ref = null,
        value = "",
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Command$1($$renderer3, spread_props([
          {
            "data-slot": "command",
            class: cn("bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md", className)
          },
          restProps,
          {
            get value() {
              return value;
            },
            set value($$value) {
              value = $$value;
              $$settled = false;
            },
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
      bind_props($$props, { api, ref, value });
    },
    Command
  );
}
Command.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_empty[FILENAME] = "src/lib/components/ui/command/command-empty.svelte";
function Command_empty($$renderer, $$props) {
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
        Command_empty$1($$renderer3, spread_props([
          {
            "data-slot": "command-empty",
            class: cn("py-6 text-center text-sm", className)
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
    Command_empty
  );
}
Command_empty.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_item[FILENAME] = "src/lib/components/ui/command/command-item.svelte";
function Command_item($$renderer, $$props) {
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
        Command_item$1($$renderer3, spread_props([
          {
            "data-slot": "command-item",
            class: cn("aria-selected:bg-accent aria-selected:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
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
    Command_item
  );
}
Command_item.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_input[FILENAME] = "src/lib/components/ui/command/command-input.svelte";
function Command_input($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        value = "",
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="flex h-9 items-center gap-2 border-b ps-3 pe-8" data-slot="command-input-wrapper">`);
        push_element($$renderer3, "div", 14, 0);
        Search($$renderer3, { class: "size-4 shrink-0 opacity-50" });
        $$renderer3.push(`<!----> <!---->`);
        Command_input$1($$renderer3, spread_props([
          {
            "data-slot": "command-input",
            class: cn("placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50", className)
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
            get value() {
              return value;
            },
            set value($$value) {
              value = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!----></div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref, value });
    },
    Command_input
  );
}
Command_input.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_list[FILENAME] = "src/lib/components/ui/command/command-list.svelte";
function Command_list($$renderer, $$props) {
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
        Command_list$1($$renderer3, spread_props([
          {
            "data-slot": "command-list",
            class: cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)
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
    Command_list
  );
}
Command_list.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
FileUpload[FILENAME] = "src/lib/components/FileUpload.svelte";
function FileUpload($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let label = $$props["label"];
      let name = $$props["name"];
      let accept = fallback($$props["accept"], "*");
      let required = fallback($$props["required"], false);
      let file = fallback(
        $$props["file"],
        null
        // Allow external binding
      );
      const dispatchChange = () => {
        dispatchEvent(new CustomEvent("change", { detail: { file } }));
      };
      function handleFileChange(event) {
        const input = event.target;
        if (input.files?.length) {
          file = input.files[0];
          dispatchChange();
        }
      }
      $$renderer2.push(`<div class="space-y-2">`);
      push_element($$renderer2, "div", 30, 0);
      $$renderer2.push(`<label${attr("for", name)} class="text-sm font-medium">`);
      push_element($$renderer2, "label", 31, 2);
      $$renderer2.push(`${escape_html(label)}</label>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-2">`);
      push_element($$renderer2, "div", 32, 2);
      Input($$renderer2, {
        id: name,
        type: "file",
        name,
        accept,
        required,
        onchange: handleFileChange
      });
      $$renderer2.push(`<!----> `);
      if (file) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center gap-2 text-sm border rounded-md p-2">`);
        push_element($$renderer2, "div", 35, 6);
        $$renderer2.push(`${escape_html(file.name)} `);
        Button($$renderer2, {
          size: "icon",
          variant: "ghost",
          children: prevent_snippet_stringification(($$renderer3) => {
            X($$renderer3, { size: 16 });
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { label, name, accept, required, file });
    },
    FileUpload
  );
}
FileUpload.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/sponsorships/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let data = $$props["data"];
      let form = $$props["form"];
      let isSubmitting = false;
      let files = { script: null, budget_breakdown: null, storyboard: null };
      let selectedGenre = "";
      const genres = [
        "Drama",
        "Documentary",
        "Educational",
        "Family",
        "Christian",
        "Historical",
        "Inspirational"
      ];
      function selectGenre(genre) {
        selectedGenre = genre;
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="container mx-auto py-12 px-4">`);
        push_element($$renderer3, "div", 42, 0);
        $$renderer3.push(`<div class="max-w-4xl mx-auto space-y-8">`);
        push_element($$renderer3, "div", 43, 2);
        $$renderer3.push(`<div class="text-center space-y-4">`);
        push_element($$renderer3, "div", 44, 4);
        $$renderer3.push(`<h1 class="text-4xl font-bold">`);
        push_element($$renderer3, "h1", 45, 6);
        $$renderer3.push(`Movie Production Sponsorship</h1>`);
        pop_element();
        $$renderer3.push(` <p class="text-xl text-muted-foreground">`);
        push_element($$renderer3, "p", 46, 6);
        $$renderer3.push(`Partner with Sephar Studios to bring your Christian movie project to life</p>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        if (form) {
          $$renderer3.push("<!--[-->");
          Notifications($$renderer3, {
            type: form.success ? "success" : "error",
            message: form.message
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <form method="POST" action="?/submit" class="space-y-8" enctype="multipart/form-data">`);
        push_element($$renderer3, "form", 53, 4);
        $$renderer3.push(`<div class="space-y-4">`);
        push_element($$renderer3, "div", 54, 6);
        $$renderer3.push(`<h2 class="text-2xl font-semibold">`);
        push_element($$renderer3, "h2", 55, 8);
        $$renderer3.push(`Contact Information</h2>`);
        pop_element();
        $$renderer3.push(` <div class="grid gap-4 md:grid-cols-2">`);
        push_element($$renderer3, "div", 57, 8);
        if (!data?.session?.user) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="space-y-2">`);
          push_element($$renderer3, "div", 59, 12);
          $$renderer3.push(`<label for="name" class="text-sm font-medium">`);
          push_element($$renderer3, "label", 60, 14);
          $$renderer3.push(`Full Name</label>`);
          pop_element();
          $$renderer3.push(` `);
          Input($$renderer3, { id: "name", name: "name", required: true });
          $$renderer3.push(`<!----></div>`);
          pop_element();
          $$renderer3.push(` <div class="space-y-2">`);
          push_element($$renderer3, "div", 64, 12);
          $$renderer3.push(`<label for="email" class="text-sm font-medium">`);
          push_element($$renderer3, "label", 65, 14);
          $$renderer3.push(`Email Address</label>`);
          pop_element();
          $$renderer3.push(` `);
          Input($$renderer3, { id: "email", name: "email", type: "email", required: true });
          $$renderer3.push(`<!----></div>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="space-y-4">`);
        push_element($$renderer3, "div", 72, 6);
        $$renderer3.push(`<h2 class="text-2xl font-semibold">`);
        push_element($$renderer3, "h2", 73, 8);
        $$renderer3.push(`Project Details</h2>`);
        pop_element();
        $$renderer3.push(` <div class="grid gap-4 md:grid-cols-2">`);
        push_element($$renderer3, "div", 75, 8);
        $$renderer3.push(`<div class="space-y-2">`);
        push_element($$renderer3, "div", 76, 10);
        $$renderer3.push(`<label for="title" class="text-sm font-medium">`);
        push_element($$renderer3, "label", 77, 12);
        $$renderer3.push(`Project Title</label>`);
        pop_element();
        $$renderer3.push(` `);
        Input($$renderer3, { id: "title", name: "title", required: true });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div class="space-y-2">`);
        push_element($$renderer3, "div", 81, 10);
        $$renderer3.push(`<label for="genre" class="text-sm font-medium">`);
        push_element($$renderer3, "label", 82, 12);
        $$renderer3.push(`Genre</label>`);
        pop_element();
        $$renderer3.push(` `);
        Popover($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            Popover_trigger($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Button($$renderer5, {
                  class: "w-full justify-between",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->${escape_html(selectedGenre || "Select genre")} `);
                    Chevron_down($$renderer6, { size: 16 });
                    $$renderer6.push(`<!---->`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Popover_content($$renderer4, {
              class: "w-[200px] p-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                Command($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Command_input($$renderer6, { placeholder: "Search genre..." });
                    $$renderer6.push(`<!----> `);
                    Command_list($$renderer6, {
                      children: prevent_snippet_stringification(($$renderer7) => {
                        Command_empty($$renderer7, {
                          children: prevent_snippet_stringification(($$renderer8) => {
                            $$renderer8.push(`<!---->No genres found.`);
                          }),
                          $$slots: { default: true }
                        });
                        $$renderer7.push(`<!----> <!--[-->`);
                        const each_array = ensure_array_like(genres);
                        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                          let genre = each_array[$$index];
                          Command_item($$renderer7, {
                            onclick: () => selectGenre(genre),
                            children: prevent_snippet_stringification(($$renderer8) => {
                              $$renderer8.push(`<!---->${escape_html(genre)}`);
                            }),
                            $$slots: { default: true }
                          });
                        }
                        $$renderer7.push(`<!--]-->`);
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
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> <input type="hidden" name="genre"${attr("value", selectedGenre)} required/>`);
        push_element($$renderer3, "input", 103, 12);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="space-y-2">`);
        push_element($$renderer3, "div", 107, 8);
        $$renderer3.push(`<label for="synopsis" class="text-sm font-medium">`);
        push_element($$renderer3, "label", 108, 10);
        $$renderer3.push(`Project Synopsis</label>`);
        pop_element();
        $$renderer3.push(` `);
        Textarea($$renderer3, {
          id: "synopsis",
          name: "synopsis",
          rows: 4,
          required: true,
          placeholder: "Provide a brief overview of your project..."
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="space-y-4">`);
        push_element($$renderer3, "div", 113, 6);
        $$renderer3.push(`<h2 class="text-2xl font-semibold">`);
        push_element($$renderer3, "h2", 114, 8);
        $$renderer3.push(`Supporting Documents</h2>`);
        pop_element();
        $$renderer3.push(` <div class="grid gap-6">`);
        push_element($$renderer3, "div", 116, 8);
        FileUpload($$renderer3, {
          label: "Script or Treatment",
          name: "script",
          accept: ".pdf,.doc,.docx",
          required: true,
          get file() {
            return files.script;
          },
          set file($$value) {
            files.script = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        FileUpload($$renderer3, {
          label: "Budget Breakdown",
          name: "budget_breakdown",
          accept: ".pdf,.xls,.xlsx",
          required: true,
          get file() {
            return files.budget_breakdown;
          },
          set file($$value) {
            files.budget_breakdown = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        FileUpload($$renderer3, {
          label: "Storyboard/Visual References",
          name: "storyboard",
          accept: ".pdf,.zip,.jpg,.png",
          get file() {
            return files.storyboard;
          },
          set file($$value) {
            files.storyboard = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="flex justify-end gap-4">`);
        push_element($$renderer3, "div", 128, 6);
        Button($$renderer3, {
          type: "reset",
          variant: "outline",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->Reset`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          type: "submit",
          disabled: isSubmitting,
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html("Submit Request")}`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</form>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { data, form });
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-DAuXiNoQ.js.map
