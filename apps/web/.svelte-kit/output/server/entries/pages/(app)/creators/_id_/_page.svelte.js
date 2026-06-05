import { Dt as spread_props, Lt as attr, Mt as html, St as derived, Tt as head, wt as ensure_array_like, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { i as SiteMeta } from "../../../../../chunks/constants.js";
import { t as Icon } from "../../../../../chunks/Icon.js";
import { t as External_link } from "../../../../../chunks/external-link.js";
import { t as Heart } from "../../../../../chunks/heart.js";
import { n as goto } from "../../../../../chunks/client.js";
import "../../../../../chunks/navigation.js";
import { t as Button } from "../../../../../chunks/button.js";
import { t as Badge } from "../../../../../chunks/badge.js";
import { t as MovieCard } from "../../../../../chunks/MovieCard.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/badge-check.svelte
function Badge_check($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "badge-check" },
		props,
		{ iconNode: [["path", { "d": "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" }], ["path", { "d": "m9 12 2 2 4-4" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/heart-off.svelte
function Heart_off($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "heart-off" },
		props,
		{ iconNode: [
			["path", { "d": "M10.5 4.893a5.5 5.5 0 0 1 1.091.931.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 1.872-1.002 3.356-2.187 4.655" }],
			["path", { "d": "m16.967 16.967-3.459 3.346a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 2.747-4.761" }],
			["path", { "d": "m2 2 20 20" }]
		] }
	]));
}
//#endregion
//#region src/routes/(app)/creators/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		let creator = derived(() => data.creator);
		let content = derived(() => data.content);
		let followerCount = 0;
		let isFollowing = false;
		let isOwnProfile = derived(() => data.isOwnProfile);
		let toggling = false;
		async function toggleFollow() {
			toggling = true;
			try {
				const method = isFollowing ? "DELETE" : "POST";
				const res = await fetch(`/api/creators/${creator().id}/follow`, { method });
				if (res.status === 401) {
					goto(`/auth/login?redirectTo=/creators/${creator().id}`);
					return;
				}
				const body = await res.json();
				if (!res.ok) throw new Error(body.error ?? "Follow toggle failed");
				isFollowing = body.following;
				followerCount = body.followerCount;
			} catch (err) {
				alert(err.message);
			} finally {
				toggling = false;
			}
		}
		head("1b9lznf", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(creator().displayName)} · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", creator().bio ?? `${creator().displayName} on Sephar Studios — faith-based content creator.`)}/> <meta property="og:type" content="profile"/> <meta property="og:title"${attr("content", `${creator().displayName} · Sephar Studios`)}/> <meta property="og:description"${attr("content", creator().bio ?? "")}/> `);
			if (creator().avatarUrl) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<meta property="og:image"${attr("content", creator().avatarUrl)}/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> ${html(`<script type="application/ld+json">${JSON.stringify({
				"@context": "https://schema.org",
				"@type": creator().creatorType === "organization" ? "Organization" : "Person",
				name: creator().displayName,
				description: creator().bio ?? void 0,
				image: creator().avatarUrl ?? void 0,
				url: `${SiteMeta.link}/creators/${creator().id}`
			})}<\/script>`)}`);
		});
		$$renderer.push(`<div class="min-h-screen bg-background text-white"><div class="relative h-48 sm:h-64 bg-linear-to-br from-primary/20 via-background to-background">`);
		if (creator().bannerUrl) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<img${attr("src", creator().bannerUrl)} alt="" class="absolute inset-0 w-full h-full object-cover"/> <div class="absolute inset-0 bg-linear-to-t from-background to-transparent"></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="max-w-5xl mx-auto px-4 -mt-16 relative"><div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"><div class="flex items-end gap-4"><div class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-card border-4 border-background shadow-xl overflow-hidden shrink-0">`);
		if (creator().avatarUrl) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<img${attr("src", creator().avatarUrl)} alt="" class="w-full h-full object-cover"/>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">${escape_html(creator().displayName.slice(0, 1).toUpperCase())}</div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="pb-2"><h1 class="text-2xl sm:text-3xl font-bold flex items-center gap-2">${escape_html(creator().displayName)} `);
		if (creator().isVerified) {
			$$renderer.push("<!--[0-->");
			Badge_check($$renderer, {
				class: "w-6 h-6 text-primary",
				"aria-label": "Verified creator"
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></h1> <div class="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">`);
		Badge($$renderer, {
			variant: "outline",
			class: "capitalize",
			children: ($$renderer) => {
				$$renderer.push(`<!---->${escape_html(creator().creatorType?.replace("_", " ") ?? "creator")}`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		if (creator().denomination) {
			$$renderer.push("<!--[0-->");
			Badge($$renderer, {
				variant: "secondary",
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(creator().denomination)}`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <span>${escape_html(followerCount.toLocaleString())} ${escape_html(followerCount === 1 ? "follower" : "followers")}</span></div></div></div> `);
		if (!isOwnProfile()) {
			$$renderer.push("<!--[0-->");
			Button($$renderer, {
				onclick: toggleFollow,
				disabled: toggling,
				variant: isFollowing ? "outline" : "default",
				"aria-pressed": isFollowing,
				children: ($$renderer) => {
					if (isFollowing) {
						$$renderer.push("<!--[0-->");
						Heart_off($$renderer, { class: "w-4 h-4 mr-2" });
						$$renderer.push(`<!----> ${escape_html(toggling ? "Unfollowing…" : "Following")}`);
					} else {
						$$renderer.push("<!--[-1-->");
						Heart($$renderer, { class: "w-4 h-4 mr-2" });
						$$renderer.push(`<!----> ${escape_html(toggling ? "Following…" : "Follow")}`);
					}
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (creator().bio) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-card border border-border rounded-2xl p-6 mb-8"><h2 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">About</h2> <p class="text-sm whitespace-pre-line">${escape_html(creator().bio)}</p></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (creator().socialLinks && Object.keys(creator().socialLinks).length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-3 mb-8"><!--[-->`);
			const each_array = ensure_array_like(Object.entries(creator().socialLinks));
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let [platform, url] = each_array[$$index];
				if (typeof url === "string" && url) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<a${attr("href", url)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">${escape_html(platform)} `);
					External_link($$renderer, { class: "w-3 h-3" });
					$$renderer.push(`<!----></a>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h2 class="text-xl font-bold mb-4">Content from ${escape_html(creator().displayName)}</h2> `);
		if (content().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-card border border-border rounded-2xl p-12 text-center"><p class="text-muted-foreground">No published content yet.</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pb-16"><!--[-->`);
			const each_array_1 = ensure_array_like(content());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let item = each_array_1[$$index_1];
				MovieCard($$renderer, { movie: item });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
