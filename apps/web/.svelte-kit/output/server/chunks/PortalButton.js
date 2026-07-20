import { Et as derived, Ut as clsx, wt as attributes } from "./ui-libs.js";
//#region src/lib/components/portal/PortalButton.svelte
function PortalButton($$renderer, $$props) {
	/**
	* Portal-scoped button. Five variants drive the entire CTA system
	* across /admin and /creator. Read CSS variables from PortalShell
	* (--portal-accent, --portal-gradient-cta, etc.), so a single
	* component renders portal-correct chrome without any portal-aware
	* logic here.
	*/
	let { variant = "primary", size = "md", href, type = "button", disabled = false, loading = false, class: className = "", children, $$slots, $$events, ...rest } = $$props;
	const base = "relative inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--portal-accent))] focus-visible:ring-offset-[hsl(var(--portal-bg-base))] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]";
	const sizeClasses = {
		sm: "text-xs px-2.5 py-1.5 rounded-md",
		md: "text-sm px-4 py-2 rounded-lg",
		lg: "text-base px-5 py-2.5 rounded-xl"
	};
	const iconSizeClasses = {
		sm: "w-7 h-7 rounded-md",
		md: "w-9 h-9 rounded-lg",
		lg: "w-11 h-11 rounded-xl"
	};
	const variantClasses = {
		primary: "text-white shadow-md hover:-translate-y-px hover:shadow-[var(--portal-accent-glow)] [background:var(--portal-gradient-cta)]",
		secondary: "text-[hsl(var(--portal-accent))] backdrop-blur-md border border-[hsl(var(--portal-border))] bg-[hsl(var(--portal-bg-elevated)/0.5)] hover:border-[hsl(var(--portal-accent))] hover:bg-[hsl(var(--portal-bg-elevated)/0.8)] hover:shadow-[var(--portal-accent-glow)]",
		ghost: "text-[hsl(var(--portal-text-muted))] hover:text-[hsl(var(--portal-text))] hover:bg-[hsl(var(--portal-bg-elevated)/0.5)]",
		destructive: "text-white bg-[hsl(var(--portal-danger))] hover:bg-[hsl(var(--portal-danger)/0.85)] hover:-translate-y-px hover:shadow-md",
		icon: "text-[hsl(var(--portal-text))] backdrop-blur-md border border-[hsl(var(--portal-border))] bg-[hsl(var(--portal-bg-elevated)/0.6)] hover:scale-105 hover:border-[hsl(var(--portal-accent))] hover:shadow-[var(--portal-accent-glow)]"
	};
	const finalClass = derived(() => `${base} ${variant === "icon" ? iconSizeClasses[size] : sizeClasses[size]} ${variantClasses[variant]} ${className}`);
	if (href) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<a${attributes({
			href,
			class: clsx(finalClass()),
			"aria-disabled": disabled,
			...rest
		})}>`);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		children?.($$renderer);
		$$renderer.push(`<!----></a>`);
	} else {
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<button${attributes({
			type,
			disabled,
			class: clsx(finalClass()),
			...rest
		})}>`);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		children?.($$renderer);
		$$renderer.push(`<!----></button>`);
	}
	$$renderer.push(`<!--]-->`);
}
//#endregion
export { PortalButton as t };
