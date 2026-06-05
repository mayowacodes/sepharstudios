import { At as stringify, Dt as spread_props, It as writable, Lt as attr, Ot as store_get, St as derived, bt as attributes, jt as unsubscribe_stores, vt as attr_class, wt as ensure_array_like, xt as bind_props, yt as attr_style, zt as escape_html } from "./ui-libs.js";
import "./index-server.js";
import { t as Icon } from "./Icon.js";
import { t as Activity } from "./activity.js";
import { t as Banknote } from "./banknote.js";
import { t as Bell } from "./bell.js";
import { t as Chart_column } from "./chart-column.js";
import { t as Check } from "./check.js";
import { t as Chevron_right } from "./chevron-right.js";
import { t as External_link } from "./external-link.js";
import { t as File_check } from "./file-check.js";
import { t as File_text } from "./file-text.js";
import { t as House } from "./house.js";
import { t as Landmark } from "./landmark.js";
import { t as Loader_circle } from "./loader-circle.js";
import { t as Log_out } from "./log-out.js";
import { t as Message_square } from "./message-square.js";
import { t as Monitor } from "./monitor.js";
import { _ as Moon, a as Sidebar_menu, c as Sidebar_inset, d as Sidebar_group_label, f as Sidebar_group_content, g as Sun, i as Sidebar_provider, l as Sidebar_header, m as Sidebar_content, n as Sidebar_trigger, o as Sidebar_menu_item, p as Sidebar_footer, r as Sidebar_rail, s as Sidebar_menu_button, t as Sidebar, u as Sidebar_group } from "./sidebar.js";
import { t as Pin } from "./pin.js";
import { t as Plus } from "./plus.js";
import { t as Search } from "./search.js";
import { t as Send } from "./send.js";
import { t as Settings } from "./settings.js";
import { t as Shield_alert } from "./shield-alert.js";
import { t as Shield_check } from "./shield-check.js";
import { t as Sparkles } from "./sparkles.js";
import { t as Triangle_alert } from "./triangle-alert.js";
import { t as Upload } from "./upload.js";
import { t as User } from "./user.js";
import { t as Users } from "./users.js";
import { t as Video } from "./video.js";
import { t as Wallet } from "./wallet.js";
import { t as X } from "./x.js";
import { t as Zap } from "./zap.js";
import "./toast-state.svelte.js";
import { a as derivedMode, n as resetMode, r as setMode } from "./dist.js";
import { n as goto } from "./client.js";
import { t as page } from "./state.js";
import "./navigation.js";
import { t as Separator } from "./separator.js";
import { c as Dropdown_menu_content, i as Dropdown_menu_separator, l as Dropdown_menu_sub, n as Dropdown_menu_sub_content, o as Dropdown_menu_item, r as Dropdown_menu_trigger, t as Dropdown_menu_sub_trigger, u as Dropdown_menu } from "./dropdown-menu.js";
import { a as Command_group, i as Command_item, n as Command_list, o as Command_empty, r as Command_input, s as Command_dialog, t as Command_separator } from "./command.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/compass.svelte
function Compass($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "compass" },
		props,
		{ iconNode: [["circle", {
			"cx": "12",
			"cy": "12",
			"r": "10"
		}], ["path", { "d": "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/pin-off.svelte
function Pin_off($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "pin-off" },
		props,
		{ iconNode: [
			["path", { "d": "M12 17v5" }],
			["path", { "d": "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" }],
			["path", { "d": "m2 2 20 20" }],
			["path", { "d": "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" }]
		] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/scale.svelte
function Scale($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "scale" },
		props,
		{ iconNode: [
			["path", { "d": "M12 3v18" }],
			["path", { "d": "m19 8 3 8a5 5 0 0 1-6 0zV7" }],
			["path", { "d": "M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" }],
			["path", { "d": "m5 8 3 8a5 5 0 0 1-6 0zV7" }],
			["path", { "d": "M7 21h10" }]
		] }
	]));
}
//#endregion
//#region src/lib/components/shell/portal-nav.ts
var ADMIN_NAV = [
	{
		label: "Overview",
		items: [
			{
				href: "/admin",
				label: "Dashboard",
				icon: House
			},
			{
				href: "/admin/ai-runs",
				label: "AI Runs",
				icon: Sparkles
			},
			{
				href: "/admin/system-health",
				label: "System health",
				icon: Activity
			},
			{
				href: "/admin/analytics",
				label: "Analytics",
				icon: Chart_column
			}
		]
	},
	{
		label: "Catalog",
		items: [
			{
				href: "/admin/review",
				label: "Review queue",
				icon: Shield_check
			},
			{
				href: "/admin/content",
				label: "Content",
				icon: Video
			},
			{
				href: "/admin/creator-applications",
				label: "Applications",
				icon: File_text
			}
		]
	},
	{
		label: "Community",
		items: [
			{
				href: "/admin/creators",
				label: "Creators",
				icon: Users
			},
			{
				href: "/admin/users",
				label: "Audience",
				icon: User
			},
			{
				href: "/admin/abuse",
				label: "Abuse",
				icon: Shield_alert
			}
		]
	},
	{
		label: "Finance",
		items: [
			{
				href: "/admin/refunds",
				label: "Refunds",
				icon: Banknote
			},
			{
				href: "/admin/disputes",
				label: "Disputes",
				icon: Scale
			},
			{
				href: "/admin/payouts",
				label: "Payouts",
				icon: Wallet
			},
			{
				href: "/admin/tax-forms",
				label: "Tax forms",
				icon: File_check
			}
		]
	},
	{
		label: "Settings",
		items: [{
			href: "/admin/governance",
			label: "Governance",
			icon: Landmark
		}, {
			href: "/admin/settings",
			label: "Settings",
			icon: Settings
		}]
	}
];
var CREATOR_NAV = [{
	label: "Make",
	items: [{
		href: "/creator",
		label: "Dashboard",
		icon: House
	}, {
		href: "/creator/upload",
		label: "Upload",
		icon: Upload
	}]
}, {
	label: "Manage",
	items: [
		{
			href: "/creator/content",
			label: "Content",
			icon: Video
		},
		{
			href: "/creator/analytics",
			label: "Analytics",
			icon: Chart_column
		},
		{
			href: "/creator/moderation",
			label: "Moderation",
			icon: Shield_check
		},
		{
			href: "/creator/inbox",
			label: "Inbox",
			icon: Message_square
		},
		{
			href: "/creator/profile",
			label: "Profile",
			icon: User
		},
		{
			href: "/creator/guidelines",
			label: "Guidelines",
			icon: File_text
		}
	]
}];
/** Flat lookup of every route → label, for the breadcrumb. */
function buildLabelMap(groups) {
	const out = {};
	for (const g of groups) for (const item of g.items) out[item.href] = item.label;
	return out;
}
var ADMIN_LABELS = buildLabelMap(ADMIN_NAV);
var CREATOR_LABELS = buildLabelMap(CREATOR_NAV);
//#endregion
//#region src/lib/components/shell/PortalBreadcrumb.svelte
function PortalBreadcrumb($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { portal } = $$props;
		const labels = derived(() => portal === "admin" ? ADMIN_LABELS : CREATOR_LABELS);
		const crumbs = derived(() => {
			const segments = page.url.pathname.split("/").filter(Boolean);
			if (segments.length === 0) return [];
			const root = `/${segments[0]}`;
			const result = [{
				href: root,
				label: portal === "admin" ? "Admin" : "Creator Studio"
			}];
			let acc = root;
			for (let i = 1; i < segments.length; i++) {
				acc += `/${segments[i]}`;
				const label = labels()[acc] ?? prettify(segments[i]);
				result.push({
					href: acc,
					label
				});
				if (i === segments.length - 1 && looksLikeId(segments[i]) && labels()[acc.replace(`/${segments[i]}`, "")]) result.pop();
			}
			return result;
		});
		function prettify(slug) {
			return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
		}
		function looksLikeId(s) {
			return /^[0-9a-f-]{12,}$/i.test(s) || /^\d+$/.test(s);
		}
		$$renderer.push(`<nav aria-label="Breadcrumb" class="text-sm text-muted-foreground flex items-center gap-1.5 min-w-0"><!--[-->`);
		const each_array = ensure_array_like(crumbs());
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let c = each_array[i];
			if (i > 0) {
				$$renderer.push("<!--[0-->");
				Chevron_right($$renderer, {
					class: "w-3.5 h-3.5 shrink-0 opacity-50",
					"aria-hidden": "true"
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (i === crumbs().length - 1) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-foreground font-medium truncate">${escape_html(c.label)}</span>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<a${attr("href", c.href)} class="hover:text-foreground transition-colors truncate">${escape_html(c.label)}</a>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></nav>`);
	});
}
//#endregion
//#region src/lib/components/shell/slide-over-store.ts
var stack = writable([]);
var slideOverStack = stack;
function openSlideOver(entry) {
	stack.update((curr) => {
		const existing = curr.findIndex((e) => e.id === entry.id);
		if (existing >= 0) {
			const next = curr.slice();
			next[existing] = entry;
			return next;
		}
		return [...curr, entry].slice(-2);
	});
}
var copilotState = writable({
	conversationId: null,
	messages: [],
	pending: null,
	sending: false,
	queuedQuery: null
});
function queueCopilotQuery(text) {
	copilotState.update((s) => ({
		...s,
		queuedQuery: text.trim()
	}));
}
//#endregion
//#region src/lib/components/shell/panels/ApproveNextReviewPanel.svelte
function ApproveNextReviewPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="p-4 space-y-4">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="text-center text-muted-foreground py-12">`);
		Loader_circle($$renderer, { class: "w-5 h-5 mx-auto animate-spin" });
		$$renderer.push(`<!----></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/shell/panels/IssueRefundPanel.svelte
function IssueRefundPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Quick-refund slide-over — admin types a transaction reference,
		* the panel resolves the transaction + viewer, and lets them approve
		* or deny without leaving the current page. Calls /api/admin/refunds
		* (which the existing refunds page also uses), so the audit trail is
		* uniform regardless of where the action was taken.
		*/
		let reference = "";
		$$renderer.push(`<div class="p-4 space-y-4"><div><label for="refund-ref" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Transaction reference</label> <div class="relative"><input id="refund-ref" type="text"${attr("value", reference)} placeholder="tx_… or paystack reference" class="w-full surface-1 rounded-md pl-3 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground"/> <button type="button"${attr("disabled", !reference.trim(), true)} class="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-40" aria-label="Look up">`);
		$$renderer.push("<!--[-1-->");
		Search($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!--]--></button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/shell/panels/SendCreatorNotePanel.svelte
function SendCreatorNotePanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Send a note to a specific creator without leaving the current page.
		* Looks up creators by name/email as the admin types, then drops the
		* message into `admin_messages` via the existing communications
		* endpoint. Reused inbox styling so the message renders consistently
		* with the rest of the admin↔creator thread surface.
		*/
		let query = "";
		let results = [];
		$$renderer.push(`<div class="p-4 space-y-4">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div><label for="note-search" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Find creator</label> <div class="relative"><input id="note-search" type="text"${attr("value", query)} placeholder="Name or email…" class="w-full surface-1 rounded-md pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground"/> `);
		Search($$renderer, { class: "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" });
		$$renderer.push(`<!----></div> `);
		if (results.length > 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<ul class="mt-2 surface-1 rounded-md divide-y divide-border/40 max-h-64 overflow-y-auto"><!--[-->`);
			const each_array = ensure_array_like(results);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let r = each_array[$$index];
				$$renderer.push(`<li><button type="button" class="w-full text-left px-3 py-2 hover:surface-2 transition-colors"><div class="text-sm text-foreground">${escape_html(r.name)}</div> `);
				if (r.email) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="text-xs text-muted-foreground truncate">${escape_html(r.email)}</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></button></li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		} else if (query.trim().length >= 2) {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<div class="text-xs text-muted-foreground mt-2">No matches.</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/shell/panels/ReplyToThreadPanel.svelte
function ReplyToThreadPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="flex flex-col h-full">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex-1 flex items-center justify-center text-muted-foreground">`);
		Loader_circle($$renderer, { class: "w-5 h-5 animate-spin" });
		$$renderer.push(`<!----></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/shell/CommandPaletteAI.svelte
function CommandPaletteAI($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Hybrid command palette — three semantic sections (Actions, Navigate,
		* Ask Copilot) with verb-aware ranking. Replaces the legacy
		* CommandPalette.svelte for portal use.
		*
		* - Verb-shaped queries ("approve…", "refund…") rank ACTIONS first
		* - Noun-shaped queries ("payouts", "review") rank NAVIGATE first
		* - Free-form questions ("how many…", "why does…") show the Ask Copilot
		*   row, which hands the query off to the persistent Copilot rail
		*/
		/** Called by the shell when the user wants the Copilot rail opened. */
		let { open = false, variant, onAskCopilot } = $$props;
		let query = "";
		const navGroups = derived(() => variant === "admin" ? ADMIN_NAV : CREATOR_NAV);
		const flatNav = derived(() => navGroups().flatMap((g) => g.items));
		const ACTIONS = [
			{
				id: "approve-next-review",
				label: "Approve next pending review",
				verbs: [
					"approve",
					"review",
					"next"
				],
				portals: ["admin"],
				perform: () => {
					openSlideOver({
						id: "approve-next-review",
						title: "Approve next",
						component: ApproveNextReviewPanel
					});
				}
			},
			{
				id: "issue-refund",
				label: "Issue refund…",
				verbs: [
					"refund",
					"issue",
					"return"
				],
				portals: ["admin"],
				perform: () => {
					openSlideOver({
						id: "issue-refund",
						title: "Issue refund",
						component: IssueRefundPanel
					});
				}
			},
			{
				id: "send-creator-note",
				label: "Send creator note…",
				verbs: [
					"note",
					"message",
					"send",
					"write"
				],
				portals: ["admin"],
				perform: () => {
					openSlideOver({
						id: "send-creator-note",
						title: "Send creator note",
						component: SendCreatorNotePanel
					});
				}
			},
			{
				id: "open-refunds",
				label: "Open refunds queue",
				verbs: ["refunds", "queue"],
				portals: ["admin"],
				perform: () => {
					goto("/admin/refunds");
				}
			},
			{
				id: "open-creator-applications",
				label: "Open creator applications",
				verbs: [
					"application",
					"creator",
					"approve"
				],
				portals: ["admin"],
				perform: () => {
					goto("/admin/creator-applications");
				}
			},
			{
				id: "upload-content",
				label: "Upload new content",
				verbs: [
					"upload",
					"create",
					"new"
				],
				portals: ["creator"],
				perform: () => {
					goto("/creator/upload");
				}
			},
			{
				id: "reply-to-thread",
				label: "Reply to latest admin thread…",
				verbs: [
					"reply",
					"thread",
					"admin",
					"respond"
				],
				portals: ["creator"],
				perform: () => {
					openSlideOver({
						id: "reply-to-thread",
						title: "Reply to thread",
						component: ReplyToThreadPanel
					});
				}
			},
			{
				id: "open-inbox",
				label: "Open inbox",
				verbs: ["inbox", "messages"],
				portals: ["creator"],
				perform: () => {
					goto("/creator/inbox");
				}
			}
		];
		const visibleActions = derived(() => ACTIONS.filter((a) => a.portals.includes(variant)));
		function tokens(s) {
			return s.toLowerCase().split(/\s+/).filter(Boolean);
		}
		function scoreAction(a, q) {
			if (!q.trim()) return 0;
			const qt = tokens(q);
			const text = (a.label + " " + a.verbs.join(" ")).toLowerCase();
			let score = 0;
			for (const t of qt) {
				if (text.includes(t)) score += 1;
				if (a.verbs.some((v) => v.startsWith(t))) score += 2;
			}
			return score;
		}
		function scoreNav(item, q) {
			if (!q.trim()) return 0;
			const qt = tokens(q);
			const text = (item.label + " " + item.href).toLowerCase();
			let score = 0;
			for (const t of qt) if (text.includes(t)) score += 1;
			return score;
		}
		const isQuestion = derived(() => /[?]$/.test(query.trim()) || /^(how|what|why|when|who|which|can|does|is|are|will|should)\b/i.test(query.trim()));
		const rankedActions = derived(() => {
			if (!query.trim()) return visibleActions();
			return visibleActions().map((a) => ({
				a,
				score: scoreAction(a, query)
			})).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).map((x) => x.a);
		});
		const rankedNav = derived(() => {
			if (!query.trim()) return flatNav();
			return flatNav().map((item) => ({
				item,
				score: scoreNav(item, query)
			})).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).map((x) => x.item);
		});
		function runAction(a) {
			open = false;
			a.perform();
		}
		function go(href) {
			open = false;
			goto(href);
		}
		function askCopilot() {
			const q = query.trim();
			if (!q) return;
			queueCopilotQuery(q);
			open = false;
			onAskCopilot?.();
		}
		function setTheme(mode) {
			if (mode === "system") resetMode();
			else setMode(mode);
			open = false;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command_dialog) {
				$$renderer.push("<!--[-->");
				Command_dialog($$renderer, {
					shouldFilter: false,
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						if (Command_input) {
							$$renderer.push("<!--[-->");
							Command_input($$renderer, {
								placeholder: "Type a command, page, or question…",
								get value() {
									return query;
								},
								set value($$value) {
									query = $$value;
									$$settled = false;
								}
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Command_list) {
							$$renderer.push("<!--[-->");
							Command_list($$renderer, {
								children: ($$renderer) => {
									if (rankedActions().length === 0 && rankedNav().length === 0 && !isQuestion()) {
										$$renderer.push("<!--[0-->");
										if (Command_empty) {
											$$renderer.push("<!--[-->");
											Command_empty($$renderer, {
												children: ($$renderer) => {
													$$renderer.push(`<!---->No results. Press Enter to ask the Copilot.`);
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (rankedActions().length > 0) {
										$$renderer.push("<!--[0-->");
										if (Command_group) {
											$$renderer.push("<!--[-->");
											Command_group($$renderer, {
												heading: "Actions",
												children: ($$renderer) => {
													$$renderer.push(`<!--[-->`);
													const each_array = ensure_array_like(rankedActions());
													for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
														let a = each_array[$$index];
														if (Command_item) {
															$$renderer.push("<!--[-->");
															Command_item($$renderer, {
																onSelect: () => runAction(a),
																children: ($$renderer) => {
																	Zap($$renderer, {});
																	$$renderer.push(`<!----> <span>${escape_html(a.label)}</span>`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (rankedNav().length > 0) {
										$$renderer.push("<!--[0-->");
										if (rankedActions().length > 0) {
											$$renderer.push("<!--[0-->");
											if (Command_separator) {
												$$renderer.push("<!--[-->");
												Command_separator($$renderer, {});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										if (Command_group) {
											$$renderer.push("<!--[-->");
											Command_group($$renderer, {
												heading: "Navigate",
												children: ($$renderer) => {
													$$renderer.push(`<!--[-->`);
													const each_array_1 = ensure_array_like(rankedNav().slice(0, 8));
													for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
														let item = each_array_1[$$index_1];
														const I = item.icon;
														if (Command_item) {
															$$renderer.push("<!--[-->");
															Command_item($$renderer, {
																onSelect: () => go(item.href),
																children: ($$renderer) => {
																	if (I) {
																		$$renderer.push("<!--[-->");
																		I($$renderer, {});
																		$$renderer.push("<!--]-->");
																	} else {
																		$$renderer.push("<!--[!-->");
																		$$renderer.push("<!--]-->");
																	}
																	$$renderer.push(` <span>${escape_html(item.label)}</span>`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (query.trim() && (isQuestion() || rankedActions().length === 0 && rankedNav().length === 0)) {
										$$renderer.push("<!--[0-->");
										if (Command_separator) {
											$$renderer.push("<!--[-->");
											Command_separator($$renderer, {});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
										$$renderer.push(` `);
										if (Command_group) {
											$$renderer.push("<!--[-->");
											Command_group($$renderer, {
												heading: "Ask Copilot",
												children: ($$renderer) => {
													if (Command_item) {
														$$renderer.push("<!--[-->");
														Command_item($$renderer, {
															onSelect: askCopilot,
															children: ($$renderer) => {
																Sparkles($$renderer, {});
																$$renderer.push(`<!----> <span class="truncate">"${escape_html(query.trim())}"</span>`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (!query.trim()) {
										$$renderer.push("<!--[0-->");
										if (Command_separator) {
											$$renderer.push("<!--[-->");
											Command_separator($$renderer, {});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
										$$renderer.push(` `);
										if (Command_group) {
											$$renderer.push("<!--[-->");
											Command_group($$renderer, {
												heading: "Theme",
												children: ($$renderer) => {
													if (Command_item) {
														$$renderer.push("<!--[-->");
														Command_item($$renderer, {
															onSelect: () => setTheme("light"),
															children: ($$renderer) => {
																Sun($$renderer, {});
																$$renderer.push(`<!----><span>Light mode</span>`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
													$$renderer.push(` `);
													if (Command_item) {
														$$renderer.push("<!--[-->");
														Command_item($$renderer, {
															onSelect: () => setTheme("dark"),
															children: ($$renderer) => {
																Moon($$renderer, {});
																$$renderer.push(`<!----><span>Dark mode</span>`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
													$$renderer.push(` `);
													if (Command_item) {
														$$renderer.push("<!--[-->");
														Command_item($$renderer, {
															onSelect: () => setTheme("system"),
															children: ($$renderer) => {
																Monitor($$renderer, {});
																$$renderer.push(`<!----><span>System mode</span>`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (!query.trim()) {
										$$renderer.push("<!--[0-->");
										if (Command_separator) {
											$$renderer.push("<!--[-->");
											Command_separator($$renderer, {});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
										$$renderer.push(` `);
										if (Command_group) {
											$$renderer.push("<!--[-->");
											Command_group($$renderer, {
												heading: "Tip",
												children: ($$renderer) => {
													if (Command_item) {
														$$renderer.push("<!--[-->");
														Command_item($$renderer, {
															disabled: true,
															children: ($$renderer) => {
																Compass($$renderer, {});
																$$renderer.push(`<!----> <span class="text-xs">Type a question to ask the Copilot · ⌘J toggles rail · ⌘B toggles sidebar</span>`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/components/shell/CopilotRail.svelte
function CopilotRail($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		/** When true, the rail is rendered. When false, only the icon spine
		*  is visible (collapsed). PortalShell owns this state so ⌘J at the
		*  shell level can toggle it. */
		let { variant, open = true } = $$props;
		let input = "";
		const accentClass = derived(() => variant === "admin" ? "text-red-300" : "text-purple-300");
		const sendBtnClass = derived(() => variant === "admin" ? "text-red-300 hover:text-red-200" : "text-purple-300 hover:text-purple-200");
		$$renderer.push(`<aside${attr_class(`hidden md:flex relative h-full transition-[width] duration-200 border-l border-white/10 surface-glass shrink-0 flex-col ${open ? "w-80" : "w-12"}`)} aria-label="AI Copilot">`);
		if (!open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="flex flex-col items-center gap-3 w-full pt-4 text-muted-foreground hover:text-foreground transition-colors" aria-label="Open Copilot (⌘J)" title="Open Copilot (⌘J)">`);
			Sparkles($$renderer, { class: `w-4 h-4 ${accentClass()}` });
			$$renderer.push(`<!----> <span class="rotate-180 text-[10px] uppercase tracking-wider font-medium" style="writing-mode: vertical-rl;">Copilot ⌘J</span></button> `);
			if (store_get($$store_subs ??= {}, "$copilotState", copilotState).messages.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true"></span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<header class="h-12 px-3 border-b border-white/10 flex items-center gap-2 shrink-0">`);
			Sparkles($$renderer, { class: `w-4 h-4 ${accentClass()}` });
			$$renderer.push(`<!----> <h2 class="text-xs font-semibold text-foreground uppercase tracking-wide">Copilot</h2> <span${attr_class(`text-[10px] ${accentClass()} font-mono`)}>⌘J</span> <span class="flex-1"></span> <button type="button" class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5" title="Start a new chat">`);
			Plus($$renderer, { class: "w-3 h-3" });
			$$renderer.push(`<!----> New</button> <button type="button" class="text-muted-foreground hover:text-foreground" aria-label="Collapse Copilot (⌘J)">`);
			Chevron_right($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----></button></header> <div class="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">`);
			if (store_get($$store_subs ??= {}, "$copilotState", copilotState).messages.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-center text-muted-foreground text-xs space-y-2 py-8">`);
				Sparkles($$renderer, { class: `w-5 h-5 ${accentClass()} mx-auto` });
				$$renderer.push(`<!----> <p>Ask me anything about your ${escape_html(variant === "admin" ? "platform" : "content")}.</p> <p class="text-[10px] text-muted-foreground/70">${escape_html(variant === "admin" ? "Try: \"How many reviews are pending?\"" : "Try: \"Summarize my last 30 days\"")}</p></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <!--[-->`);
			const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$copilotState", copilotState).messages);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let m = each_array[$$index];
				if (m.role === "user") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex justify-end"><div class="max-w-[85%] bg-primary text-primary-foreground text-xs rounded-lg px-2.5 py-1.5">${escape_html(m.content)}</div></div>`);
				} else if (m.role === "tool") {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<div class="surface-2 rounded-lg px-2.5 py-1.5 text-[11px]"><div${attr_class(`text-[9px] uppercase tracking-wide ${accentClass()} mb-0.5`)}>Tool: ${escape_html(m.toolName ?? "?")}</div> <pre class="whitespace-pre-wrap text-foreground/80 max-h-24 overflow-y-auto">${escape_html(m.content.length > 400 ? m.content.slice(0, 400) + "…" : m.content)}</pre></div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="flex justify-start"><div class="max-w-[85%] surface-1 text-foreground text-xs rounded-lg px-2.5 py-1.5 whitespace-pre-line">${escape_html(m.content)}</div></div>`);
				}
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]--> `);
			if (store_get($$store_subs ??= {}, "$copilotState", copilotState).pending) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="border border-yellow-500/40 bg-yellow-500/10 rounded-lg p-2.5 space-y-2"><div class="flex items-center gap-1.5 text-[11px] text-yellow-200">`);
				Triangle_alert($$renderer, { class: "w-3 h-3" });
				$$renderer.push(`<!----> Approval required: ${escape_html(store_get($$store_subs ??= {}, "$copilotState", copilotState).pending.tool)}</div> <pre class="text-[10px] text-yellow-100 bg-black/30 rounded p-1.5 overflow-x-auto max-h-32">${escape_html(JSON.stringify(store_get($$store_subs ??= {}, "$copilotState", copilotState).pending.preview, null, 2))}</pre> <div class="flex gap-1.5 justify-end"><button type="button" class="text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-foreground">Decline</button> <button type="button"${attr("disabled", store_get($$store_subs ??= {}, "$copilotState", copilotState).sending, true)} class="text-[11px] px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white inline-flex items-center gap-0.5">`);
				Check($$renderer, { class: "w-3 h-3" });
				$$renderer.push(`<!----> Confirm</button></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (store_get($$store_subs ??= {}, "$copilotState", copilotState).sending) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-[11px] text-muted-foreground italic">Thinking…</div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <footer class="border-t border-white/10 p-2 shrink-0"><div class="relative"><textarea rows="2" placeholder="Ask the Copilot…" class="w-full surface-1 rounded-lg pl-2.5 pr-8 py-1.5 text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground">`);
			const $$body = escape_html(input);
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea> <button type="button"${attr("disabled", store_get($$store_subs ??= {}, "$copilotState", copilotState).sending || !input.trim(), true)}${attr_class(`absolute right-1.5 bottom-1.5 ${sendBtnClass()} disabled:opacity-40`)} aria-label="Send">`);
			Send($$renderer, { class: "w-3.5 h-3.5" });
			$$renderer.push(`<!----></button></div> <div class="text-[9px] text-muted-foreground mt-0.5">⌘+Enter to send</div></footer>`);
		}
		$$renderer.push(`<!--]--></aside>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/components/shell/SlideOverHost.svelte
function SlideOverHost($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		page.url.pathname;
		if (store_get($$store_subs ??= {}, "$slideOverStack", slideOverStack).length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="md:hidden fixed inset-0 bg-black/40 z-40" aria-hidden="true" role="presentation"></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="fixed top-12 right-0 bottom-0 z-50 flex pointer-events-none"><!--[-->`);
		const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$slideOverStack", slideOverStack));
		for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
			let panel = each_array[idx];
			const PanelComponent = panel.component;
			$$renderer.push(`<div${attr_class(`pointer-events-auto w-full md:w-[400px] max-w-full bg-background border-l border-white/10 shadow-2xl flex flex-col ${idx > 0 ? "border-l-2 border-l-primary/40" : ""}`)}${attr_style(`z-index: ${stringify(50 + idx)};`)} role="dialog"${attr("aria-label", panel.title)} aria-modal="false"><header class="h-12 px-3 border-b border-white/10 flex items-center gap-2 shrink-0"><span class="text-xs uppercase tracking-wide text-muted-foreground font-semibold">${escape_html(panel.title)}</span> <span class="flex-1"></span> <button type="button" class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/5"${attr("aria-label", panel.pinned ? "Unpin panel" : "Pin panel")}${attr("title", panel.pinned ? "Unpin (closes on navigate)" : "Pin (stays open across pages)")}>`);
			if (panel.pinned) {
				$$renderer.push("<!--[0-->");
				Pin_off($$renderer, { class: "w-3.5 h-3.5" });
			} else {
				$$renderer.push("<!--[-1-->");
				Pin($$renderer, { class: "w-3.5 h-3.5" });
			}
			$$renderer.push(`<!--]--></button> <button type="button" class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/5" aria-label="Close">`);
			X($$renderer, { class: "w-3.5 h-3.5" });
			$$renderer.push(`<!----></button></header> <div class="flex-1 overflow-y-auto">`);
			if (PanelComponent) {
				$$renderer.push("<!--[-->");
				PanelComponent($$renderer, spread_props([panel.props ?? {}]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(`</div></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/components/shell/PortalShell.svelte
function PortalShell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { portal, children } = $$props;
		const navGroups = derived(() => portal === "admin" ? ADMIN_NAV : CREATOR_NAV);
		const portalLabel = derived(() => portal === "admin" ? "Admin" : "Creator Studio");
		const user = derived(() => page.data.user);
		const initial = derived(() => (user()?.name ?? "?").trim().charAt(0).toUpperCase() || "?");
		function isActive(href) {
			const path = page.url.pathname;
			if (href === "/admin" || href === "/creator") return path === href;
			return path.startsWith(href);
		}
		let paletteOpen = false;
		let copilotOpen = true;
		const bellHref = derived(() => portal === "admin" ? "/admin/abuse" : "/creator/inbox");
		function switchPortal() {
			if (portal === "admin") goto("/creator");
			else goto("/admin");
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			CommandPaletteAI($$renderer, {
				variant: portal,
				onAskCopilot: () => copilotOpen = true,
				get open() {
					return paletteOpen;
				},
				set open($$value) {
					paletteOpen = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> <div${attr("data-portal", portal)} class="min-h-screen bg-background text-foreground"><a href="#portal-main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded-md">Skip to main content</a> `);
			if (Sidebar_provider) {
				$$renderer.push("<!--[-->");
				Sidebar_provider($$renderer, {
					style: "--sidebar-width: 14rem;",
					children: ($$renderer) => {
						if (Sidebar) {
							$$renderer.push("<!--[-->");
							Sidebar($$renderer, {
								collapsible: "icon",
								class: "surface-glass",
								children: ($$renderer) => {
									if (Sidebar_header) {
										$$renderer.push("<!--[-->");
										Sidebar_header($$renderer, {
											class: "border-b border-white/10",
											children: ($$renderer) => {
												$$renderer.push(`<a${attr("href", portal === "admin" ? "/admin" : "/creator")} class="flex items-center gap-2 px-2 py-1.5 text-foreground hover:opacity-80 transition-opacity"><img src="/logo-alone-sepharstudios-bgless.png" alt="" class="h-6 w-6 object-contain shrink-0"/> <span class="text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">${escape_html(portalLabel())}</span></a>`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Sidebar_content) {
										$$renderer.push("<!--[-->");
										Sidebar_content($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!--[-->`);
												const each_array = ensure_array_like(navGroups());
												for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
													let group = each_array[$$index_1];
													if (Sidebar_group) {
														$$renderer.push("<!--[-->");
														Sidebar_group($$renderer, {
															children: ($$renderer) => {
																if (Sidebar_group_label) {
																	$$renderer.push("<!--[-->");
																	Sidebar_group_label($$renderer, {
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(group.label)}`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push("<!--]-->");
																} else {
																	$$renderer.push("<!--[!-->");
																	$$renderer.push("<!--]-->");
																}
																$$renderer.push(` `);
																if (Sidebar_group_content) {
																	$$renderer.push("<!--[-->");
																	Sidebar_group_content($$renderer, {
																		children: ($$renderer) => {
																			if (Sidebar_menu) {
																				$$renderer.push("<!--[-->");
																				Sidebar_menu($$renderer, {
																					children: ($$renderer) => {
																						$$renderer.push(`<!--[-->`);
																						const each_array_1 = ensure_array_like(group.items);
																						for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
																							let item = each_array_1[$$index];
																							const Icon = item.icon;
																							if (Sidebar_menu_item) {
																								$$renderer.push("<!--[-->");
																								Sidebar_menu_item($$renderer, {
																									children: ($$renderer) => {
																										{
																											function child($$renderer, { props }) {
																												$$renderer.push(`<a${attributes({
																													href: item.href,
																													...props
																												})}>`);
																												if (Icon) {
																													$$renderer.push("<!--[-->");
																													Icon($$renderer, {});
																													$$renderer.push("<!--]-->");
																												} else {
																													$$renderer.push("<!--[!-->");
																													$$renderer.push("<!--]-->");
																												}
																												$$renderer.push(` <span>${escape_html(item.label)}</span></a>`);
																											}
																											if (Sidebar_menu_button) {
																												$$renderer.push("<!--[-->");
																												Sidebar_menu_button($$renderer, {
																													isActive: isActive(item.href),
																													tooltipContent: item.label,
																													child,
																													$$slots: { child: true }
																												});
																												$$renderer.push("<!--]-->");
																											} else {
																												$$renderer.push("<!--[!-->");
																												$$renderer.push("<!--]-->");
																											}
																										}
																									},
																									$$slots: { default: true }
																								});
																								$$renderer.push("<!--]-->");
																							} else {
																								$$renderer.push("<!--[!-->");
																								$$renderer.push("<!--]-->");
																							}
																						}
																						$$renderer.push(`<!--]-->`);
																					},
																					$$slots: { default: true }
																				});
																				$$renderer.push("<!--]-->");
																			} else {
																				$$renderer.push("<!--[!-->");
																				$$renderer.push("<!--]-->");
																			}
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push("<!--]-->");
																} else {
																	$$renderer.push("<!--[!-->");
																	$$renderer.push("<!--]-->");
																}
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
												}
												$$renderer.push(`<!--]-->`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Sidebar_footer) {
										$$renderer.push("<!--[-->");
										Sidebar_footer($$renderer, {
											class: "border-t border-white/10",
											children: ($$renderer) => {
												if (Sidebar_menu) {
													$$renderer.push("<!--[-->");
													Sidebar_menu($$renderer, {
														children: ($$renderer) => {
															if (Sidebar_menu_item) {
																$$renderer.push("<!--[-->");
																Sidebar_menu_item($$renderer, {
																	children: ($$renderer) => {
																		if (Dropdown_menu) {
																			$$renderer.push("<!--[-->");
																			Dropdown_menu($$renderer, {
																				children: ($$renderer) => {
																					{
																						function child($$renderer, { props }) {
																							{
																								function child($$renderer, { props: btnProps }) {
																									$$renderer.push(`<button${attributes({
																										type: "button",
																										...props,
																										...btnProps
																									})}>`);
																									if (user()?.image) {
																										$$renderer.push("<!--[0-->");
																										$$renderer.push(`<img${attr("src", user().image)} alt="" class="w-5 h-5 rounded-full object-cover"/>`);
																									} else {
																										$$renderer.push("<!--[-1-->");
																										$$renderer.push(`<div class="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">${escape_html(initial())}</div>`);
																									}
																									$$renderer.push(`<!--]--> <span class="truncate">${escape_html(user()?.name ?? "Account")}</span></button>`);
																								}
																								if (Sidebar_menu_button) {
																									$$renderer.push("<!--[-->");
																									Sidebar_menu_button($$renderer, {
																										tooltipContent: user()?.name ?? "Account",
																										child,
																										$$slots: { child: true }
																									});
																									$$renderer.push("<!--]-->");
																								} else {
																									$$renderer.push("<!--[!-->");
																									$$renderer.push("<!--]-->");
																								}
																							}
																						}
																						if (Dropdown_menu_trigger) {
																							$$renderer.push("<!--[-->");
																							Dropdown_menu_trigger($$renderer, {
																								child,
																								$$slots: { child: true }
																							});
																							$$renderer.push("<!--]-->");
																						} else {
																							$$renderer.push("<!--[!-->");
																							$$renderer.push("<!--]-->");
																						}
																					}
																					$$renderer.push(` `);
																					if (Dropdown_menu_content) {
																						$$renderer.push("<!--[-->");
																						Dropdown_menu_content($$renderer, {
																							side: "right",
																							align: "end",
																							class: "w-56",
																							children: ($$renderer) => {
																								if (user()?.email) {
																									$$renderer.push("<!--[0-->");
																									$$renderer.push(`<div class="px-2 py-1.5 text-xs text-muted-foreground truncate">${escape_html(user().email)}</div> `);
																									if (Dropdown_menu_separator) {
																										$$renderer.push("<!--[-->");
																										Dropdown_menu_separator($$renderer, {});
																										$$renderer.push("<!--]-->");
																									} else {
																										$$renderer.push("<!--[!-->");
																										$$renderer.push("<!--]-->");
																									}
																								} else $$renderer.push("<!--[-1-->");
																								$$renderer.push(`<!--]--> `);
																								if (Dropdown_menu_item) {
																									$$renderer.push("<!--[-->");
																									Dropdown_menu_item($$renderer, {
																										onSelect: () => goto(portal === "admin" ? "/admin/settings" : "/creator/profile"),
																										children: ($$renderer) => {
																											User($$renderer, { class: "w-3.5 h-3.5 mr-2" });
																											$$renderer.push(`<!----> Profile`);
																										},
																										$$slots: { default: true }
																									});
																									$$renderer.push("<!--]-->");
																								} else {
																									$$renderer.push("<!--[!-->");
																									$$renderer.push("<!--]-->");
																								}
																								$$renderer.push(` `);
																								if (Dropdown_menu_item) {
																									$$renderer.push("<!--[-->");
																									Dropdown_menu_item($$renderer, {
																										onSelect: switchPortal,
																										children: ($$renderer) => {
																											External_link($$renderer, { class: "w-3.5 h-3.5 mr-2" });
																											$$renderer.push(`<!----> Switch to ${escape_html(portal === "admin" ? "Creator" : "Admin")}`);
																										},
																										$$slots: { default: true }
																									});
																									$$renderer.push("<!--]-->");
																								} else {
																									$$renderer.push("<!--[!-->");
																									$$renderer.push("<!--]-->");
																								}
																								$$renderer.push(` `);
																								if (Dropdown_menu_item) {
																									$$renderer.push("<!--[-->");
																									Dropdown_menu_item($$renderer, {
																										onSelect: () => goto("/"),
																										children: ($$renderer) => {
																											External_link($$renderer, { class: "w-3.5 h-3.5 mr-2" });
																											$$renderer.push(`<!----> Main site`);
																										},
																										$$slots: { default: true }
																									});
																									$$renderer.push("<!--]-->");
																								} else {
																									$$renderer.push("<!--[!-->");
																									$$renderer.push("<!--]-->");
																								}
																								$$renderer.push(` `);
																								if (Dropdown_menu_separator) {
																									$$renderer.push("<!--[-->");
																									Dropdown_menu_separator($$renderer, {});
																									$$renderer.push("<!--]-->");
																								} else {
																									$$renderer.push("<!--[!-->");
																									$$renderer.push("<!--]-->");
																								}
																								$$renderer.push(` `);
																								if (Dropdown_menu_sub) {
																									$$renderer.push("<!--[-->");
																									Dropdown_menu_sub($$renderer, {
																										children: ($$renderer) => {
																											if (Dropdown_menu_sub_trigger) {
																												$$renderer.push("<!--[-->");
																												Dropdown_menu_sub_trigger($$renderer, {
																													children: ($$renderer) => {
																														if (derivedMode.current === "light") {
																															$$renderer.push("<!--[0-->");
																															Sun($$renderer, { class: "w-3.5 h-3.5 mr-2" });
																														} else if (derivedMode.current === "dark") {
																															$$renderer.push("<!--[1-->");
																															Moon($$renderer, { class: "w-3.5 h-3.5 mr-2" });
																														} else {
																															$$renderer.push("<!--[-1-->");
																															Monitor($$renderer, { class: "w-3.5 h-3.5 mr-2" });
																														}
																														$$renderer.push(`<!--]--> Theme`);
																													},
																													$$slots: { default: true }
																												});
																												$$renderer.push("<!--]-->");
																											} else {
																												$$renderer.push("<!--[!-->");
																												$$renderer.push("<!--]-->");
																											}
																											$$renderer.push(` `);
																											if (Dropdown_menu_sub_content) {
																												$$renderer.push("<!--[-->");
																												Dropdown_menu_sub_content($$renderer, {
																													children: ($$renderer) => {
																														if (Dropdown_menu_item) {
																															$$renderer.push("<!--[-->");
																															Dropdown_menu_item($$renderer, {
																																onSelect: () => setMode("light"),
																																children: ($$renderer) => {
																																	Sun($$renderer, { class: "w-3.5 h-3.5 mr-2" });
																																	$$renderer.push(`<!----> Light`);
																																},
																																$$slots: { default: true }
																															});
																															$$renderer.push("<!--]-->");
																														} else {
																															$$renderer.push("<!--[!-->");
																															$$renderer.push("<!--]-->");
																														}
																														$$renderer.push(` `);
																														if (Dropdown_menu_item) {
																															$$renderer.push("<!--[-->");
																															Dropdown_menu_item($$renderer, {
																																onSelect: () => setMode("dark"),
																																children: ($$renderer) => {
																																	Moon($$renderer, { class: "w-3.5 h-3.5 mr-2" });
																																	$$renderer.push(`<!----> Dark`);
																																},
																																$$slots: { default: true }
																															});
																															$$renderer.push("<!--]-->");
																														} else {
																															$$renderer.push("<!--[!-->");
																															$$renderer.push("<!--]-->");
																														}
																														$$renderer.push(` `);
																														if (Dropdown_menu_item) {
																															$$renderer.push("<!--[-->");
																															Dropdown_menu_item($$renderer, {
																																onSelect: () => resetMode(),
																																children: ($$renderer) => {
																																	Monitor($$renderer, { class: "w-3.5 h-3.5 mr-2" });
																																	$$renderer.push(`<!----> System`);
																																},
																																$$slots: { default: true }
																															});
																															$$renderer.push("<!--]-->");
																														} else {
																															$$renderer.push("<!--[!-->");
																															$$renderer.push("<!--]-->");
																														}
																													},
																													$$slots: { default: true }
																												});
																												$$renderer.push("<!--]-->");
																											} else {
																												$$renderer.push("<!--[!-->");
																												$$renderer.push("<!--]-->");
																											}
																										},
																										$$slots: { default: true }
																									});
																									$$renderer.push("<!--]-->");
																								} else {
																									$$renderer.push("<!--[!-->");
																									$$renderer.push("<!--]-->");
																								}
																								$$renderer.push(` `);
																								if (Dropdown_menu_separator) {
																									$$renderer.push("<!--[-->");
																									Dropdown_menu_separator($$renderer, {});
																									$$renderer.push("<!--]-->");
																								} else {
																									$$renderer.push("<!--[!-->");
																									$$renderer.push("<!--]-->");
																								}
																								$$renderer.push(` `);
																								if (Dropdown_menu_item) {
																									$$renderer.push("<!--[-->");
																									Dropdown_menu_item($$renderer, {
																										onSelect: () => goto("/auth/logout"),
																										children: ($$renderer) => {
																											Log_out($$renderer, { class: "w-3.5 h-3.5 mr-2" });
																											$$renderer.push(`<!----> Sign out`);
																										},
																										$$slots: { default: true }
																									});
																									$$renderer.push("<!--]-->");
																								} else {
																									$$renderer.push("<!--[!-->");
																									$$renderer.push("<!--]-->");
																								}
																							},
																							$$slots: { default: true }
																						});
																						$$renderer.push("<!--]-->");
																					} else {
																						$$renderer.push("<!--[!-->");
																						$$renderer.push("<!--]-->");
																					}
																				},
																				$$slots: { default: true }
																			});
																			$$renderer.push("<!--]-->");
																		} else {
																			$$renderer.push("<!--[!-->");
																			$$renderer.push("<!--]-->");
																		}
																	},
																	$$slots: { default: true }
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Sidebar_rail) {
										$$renderer.push("<!--[-->");
										Sidebar_rail($$renderer, {});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Sidebar_inset) {
							$$renderer.push("<!--[-->");
							Sidebar_inset($$renderer, {
								class: "flex flex-col min-w-0",
								children: ($$renderer) => {
									$$renderer.push(`<header class="sticky top-0 z-30 h-12 shrink-0 flex items-center gap-2 px-3 surface-glass border-b border-white/10">`);
									if (Sidebar_trigger) {
										$$renderer.push("<!--[-->");
										Sidebar_trigger($$renderer, { class: "-ml-1" });
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									Separator($$renderer, {
										orientation: "vertical",
										class: "mr-1 h-4"
									});
									$$renderer.push(`<!----> `);
									PortalBreadcrumb($$renderer, { portal });
									$$renderer.push(`<!----> <span class="flex-1"></span> <button type="button" class="hidden md:inline-flex items-center gap-1.5 surface-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors" aria-label="Open command palette (⌘K)"><span>Search…</span> <kbd class="font-mono text-[10px]">⌘K</kbd></button> <a${attr("href", bellHref())} class="relative inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5"${attr("aria-label", "Notifications")}${attr("title", "No new notifications")}>`);
									Bell($$renderer, { class: "w-4 h-4" });
									$$renderer.push(`<!----> `);
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></a> <button type="button" class="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5" aria-label="Open Copilot (⌘J)">`);
									Sparkles($$renderer, { class: "w-4 h-4" });
									$$renderer.push(`<!----></button></header> <div class="flex flex-1 min-h-0"><main id="portal-main" class="flex-1 min-w-0 overflow-x-hidden">`);
									children?.($$renderer);
									$$renderer.push(`<!----></main> `);
									CopilotRail($$renderer, {
										variant: portal,
										get open() {
											return copilotOpen;
										},
										set open($$value) {
											copilotOpen = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div>`);
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(`</div> `);
			SlideOverHost($$renderer, {});
			$$renderer.push(`<!----> `);
			if (user()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button type="button" class="md:hidden fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center" aria-label="Open Copilot (⌘J)">`);
				Sparkles($$renderer, { class: "w-5 h-5" });
				$$renderer.push(`<!----></button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { PortalShell as t };
