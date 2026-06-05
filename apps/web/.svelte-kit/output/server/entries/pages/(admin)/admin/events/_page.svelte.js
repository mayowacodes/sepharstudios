import { At as stringify, Dt as spread_props, Lt as attr, St as derived, Tt as head, vt as attr_class, wt as ensure_array_like, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../../chunks/Icon.js";
import { t as Calendar } from "../../../../../chunks/calendar.js";
import { t as External_link } from "../../../../../chunks/external-link.js";
import { t as Plus } from "../../../../../chunks/plus.js";
import { t as Trash_2 } from "../../../../../chunks/trash-2.js";
import { t as Users } from "../../../../../chunks/users.js";
import { t as Input } from "../../../../../chunks/input.js";
import { t as Button } from "../../../../../chunks/button.js";
import { t as Badge } from "../../../../../chunks/badge.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
import { a as Card, i as Card_content } from "../../../../../chunks/card.js";
import { t as Label } from "../../../../../chunks/label.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/square-pen.svelte
function Square_pen($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "square-pen" },
		props,
		{ iconNode: [["path", { "d": "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }], ["path", { "d": "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" }]] }
	]));
}
//#endregion
//#region src/routes/(admin)/admin/events/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let events = [];
		let loading = true;
		let saving = false;
		let message = "";
		let audienceFilter = "all";
		let dialogOpen = false;
		let editingId = null;
		let form = {
			title: "",
			description: "",
			speaker: "",
			speakerRole: "",
			kind: "webinar",
			track: "",
			audience: "public",
			startsAt: "",
			durationMinutes: "60",
			location: "Online",
			capacity: "",
			meetingUrl: "",
			recordingUrl: "",
			status: "scheduled"
		};
		async function loadEvents() {
			loading = true;
			try {
				const res = await fetch("/api/admin/events");
				if (res.ok) events = (await res.json()).events ?? [];
			} finally {
				loading = false;
			}
		}
		let filtered = derived(() => events);
		function openCreate() {
			editingId = null;
			form = {
				title: "",
				description: "",
				speaker: "",
				speakerRole: "",
				kind: "webinar",
				track: "",
				audience: "public",
				startsAt: "",
				durationMinutes: "60",
				location: "Online",
				capacity: "",
				meetingUrl: "",
				recordingUrl: "",
				status: "scheduled"
			};
			dialogOpen = true;
		}
		function openEdit(e) {
			editingId = e.id;
			form = {
				title: e.title,
				description: e.description ?? "",
				speaker: e.speaker ?? "",
				speakerRole: e.speakerRole ?? "",
				kind: e.kind,
				track: e.track ?? "",
				audience: e.audience,
				startsAt: new Date(e.startsAt).toISOString().slice(0, 16),
				durationMinutes: e.durationMinutes?.toString() ?? "",
				location: e.location ?? "",
				capacity: e.capacity?.toString() ?? "",
				meetingUrl: e.meetingUrl ?? "",
				recordingUrl: e.recordingUrl ?? "",
				status: e.status
			};
			dialogOpen = true;
		}
		async function cancelEvent(e) {
			if (!confirm(`Cancel "${e.title}"? All 0 registrants will be notified.`)) return;
			saving = true;
			try {
				const res = await fetch(`/api/admin/events/${e.id}`, { method: "DELETE" });
				const data = await res.json();
				if (!res.ok) throw new Error(data.error ?? "Cancel failed");
				message = `Event cancelled. ${data.cancelledRegistrants ?? 0} registrants notified.`;
				await loadEvents();
				setTimeout(() => message = "", 5e3);
			} catch (err) {
				message = `Error: ${err.message}`;
			} finally {
				saving = false;
			}
		}
		function fmt(iso) {
			return new Date(iso).toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit"
			});
		}
		function statusColor(s) {
			if (s === "scheduled") return "bg-blue-500/15 text-blue-300 border-blue-500/30";
			if (s === "live") return "bg-green-500/15 text-green-300 border-green-500/30";
			if (s === "completed") return "bg-gray-500/15 text-foreground/80 border-gray-500/30";
			return "bg-red-500/15 text-red-300 border-red-500/30";
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1t5c1jr", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Events · Admin</title>`);
				});
			});
			$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
			{
				function actions($$renderer) {
					Button($$renderer, {
						onclick: openCreate,
						size: "sm",
						class: "rounded-full",
						children: ($$renderer) => {
							Plus($$renderer, { class: "w-3.5 h-3.5 mr-1" });
							$$renderer.push(`<!----> New event`);
						},
						$$slots: { default: true }
					});
				}
				PageHeader($$renderer, {
					icon: Calendar,
					title: "Events",
					subtitle: "Webinars, workshops, conferences. Powers /webinars and /creator/events.",
					actions,
					$$slots: { actions: true }
				});
			}
			$$renderer.push(`<!----> `);
			if (message) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="rounded-md border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">${escape_html(message)}</div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex gap-2"><!--[-->`);
			const each_array = ensure_array_like([
				{
					id: "all",
					label: "All"
				},
				{
					id: "public",
					label: "Public (webinars)"
				},
				{
					id: "creator",
					label: "Creator portal"
				}
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let chip = each_array[$$index];
				$$renderer.push(`<button${attr_class(`px-3 py-1 rounded-full text-sm transition-colors ${audienceFilter === chip.id ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted"}`)}${attr("aria-pressed", audienceFilter === chip.id)}>${escape_html(chip.label)}</button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (loading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-sm text-muted-foreground py-8 text-center">Loading events…</p>`);
			} else if (filtered().length === 0) {
				$$renderer.push("<!--[1-->");
				Card($$renderer, {
					children: ($$renderer) => {
						Card_content($$renderer, {
							class: "py-12 text-center text-sm text-muted-foreground",
							children: ($$renderer) => {
								$$renderer.push(`<!---->No events in this audience. Click <strong>New event</strong> to create the first one.`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="grid gap-3"><!--[-->`);
				const each_array_1 = ensure_array_like(filtered());
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let event = each_array_1[$$index_1];
					Card($$renderer, {
						children: ($$renderer) => {
							Card_content($$renderer, {
								class: "p-5 flex items-start justify-between gap-4 flex-wrap",
								children: ($$renderer) => {
									$$renderer.push(`<div class="flex-1 min-w-72"><div class="flex items-center gap-2 mb-2 flex-wrap">`);
									Badge($$renderer, {
										variant: "outline",
										class: "capitalize",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(event.kind)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Badge($$renderer, {
										variant: "secondary",
										class: "capitalize",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(event.audience)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <span${attr_class(`text-xs px-2 py-0.5 rounded-full border ${stringify(statusColor(event.status))}`)}>${escape_html(event.status)}</span> `);
									if (event.track) {
										$$renderer.push("<!--[0-->");
										Badge($$renderer, {
											variant: "outline",
											class: "capitalize",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(event.track)}`);
											},
											$$slots: { default: true }
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> <h2 class="text-lg font-semibold mb-1">${escape_html(event.title)}</h2> `);
									if (event.description) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-sm text-muted-foreground mb-2 line-clamp-2">${escape_html(event.description)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> <div class="flex flex-wrap gap-3 text-xs text-muted-foreground"><span>📅 ${escape_html(fmt(event.startsAt))}</span> `);
									if (event.durationMinutes) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<span>⏱ ${escape_html(event.durationMinutes)}m</span>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (event.location) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<span>📍 ${escape_html(event.location)}</span>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (event.speaker) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<span>🎤 ${escape_html(event.speaker)}</span>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (event.capacity) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<span>`);
										Users($$renderer, { class: "inline w-3 h-3" });
										$$renderer.push(`<!----> cap: ${escape_html(event.capacity)}</span>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (event.meetingUrl) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<a${attr("href", event.meetingUrl)} target="_blank" rel="noopener" class="text-primary hover:underline inline-flex items-center gap-1">Meeting `);
										External_link($$renderer, { class: "w-3 h-3" });
										$$renderer.push(`<!----></a>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div></div> <div class="flex flex-col gap-2 shrink-0">`);
									Button($$renderer, {
										size: "sm",
										variant: "outline",
										onclick: () => openEdit(event),
										children: ($$renderer) => {
											Square_pen($$renderer, { class: "w-3.5 h-3.5 mr-1" });
											$$renderer.push(`<!----> Edit`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									if (event.status !== "cancelled") {
										$$renderer.push("<!--[0-->");
										Button($$renderer, {
											size: "sm",
											variant: "outline",
											class: "text-red-400 hover:text-red-300",
											onclick: () => cancelEvent(event),
											children: ($$renderer) => {
												Trash_2($$renderer, { class: "w-3.5 h-3.5 mr-1" });
												$$renderer.push(`<!----> Cancel`);
											},
											$$slots: { default: true }
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div>`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (dialogOpen) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"><div role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="event-dialog-title" class="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl my-8 shadow-2xl"><h2 id="event-dialog-title" class="text-xl font-bold mb-4">${escape_html(editingId ? "Edit event" : "New event")}</h2> <form class="space-y-4"><div>`);
				Label($$renderer, {
					for: "evt-title",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Title <span class="text-red-400">*</span>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Input($$renderer, {
					id: "evt-title",
					required: true,
					get value() {
						return form.title;
					},
					set value($$value) {
						form.title = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> <div>`);
				Label($$renderer, {
					for: "evt-description",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Description`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <textarea id="evt-description" rows="3" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">`);
				const $$body = escape_html(form.description);
				if ($$body) $$renderer.push(`${$$body}`);
				$$renderer.push(`</textarea></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div>`);
				Label($$renderer, {
					for: "evt-speaker",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Speaker`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Input($$renderer, {
					id: "evt-speaker",
					get value() {
						return form.speaker;
					},
					set value($$value) {
						form.speaker = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> <div>`);
				Label($$renderer, {
					for: "evt-speaker-role",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Speaker role`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Input($$renderer, {
					id: "evt-speaker-role",
					get value() {
						return form.speakerRole;
					},
					set value($$value) {
						form.speakerRole = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-3"><div>`);
				Label($$renderer, {
					for: "evt-kind",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Kind`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				$$renderer.select({
					id: "evt-kind",
					value: form.kind,
					class: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
				}, ($$renderer) => {
					$$renderer.option({ value: "webinar" }, ($$renderer) => {
						$$renderer.push(`Webinar`);
					});
					$$renderer.option({ value: "workshop" }, ($$renderer) => {
						$$renderer.push(`Workshop`);
					});
					$$renderer.option({ value: "fellowship" }, ($$renderer) => {
						$$renderer.push(`Fellowship`);
					});
					$$renderer.option({ value: "conference" }, ($$renderer) => {
						$$renderer.push(`Conference`);
					});
					$$renderer.option({ value: "qa" }, ($$renderer) => {
						$$renderer.push(`Q&amp;A`);
					});
					$$renderer.option({ value: "ama" }, ($$renderer) => {
						$$renderer.push(`AMA`);
					});
				});
				$$renderer.push(`</div> <div>`);
				Label($$renderer, {
					for: "evt-audience",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Audience`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				$$renderer.select({
					id: "evt-audience",
					value: form.audience,
					class: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
				}, ($$renderer) => {
					$$renderer.option({ value: "public" }, ($$renderer) => {
						$$renderer.push(`Public (/webinars)`);
					});
					$$renderer.option({ value: "creator" }, ($$renderer) => {
						$$renderer.push(`Creator (/creator/events)`);
					});
				});
				$$renderer.push(`</div> <div>`);
				Label($$renderer, {
					for: "evt-track",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Track`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				$$renderer.select({
					id: "evt-track",
					value: form.track,
					class: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
				}, ($$renderer) => {
					$$renderer.option({ value: "" }, ($$renderer) => {
						$$renderer.push(`— None —`);
					});
					$$renderer.option({ value: "creator" }, ($$renderer) => {
						$$renderer.push(`Creator`);
					});
					$$renderer.option({ value: "tokenomics" }, ($$renderer) => {
						$$renderer.push(`Tokenomics`);
					});
					$$renderer.option({ value: "theology" }, ($$renderer) => {
						$$renderer.push(`Theology`);
					});
					$$renderer.option({ value: "tech" }, ($$renderer) => {
						$$renderer.push(`Tech`);
					});
				});
				$$renderer.push(`</div></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-3"><div>`);
				Label($$renderer, {
					for: "evt-starts",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Starts at <span class="text-red-400">*</span>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Input($$renderer, {
					id: "evt-starts",
					type: "datetime-local",
					required: true,
					get value() {
						return form.startsAt;
					},
					set value($$value) {
						form.startsAt = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> <div>`);
				Label($$renderer, {
					for: "evt-duration",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Duration (min)`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Input($$renderer, {
					id: "evt-duration",
					type: "number",
					min: "0",
					get value() {
						return form.durationMinutes;
					},
					set value($$value) {
						form.durationMinutes = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> <div>`);
				Label($$renderer, {
					for: "evt-capacity",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Capacity`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Input($$renderer, {
					id: "evt-capacity",
					type: "number",
					min: "0",
					placeholder: "Unlimited",
					get value() {
						return form.capacity;
					},
					set value($$value) {
						form.capacity = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div></div> <div>`);
				Label($$renderer, {
					for: "evt-location",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Location`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Input($$renderer, {
					id: "evt-location",
					placeholder: "Online / city",
					get value() {
						return form.location;
					},
					set value($$value) {
						form.location = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div>`);
				Label($$renderer, {
					for: "evt-meeting",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Meeting URL <span class="text-xs text-muted-foreground">(Zoom/Meet — gated to registrants)</span>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Input($$renderer, {
					id: "evt-meeting",
					type: "url",
					get value() {
						return form.meetingUrl;
					},
					set value($$value) {
						form.meetingUrl = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> <div>`);
				Label($$renderer, {
					for: "evt-recording",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Recording URL <span class="text-xs text-muted-foreground">(set after the event)</span>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Input($$renderer, {
					id: "evt-recording",
					type: "url",
					get value() {
						return form.recordingUrl;
					},
					set value($$value) {
						form.recordingUrl = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div></div> `);
				if (editingId) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div>`);
					Label($$renderer, {
						for: "evt-status",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Status`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					$$renderer.select({
						id: "evt-status",
						value: form.status,
						class: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
					}, ($$renderer) => {
						$$renderer.option({ value: "scheduled" }, ($$renderer) => {
							$$renderer.push(`Scheduled`);
						});
						$$renderer.option({ value: "live" }, ($$renderer) => {
							$$renderer.push(`Live`);
						});
						$$renderer.option({ value: "completed" }, ($$renderer) => {
							$$renderer.push(`Completed`);
						});
						$$renderer.option({ value: "cancelled" }, ($$renderer) => {
							$$renderer.push(`Cancelled`);
						});
					});
					$$renderer.push(`</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="flex justify-end gap-2 pt-2">`);
				Button($$renderer, {
					type: "button",
					variant: "outline",
					onclick: () => dialogOpen = false,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Cancel`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					type: "submit",
					disabled: saving,
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(saving ? "Saving…" : editingId ? "Save changes" : "Create event")}`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div></form></div></div>`);
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
export { _page as default };
