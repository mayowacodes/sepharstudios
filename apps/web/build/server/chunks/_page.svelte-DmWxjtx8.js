import { C as attr_class, m as ensure_array_like, E as escape_html, x as stringify, D as attr_style } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(creator)/creator/events/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const upcomingEvents = [
        {
          id: 1,
          title: "Creator Workshop: Advanced Video Editing",
          date: "February 15, 2024",
          time: "7:00 PM EST",
          type: "workshop",
          location: "Online",
          attendees: 124,
          maxAttendees: 200,
          description: "Learn professional video editing techniques specifically for ministry content.",
          speaker: "Sarah Johnson",
          isRegistered: false
        },
        {
          id: 2,
          title: "Monthly Creator Fellowship & Prayer",
          date: "February 22, 2024",
          time: "8:00 PM EST",
          type: "fellowship",
          location: "Online",
          attendees: 89,
          maxAttendees: null,
          description: "Join fellow creators for encouragement, prayer, and community building.",
          speaker: "Community Team",
          isRegistered: true
        },
        {
          id: 3,
          title: "Faith & Film Conference 2024",
          date: "March 8-10, 2024",
          time: "All Day",
          type: "conference",
          location: "Nashville, TN + Online",
          attendees: 456,
          maxAttendees: 1e3,
          description: "Three-day conference featuring industry leaders, workshops, and networking.",
          speaker: "Multiple Speakers",
          isRegistered: false
        },
        {
          id: 4,
          title: "Live Q&A: Monetizing Your Ministry Content",
          date: "February 29, 2024",
          time: "2:00 PM EST",
          type: "qa",
          location: "Online",
          attendees: 67,
          maxAttendees: 150,
          description: "Get your questions answered about ethical monetization strategies.",
          speaker: "Pastor Mike Davis",
          isRegistered: false
        }
      ];
      function getEventTypeColor(type) {
        const colors = {
          workshop: "blue",
          fellowship: "purple",
          conference: "green",
          qa: "orange",
          orientation: "yellow",
          masterclass: "red"
        };
        return colors[type] || "gray";
      }
      function getEventTypeIcon(type) {
        const icons = {
          workshop: "🔧",
          fellowship: "🤝",
          conference: "🎪",
          qa: "❓",
          orientation: "🚀",
          masterclass: "🎓"
        };
        return icons[type] || "📅";
      }
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 112, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 114, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 115, 4);
      $$renderer2.push(`Creator Events</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 116, 4);
      $$renderer2.push(`Learn, grow, and connect with fellow faith-based creators</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">`);
      push_element($$renderer2, "div", 120, 2);
      $$renderer2.push(`<div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 121, 4);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 122, 6);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h2", 123, 8);
      $$renderer2.push(`🎪 Faith &amp; Film Conference 2024</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-purple-200 mb-4">`);
      push_element($$renderer2, "p", 124, 8);
      $$renderer2.push(`Join us for our biggest event of the year! Three days of workshops, networking, and inspiration.</p>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center space-x-4 text-sm text-purple-300">`);
      push_element($$renderer2, "div", 127, 8);
      $$renderer2.push(`<span>`);
      push_element($$renderer2, "span", 128, 10);
      $$renderer2.push(`📅 March 8-10, 2024</span>`);
      pop_element();
      $$renderer2.push(` <span>`);
      push_element($$renderer2, "span", 129, 10);
      $$renderer2.push(`📍 Nashville, TN + Online</span>`);
      pop_element();
      $$renderer2.push(` <span>`);
      push_element($$renderer2, "span", 130, 10);
      $$renderer2.push(`🎟️ Early Bird: $199</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium">`);
      push_element($$renderer2, "button", 133, 6);
      $$renderer2.push(`Register Now</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="border-b border-white/20">`);
      push_element($$renderer2, "div", 140, 2);
      $$renderer2.push(`<nav class="flex space-x-8">`);
      push_element($$renderer2, "nav", 141, 4);
      $$renderer2.push(`<button${attr_class(`py-2 px-1 border-b-2 font-medium text-sm ${stringify(
        "border-purple-500 text-purple-400"
      )}`)}>`);
      push_element($$renderer2, "button", 142, 6);
      $$renderer2.push(`Upcoming Events</button>`);
      pop_element();
      $$renderer2.push(` <button${attr_class(`py-2 px-1 border-b-2 font-medium text-sm ${stringify("border-transparent text-gray-400 hover:text-gray-300")}`)}>`);
      push_element($$renderer2, "button", 148, 6);
      $$renderer2.push(`Past Events &amp; Recordings</button>`);
      pop_element();
      $$renderer2.push(` <button${attr_class(`py-2 px-1 border-b-2 font-medium text-sm ${stringify("border-transparent text-gray-400 hover:text-gray-300")}`)}>`);
      push_element($$renderer2, "button", 154, 6);
      $$renderer2.push(`Event Calendar</button>`);
      pop_element();
      $$renderer2.push(`</nav>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="space-y-6">`);
        push_element($$renderer2, "div", 165, 4);
        $$renderer2.push(`<div class="flex flex-wrap gap-2">`);
        push_element($$renderer2, "div", 167, 6);
        $$renderer2.push(`<button class="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">`);
        push_element($$renderer2, "button", 168, 8);
        $$renderer2.push(`All Events</button>`);
        pop_element();
        $$renderer2.push(` <button class="px-3 py-1 bg-white/10 text-gray-300 hover:bg-white/20 rounded-full text-sm">`);
        push_element($$renderer2, "button", 169, 8);
        $$renderer2.push(`Workshops</button>`);
        pop_element();
        $$renderer2.push(` <button class="px-3 py-1 bg-white/10 text-gray-300 hover:bg-white/20 rounded-full text-sm">`);
        push_element($$renderer2, "button", 170, 8);
        $$renderer2.push(`Fellowship</button>`);
        pop_element();
        $$renderer2.push(` <button class="px-3 py-1 bg-white/10 text-gray-300 hover:bg-white/20 rounded-full text-sm">`);
        push_element($$renderer2, "button", 171, 8);
        $$renderer2.push(`Q&amp;A Sessions</button>`);
        pop_element();
        $$renderer2.push(` <button class="px-3 py-1 bg-white/10 text-gray-300 hover:bg-white/20 rounded-full text-sm">`);
        push_element($$renderer2, "button", 172, 8);
        $$renderer2.push(`Conferences</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-4">`);
        push_element($$renderer2, "div", 176, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(upcomingEvents);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let event = each_array[$$index];
          $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
          push_element($$renderer2, "div", 178, 10);
          $$renderer2.push(`<div class="flex items-start justify-between">`);
          push_element($$renderer2, "div", 179, 12);
          $$renderer2.push(`<div class="flex-1">`);
          push_element($$renderer2, "div", 180, 14);
          $$renderer2.push(`<div class="flex items-center space-x-3 mb-2">`);
          push_element($$renderer2, "div", 181, 16);
          $$renderer2.push(`<span class="text-2xl">`);
          push_element($$renderer2, "span", 182, 18);
          $$renderer2.push(`${escape_html(getEventTypeIcon(event.type))}</span>`);
          pop_element();
          $$renderer2.push(` <h3 class="text-xl font-bold text-white">`);
          push_element($$renderer2, "h3", 183, 18);
          $$renderer2.push(`${escape_html(event.title)}</h3>`);
          pop_element();
          $$renderer2.push(` <span${attr_class(`bg-${stringify(getEventTypeColor(event.type))}-600 text-${stringify(getEventTypeColor(event.type))}-100 text-xs px-2 py-1 rounded capitalize`)}>`);
          push_element($$renderer2, "span", 184, 18);
          $$renderer2.push(`${escape_html(event.type)}</span>`);
          pop_element();
          $$renderer2.push(` `);
          if (event.isRegistered) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span class="bg-green-600 text-green-100 text-xs px-2 py-1 rounded">`);
            push_element($$renderer2, "span", 188, 20);
            $$renderer2.push(`✅ Registered</span>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
          $$renderer2.push(` <p class="text-gray-300 mb-4">`);
          push_element($$renderer2, "p", 194, 16);
          $$renderer2.push(`${escape_html(event.description)}</p>`);
          pop_element();
          $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">`);
          push_element($$renderer2, "div", 196, 16);
          $$renderer2.push(`<div class="space-y-2">`);
          push_element($$renderer2, "div", 197, 18);
          $$renderer2.push(`<div class="flex items-center text-sm text-gray-400">`);
          push_element($$renderer2, "div", 198, 20);
          $$renderer2.push(`<span class="mr-2">`);
          push_element($$renderer2, "span", 199, 22);
          $$renderer2.push(`📅</span>`);
          pop_element();
          $$renderer2.push(` <span>`);
          push_element($$renderer2, "span", 200, 22);
          $$renderer2.push(`${escape_html(event.date)} at ${escape_html(event.time)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="flex items-center text-sm text-gray-400">`);
          push_element($$renderer2, "div", 202, 20);
          $$renderer2.push(`<span class="mr-2">`);
          push_element($$renderer2, "span", 203, 22);
          $$renderer2.push(`📍</span>`);
          pop_element();
          $$renderer2.push(` <span>`);
          push_element($$renderer2, "span", 204, 22);
          $$renderer2.push(`${escape_html(event.location)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="flex items-center text-sm text-gray-400">`);
          push_element($$renderer2, "div", 206, 20);
          $$renderer2.push(`<span class="mr-2">`);
          push_element($$renderer2, "span", 207, 22);
          $$renderer2.push(`🎤</span>`);
          pop_element();
          $$renderer2.push(` <span>`);
          push_element($$renderer2, "span", 208, 22);
          $$renderer2.push(`Speaker: ${escape_html(event.speaker)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="space-y-2">`);
          push_element($$renderer2, "div", 211, 18);
          $$renderer2.push(`<div class="flex items-center text-sm text-gray-400">`);
          push_element($$renderer2, "div", 212, 20);
          $$renderer2.push(`<span class="mr-2">`);
          push_element($$renderer2, "span", 213, 22);
          $$renderer2.push(`👥</span>`);
          pop_element();
          $$renderer2.push(` <span>`);
          push_element($$renderer2, "span", 214, 22);
          $$renderer2.push(`${escape_html(event.attendees)} attending `);
          if (event.maxAttendees) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`/ ${escape_html(event.maxAttendees)} max`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` `);
          if (event.maxAttendees) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="w-full bg-gray-700 rounded-full h-2">`);
            push_element($$renderer2, "div", 222, 22);
            $$renderer2.push(`<div class="bg-purple-600 h-2 rounded-full"${attr_style(`width: ${stringify(event.attendees / event.maxAttendees * 100)}%`)}>`);
            push_element($$renderer2, "div", 223, 24);
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <div class="flex items-center space-x-3">`);
          push_element($$renderer2, "div", 232, 16);
          if (!event.isRegistered) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">`);
            push_element($$renderer2, "button", 234, 20);
            $$renderer2.push(`Register</button>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">`);
            push_element($$renderer2, "button", 238, 20);
            $$renderer2.push(`View Details</button>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--> <button class="text-gray-400 hover:text-white">`);
          push_element($$renderer2, "button", 242, 18);
          $$renderer2.push(`📅 Add to Calendar</button>`);
          pop_element();
          $$renderer2.push(` <button class="text-gray-400 hover:text-white">`);
          push_element($$renderer2, "button", 245, 18);
          $$renderer2.push(`🔔 Set Reminder</button>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> <div class="bg-purple-600/20 border border-purple-600 rounded-xl p-6">`);
      push_element($$renderer2, "div", 390, 2);
      $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-4">`);
      push_element($$renderer2, "h3", 391, 4);
      $$renderer2.push(`💡 Suggest an Event</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-purple-200 mb-4">`);
      push_element($$renderer2, "p", 392, 4);
      $$renderer2.push(`Have an idea for a workshop, topic, or speaker you'd like to see? We'd love to hear from you!</p>`);
      pop_element();
      $$renderer2.push(` <div class="flex flex-col md:flex-row gap-4">`);
      push_element($$renderer2, "div", 395, 4);
      $$renderer2.push(`<input type="text" placeholder="What event would you like to see?" class="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"/>`);
      push_element($$renderer2, "input", 396, 6);
      pop_element();
      $$renderer2.push(` <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium">`);
      push_element($$renderer2, "button", 401, 6);
      $$renderer2.push(`Submit Suggestion</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-DmWxjtx8.js.map
