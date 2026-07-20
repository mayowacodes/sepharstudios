import { Et as derived, Ht as attr, Ot as ensure_array_like, St as attr_class, Wt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Calendar } from "../../../../../chunks/calendar.js";
import "../../../../../chunks/navigation.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
//#region src/routes/(creator)/creator/events/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let kindFilter = "all";
		let upcomingEvents = [];
		let toggling = null;
		derived(() => upcomingEvents);
		let featured = derived(() => upcomingEvents[0] ?? null);
		function formatStart(iso) {
			return new Date(iso).toLocaleString("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit"
			});
		}
		function getEventTypeIcon(type) {
			return {
				workshop: "🔧",
				fellowship: "🤝",
				conference: "🎪",
				qa: "❓",
				orientation: "🚀",
				masterclass: "🎓"
			}[type] || "📅";
		}
		$$renderer.push(`<div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "Calendar",
			title: "Events",
			subtitle: "Learn, grow, and connect with fellow faith-based creators.",
			icon: Calendar
		});
		$$renderer.push(`<!----> `);
		if (featured()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-linear-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6"><div class="flex items-center justify-between flex-wrap gap-4"><div class="flex-1 min-w-60"><h2 class="text-2xl font-bold text-foreground mb-2">${escape_html(getEventTypeIcon(featured().kind))} ${escape_html(featured().title)}</h2> `);
			if (featured().description) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-purple-200 mb-4">${escape_html(featured().description)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex items-center space-x-4 text-sm text-purple-300 flex-wrap gap-y-2"><span>📅 ${escape_html(formatStart(featured().startsAt))}</span> `);
			if (featured().location) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span>📍 ${escape_html(featured().location)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (featured().speaker) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span>🎤 ${escape_html(featured().speaker)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <button${attr("disabled", toggling === featured().id, true)}${attr_class(`px-6 py-3 rounded-lg font-medium disabled:opacity-50 ${featured().isRegistered ? "surface-2 hover:surface-3 text-foreground" : "bg-purple-600 hover:bg-purple-700 text-white"}`)}${attr("aria-pressed", featured().isRegistered)}>`);
			if (toggling === featured().id) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`Working…`);
			} else if (featured().isRegistered) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`Registered ✓`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`Register Now`);
			}
			$$renderer.push(`<!--]--></button></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="border-b border-border"><nav class="flex space-x-8"><button${attr_class(`py-2 px-1 border-b-2 font-medium text-sm border-purple-500 text-purple-400`)}>Upcoming Events</button> <button${attr_class(`py-2 px-1 border-b-2 font-medium text-sm border-transparent text-muted-foreground hover:text-foreground/80`)}>Past Events &amp; Recordings</button> <button${attr_class(`py-2 px-1 border-b-2 font-medium text-sm border-transparent text-muted-foreground hover:text-foreground/80`)}>Event Calendar</button></nav></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-6"><div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array = ensure_array_like([
				{
					id: "all",
					label: "All Events"
				},
				{
					id: "workshop",
					label: "Workshops"
				},
				{
					id: "fellowship",
					label: "Fellowship"
				},
				{
					id: "qa",
					label: "Q&A Sessions"
				},
				{
					id: "conference",
					label: "Conferences"
				}
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let chip = each_array[$$index];
				$$renderer.push(`<button${attr_class(`px-3 py-1 rounded-full text-sm transition-colors ${kindFilter === chip.id ? "bg-purple-600 text-foreground" : "surface-2 text-white/80 hover:surface-3"}`)}${attr("aria-pressed", kindFilter === chip.id)}>${escape_html(chip.label)}</button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-muted-foreground py-6 text-center">Loading events…</p>`);
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> <div class="bg-purple-600/20 border border-purple-600 rounded-xl p-6"><h3 class="text-lg font-bold text-foreground mb-4">💡 Suggest an Event</h3> <p class="text-purple-200 mb-4">Have an idea for a workshop, topic, or speaker you'd like to see? We'd love to hear from you!</p> <div class="flex flex-col md:flex-row gap-4"><input type="text" placeholder="What event would you like to see?" class="flex-1 px-4 py-2 surface-2 border border-border rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:border-purple-500"/> <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium">Submit Suggestion</button></div></div></div>`);
	});
}
//#endregion
export { _page as default };
