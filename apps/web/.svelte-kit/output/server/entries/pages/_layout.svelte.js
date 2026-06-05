import { At as stringify, Dt as spread_props, Ht as run, Lt as attr, Mt as html, Ot as store_get, Rt as clsx, St as derived, Tt as head, bt as attributes, jt as unsubscribe_stores, vt as attr_class, wt as ensure_array_like, yt as attr_style, zt as escape_html } from "../../chunks/ui-libs.js";
import { i as SiteMeta } from "../../chunks/constants.js";
/* empty css                */
import { a as cn, i as sonnerContext, r as toastState, t as SonnerState } from "../../chunks/toast-state.svelte.js";
import { t as Mode_watcher } from "../../chunks/dist.js";
import { t as page } from "../../chunks/state.js";
import { t as PWAInstallPrompt } from "../../chunks/PWAInstallPrompt.js";
import { n as copilotOpen, t as copilotContext } from "../../chunks/copilot.js";
import { n as liveRegionBuffer } from "../../chunks/live-region.js";
//#region ../../node_modules/svelte-sonner/dist/Loader.svelte
var bars = Array(12).fill(0);
function Loader($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		"use strict";
		let { visible, class: className } = $$props;
		$$renderer.push(`<div${attr_class(clsx(["sonner-loading-wrapper", className].filter(Boolean).join(" ")))}${attr("data-visible", visible)}><div class="sonner-spinner"><!--[-->`);
		const each_array = ensure_array_like(bars);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			each_array[i];
			$$renderer.push(`<div class="sonner-loading-bar"></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
//#region ../../node_modules/svelte-sonner/dist/types.js
function isAction(action) {
	return action.label !== void 0;
}
//#endregion
//#region ../../node_modules/svelte-sonner/dist/internal/use-document-hidden.svelte.js
function useDocumentHidden() {
	let current = typeof document !== "undefined" ? document.hidden : false;
	return { get current() {
		return current;
	} };
}
//#endregion
//#region ../../node_modules/svelte-sonner/dist/Toast.svelte
var TOAST_LIFETIME$1 = 4e3;
var GAP$1 = 14;
var TIME_BEFORE_UNMOUNT = 200;
var DEFAULT_TOAST_CLASSES = {
	toast: "",
	title: "",
	description: "",
	loader: "",
	closeButton: "",
	cancelButton: "",
	actionButton: "",
	action: "",
	warning: "",
	error: "",
	success: "",
	default: "",
	info: "",
	loading: ""
};
function Toast($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { toast, index, expanded, invert: invertFromToaster, position, visibleToasts, expandByDefault, closeButton: closeButtonFromToaster, interacting, cancelButtonStyle = "", actionButtonStyle = "", duration: durationFromToaster, descriptionClass = "", classes: classesProp, unstyled = false, loadingIcon, successIcon, errorIcon, warningIcon, closeIcon, infoIcon, defaultRichColors = false, swipeDirections: swipeDirectionsProp, closeButtonAriaLabel, pauseWhenPageIsHidden, $$slots, $$events, ...restProps } = $$props;
		const defaultClasses = { ...DEFAULT_TOAST_CLASSES };
		let mounted = false;
		let removed = false;
		let swiping = false;
		let swipeOut = false;
		let isSwiped = false;
		let offsetBeforeRemove = 0;
		let initialHeight = 0;
		toast.duration;
		let swipeOutDirection = null;
		const isFront = derived(() => index === 0);
		const isVisible = derived(() => index + 1 <= visibleToasts);
		const toastType = derived(() => toast.type);
		const dismissible = derived(() => toast.dismissible !== void 0 ? toast.dismissible !== false : toast.dismissable !== false);
		const toastClass = derived(() => toast.class || "");
		const toastDescriptionClass = derived(() => toast.descriptionClass || "");
		const heightIndex = derived(() => toastState.heights.findIndex((height) => height.toastId === toast.id) || 0);
		const closeButton = derived(() => toast.closeButton ?? closeButtonFromToaster);
		derived(() => toast.duration ?? durationFromToaster ?? TOAST_LIFETIME$1);
		const coords = derived(() => position.split("-"));
		const toastsHeightBefore = derived(() => toastState.heights.reduce((prev, curr, reducerIndex) => {
			if (reducerIndex >= heightIndex()) return prev;
			return prev + curr.height;
		}, 0));
		useDocumentHidden();
		const invert = derived(() => toast.invert || invertFromToaster);
		const disabled = derived(() => toastType() === "loading");
		const classes = derived(() => ({
			...defaultClasses,
			...classesProp
		}));
		derived(() => toast.title);
		derived(() => toast.description);
		const offset = derived(() => Math.round(heightIndex() * GAP$1 + toastsHeightBefore()));
		function deleteToast() {
			removed = true;
			offsetBeforeRemove = offset();
			toastState.removeHeight(toast.id);
			setTimeout(() => {
				toastState.remove(toast.id);
			}, TIME_BEFORE_UNMOUNT);
		}
		derived(() => toast.promise && toastType() === "loading" || toast.duration === Number.POSITIVE_INFINITY);
		const icon = derived(() => {
			if (toast.icon) return toast.icon;
			if (toastType() === "success") return successIcon;
			if (toastType() === "error") return errorIcon;
			if (toastType() === "warning") return warningIcon;
			if (toastType() === "info") return infoIcon;
			if (toastType() === "loading") return loadingIcon;
			return null;
		});
		function LoadingIcon($$renderer) {
			if (loadingIcon) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(clsx(cn(classes()?.loader, toast?.classes?.loader, "sonner-loader")))}${attr("data-visible", toastType() === "loading")}>`);
				loadingIcon($$renderer);
				$$renderer.push(`<!----></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				Loader($$renderer, {
					class: cn(classes()?.loader, toast.classes?.loader),
					visible: toastType() === "loading"
				});
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<li${attr("tabindex", 0)}${attr_class(clsx(cn(restProps.class, toastClass(), classes()?.toast, toast?.classes?.toast, classes()?.[toastType()], toast?.classes?.[toastType()])))}${attr("aria-live", toast.important ? "assertive" : "polite")} aria-atomic="true" data-sonner-toast=""${attr("data-rich-colors", toast.richColors ?? defaultRichColors)}${attr("data-styled", !(toast.component || toast.unstyled || unstyled))}${attr("data-mounted", mounted)}${attr("data-promise", Boolean(toast.promise))}${attr("data-swiped", isSwiped)}${attr("data-removed", removed)}${attr("data-visible", isVisible())}${attr("data-y-position", coords()[0])}${attr("data-x-position", coords()[1])}${attr("data-index", index)}${attr("data-front", isFront())}${attr("data-swiping", swiping)}${attr("data-dismissible", dismissible())}${attr("data-type", toastType())}${attr("data-invert", invert())}${attr("data-swipe-out", swipeOut)}${attr("data-swipe-direction", swipeOutDirection)}${attr("data-expanded", Boolean(expanded || expandByDefault && mounted))}${attr_style(`${restProps.style} ${toast.style}`, {
			"--index": index,
			"--toasts-before": index,
			"--z-index": toastState.toasts.length - index,
			"--offset": `${removed ? offsetBeforeRemove : offset()}px`,
			"--initial-height": expandByDefault ? "auto" : `${initialHeight}px`
		})}>`);
		if (closeButton() && !toast.component && toastType() !== "loading" && closeIcon !== null) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button${attr("aria-label", closeButtonAriaLabel)}${attr("data-disabled", disabled())} data-close-button=""${attr_class(clsx(cn(classes()?.closeButton, toast?.classes?.closeButton)))}>`);
			closeIcon?.($$renderer);
			$$renderer.push(`<!----></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (toast.component) {
			$$renderer.push("<!--[0-->");
			const Component = toast.component;
			if (Component) {
				$$renderer.push("<!--[-->");
				Component($$renderer, spread_props([toast.componentProps, { closeToast: deleteToast }]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		} else {
			$$renderer.push("<!--[-1-->");
			if ((toastType() || toast.icon || toast.promise) && toast.icon !== null && (icon() !== null || toast.icon)) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div data-icon=""${attr_class(clsx(cn(classes()?.icon, toast?.classes?.icon)))}>`);
				if (toast.promise || toastType() === "loading") {
					$$renderer.push("<!--[0-->");
					if (toast.icon) {
						$$renderer.push("<!--[0-->");
						if (toast.icon) {
							$$renderer.push("<!--[-->");
							toast.icon($$renderer, {});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					} else {
						$$renderer.push("<!--[-1-->");
						LoadingIcon($$renderer);
					}
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (toast.type !== "loading") {
					$$renderer.push("<!--[0-->");
					if (toast.icon) {
						$$renderer.push("<!--[0-->");
						if (toast.icon) {
							$$renderer.push("<!--[-->");
							toast.icon($$renderer, {});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					} else if (toastType() === "success") {
						$$renderer.push("<!--[1-->");
						successIcon?.($$renderer);
						$$renderer.push(`<!---->`);
					} else if (toastType() === "error") {
						$$renderer.push("<!--[2-->");
						errorIcon?.($$renderer);
						$$renderer.push(`<!---->`);
					} else if (toastType() === "warning") {
						$$renderer.push("<!--[3-->");
						warningIcon?.($$renderer);
						$$renderer.push(`<!---->`);
					} else if (toastType() === "info") {
						$$renderer.push("<!--[4-->");
						infoIcon?.($$renderer);
						$$renderer.push(`<!---->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div data-content=""${attr_class(clsx(cn(classes()?.content, toast?.classes?.content)))}><div data-title=""${attr_class(clsx(cn(classes()?.title, toast?.classes?.title)))}>`);
			if (toast.title) {
				$$renderer.push("<!--[0-->");
				if (typeof toast.title !== "string") {
					$$renderer.push("<!--[0-->");
					const Title = toast.title;
					if (Title) {
						$$renderer.push("<!--[-->");
						Title($$renderer, spread_props([toast.componentProps]));
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`${escape_html(toast.title)}`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (toast.description) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div data-description=""${attr_class(clsx(cn(descriptionClass, toastDescriptionClass(), classes()?.description, toast.classes?.description)))}>`);
				if (typeof toast.description !== "string") {
					$$renderer.push("<!--[0-->");
					const Description = toast.description;
					if (Description) {
						$$renderer.push("<!--[-->");
						Description($$renderer, spread_props([toast.componentProps]));
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`${escape_html(toast.description)}`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (toast.cancel) {
				$$renderer.push("<!--[0-->");
				if (typeof toast.cancel === "function") {
					$$renderer.push("<!--[0-->");
					if (toast.cancel) {
						$$renderer.push("<!--[-->");
						toast.cancel($$renderer, {});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else if (isAction(toast.cancel)) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<button data-button="" data-cancel=""${attr_style(toast.cancelButtonStyle ?? cancelButtonStyle)}${attr_class(clsx(cn(classes()?.cancelButton, toast?.classes?.cancelButton)))}>${escape_html(toast.cancel.label)}</button>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (toast.action) {
				$$renderer.push("<!--[0-->");
				if (typeof toast.action === "function") {
					$$renderer.push("<!--[0-->");
					if (toast.action) {
						$$renderer.push("<!--[-->");
						toast.action($$renderer, {});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else if (isAction(toast.action)) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<button data-button=""${attr_style(toast.actionButtonStyle ?? actionButtonStyle)}${attr_class(clsx(cn(classes()?.actionButton, toast?.classes?.actionButton)))}>${escape_html(toast.action.label)}</button>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></li>`);
	});
}
//#endregion
//#region ../../node_modules/svelte-sonner/dist/icons/SuccessIcon.svelte
function SuccessIcon($$renderer) {
	$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-success-icon=""><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path></svg>`);
}
//#endregion
//#region ../../node_modules/svelte-sonner/dist/icons/ErrorIcon.svelte
function ErrorIcon($$renderer) {
	$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-error-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>`);
}
//#endregion
//#region ../../node_modules/svelte-sonner/dist/icons/WarningIcon.svelte
function WarningIcon($$renderer) {
	$$renderer.push(`<svg viewBox="0 0 64 64" fill="currentColor" height="20" width="20" data-sonner-warning-icon="" xmlns="http://www.w3.org/2000/svg"><path d="M32.427,7.987c2.183,0.124 4,1.165 5.096,3.281l17.936,36.208c1.739,3.66 -0.954,8.585 -5.373,8.656l-36.119,0c-4.022,-0.064 -7.322,-4.631 -5.352,-8.696l18.271,-36.207c0.342,-0.65 0.498,-0.838 0.793,-1.179c1.186,-1.375 2.483,-2.111 4.748,-2.063Zm-0.295,3.997c-0.687,0.034 -1.316,0.419 -1.659,1.017c-6.312,11.979 -12.397,24.081 -18.301,36.267c-0.546,1.225 0.391,2.797 1.762,2.863c12.06,0.195 24.125,0.195 36.185,0c1.325,-0.064 2.321,-1.584 1.769,-2.85c-5.793,-12.184 -11.765,-24.286 -17.966,-36.267c-0.366,-0.651 -0.903,-1.042 -1.79,-1.03Z"></path><path d="M33.631,40.581l-3.348,0l-0.368,-16.449l4.1,0l-0.384,16.449Zm-3.828,5.03c0,-0.609 0.197,-1.113 0.592,-1.514c0.396,-0.4 0.935,-0.601 1.618,-0.601c0.684,0 1.223,0.201 1.618,0.601c0.395,0.401 0.593,0.905 0.593,1.514c0,0.587 -0.193,1.078 -0.577,1.473c-0.385,0.395 -0.929,0.593 -1.634,0.593c-0.705,0 -1.249,-0.198 -1.634,-0.593c-0.384,-0.395 -0.576,-0.886 -0.576,-1.473Z"></path></svg>`);
}
//#endregion
//#region ../../node_modules/svelte-sonner/dist/icons/InfoIcon.svelte
function InfoIcon($$renderer) {
	$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-info-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path></svg>`);
}
//#endregion
//#region ../../node_modules/svelte-sonner/dist/icons/CloseIcon.svelte
function CloseIcon($$renderer) {
	$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-sonner-close-icon=""><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`);
}
//#endregion
//#region ../../node_modules/svelte-sonner/dist/Toaster.svelte
var VISIBLE_TOASTS_AMOUNT = 3;
var VIEWPORT_OFFSET = "24px";
var MOBILE_VIEWPORT_OFFSET = "16px";
var TOAST_LIFETIME = 4e3;
var TOAST_WIDTH = 356;
var GAP = 14;
var DARK = "dark";
var LIGHT = "light";
function getOffsetObject(defaultOffset, mobileOffset) {
	const styles = {};
	[defaultOffset, mobileOffset].forEach((offset, index) => {
		const isMobile = index === 1;
		const prefix = isMobile ? "--mobile-offset" : "--offset";
		const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
		function assignAll(offset) {
			[
				"top",
				"right",
				"bottom",
				"left"
			].forEach((key) => {
				styles[`${prefix}-${key}`] = typeof offset === "number" ? `${offset}px` : offset;
			});
		}
		if (typeof offset === "number" || typeof offset === "string") assignAll(offset);
		else if (typeof offset === "object") [
			"top",
			"right",
			"bottom",
			"left"
		].forEach((key) => {
			const value = offset[key];
			if (value === void 0) styles[`${prefix}-${key}`] = defaultValue;
			else styles[`${prefix}-${key}`] = typeof value === "number" ? `${value}px` : value;
		});
		else assignAll(defaultValue);
	});
	return styles;
}
function Toaster($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		function getInitialTheme(t) {
			if (t !== "system") return t;
			if (typeof window !== "undefined") {
				if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return DARK;
				return LIGHT;
			}
			return LIGHT;
		}
		let { invert = false, position = "bottom-right", hotkey = ["altKey", "KeyT"], expand = false, closeButton = false, offset = VIEWPORT_OFFSET, mobileOffset = MOBILE_VIEWPORT_OFFSET, theme = "light", richColors = false, duration = TOAST_LIFETIME, visibleToasts = VISIBLE_TOASTS_AMOUNT, toastOptions = {}, dir = "auto", gap = GAP, pauseWhenPageIsHidden = false, loadingIcon: loadingIconProp, successIcon: successIconProp, errorIcon: errorIconProp, warningIcon: warningIconProp, closeIcon: closeIconProp, infoIcon: infoIconProp, containerAriaLabel = "Notifications", class: className, closeButtonAriaLabel = "Close toast", onblur, onfocus, onmouseenter, onmousemove, onmouseleave, ondragend, onpointerdown, onpointerup, $$slots, $$events, ...restProps } = $$props;
		function getDocumentDirection() {
			if (dir !== "auto") return dir;
			if (typeof window === "undefined") return "ltr";
			if (typeof document === "undefined") return "ltr";
			const dirAttribute = document.documentElement.getAttribute("dir");
			if (dirAttribute === "auto" || !dirAttribute) {
				run(() => dir = window.getComputedStyle(document.documentElement).direction ?? "ltr");
				return dir;
			}
			run(() => dir = dirAttribute);
			return dirAttribute;
		}
		const possiblePositions = derived(() => Array.from(new Set([position, ...toastState.toasts.filter((toast) => toast.position).map((toast) => toast.position)].filter(Boolean))));
		let expanded = false;
		let interacting = false;
		let actualTheme = getInitialTheme(theme);
		const hotkeyLabel = derived(() => hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, ""));
		sonnerContext.set(new SonnerState());
		$$renderer.push(`<section${attr("aria-label", `${stringify(containerAriaLabel)} ${stringify(hotkeyLabel())}`)}${attr("tabindex", -1)} aria-live="polite" aria-relevant="additions text" aria-atomic="false" class="svelte-1xr4pbs">`);
		if (toastState.toasts.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(possiblePositions());
			for (let index = 0, $$length = each_array.length; index < $$length; index++) {
				let position = each_array[index];
				const [y, x] = position.split("-");
				const offsetObject = getOffsetObject(offset, mobileOffset);
				$$renderer.push(`<ol${attributes({
					tabindex: -1,
					dir: getDocumentDirection(),
					class: clsx(className),
					"data-sonner-toaster": true,
					"data-sonner-theme": actualTheme,
					"data-y-position": y,
					"data-x-position": x,
					style: restProps.style,
					...restProps
				}, "svelte-1xr4pbs", void 0, {
					"--front-toast-height": `${toastState.heights[0]?.height}px`,
					"--width": `${TOAST_WIDTH}px`,
					"--gap": `${gap}px`,
					"--offset-top": offsetObject["--offset-top"],
					"--offset-right": offsetObject["--offset-right"],
					"--offset-bottom": offsetObject["--offset-bottom"],
					"--offset-left": offsetObject["--offset-left"],
					"--mobile-offset-top": offsetObject["--mobile-offset-top"],
					"--mobile-offset-right": offsetObject["--mobile-offset-right"],
					"--mobile-offset-bottom": offsetObject["--mobile-offset-bottom"],
					"--mobile-offset-left": offsetObject["--mobile-offset-left"]
				})}><!--[-->`);
				const each_array_1 = ensure_array_like(toastState.toasts.filter((toast) => !toast.position && index === 0 || toast.position === position));
				for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
					let toast = each_array_1[index];
					{
						function successIcon($$renderer) {
							if (successIconProp) {
								$$renderer.push("<!--[0-->");
								successIconProp?.($$renderer);
								$$renderer.push(`<!---->`);
							} else if (successIconProp !== null) {
								$$renderer.push("<!--[1-->");
								SuccessIcon($$renderer, {});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						function errorIcon($$renderer) {
							if (errorIconProp) {
								$$renderer.push("<!--[0-->");
								errorIconProp?.($$renderer);
								$$renderer.push(`<!---->`);
							} else if (errorIconProp !== null) {
								$$renderer.push("<!--[1-->");
								ErrorIcon($$renderer, {});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						function warningIcon($$renderer) {
							if (warningIconProp) {
								$$renderer.push("<!--[0-->");
								warningIconProp?.($$renderer);
								$$renderer.push(`<!---->`);
							} else if (warningIconProp !== null) {
								$$renderer.push("<!--[1-->");
								WarningIcon($$renderer, {});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						function infoIcon($$renderer) {
							if (infoIconProp) {
								$$renderer.push("<!--[0-->");
								infoIconProp?.($$renderer);
								$$renderer.push(`<!---->`);
							} else if (infoIconProp !== null) {
								$$renderer.push("<!--[1-->");
								InfoIcon($$renderer, {});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						function closeIcon($$renderer) {
							if (closeIconProp) {
								$$renderer.push("<!--[0-->");
								closeIconProp?.($$renderer);
								$$renderer.push(`<!---->`);
							} else if (closeIconProp !== null) {
								$$renderer.push("<!--[1-->");
								CloseIcon($$renderer, {});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						Toast($$renderer, {
							index,
							toast,
							defaultRichColors: richColors,
							duration: toastOptions?.duration ?? duration,
							class: toastOptions?.class ?? "",
							descriptionClass: toastOptions?.descriptionClass || "",
							invert,
							visibleToasts,
							closeButton,
							interacting,
							position,
							style: toastOptions?.style ?? "",
							classes: toastOptions.classes || {},
							unstyled: toastOptions.unstyled ?? false,
							cancelButtonStyle: toastOptions?.cancelButtonStyle ?? "",
							actionButtonStyle: toastOptions?.actionButtonStyle ?? "",
							closeButtonAriaLabel: toastOptions?.closeButtonAriaLabel ?? closeButtonAriaLabel,
							expandByDefault: expand,
							expanded,
							pauseWhenPageIsHidden,
							loadingIcon: loadingIconProp,
							successIcon,
							errorIcon,
							warningIcon,
							infoIcon,
							closeIcon,
							$$slots: {
								successIcon: true,
								errorIcon: true,
								warningIcon: true,
								infoIcon: true,
								closeIcon: true
							}
						});
					}
				}
				$$renderer.push(`<!--]--></ol>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></section>`);
	});
}
//#endregion
//#region src/lib/components/widgets/AICopilot.svelte
function AICopilot($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { isLoggedIn = false } = $$props;
		let messages = [];
		let inputValue = "";
		let loading = false;
		let context = derived(() => store_get($$store_subs ??= {}, "$copilotContext", copilotContext));
		let isOpen = derived(() => store_get($$store_subs ??= {}, "$copilotOpen", copilotOpen));
		$$renderer.push(`<button aria-label="Open AI Copilot"${attr_class("copilot-fab svelte-18brgu8", void 0, { "open": isOpen() })}>`);
		if (isOpen()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-18brgu8"><line x1="18" y1="6" x2="6" y2="18" class="svelte-18brgu8"></line><line x1="6" y1="6" x2="18" y2="18" class="svelte-18brgu8"></line></svg>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-18brgu8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" class="svelte-18brgu8"></path></svg>`);
		}
		$$renderer.push(`<!--]--></button> `);
		if (isOpen()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="copilot-panel svelte-18brgu8" role="dialog" aria-label="AI Copilot"><div class="copilot-header svelte-18brgu8"><div class="copilot-header-left svelte-18brgu8"><div class="copilot-avatar svelte-18brgu8" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-18brgu8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" class="svelte-18brgu8"></path></svg></div> <div class="svelte-18brgu8"><p class="copilot-title svelte-18brgu8">${escape_html(context() ? "Watch Companion" : "Copilot")}</p> `);
			if (context()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="copilot-subtitle svelte-18brgu8">${escape_html(context().contentTitle)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <button aria-label="Close copilot" class="copilot-close-btn svelte-18brgu8"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-18brgu8"><line x1="18" y1="6" x2="6" y2="18" class="svelte-18brgu8"></line><line x1="6" y1="6" x2="18" y2="18" class="svelte-18brgu8"></line></svg></button></div> <div class="copilot-messages svelte-18brgu8"><!--[-->`);
			const each_array = ensure_array_like(messages);
			for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
				let msg = each_array[$$index_1];
				$$renderer.push(`<div${attr_class("msg-row svelte-18brgu8", void 0, {
					"user": msg.role === "user",
					"assistant": msg.role === "assistant"
				})}>`);
				if (msg.role === "assistant") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="msg-icon svelte-18brgu8" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="svelte-18brgu8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" class="svelte-18brgu8"></path></svg></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="msg-bubble svelte-18brgu8"><p class="msg-text svelte-18brgu8">${html(msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>"))}</p> `);
				if (msg.loginPrompt) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="login-cta-wrap svelte-18brgu8"><a href="/auth/login" class="login-cta-btn svelte-18brgu8">Sign in — it's free</a> <a href="/auth/register" class="login-cta-link svelte-18brgu8">Create account</a></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (msg.followUps && msg.followUps.length > 0 && true) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="follow-ups svelte-18brgu8"><!--[-->`);
					const each_array_1 = ensure_array_like(msg.followUps);
					for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
						let fu = each_array_1[$$index];
						$$renderer.push(`<button class="follow-up-chip svelte-18brgu8">${escape_html(fu)}</button>`);
					}
					$$renderer.push(`<!--]--></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (isLoggedIn) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="copilot-input-area svelte-18brgu8"><input${attr("value", inputValue)}${attr("placeholder", context() ? `Ask about "${context().contentTitle}"\u2026` : "Ask about faith, movies, or content…")}${attr("disabled", loading, true)} class="copilot-input svelte-18brgu8"${attr("maxlength", 500)}/> <button${attr("disabled", !inputValue.trim(), true)} aria-label="Send message" class="copilot-send-btn svelte-18brgu8">`);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-18brgu8"><line x1="22" y1="2" x2="11" y2="13" class="svelte-18brgu8"></line><polygon points="22 2 15 22 11 13 2 9 22 2" class="svelte-18brgu8"></polygon></svg>`);
				$$renderer.push(`<!--]--></button></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="copilot-input-area svelte-18brgu8"><input${attr("value", inputValue)} placeholder="Type a question to preview\\u2026" class="copilot-input svelte-18brgu8"${attr("maxlength", 500)}/> <button${attr("disabled", !inputValue.trim(), true)} aria-label="Send message" class="copilot-send-btn svelte-18brgu8"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-18brgu8"><line x1="22" y1="2" x2="11" y2="13" class="svelte-18brgu8"></line><polygon points="22 2 15 22 11 13 2 9 22 2" class="svelte-18brgu8"></polygon></svg></button></div> <div class="guest-footer svelte-18brgu8"><a href="/auth/login" class="guest-signin-btn svelte-18brgu8">Sign in to chat</a> <a href="/auth/register" class="guest-register-link svelte-18brgu8">Create account</a></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/components/LiveRegion.svelte
function LiveRegion($$renderer) {
	var $$store_subs;
	$$renderer.push(`<span class="sr-only" aria-live="polite" aria-atomic="true" role="status">${escape_html(store_get($$store_subs ??= {}, "$liveRegionBuffer", liveRegionBuffer))}</span>`);
	if ($$store_subs) unsubscribe_stores($$store_subs);
	/**
	* Singleton aria-live region. Mount once per portal layout.
	* Listens to the live-region store and renders into a visually-hidden
	* span; assistive tech reads it out as text changes.
	*/
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, children } = $$props;
		let isPortalRoute = derived(() => page.url.pathname.startsWith("/admin") || page.url.pathname.startsWith("/creator"));
		let isLoggedIn = derived(() => !!data?.user && !isPortalRoute());
		let canonical = derived(() => () => {
			return `${SiteMeta.link.replace(/\/$/, "")}${page.url.pathname.replace(/\/$/, "") || "/"}`;
		});
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(SiteMeta.title)}</title>`);
			});
			$$renderer.push(`<meta name="title"${attr("content", SiteMeta.title)}/> <meta name="description"${attr("content", SiteMeta.description)}/> <meta name="keywords"${attr("content", SiteMeta.keywords.join(", "))}/> <link rel="canonical"${attr("href", canonical()())}/> <meta property="og:type" content="website"/> <meta property="og:site_name"${attr("content", SiteMeta.name)}/> <meta property="og:url"${attr("content", canonical()())}/> <meta property="og:title"${attr("content", SiteMeta.title)}/> <meta property="og:description"${attr("content", SiteMeta.description)}/> <meta property="og:image"${attr("content", `${SiteMeta.link}${SiteMeta.ogimage}`)}/> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:site"${attr("content", SiteMeta.twitterHandle)}/> <meta name="twitter:url"${attr("content", canonical()())}/> <meta name="twitter:title"${attr("content", SiteMeta.title)}/> <meta name="twitter:description"${attr("content", SiteMeta.description)}/> <meta name="twitter:image"${attr("content", `${SiteMeta.link}${SiteMeta.ogimage}`)}/>`);
		});
		Toaster($$renderer, {
			richColors: true,
			position: "top-center"
		});
		$$renderer.push(`<!----> `);
		Mode_watcher($$renderer, {
			defaultMode: "dark",
			disableTransitions: true
		});
		$$renderer.push(`<!----> `);
		PWAInstallPrompt($$renderer, {});
		$$renderer.push(`<!----> `);
		LiveRegion($$renderer, {});
		$$renderer.push(`<!----> `);
		children?.($$renderer);
		$$renderer.push(`<!----> `);
		if (!isPortalRoute()) {
			$$renderer.push("<!--[0-->");
			AICopilot($$renderer, { isLoggedIn: isLoggedIn() });
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _layout as default };
