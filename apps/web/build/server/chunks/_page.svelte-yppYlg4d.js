import { at as head, al as ensure_array_like, ab as attr_class, aa as attr, an as escape_html } from './ui-libs-TtGtWAGI.js';
import { C as Calendar } from './calendar-CxjjBQYu.js';
import { P as Plus } from './plus-CUYEb6Zo.js';
import { B as Button } from './button-D9M18H3C.js';
import { I as Input } from './input-BHWqom2S.js';
import './badge-HJ6WNmX7.js';
import { L as Label } from './label-BV40bMri.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CGEdwVFL.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';

//#endregion
//#region src/routes/(admin)/admin/events/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let saving = false;
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
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1t5c1jr", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Events · Admin</title>`);
				});
			});
			$$renderer.push(`<div class="space-y-6"><div class="flex items-center justify-between flex-wrap gap-3"><div><h1 class="text-3xl font-bold flex items-center gap-2">`);
			Calendar($$renderer, { class: "w-7 h-7" });
			$$renderer.push(`<!----> Events</h1> <p class="text-sm text-muted-foreground">Create + manage webinars, workshops, conferences. Powers /webinars and /creator/events.</p></div> `);
			Button($$renderer, {
				onclick: openCreate,
				children: ($$renderer) => {
					Plus($$renderer, { class: "w-4 h-4 mr-2" });
					$$renderer.push(`<!----> New event`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			$$renderer.push("<!--[-1-->");
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
			{
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-sm text-muted-foreground py-8 text-center">Loading events…</p>`);
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
						$$renderer.push(`<!---->${escape_html(editingId ? "Save changes" : "Create event")}`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-yppYlg4d.js.map
