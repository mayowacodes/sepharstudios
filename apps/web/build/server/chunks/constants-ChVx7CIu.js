import { aH as spread_props, ad as attributes, ag as clsx$1 } from './ui-libs-TtGtWAGI.js';
import { I as Icon } from './Icon-CGEdwVFL.js';
import { F as File_text } from './file-text-CODLMeLI.js';
import { L as Layout_dashboard } from './layout-dashboard-B00hq5k6.js';
import { U as User } from './user-BR-ZR5dM.js';
import { U as Users } from './users-Bb_ynahW.js';

//#region src/lib/components/icons/logo.svelte
function Logo($$renderer, $$props) {
	let { class: className, $$slots, $$events, ...rest } = $$props;
	$$renderer.push(`<img${attributes({
		src: "/logo-alone-sepharstudios-bgless.png",
		alt: "Sephar Studios",
		class: clsx$1(className || ""),
		...rest
	})} onload="this.__e=event" onerror="this.__e=event"/>`);
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/house.svelte
function House($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "house" },
		props,
		{ iconNode: [["path", { "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }], ["path", { "d": "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }]] }
	]));
}
//#endregion
//#region src/lib/constants/index.ts
var Role = /* @__PURE__ */ function(Role) {
	Role["ADMIN"] = "admin";
	Role["EDITOR"] = "editor";
	Role["CREATOR"] = "creator";
	Role["USER"] = "user";
	return Role;
}({});
var Fields = /* @__PURE__ */ function(Fields) {
	Fields["USER"] = "user";
	return Fields;
}({});
var Constants = /* @__PURE__ */ function(Constants) {
	Constants["BRANDNAME"] = "Sephar Studios";
	Constants["CREDENTIAL"] = "credential";
	Constants["GOOGLE"] = "google";
	Constants["AFTERAUTH"] = "/browse";
	Constants["SUPPORTEMAIL"] = "support@sepharstudios.com";
	Constants["BRANDWEBSITE"] = "https://sepharstudios.com";
	return Constants;
}({});
var SiteMeta = {
	name: "Sephar Studios",
	title: "Sephar Studios — Faith-based streaming for families",
	description: "Stream faith-based movies, shows, documentaries, and kids content. Family-safe viewing, ad-free premium tiers, and creator-owned originals — all on one platform.",
	keywords: [
		"faith based streaming",
		"christian movies",
		"christian shows",
		"family streaming",
		"kids christian content",
		"documentaries",
		"sephar studios",
		"faith films"
	],
	ogimage: "/screenshot-wide.webp",
	twitterHandle: "@sepharstudios",
	link: "https://sepharstudios.com"};
var documentationRoles = [
	"admin",
	"editor",
	"user"
];
var dashboardRoles = [
	"admin",
	"editor",
	"user"
];
var usersRoles = ["admin"];
var profileRoles = [
	"admin",
	"editor",
	"user"
];
var homeRoles = [
	"admin",
	"editor",
	"user"
];
var getNavigation = (reference) => {
	const isActive = (url) => reference === url;
	return {
		teams: [{
			name: "Homepage",
			logo: Logo,
			plan: "sepharstudios",
			url: "/"
		}],
		navMain: [
			{
				title: "Documentation",
				url: "/documentation",
				roles: documentationRoles,
				icon: File_text,
				isActive: isActive("/documentation")
			},
			{
				title: "Dashboard",
				url: "/dashboard",
				roles: dashboardRoles,
				icon: Layout_dashboard,
				isActive: isActive("/dashboard")
			},
			{
				title: "Users",
				url: "/users",
				roles: usersRoles,
				icon: Users,
				isActive: isActive("/users")
			},
			{
				title: "Profile",
				url: "/profile",
				roles: profileRoles,
				icon: User,
				isActive: isActive("/profile")
			}
		],
		publicNav: [{
			name: "Home",
			href: "/",
			icon: House,
			roles: homeRoles
		}],
		privateNav: [{
			name: "Home",
			href: "/",
			icon: House,
			roles: homeRoles
		}, {
			name: "Dashboard",
			href: "/dashboard",
			icon: Layout_dashboard,
			roles: dashboardRoles
		}]
	};
};
var adminRoles = ["admin"];
var emptyMetalist = {
	total: 0,
	meta: {
		cursor: "",
		more: false,
		size: 0
	},
	data: []
};

export { Constants as C, Fields as F, House as H, Role as R, SiteMeta as S, adminRoles as a, emptyMetalist as e, getNavigation as g, usersRoles as u };
//# sourceMappingURL=constants-ChVx7CIu.js.map
