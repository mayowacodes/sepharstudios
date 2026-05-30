import { al as ensure_array_like, at as head, aa as attr, an as escape_html, aI as store_get, ab as attr_class, aO as unsubscribe_stores, ae as bind_props, ao as fallback, aQ as writable, aH as spread_props } from './ui-libs-TtGtWAGI.js';
import { I as Icon } from './Icon-CGEdwVFL.js';
import { W as WalletConnect } from './WalletConnect-DI9hjdh2.js';
import { C as Chevron_down } from './chevron-down-mzP8AnTN.js';
import { C as Chevron_right, S as Sheet, e as Sheet_trigger, a as Sheet_content } from './sheet-DgeY35Gk.js';
import { L as List_video, C as Clapperboard } from './list-video-DFi41qJI.js';
import { C as Clock } from './clock-DstfyR2R.js';
import { C as Coins } from './coins-B3BwYJFB.js';
import { C as Crown } from './crown-BWSJY-VY.js';
import { D as Download } from './download-DU7Dev9Y.js';
import { G as Gift } from './gift-DRnCdiID.js';
import { S as Settings$1 } from './settings-Hcbiy6MZ.js';
import { U as User } from './user-BR-ZR5dM.js';
import { p as page } from './state-Cm-InHWy.js';
import { B as Button } from './button-D9M18H3C.js';
import { i as isConnected } from './wallet2-CUQK2HjM.js';
import './config-BPBzrUzB.js';
import './rolldown-runtime-pTpnEGsq.js';
import './external-link-B4ZY0tn6.js';
import './wallet-hvKePUx2.js';
import './zap-C4H7G9BI.js';
import './badge-HJ6WNmX7.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';
import './card-DdzYeJGJ.js';
import './x-DtBkfd3e.js';
import './client-CZa6R-ON.js';
import './internal-CB1sTboO.js';
import './index-DBqjc0Yf.js';
import './polygon-D78JtxJX.js';
import './utils-BQDJK5Ro.js';
import 'node:crypto';

