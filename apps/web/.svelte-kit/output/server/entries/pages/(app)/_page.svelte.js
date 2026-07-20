import { Et as derived } from "../../../chunks/ui-libs.js";
import { t as Constants } from "../../../chunks/constants.js";
import "../../../chunks/Icon.js";
import "../../../chunks/circle-play.js";
import "../../../chunks/coins.js";
import "../../../chunks/crown.js";
import "../../../chunks/film.js";
import "../../../chunks/lock.js";
import { t as Mail } from "../../../chunks/mail.js";
import "../../../chunks/play.js";
import { t as Shield_alert } from "../../../chunks/shield-alert.js";
import "../../../chunks/sparkles.js";
import "../../../chunks/trending-up.js";
import "../../../chunks/users.js";
import "../../../chunks/ComingSoonRow.js";
import "../../../chunks/volume-x.js";
import { t as X } from "../../../chunks/x.js";
import "../../../chunks/zap.js";
import { t as page } from "../../../chunks/state.js";
import "../../../chunks/navigation.js";
import { t as Button } from "../../../chunks/button.js";
import "../../../chunks/MediaGrid.js";
import "../../../chunks/Recommendations2.js";
//#endregion
//#region src/lib/components/widgets/AccessDeniedBanner.svelte
function AccessDeniedBanner($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		if (derived(() => page.url.searchParams.get("denied"))() === "admin" && true) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="access-denied-banner svelte-19o2cg7" role="alert"><div class="access-denied-inner svelte-19o2cg7"><div class="access-denied-icon svelte-19o2cg7">`);
			Shield_alert($$renderer, { class: "w-5 h-5" });
			$$renderer.push(`<!----></div> <div class="access-denied-body svelte-19o2cg7"><p class="access-denied-title svelte-19o2cg7">Admin portal access required</p> <p class="access-denied-text svelte-19o2cg7">Your account doesn't have admin privileges. Reach out to the support team and we'll review your request.</p></div> <div class="access-denied-actions svelte-19o2cg7">`);
			Button($$renderer, {
				size: "sm",
				href: `mailto:${Constants.SUPPORTEMAIL}?subject=Admin%20access%20request`,
				children: ($$renderer) => {
					Mail($$renderer, { class: "w-4 h-4 mr-1.5" });
					$$renderer.push(`<!----> Contact support`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <button type="button" class="access-denied-close svelte-19o2cg7" aria-label="Dismiss notice">`);
			X($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----></button></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/(app)/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		derived(() => page.data.user);
		derived(() => [
			{
				title: "Trending Movies",
				items: data.movies || []
			},
			{
				title: "Popular Shows",
				items: data.shows || []
			},
			{
				title: "Inspiring Documentaries",
				items: data.documentaries || []
			}
		]);
		const featuredTrailer = derived(() => {
			const pools = [
				data.movies,
				data.shows,
				data.documentaries
			];
			for (const pool of pools) {
				const match = pool?.find((m) => typeof m.trailerUrl === "string" && m.trailerUrl.startsWith("http"));
				if (match) return match;
			}
			return null;
		});
		derived(() => {
			if (!featuredTrailer()) return "/movies";
			const slug = featuredTrailer().slug || featuredTrailer().id || "";
			if (featuredTrailer().category === "kids") return `/kids/kiddies/${slug}`;
			if (featuredTrailer().category === "teens") return `/kids/teens/${slug}`;
			return `/movies/${slug}`;
		});
		$$renderer.push(`<div class="relative overflow-hidden min-h-screen bg-(--surface-charcoal) text-white"><div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]"></div> `);
		AccessDeniedBanner($$renderer, {});
		$$renderer.push(`<!----> <main class="container relative z-10 pt-32 pb-16 mx-auto px-4">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></main></div>`);
	});
}
//#endregion
export { _page as default };
