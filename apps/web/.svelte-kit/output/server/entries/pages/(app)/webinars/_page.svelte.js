import { Ot as ensure_array_like, Pt as stringify, St as attr_class, Wt as escape_html, kt as head } from "../../../../chunks/ui-libs.js";
import { t as Arrow_right } from "../../../../chunks/arrow-right.js";
import { t as Bell } from "../../../../chunks/bell.js";
import { t as Calendar } from "../../../../chunks/calendar.js";
import { t as Clock } from "../../../../chunks/clock.js";
import { t as Users } from "../../../../chunks/users.js";
import { t as Video } from "../../../../chunks/video.js";
import { n as goto } from "../../../../chunks/client.js";
import "../../../../chunks/navigation.js";
import { t as Button } from "../../../../chunks/button.js";
//#region src/routes/(app)/webinars/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const tracks = {
			creator: {
				label: "Creator Track",
				color: "bg-purple-500/15 text-purple-300 border-purple-500/30"
			},
			tokenomics: {
				label: "STC & Web3",
				color: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30"
			},
			theology: {
				label: "Theology",
				color: "bg-blue-500/15 text-blue-300 border-blue-500/30"
			},
			tech: {
				label: "Platform Tech",
				color: "bg-green-500/15 text-green-300 border-green-500/30"
			}
		};
		let upcoming = [];
		let past = [];
		let loading = true;
		let toggling = null;
		let message = "";
		async function loadEvents() {
			loading = true;
			try {
				const [up, pa] = await Promise.all([fetch("/api/events?audience=public&filter=upcoming").then((r) => r.json()), fetch("/api/events?audience=public&filter=past").then((r) => r.json())]);
				upcoming = up.events ?? [];
				past = pa.events ?? [];
			} catch (err) {
				console.error("Failed to load events:", err);
			} finally {
				loading = false;
			}
		}
		async function toggleRegistration(eventId, isRegistered) {
			toggling = eventId;
			message = "";
			try {
				const res = await fetch(`/api/events/${eventId}/register`, { method: isRegistered ? "DELETE" : "POST" });
				if (res.status === 401) {
					goto(`/auth/login?redirectTo=/webinars`);
					return;
				}
				const data = await res.json();
				if (!res.ok) throw new Error(data.error ?? "Registration failed");
				message = isRegistered ? "Cancelled." : "You're registered — we'll send a reminder.";
				setTimeout(() => message = "", 4e3);
				await loadEvents();
			} catch (err) {
				message = err instanceof Error ? err.message : "Something went wrong";
			} finally {
				toggling = null;
			}
		}
		function formatDate(iso) {
			return new Date(iso).toLocaleString("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
				timeZoneName: "short"
			});
		}
		function formatDuration(minutes) {
			if (!minutes) return "";
			if (minutes < 60) return `${minutes} min`;
			const h = Math.floor(minutes / 60);
			const m = minutes % 60;
			return m === 0 ? `${h} hr` : `${h}h ${m}m`;
		}
		head("1tufhkd", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Webinars · Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description" content="Live and on-demand sessions for Sephar Studios creators, viewers and STC holders."/>`);
		});
		$$renderer.push(`<div class="min-h-screen bg-background text-white px-4 py-10"><div class="max-w-5xl mx-auto space-y-10"><header class="text-center space-y-3"><div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">`);
		Video($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----> Live &amp; On-Demand</div> <h1 class="text-3xl md:text-4xl font-bold">Sephar Studios Webinars</h1> <p class="text-muted-foreground max-w-2xl mx-auto">Weekly sessions for creators, viewers and STC holders — production craft, theology,
        platform mechanics and token economics, taught by the people building Sephar Studios.</p></header> <section class="space-y-4"><div class="flex items-center justify-between"><h2 class="text-xl font-semibold flex items-center gap-2">`);
		Calendar($$renderer, { class: "w-5 h-5 text-primary" });
		$$renderer.push(`<!----> Upcoming sessions</h2> `);
		Button($$renderer, {
			variant: "outline",
			size: "sm",
			children: ($$renderer) => {
				Bell($$renderer, { class: "w-4 h-4 mr-2" });
				$$renderer.push(`<!----> Subscribe to calendar`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div> `);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-muted-foreground py-6 text-center">Loading webinars…</p>`);
		} else if (upcoming.length === 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="bg-card border border-border rounded-xl p-8 text-center"><p class="text-sm text-muted-foreground">No upcoming sessions scheduled. Subscribe to the calendar or follow us for announcements.</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid gap-4 md:grid-cols-2"><!--[-->`);
			const each_array = ensure_array_like(upcoming);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let w = each_array[$$index];
				$$renderer.push(`<article class="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors"><div class="flex items-start justify-between gap-3">`);
				if (w.track && tracks[w.track]) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span${attr_class(`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded border ${stringify(tracks[w.track].color)}`)}>${escape_html(tracks[w.track].label)}</span>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span></span>`);
				}
				$$renderer.push(`<!--]--> <div class="flex items-center text-xs text-muted-foreground gap-1">`);
				Users($$renderer, { class: "w-3.5 h-3.5" });
				$$renderer.push(`<!----> ${escape_html(w.registeredCount)}${escape_html(w.capacity ? ` / ${w.capacity}` : "")}</div></div> <h3 class="text-base font-bold leading-snug">${escape_html(w.title)}</h3> `);
				if (w.description) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-sm text-muted-foreground leading-relaxed">${escape_html(w.description)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="text-xs text-muted-foreground space-y-1"><div class="flex items-center gap-2">`);
				Calendar($$renderer, { class: "w-3.5 h-3.5" });
				$$renderer.push(`<!---->${escape_html(formatDate(w.startsAt))}</div> `);
				if (w.durationMinutes) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex items-center gap-2">`);
					Clock($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!---->${escape_html(formatDuration(w.durationMinutes))}</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="pt-2 border-t border-border flex items-center justify-between"><div class="text-xs">`);
				if (w.speaker) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="font-semibold">${escape_html(w.speaker)}</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (w.speakerRole) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="text-muted-foreground">${escape_html(w.speakerRole)}</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> `);
				Button($$renderer, {
					size: "sm",
					variant: w.isRegistered ? "outline" : "default",
					disabled: toggling === w.id || w.capacity !== null && w.registeredCount >= w.capacity && !w.isRegistered,
					onclick: () => toggleRegistration(w.id, w.isRegistered),
					"aria-pressed": w.isRegistered,
					children: ($$renderer) => {
						if (toggling === w.id) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`Working…`);
						} else if (w.isRegistered) {
							$$renderer.push("<!--[1-->");
							$$renderer.push(`Registered`);
						} else if (w.capacity !== null && w.registeredCount >= w.capacity) {
							$$renderer.push("<!--[2-->");
							$$renderer.push(`Full`);
						} else {
							$$renderer.push("<!--[-1-->");
							$$renderer.push(`Reserve seat `);
							Arrow_right($$renderer, { class: "w-3.5 h-3.5 ml-2" });
							$$renderer.push(`<!---->`);
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div></article>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> `);
		if (message) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-xs text-center text-muted-foreground">${escape_html(message)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></section> `);
		if (!loading && past.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="space-y-4"><h2 class="text-xl font-semibold flex items-center gap-2">`);
			Video($$renderer, { class: "w-5 h-5 text-primary" });
			$$renderer.push(`<!----> Past recordings</h2> <div class="grid gap-3"><!--[-->`);
			const each_array_1 = ensure_array_like(past);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let w = each_array_1[$$index_1];
				$$renderer.push(`<article class="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-4">`);
				if (w.track && tracks[w.track]) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span${attr_class(`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded border ${stringify(tracks[w.track].color)}`)}>${escape_html(tracks[w.track].label)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="flex-1 min-w-60"><h3 class="text-sm font-semibold">${escape_html(w.title)}</h3> <p class="text-xs text-muted-foreground">${escape_html(w.speaker ?? "Sephar Studios")} · ${escape_html(formatDate(w.startsAt))}${escape_html(w.durationMinutes ? ` · ${formatDuration(w.durationMinutes)}` : "")}</p></div> `);
				if (w.recordingUrl) {
					$$renderer.push("<!--[0-->");
					Button($$renderer, {
						size: "sm",
						variant: "outline",
						href: w.recordingUrl,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Watch recording`);
						},
						$$slots: { default: true }
					});
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="text-xs text-muted-foreground">Recording pending</span>`);
				}
				$$renderer.push(`<!--]--></article>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <section class="bg-card border border-border rounded-2xl p-6 text-center space-y-3"><h2 class="text-lg font-semibold">Want to speak at a session?</h2> <p class="text-sm text-muted-foreground max-w-xl mx-auto">Pitch a topic to our creator success team. Approved sessions reach 200+ live viewers and stay in the archive permanently.</p> `);
		Button($$renderer, {
			href: "/contact",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Pitch a session`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></section></div></div>`);
	});
}
//#endregion
export { _page as default };
