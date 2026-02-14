import { m as ensure_array_like, E as escape_html, C as attr_class, x as stringify } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(creator)/creator/success-stories/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let filteredStories, featuredStories;
      let activeFilter = "all";
      const filters = [
        { id: "all", title: "All Stories", icon: "⭐" },
        { id: "growth", title: "Channel Growth", icon: "📈" },
        { id: "ministry", title: "Ministry Impact", icon: "✝️" },
        {
          id: "breakthrough",
          title: "Breakthrough Moments",
          icon: "🚀"
        },
        { id: "community", title: "Community Building", icon: "👥" },
        {
          id: "monetization",
          title: "Monetization Success",
          icon: "💰"
        }
      ];
      const successStories = [
        {
          id: 1,
          name: "Pastor Sarah Johnson",
          channel: "Grace & Truth Ministries",
          category: "ministry",
          thumbnail: "/avatars/sarah.jpg",
          subscribers: "125K",
          achievement: "Built a global community reaching 50+ countries",
          story: "Started with just a smartphone and a heart for ministry. Now reaching hundreds of thousands with weekly Bible studies.",
          quote: "Sephar Studios gave me the platform to share God's love beyond my local church walls.",
          metrics: {
            views: "2.3M",
            countries: "52",
            baptisms: "127",
            testimonies: "1,400+"
          },
          featured: true
        },
        {
          id: 2,
          name: "David Martinez",
          channel: "Kingdom Builders",
          category: "growth",
          thumbnail: "/avatars/david.jpg",
          subscribers: "89K",
          achievement: "Grew from 0 to 89K subscribers in 18 months",
          story: "Consistent content creation and community engagement helped build a thriving Christian community online.",
          quote: "The analytics tools helped me understand my audience and create content that really resonates.",
          metrics: {
            growth: "89K in 18mo",
            engagement: "12.4%",
            retention: "78%",
            community: "Active"
          },
          featured: false
        },
        {
          id: 3,
          name: "Michelle Chen",
          channel: "Faith & Family Life",
          category: "breakthrough",
          thumbnail: "/avatars/michelle.jpg",
          subscribers: "67K",
          achievement: "Viral testimony video reached 1.2M people",
          story: "One authentic testimony about overcoming addiction touched millions and opened doors for speaking opportunities.",
          quote: "God used one vulnerable moment to create breakthrough in countless lives.",
          metrics: {
            viral: "1.2M views",
            speaking: "25 events",
            books: "2 published",
            recovery: "500+ stories"
          },
          featured: true
        },
        {
          id: 4,
          name: "James Wilson",
          channel: "Modern Worship",
          category: "monetization",
          thumbnail: "/avatars/james.jpg",
          subscribers: "156K",
          achievement: "Generated $45K annually to fund music ministry",
          story: "Leveraged sponsorships and donations to produce high-quality worship content and support local musicians.",
          quote: "The platform's monetization tools allowed me to turn my passion into sustainable ministry.",
          metrics: {
            revenue: "$45K/year",
            musicians: "12 supported",
            albums: "3 produced",
            concerts: "24 funded"
          },
          featured: false
        },
        {
          id: 5,
          name: "Rebecca Thompson",
          channel: "Women of Faith",
          category: "community",
          thumbnail: "/avatars/rebecca.jpg",
          subscribers: "78K",
          achievement: "Created support network for 5,000+ women",
          story: "Built an online community that provides spiritual support, mentorship, and real-life connections for women worldwide.",
          quote: "We've seen marriages restored, addictions overcome, and faith renewed through our community.",
          metrics: {
            members: "5,000+",
            groups: "45 local",
            mentors: "200+",
            marriages: "89 restored"
          },
          featured: true
        },
        {
          id: 6,
          name: "Pastor Mark Rodriguez",
          channel: "Biblical Archaeology",
          category: "ministry",
          thumbnail: "/avatars/mark.jpg",
          subscribers: "94K",
          achievement: "Made Biblical history accessible to modern audiences",
          story: "Combines archaeological discoveries with Biblical teaching to strengthen faith and reach skeptics.",
          quote: "Seeing people's faith strengthened through historical evidence has been incredibly rewarding.",
          metrics: {
            documentaries: "12",
            universities: "8 partnerships",
            conversions: "2,300+",
            research: "6 published"
          },
          featured: false
        }
      ];
      function getCategoryColor(category) {
        const colors = {
          ministry: "purple",
          growth: "blue",
          breakthrough: "green",
          community: "orange",
          monetization: "yellow"
        };
        return colors[category] || "gray";
      }
      filteredStories = successStories.filter((story) => activeFilter === "all");
      featuredStories = successStories.filter((story) => story.featured);
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 143, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 145, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 146, 4);
      $$renderer2.push(`Creator Success Stories</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 147, 4);
      $$renderer2.push(`Be inspired by fellow creators who are making a real impact through their ministry</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">`);
      push_element($$renderer2, "div", 151, 2);
      $$renderer2.push(`<h2 class="text-xl font-bold text-white mb-4 text-center">`);
      push_element($$renderer2, "h2", 152, 4);
      $$renderer2.push(`🌟 Community Impact</h2>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-2 md:grid-cols-4 gap-4">`);
      push_element($$renderer2, "div", 153, 4);
      $$renderer2.push(`<div class="text-center">`);
      push_element($$renderer2, "div", 154, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-purple-400">`);
      push_element($$renderer2, "div", 155, 8);
      $$renderer2.push(`12.8M</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-purple-200">`);
      push_element($$renderer2, "div", 156, 8);
      $$renderer2.push(`Total Views</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center">`);
      push_element($$renderer2, "div", 158, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 159, 8);
      $$renderer2.push(`340+</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-blue-200">`);
      push_element($$renderer2, "div", 160, 8);
      $$renderer2.push(`Active Creators</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center">`);
      push_element($$renderer2, "div", 162, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-green-400">`);
      push_element($$renderer2, "div", 163, 8);
      $$renderer2.push(`89</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-green-200">`);
      push_element($$renderer2, "div", 164, 8);
      $$renderer2.push(`Countries Reached</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center">`);
      push_element($$renderer2, "div", 166, 6);
      $$renderer2.push(`<div class="text-2xl font-bold text-orange-400">`);
      push_element($$renderer2, "div", 167, 8);
      $$renderer2.push(`15K+</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-orange-200">`);
      push_element($$renderer2, "div", 168, 8);
      $$renderer2.push(`Lives Changed</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 174, 2);
      $$renderer2.push(`<h3 class="text-xl font-bold text-white mb-6">`);
      push_element($$renderer2, "h3", 175, 4);
      $$renderer2.push(`🏆 Featured Success Stories</h3>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-3 gap-6">`);
      push_element($$renderer2, "div", 176, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(featuredStories);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let story = each_array[$$index];
        $$renderer2.push(`<div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 178, 8);
        $$renderer2.push(`<div class="flex items-center space-x-3 mb-3">`);
        push_element($$renderer2, "div", 179, 10);
        $$renderer2.push(`<div class="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">`);
        push_element($$renderer2, "div", 180, 12);
        $$renderer2.push(`${escape_html(story.name.charAt(0))}</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 183, 12);
        $$renderer2.push(`<div class="text-white font-medium">`);
        push_element($$renderer2, "div", 184, 14);
        $$renderer2.push(`${escape_html(story.name)}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-400 text-sm">`);
        push_element($$renderer2, "div", 185, 14);
        $$renderer2.push(`${escape_html(story.channel)}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 text-sm mb-3">`);
        push_element($$renderer2, "p", 188, 10);
        $$renderer2.push(`${escape_html(story.achievement)}</p>`);
        pop_element();
        $$renderer2.push(` <div class="text-purple-400 text-xs">`);
        push_element($$renderer2, "div", 189, 10);
        $$renderer2.push(`${escape_html(story.subscribers)} subscribers</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex flex-wrap gap-2">`);
      push_element($$renderer2, "div", 198, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(filters);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let filter = each_array_1[$$index_1];
        $$renderer2.push(`<button${attr_class(`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${stringify(activeFilter === filter.id ? "bg-purple-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white")}`)}>`);
        push_element($$renderer2, "button", 200, 6);
        $$renderer2.push(`<span class="mr-2">`);
        push_element($$renderer2, "span", 208, 8);
        $$renderer2.push(`${escape_html(filter.icon)}</span>`);
        pop_element();
        $$renderer2.push(` ${escape_html(filter.title)}</button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-8">`);
      push_element($$renderer2, "div", 215, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array_2 = ensure_array_like(filteredStories);
      for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
        let story = each_array_2[$$index_3];
        $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
        push_element($$renderer2, "div", 217, 6);
        $$renderer2.push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">`);
        push_element($$renderer2, "div", 218, 8);
        $$renderer2.push(`<div class="lg:col-span-1">`);
        push_element($$renderer2, "div", 220, 10);
        $$renderer2.push(`<div class="flex items-center space-x-4 mb-4">`);
        push_element($$renderer2, "div", 221, 12);
        $$renderer2.push(`<div class="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl">`);
        push_element($$renderer2, "div", 222, 14);
        $$renderer2.push(`${escape_html(story.name.charAt(0))}</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 225, 14);
        $$renderer2.push(`<h3 class="text-xl font-bold text-white">`);
        push_element($$renderer2, "h3", 226, 16);
        $$renderer2.push(`${escape_html(story.name)}</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-400">`);
        push_element($$renderer2, "p", 227, 16);
        $$renderer2.push(`${escape_html(story.channel)}</p>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-2 mt-1">`);
        push_element($$renderer2, "div", 228, 16);
        $$renderer2.push(`<span${attr_class(`bg-${stringify(getCategoryColor(story.category))}-600 text-${stringify(getCategoryColor(story.category))}-100 text-xs px-2 py-1 rounded capitalize`)}>`);
        push_element($$renderer2, "span", 229, 18);
        $$renderer2.push(`${escape_html(story.category)}</span>`);
        pop_element();
        $$renderer2.push(` <span class="text-purple-400 text-sm">`);
        push_element($$renderer2, "span", 232, 18);
        $$renderer2.push(`${escape_html(story.subscribers)} subscribers</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-white/5 rounded-lg p-4">`);
        push_element($$renderer2, "div", 238, 12);
        $$renderer2.push(`<h4 class="text-white font-medium mb-3">`);
        push_element($$renderer2, "h4", 239, 14);
        $$renderer2.push(`Key Metrics</h4>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-2">`);
        push_element($$renderer2, "div", 240, 14);
        $$renderer2.push(`<!--[-->`);
        const each_array_3 = ensure_array_like(Object.entries(story.metrics));
        for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
          let [key, value] = each_array_3[$$index_2];
          $$renderer2.push(`<div class="flex justify-between">`);
          push_element($$renderer2, "div", 242, 18);
          $$renderer2.push(`<span class="text-gray-400 capitalize text-sm">`);
          push_element($$renderer2, "span", 243, 20);
          $$renderer2.push(`${escape_html(key)}:</span>`);
          pop_element();
          $$renderer2.push(` <span class="text-white text-sm">`);
          push_element($$renderer2, "span", 244, 20);
          $$renderer2.push(`${escape_html(value)}</span>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="lg:col-span-2">`);
        push_element($$renderer2, "div", 252, 10);
        $$renderer2.push(`<div class="mb-4">`);
        push_element($$renderer2, "div", 253, 12);
        $$renderer2.push(`<h4 class="text-lg font-bold text-white mb-2">`);
        push_element($$renderer2, "h4", 254, 14);
        $$renderer2.push(`🎯 Achievement</h4>`);
        pop_element();
        $$renderer2.push(` <p class="text-green-400 font-medium">`);
        push_element($$renderer2, "p", 255, 14);
        $$renderer2.push(`${escape_html(story.achievement)}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="mb-4">`);
        push_element($$renderer2, "div", 258, 12);
        $$renderer2.push(`<h4 class="text-lg font-bold text-white mb-2">`);
        push_element($$renderer2, "h4", 259, 14);
        $$renderer2.push(`📖 Story</h4>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300">`);
        push_element($$renderer2, "p", 260, 14);
        $$renderer2.push(`${escape_html(story.story)}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="bg-blue-600/20 border-l-4 border-blue-600 pl-4 py-2">`);
        push_element($$renderer2, "div", 263, 12);
        $$renderer2.push(`<p class="text-blue-200 italic">`);
        push_element($$renderer2, "p", 264, 14);
        $$renderer2.push(`"${escape_html(story.quote)}"</p>`);
        pop_element();
        $$renderer2.push(` <p class="text-blue-300 text-sm mt-2">`);
        push_element($$renderer2, "p", 265, 14);
        $$renderer2.push(`— ${escape_html(story.name)}</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="mt-4 flex space-x-3">`);
        push_element($$renderer2, "div", 268, 12);
        $$renderer2.push(`<button class="text-purple-400 hover:text-purple-300 text-sm">`);
        push_element($$renderer2, "button", 269, 14);
        $$renderer2.push(`📹 View Channel</button>`);
        pop_element();
        $$renderer2.push(` <button class="text-purple-400 hover:text-purple-300 text-sm">`);
        push_element($$renderer2, "button", 272, 14);
        $$renderer2.push(`💬 Read Full Interview</button>`);
        pop_element();
        $$renderer2.push(` <button class="text-purple-400 hover:text-purple-300 text-sm">`);
        push_element($$renderer2, "button", 275, 14);
        $$renderer2.push(`🔗 Connect with ${escape_html(story.name.split(" ")[0])}</button>`);
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
      $$renderer2.push(` <div class="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl p-8">`);
      push_element($$renderer2, "div", 286, 2);
      $$renderer2.push(`<div class="text-center">`);
      push_element($$renderer2, "div", 287, 4);
      $$renderer2.push(`<div class="text-4xl mb-4">`);
      push_element($$renderer2, "div", 288, 6);
      $$renderer2.push(`✨</div>`);
      pop_element();
      $$renderer2.push(` <h2 class="text-2xl font-bold text-white mb-4">`);
      push_element($$renderer2, "h2", 289, 6);
      $$renderer2.push(`Share Your Success Story</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-green-200 mb-6 max-w-2xl mx-auto">`);
      push_element($$renderer2, "p", 290, 6);
      $$renderer2.push(`Have you seen God work through your content in amazing ways? We'd love to hear your story and
        inspire other creators in our community. Your testimony could be the encouragement someone needs!</p>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4 max-w-md mx-auto">`);
      push_element($$renderer2, "div", 295, 6);
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
      push_element($$renderer2, "div", 296, 8);
      $$renderer2.push(`<input type="text" placeholder="Your name" class="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"/>`);
      push_element($$renderer2, "input", 297, 10);
      pop_element();
      $$renderer2.push(` <input type="text" placeholder="Channel name" class="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"/>`);
      push_element($$renderer2, "input", 302, 10);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <textarea placeholder="Tell us your success story (what God has done through your content)..." rows="4" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500">`);
      push_element($$renderer2, "textarea", 308, 8);
      $$renderer2.push(`</textarea>`);
      pop_element();
      $$renderer2.push(` <button class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">`);
      push_element($$renderer2, "button", 313, 8);
      $$renderer2.push(`Submit My Story</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-gray-400 mt-4">`);
      push_element($$renderer2, "p", 318, 6);
      $$renderer2.push(`By submitting, you agree to let us feature your story (with your permission) to inspire other creators.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 325, 2);
      $$renderer2.push(`<h3 class="text-xl font-bold text-white mb-6">`);
      push_element($$renderer2, "h3", 326, 4);
      $$renderer2.push(`💡 Common Success Patterns</h3>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
      push_element($$renderer2, "div", 327, 4);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 328, 6);
      $$renderer2.push(`<h4 class="text-lg font-medium text-white mb-4">`);
      push_element($$renderer2, "h4", 329, 8);
      $$renderer2.push(`📈 Growth Strategies</h4>`);
      pop_element();
      $$renderer2.push(` <ul class="space-y-2 text-gray-300 text-sm">`);
      push_element($$renderer2, "ul", 330, 8);
      $$renderer2.push(`<li>`);
      push_element($$renderer2, "li", 331, 10);
      $$renderer2.push(`• Consistent posting schedule (weekly minimum)</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 332, 10);
      $$renderer2.push(`• Authentic, personal storytelling</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 333, 10);
      $$renderer2.push(`• Active community engagement</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 334, 10);
      $$renderer2.push(`• Cross-platform promotion</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 335, 10);
      $$renderer2.push(`• Collaboration with other creators</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 336, 10);
      $$renderer2.push(`• Prayer and spiritual foundation</li>`);
      pop_element();
      $$renderer2.push(`</ul>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 339, 6);
      $$renderer2.push(`<h4 class="text-lg font-medium text-white mb-4">`);
      push_element($$renderer2, "h4", 340, 8);
      $$renderer2.push(`🎯 Ministry Impact</h4>`);
      pop_element();
      $$renderer2.push(` <ul class="space-y-2 text-gray-300 text-sm">`);
      push_element($$renderer2, "ul", 341, 8);
      $$renderer2.push(`<li>`);
      push_element($$renderer2, "li", 342, 10);
      $$renderer2.push(`• Clear Gospel message in content</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 343, 10);
      $$renderer2.push(`• Personal testimony sharing</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 344, 10);
      $$renderer2.push(`• Interactive community features</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 345, 10);
      $$renderer2.push(`• Prayer request integration</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 346, 10);
      $$renderer2.push(`• Follow-up with viewers</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 347, 10);
      $$renderer2.push(`• Local church partnerships</li>`);
      pop_element();
      $$renderer2.push(`</ul>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-purple-600/20 border border-purple-600 rounded-xl p-6">`);
      push_element($$renderer2, "div", 354, 2);
      $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-4">`);
      push_element($$renderer2, "h3", 355, 4);
      $$renderer2.push(`🌟 Monthly Creator Spotlight</h3>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
      push_element($$renderer2, "div", 356, 4);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 357, 6);
      $$renderer2.push(`<p class="text-purple-200 mb-4">`);
      push_element($$renderer2, "p", 358, 8);
      $$renderer2.push(`Each month, we feature exceptional creators who are making a significant impact through their ministry.
          Nominated creators receive:</p>`);
      pop_element();
      $$renderer2.push(` <ul class="text-purple-200 text-sm space-y-1">`);
      push_element($$renderer2, "ul", 362, 8);
      $$renderer2.push(`<li>`);
      push_element($$renderer2, "li", 363, 10);
      $$renderer2.push(`• Featured placement on homepage</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 364, 10);
      $$renderer2.push(`• Newsletter feature and interview</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 365, 10);
      $$renderer2.push(`• Social media promotion</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 366, 10);
      $$renderer2.push(`• Speaking opportunity consideration</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 367, 10);
      $$renderer2.push(`• Professional development resources</li>`);
      pop_element();
      $$renderer2.push(`</ul>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 370, 6);
      $$renderer2.push(`<button class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">`);
      push_element($$renderer2, "button", 371, 8);
      $$renderer2.push(`Nominate a Creator</button>`);
      pop_element();
      $$renderer2.push(` <button class="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium">`);
      push_element($$renderer2, "button", 374, 8);
      $$renderer2.push(`Apply for Spotlight</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4">`);
      push_element($$renderer2, "div", 382, 2);
      $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 383, 4);
      $$renderer2.push(`🤝 Creator Community Support</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-yellow-200 text-sm">`);
      push_element($$renderer2, "p", 384, 4);
      $$renderer2.push(`Join our Creator Forum to connect with successful creators, ask questions, and get mentorship.
      Many of our featured creators actively participate and share their insights.</p>`);
      pop_element();
      $$renderer2.push(` <a href="/creator/forum" class="text-yellow-100 underline text-sm">`);
      push_element($$renderer2, "a", 388, 4);
      $$renderer2.push(`Join the conversation →</a>`);
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
//# sourceMappingURL=_page.svelte-KeAmAJX5.js.map