//#region src/lib/components/sections/dashboard/RecentlyWatched.svelte
function RecentlyWatched($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<section><h2 class="text-xl font-semibold mb-4">Continue Watching</h2> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex gap-4"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="w-44 shrink-0 space-y-2"><div class="aspect-video bg-white/5 rounded-lg animate-pulse"></div> <div class="h-3 bg-white/5 rounded w-3/4 animate-pulse"></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></section>`);
	});
}
//#endregion
//#region src/lib/components/sections/dashboard/Recommendations.svelte
function Recommendations($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<section><h2 class="text-xl font-semibold mb-4">Recommended for You</h2> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex gap-4"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3,
				4
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="w-36 shrink-0 space-y-2"><div class="aspect-2/3 bg-white/5 rounded-lg animate-pulse"></div> <div class="h-3 bg-white/5 rounded w-3/4 animate-pulse"></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></section>`);
	});
}

//#region ../../node_modules/@lucide/svelte/dist/icons/circle-plus.svelte
function Circle_plus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "circle-plus" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "10"
			}],
			["path", { "d": "M8 12h8" }],
			["path", { "d": "M12 8v8" }]
		] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/pencil.svelte
function Pencil($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "pencil" },
		props,
		{ iconNode: [["path", { "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" }], ["path", { "d": "m15 5 4 4" }]] }
	]));
}
//#endregion
//#region src/lib/stores/profileStores.ts
var currentProfile = writable(null);
//#endregion
//#region src/lib/components/sections/dashboard/ProfileSwitcher.svelte
function ProfileSwitcher($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		const maxProfiles = 8;
		let open = false;
		const profileSlots = writable([
			{
				id: "1",
				type: "adult",
				name: "Dad",
				avatar: "",
				parental: false
			},
			{
				id: "2",
				type: "adult",
				name: "Mom",
				avatar: "",
				parental: false
			},
			{
				id: "3",
				type: "adult",
				name: "John",
				avatar: "",
				parental: false
			},
			{
				id: "4",
				type: "adult",
				name: "Jane",
				avatar: "",
				parental: false
			},
			{
				id: "5",
				type: "teen",
				name: "Alex",
				avatar: "",
				parental: true
			},
			{
				id: "6",
				type: "teen",
				name: "Sam",
				avatar: "",
				parental: true
			},
			{
				id: "7",
				type: "kids",
				name: "Lily",
				avatar: "",
				parental: true
			},
			{
				id: "8",
				type: "kids",
				name: "Tommy",
				avatar: "",
				parental: true
			}
		]);
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Sheet($$renderer, {
				get open() {
					return open;
				},
				set open($$value) {
					open = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					Sheet_trigger($$renderer, {
						class: "inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition cursor-pointer",
						children: ($$renderer) => {
							$$renderer.push(`<span>${escape_html(store_get($$store_subs ??= {}, "$currentProfile", currentProfile)?.name ?? "Select Profile")}</span> `);
							Chevron_down($$renderer, { class: "w-4 h-4" });
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Sheet_content($$renderer, {
						side: "bottom",
						class: "p-6 sm:max-w-md mx-auto",
						children: ($$renderer) => {
							$$renderer.push(`<h2 class="text-lg font-semibold mb-4 text-center">Manage Profiles</h2> <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4"><!--[-->`);
							const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$profileSlots", profileSlots));
							for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
								let profile = each_array[$$index];
								$$renderer.push(`<div class="flex flex-col items-center gap-2 p-3 bg-muted rounded-xl hover:bg-muted/70 transition cursor-pointer relative"><div class="relative group"><button class="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">${escape_html(profile.name[0])}</button> <button class="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-sm cursor-pointer group-hover:scale-110 border">`);
								Pencil($$renderer, { class: "w-3 h-3 text-muted-foreground" });
								$$renderer.push(`<!----></button></div> <span class="text-sm font-medium">${escape_html(profile.name)}</span> <span class="text-[10px] text-muted-foreground capitalize">${escape_html(profile.type)} ${escape_html(profile.parental ? "(KIDS)" : "")}</span></div>`);
							}
							$$renderer.push(`<!--]--></div> `);
							if (store_get($$store_subs ??= {}, "$profileSlots", profileSlots).length < maxProfiles) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<button class="flex items-center justify-center w-full gap-2 text-sm font-medium text-primary hover:underline mt-4">`);
								Circle_plus($$renderer, { class: "w-4 h-4" });
								$$renderer.push(`<!----> Add New Profile</button>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<p class="text-xs text-muted-foreground text-center">Maximum of 8 profiles reached.</p>`);
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/components/sections/dashboard/Downloads.svelte
function Downloads($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<section><div class="flex items-center justify-between mb-4"><h2 class="text-xl font-semibold">Downloads</h2> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-3"><!--[-->`);
			const each_array = ensure_array_like([1, 2]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="h-16 bg-white/5 rounded-lg animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></section>`);
	});
}
//#endregion
//#region src/lib/components/sections/dashboard/MyList.svelte
function MyList($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<section>`);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-3 gap-3"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="h-28 rounded bg-muted/30 animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></section>`);
	});
}
//#endregion
//#region src/lib/components/sections/dashboard/Settings.svelte
function Settings($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { settings = {
			notificationsEnabled: true,
			language: "English"
		} } = $$props;
		const changeLanguage = (e) => {
			const target = e.target;
			if (target) settings.language = target.value;
		};
		$$renderer.push(`<section><h2 class="text-xl font-semibold mb-4">Settings</h2> <div class="space-y-4"><div class="flex items-center justify-between p-4 bg-muted/30 border rounded shadow-sm"><span class="font-medium">Notifications</span> <label class="switch"><input type="checkbox"${attr("checked", settings.notificationsEnabled, true)}/> <span class="slider round"></span></label></div> <div class="flex items-center justify-between p-4 bg-muted/30 border rounded shadow-sm"><span class="font-medium">Language</span> `);
		$$renderer.select({
			class: "p-2 rounded bg-background border",
			value: settings.language,
			onchange: changeLanguage
		}, ($$renderer) => {
			$$renderer.option({ value: "English" }, ($$renderer) => {
				$$renderer.push(`English`);
			});
			$$renderer.option({ value: "Spanish" }, ($$renderer) => {
				$$renderer.push(`Spanish`);
			});
			$$renderer.option({ value: "French" }, ($$renderer) => {
				$$renderer.push(`French`);
			});
		});
		$$renderer.push(`</div></div></section>`);
		bind_props($$props, { settings });
	});
}
//#endregion
//#region src/lib/components/sections/dashboard/AccountSettings.svelte
function AccountSettings($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let accountSettings = fallback($$props["accountSettings"], () => ({
			email: "user@example.com",
			password: "••••••••"
		}), true);
		let newEmail = accountSettings.email;
		let newPassword = accountSettings.password;
		const updateAccountDetails = () => {
			accountSettings.email = newEmail;
			accountSettings.password = newPassword;
			alert("Account details updated");
		};
		$$renderer.push(`<section><h2 class="text-xl font-semibold mb-4">Account Settings</h2> <div class="space-y-4"><div class="flex flex-col p-4 bg-muted-foreground/10 rounded shadow-md"><label for="email" class="font-medium">Email</label> <input id="email" type="email" class="p-2 rounded mt-2"${attr("value", newEmail)} placeholder="Enter your email"/></div> <div class="flex flex-col p-4 bg-muted-foreground/10 rounded shadow-md"><label for="password" class="font-medium">Password</label> <input id="password" type="password" class="p-2 rounded mt-2"${attr("value", newPassword)} placeholder="Enter your password"/></div> `);
		Button($$renderer, {
			variant: "default",
			onclick: updateAccountDetails,
			class: "mt-4",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Save Changes`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></section>`);
		bind_props($$props, { accountSettings });
	});
}
//#endregion
//#region src/routes/(app)/my-studios/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		const user = page.data?.user;
		const VALID_TABS = [
			"overview",
			"mylist",
			"recent",
			"downloads",
			"recommendations",
			"settings"
		];
		function resolveTab(value) {
			return VALID_TABS.includes(value ?? "") ? value : "overview";
		}
		let userTokenBalance = "0";
		let userStakingDiscount = 0;
		let activeTab = resolveTab(page.url.searchParams.get("tab"));
		function getUserInitial(u) {
			if (!u) return "?";
			if (u.name) return u.name[0].toUpperCase();
			if (u.email) return u.email[0].toUpperCase();
			return "?";
		}
		const tabs = [
			{
				key: "overview",
				label: "Overview",
				icon: User
			},
			{
				key: "mylist",
				label: "My List",
				icon: List_video
			},
			{
				key: "recent",
				label: "Recently Watched",
				icon: Clock
			},
			{
				key: "downloads",
				label: "Downloads",
				icon: Download
			},
			{
				key: "recommendations",
				label: "For You",
				icon: Clapperboard
			},
			{
				key: "settings",
				label: "Settings",
				icon: Settings$1
			}
		];
		head("a54zow", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>My Studios · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Your personal Sephar Studios dashboard — manage profiles, watchlist, downloads and settings."/>`);
		});
		$$renderer.push(`<main class="mystudios-page svelte-a54zow"><section class="mystudios-hero svelte-a54zow"><div class="mystudios-hero-glow svelte-a54zow"></div> <div class="mystudios-hero-inner svelte-a54zow"><div class="mystudios-hero-avatar svelte-a54zow">`);
		if (user?.image) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<img${attr("src", user.image)}${attr("alt", user.name)} class="w-full h-full object-cover rounded-full"/>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="mystudios-hero-initial svelte-a54zow">${escape_html(getUserInitial(user))}</span>`);
		}
		$$renderer.push(`<!--]--> <div class="mystudios-hero-ring svelte-a54zow"></div></div> <div class="mystudios-hero-info svelte-a54zow"><h1 class="mystudios-hero-name svelte-a54zow">${escape_html(user?.name ?? "My Studios")}</h1> `);
		if (user?.email) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="mystudios-hero-email svelte-a54zow">${escape_html(user.email)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mystudios-hero-badges svelte-a54zow"><span class="badge badge--gold svelte-a54zow">`);
		Crown($$renderer, { size: 11 });
		$$renderer.push(`<!----> Premium</span> `);
		if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="badge badge--purple svelte-a54zow">`);
			Coins($$renderer, { size: 11 });
			$$renderer.push(`<!----> ${escape_html(parseFloat(userTokenBalance).toLocaleString())} STC</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> `);
		if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mystudios-hero-stats svelte-a54zow"><div class="stat-pill svelte-a54zow">`);
			Coins($$renderer, {
				size: 14,
				class: "stat-icon"
			});
			$$renderer.push(`<!----> <div><p class="stat-val svelte-a54zow">${escape_html(parseFloat(userTokenBalance).toLocaleString())}</p> <p class="stat-label svelte-a54zow">STC Tokens</p></div></div> <div class="stat-pill svelte-a54zow">`);
			Gift($$renderer, {
				size: 14,
				class: "stat-icon"
			});
			$$renderer.push(`<!----> <div><p class="stat-val svelte-a54zow">${escape_html(userStakingDiscount)}%</p> <p class="stat-label svelte-a54zow">Discount</p></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="mystudios-hero-shimmer svelte-a54zow"></div></section> <nav class="mystudios-tabs svelte-a54zow" aria-label="Studio sections"><!--[-->`);
		const each_array = ensure_array_like(tabs);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let tab = each_array[$$index];
			$$renderer.push(`<button${attr_class("mystudios-tab svelte-a54zow", void 0, { "active": activeTab === tab.key })}>`);
			if (tab.icon) {
				$$renderer.push("<!--[-->");
				tab.icon($$renderer, { size: 15 });
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` ${escape_html(tab.label)}</button>`);
		}
		$$renderer.push(`<!--]--></nav> <div class="mystudios-content svelte-a54zow">`);
		if (activeTab === "overview") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="overview-grid svelte-a54zow"><div class="overview-card svelte-a54zow"><div class="overview-card-header svelte-a54zow">`);
			User($$renderer, {
				size: 16,
				class: "overview-card-icon"
			});
			$$renderer.push(`<!----> <h2 class="svelte-a54zow">Switch Profile</h2> <button class="overview-card-action svelte-a54zow">Manage `);
			Chevron_right($$renderer, { size: 13 });
			$$renderer.push(`<!----></button></div> <div class="overview-card-body svelte-a54zow">`);
			ProfileSwitcher($$renderer);
			$$renderer.push(`<!----></div></div> <div class="overview-card svelte-a54zow"><div class="overview-card-header svelte-a54zow">`);
			List_video($$renderer, {
				size: 16,
				class: "overview-card-icon"
			});
			$$renderer.push(`<!----> <h2 class="svelte-a54zow">My List</h2> <a href="/watchlist" class="overview-card-action svelte-a54zow">View all `);
			Chevron_right($$renderer, { size: 13 });
			$$renderer.push(`<!----></a></div> <div class="overview-card-body svelte-a54zow">`);
			MyList($$renderer);
			$$renderer.push(`<!----></div></div> <div class="overview-card svelte-a54zow"><div class="overview-card-header svelte-a54zow">`);
			Clock($$renderer, {
				size: 16,
				class: "overview-card-icon"
			});
			$$renderer.push(`<!----> <h2 class="svelte-a54zow">Recently Watched</h2></div> <div class="overview-card-body svelte-a54zow">`);
			RecentlyWatched($$renderer);
			$$renderer.push(`<!----></div></div> <div class="overview-card overview-card--web3 svelte-a54zow"><div class="overview-card-header svelte-a54zow">`);
			Crown($$renderer, {
				size: 16,
				class: "overview-card-icon overview-card-icon--gold"
			});
			$$renderer.push(`<!----> <h2 class="svelte-a54zow">NFT Subscription &amp; Tokens</h2></div> <div class="overview-card-body svelte-a54zow">`);
			if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="web3-grid svelte-a54zow"><div class="web3-stat svelte-a54zow">`);
				Coins($$renderer, {
					size: 20,
					class: "web3-stat-icon"
				});
				$$renderer.push(`<!----> <p class="web3-stat-val svelte-a54zow">${escape_html(parseFloat(userTokenBalance).toLocaleString())}</p> <p class="web3-stat-label svelte-a54zow">STC Tokens</p></div> <div class="web3-stat svelte-a54zow">`);
				Gift($$renderer, {
					size: 20,
					class: "web3-stat-icon"
				});
				$$renderer.push(`<!----> <p class="web3-stat-val svelte-a54zow">${escape_html(userStakingDiscount)}%</p> <p class="web3-stat-label svelte-a54zow">Staking Discount</p></div></div> <div class="web3-actions svelte-a54zow"><a href="/subscription" class="web3-btn web3-btn--primary svelte-a54zow">`);
				Crown($$renderer, { size: 14 });
				$$renderer.push(`<!----> NFT Subscription</a> <a href="/token" class="web3-btn web3-btn--outline svelte-a54zow">`);
				Coins($$renderer, { size: 14 });
				$$renderer.push(`<!----> Token Hub</a></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				WalletConnect($$renderer);
			}
			$$renderer.push(`<!--]--></div></div></div>`);
		} else if (activeTab === "mylist") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="content-section svelte-a54zow">`);
			MyList($$renderer);
			$$renderer.push(`<!----></div>`);
		} else if (activeTab === "recent") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<div class="content-section svelte-a54zow">`);
			RecentlyWatched($$renderer);
			$$renderer.push(`<!----></div>`);
		} else if (activeTab === "downloads") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<div class="content-section svelte-a54zow">`);
			Downloads($$renderer);
			$$renderer.push(`<!----></div>`);
		} else if (activeTab === "recommendations") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<div class="content-section svelte-a54zow">`);
			Recommendations($$renderer);
			$$renderer.push(`<!----></div>`);
		} else if (activeTab === "settings") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<div class="settings-grid svelte-a54zow"><div class="overview-card svelte-a54zow"><div class="overview-card-header svelte-a54zow">`);
			Settings$1($$renderer, {
				size: 16,
				class: "overview-card-icon"
			});
			$$renderer.push(`<!----> <h2 class="svelte-a54zow">Preferences</h2></div> <div class="overview-card-body svelte-a54zow">`);
			Settings($$renderer, {});
			$$renderer.push(`<!----></div></div> <div class="overview-card svelte-a54zow"><div class="overview-card-header svelte-a54zow">`);
			User($$renderer, {
				size: 16,
				class: "overview-card-icon"
			});
			$$renderer.push(`<!----> <h2 class="svelte-a54zow">Account</h2></div> <div class="overview-card-body svelte-a54zow">`);
			AccountSettings($$renderer, {});
			$$renderer.push(`<!----></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></main>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B92zKYc4.js.map
