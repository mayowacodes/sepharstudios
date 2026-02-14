import { m as ensure_array_like, C as attr_class, x as stringify, E as escape_html, u as attr } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(creator)/creator/forum/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let filteredPosts;
      let activeCategory = "all";
      let searchTerm = "";
      const categories = [
        { id: "all", title: "All Topics", icon: "💬", color: "purple" },
        {
          id: "getting-started",
          title: "Getting Started",
          icon: "🚀",
          color: "blue"
        },
        {
          id: "technical",
          title: "Technical Help",
          icon: "⚙️",
          color: "green"
        },
        {
          id: "content-creation",
          title: "Content Creation",
          icon: "🎬",
          color: "orange"
        },
        {
          id: "ministry",
          title: "Ministry & Faith",
          icon: "✝️",
          color: "yellow"
        },
        {
          id: "community",
          title: "Community",
          icon: "❤️",
          color: "red"
        }
      ];
      const forumPosts = [
        {
          id: 1,
          title: "How to improve video quality on a budget?",
          author: "FaithFilmMaker",
          category: "technical",
          replies: 12,
          likes: 8,
          lastActivity: "2 hours ago",
          excerpt: "Looking for affordable ways to upgrade my video production quality. Any recommendations for budget-friendly equipment?",
          isSticky: false
        },
        {
          id: 2,
          title: "Best practices for sermon recordings",
          author: "PastorDavid",
          category: "content-creation",
          replies: 24,
          likes: 18,
          lastActivity: "4 hours ago",
          excerpt: "What are your tips for recording engaging sermon content? Audio setup, camera angles, lighting tips welcome!",
          isSticky: true
        },
        {
          id: 3,
          title: "Dealing with negative comments - how do you respond?",
          author: "GraceAndTruth",
          category: "ministry",
          replies: 31,
          likes: 25,
          lastActivity: "6 hours ago",
          excerpt: "Sometimes receive challenging comments on Biblical topics. How do you handle criticism while staying loving?",
          isSticky: false
        },
        {
          id: 4,
          title: "New creator introduction and prayer request",
          author: "NewBeginnings2024",
          category: "getting-started",
          replies: 19,
          likes: 22,
          lastActivity: "8 hours ago",
          excerpt: "Hi everyone! Just starting my ministry channel. Could use prayers and any advice for new creators.",
          isSticky: false
        },
        {
          id: 5,
          title: "Weekly Prayer Thread - January 2024",
          author: "CommunityModerator",
          category: "community",
          replies: 156,
          likes: 89,
          lastActivity: "1 hour ago",
          excerpt: "Share your prayer requests and lift each other up in prayer this week.",
          isSticky: true
        }
      ];
      function getCategoryColor(categoryId) {
        const category = categories.find((c) => c.id === categoryId);
        return category ? category.color : "gray";
      }
      filteredPosts = forumPosts.filter((post) => {
        const matchesSearch = searchTerm === "";
        return matchesSearch;
      });
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 87, 0);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 89, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 90, 4);
      $$renderer2.push(`Creator Community Forum</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 91, 4);
      $$renderer2.push(`Connect, learn, and grow together with fellow faith-based creators</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-2 md:grid-cols-4 gap-4">`);
      push_element($$renderer2, "div", 95, 2);
      $$renderer2.push(`<div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4 text-center">`);
      push_element($$renderer2, "div", 96, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 97, 6);
      $$renderer2.push(`1,247</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-blue-200">`);
      push_element($$renderer2, "div", 98, 6);
      $$renderer2.push(`Active Members</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-green-600/20 border border-green-600 rounded-lg p-4 text-center">`);
      push_element($$renderer2, "div", 100, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-green-400">`);
      push_element($$renderer2, "div", 101, 6);
      $$renderer2.push(`3,891</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-green-200">`);
      push_element($$renderer2, "div", 102, 6);
      $$renderer2.push(`Total Posts</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4 text-center">`);
      push_element($$renderer2, "div", 104, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-purple-400">`);
      push_element($$renderer2, "div", 105, 6);
      $$renderer2.push(`89</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-purple-200">`);
      push_element($$renderer2, "div", 106, 6);
      $$renderer2.push(`Online Now</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4 text-center">`);
      push_element($$renderer2, "div", 108, 4);
      $$renderer2.push(`<div class="text-2xl font-bold text-orange-400">`);
      push_element($$renderer2, "div", 109, 6);
      $$renderer2.push(`456</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-orange-200">`);
      push_element($$renderer2, "div", 110, 6);
      $$renderer2.push(`This Week</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">`);
      push_element($$renderer2, "div", 114, 2);
      $$renderer2.push(`<div class="lg:col-span-1 space-y-6">`);
      push_element($$renderer2, "div", 116, 4);
      $$renderer2.push(`<button class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">`);
      push_element($$renderer2, "button", 118, 6);
      $$renderer2.push(`✍️ Start New Discussion</button>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">`);
      push_element($$renderer2, "div", 123, 6);
      $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-4">`);
      push_element($$renderer2, "h3", 124, 8);
      $$renderer2.push(`Categories</h3>`);
      pop_element();
      $$renderer2.push(` <nav class="space-y-2">`);
      push_element($$renderer2, "nav", 125, 8);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(categories);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let category = each_array[$$index];
        $$renderer2.push(`<button${attr_class(`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${stringify(activeCategory === category.id ? `bg-${category.color}-600 text-white` : "text-gray-300 hover:text-white hover:bg-white/10")}`)}>`);
        push_element($$renderer2, "button", 127, 12);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 131, 14);
        $$renderer2.push(`${escape_html(category.icon)}</span>`);
        pop_element();
        $$renderer2.push(` <span class="text-sm font-medium">`);
        push_element($$renderer2, "span", 132, 14);
        $$renderer2.push(`${escape_html(category.title)}</span>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></nav>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">`);
      push_element($$renderer2, "div", 139, 6);
      $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-4">`);
      push_element($$renderer2, "h3", 140, 8);
      $$renderer2.push(`Quick Links</h3>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-2">`);
      push_element($$renderer2, "div", 141, 8);
      $$renderer2.push(`<a href="/creator/guidelines" class="block text-gray-300 hover:text-white text-sm">`);
      push_element($$renderer2, "a", 142, 10);
      $$renderer2.push(`📋 Content Guidelines</a>`);
      pop_element();
      $$renderer2.push(` <a href="/creator/support" class="block text-gray-300 hover:text-white text-sm">`);
      push_element($$renderer2, "a", 145, 10);
      $$renderer2.push(`🆘 Get Support</a>`);
      pop_element();
      $$renderer2.push(` <a href="/creator/best-practices" class="block text-gray-300 hover:text-white text-sm">`);
      push_element($$renderer2, "a", 148, 10);
      $$renderer2.push(`⭐ Best Practices</a>`);
      pop_element();
      $$renderer2.push(` <a href="/creator/events" class="block text-gray-300 hover:text-white text-sm">`);
      push_element($$renderer2, "a", 151, 10);
      $$renderer2.push(`📅 Upcoming Events</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4">`);
      push_element($$renderer2, "div", 158, 6);
      $$renderer2.push(`<h3 class="text-sm font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 159, 8);
      $$renderer2.push(`💛 Community Guidelines</h3>`);
      pop_element();
      $$renderer2.push(` <ul class="text-yellow-200 text-xs space-y-1">`);
      push_element($$renderer2, "ul", 160, 8);
      $$renderer2.push(`<li>`);
      push_element($$renderer2, "li", 161, 10);
      $$renderer2.push(`• Be respectful and encouraging</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 162, 10);
      $$renderer2.push(`• Stay on topic and relevant</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 163, 10);
      $$renderer2.push(`• No spam or self-promotion</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 164, 10);
      $$renderer2.push(`• Share with love and grace</li>`);
      pop_element();
      $$renderer2.push(` <li>`);
      push_element($$renderer2, "li", 165, 10);
      $$renderer2.push(`• Pray for one another</li>`);
      pop_element();
      $$renderer2.push(`</ul>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="lg:col-span-3 space-y-6">`);
      push_element($$renderer2, "div", 171, 4);
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">`);
      push_element($$renderer2, "div", 173, 6);
      $$renderer2.push(`<div class="flex flex-col md:flex-row gap-4">`);
      push_element($$renderer2, "div", 174, 8);
      $$renderer2.push(`<div class="flex-1">`);
      push_element($$renderer2, "div", 175, 10);
      $$renderer2.push(`<input type="text"${attr("value", searchTerm)} placeholder="Search discussions..." class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"/>`);
      push_element($$renderer2, "input", 176, 12);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex gap-2">`);
      push_element($$renderer2, "div", 183, 10);
      $$renderer2.push(`<select class="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none">`);
      push_element($$renderer2, "select", 184, 12);
      $$renderer2.option({ value: "recent" }, ($$renderer3) => {
        $$renderer3.push(`Most Recent`);
      });
      $$renderer2.option({ value: "popular" }, ($$renderer3) => {
        $$renderer3.push(`Most Popular`);
      });
      $$renderer2.option({ value: "active" }, ($$renderer3) => {
        $$renderer3.push(`Most Active`);
      });
      $$renderer2.push(`</select>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-purple-600/20 border border-purple-600 rounded-xl p-4">`);
      push_element($$renderer2, "div", 194, 6);
      $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-2 flex items-center">`);
      push_element($$renderer2, "h3", 195, 8);
      $$renderer2.push(`<span class="mr-2">`);
      push_element($$renderer2, "span", 196, 10);
      $$renderer2.push(`📢</span>`);
      pop_element();
      $$renderer2.push(` Community Announcements</h3>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-2">`);
      push_element($$renderer2, "div", 198, 8);
      $$renderer2.push(`<div class="text-purple-200 text-sm">`);
      push_element($$renderer2, "div", 199, 10);
      $$renderer2.push(`🎉 <strong>`);
      push_element($$renderer2, "strong", 200, 15);
      $$renderer2.push(`New Feature:</strong>`);
      pop_element();
      $$renderer2.push(` Live Q&amp;A sessions now available every Thursday at 7 PM EST</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-purple-200 text-sm">`);
      push_element($$renderer2, "div", 202, 10);
      $$renderer2.push(`📚 <strong>`);
      push_element($$renderer2, "strong", 203, 15);
      $$renderer2.push(`Resource Library:</strong>`);
      pop_element();
      $$renderer2.push(` Check out our new collection of free graphics and music</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-purple-200 text-sm">`);
      push_element($$renderer2, "div", 205, 10);
      $$renderer2.push(`🏆 <strong>`);
      push_element($$renderer2, "strong", 206, 15);
      $$renderer2.push(`Creator Spotlight:</strong>`);
      pop_element();
      $$renderer2.push(` Nominate fellow creators for monthly recognition</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 212, 6);
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(filteredPosts);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let post = each_array_1[$$index_1];
        $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors cursor-pointer">`);
        push_element($$renderer2, "div", 214, 10);
        $$renderer2.push(`<div class="flex items-start space-x-4">`);
        push_element($$renderer2, "div", 215, 12);
        $$renderer2.push(`<div class="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">`);
        push_element($$renderer2, "div", 217, 14);
        $$renderer2.push(`${escape_html(post.author.charAt(0).toUpperCase())}</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex-1">`);
        push_element($$renderer2, "div", 222, 14);
        $$renderer2.push(`<div class="flex items-start justify-between">`);
        push_element($$renderer2, "div", 223, 16);
        $$renderer2.push(`<div class="flex-1">`);
        push_element($$renderer2, "div", 224, 18);
        $$renderer2.push(`<div class="flex items-center space-x-2 mb-1">`);
        push_element($$renderer2, "div", 225, 20);
        if (post.isSticky) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="text-yellow-400">`);
          push_element($$renderer2, "span", 227, 24);
          $$renderer2.push(`📌</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <h3 class="text-lg font-medium text-white hover:text-purple-300">`);
        push_element($$renderer2, "h3", 229, 22);
        $$renderer2.push(`${escape_html(post.title)}</h3>`);
        pop_element();
        $$renderer2.push(` <span${attr_class(`bg-${stringify(getCategoryColor(post.category))}-600 text-${stringify(getCategoryColor(post.category))}-100 text-xs px-2 py-1 rounded`)}>`);
        push_element($$renderer2, "span", 232, 22);
        $$renderer2.push(`${escape_html(categories.find((c) => c.id === post.category)?.title || post.category)}</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-gray-300 text-sm mb-2">`);
        push_element($$renderer2, "p", 237, 20);
        $$renderer2.push(`${escape_html(post.excerpt)}</p>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-4 text-xs text-gray-400">`);
        push_element($$renderer2, "div", 241, 20);
        $$renderer2.push(`<span>`);
        push_element($$renderer2, "span", 242, 22);
        $$renderer2.push(`by <strong class="text-purple-400">`);
        push_element($$renderer2, "strong", 242, 31);
        $$renderer2.push(`${escape_html(post.author)}</strong>`);
        pop_element();
        $$renderer2.push(`</span>`);
        pop_element();
        $$renderer2.push(` <span>`);
        push_element($$renderer2, "span", 243, 22);
        $$renderer2.push(`•</span>`);
        pop_element();
        $$renderer2.push(` <span>`);
        push_element($$renderer2, "span", 244, 22);
        $$renderer2.push(`${escape_html(post.lastActivity)}</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-right space-y-1">`);
        push_element($$renderer2, "div", 249, 18);
        $$renderer2.push(`<div class="flex items-center space-x-3 text-sm text-gray-400">`);
        push_element($$renderer2, "div", 250, 20);
        $$renderer2.push(`<span class="flex items-center">`);
        push_element($$renderer2, "span", 251, 22);
        $$renderer2.push(`<span class="mr-1">`);
        push_element($$renderer2, "span", 252, 24);
        $$renderer2.push(`💬</span>`);
        pop_element();
        $$renderer2.push(` ${escape_html(post.replies)}</span>`);
        pop_element();
        $$renderer2.push(` <span class="flex items-center">`);
        push_element($$renderer2, "span", 255, 22);
        $$renderer2.push(`<span class="mr-1">`);
        push_element($$renderer2, "span", 256, 24);
        $$renderer2.push(`❤️</span>`);
        pop_element();
        $$renderer2.push(` ${escape_html(post.likes)}</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
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
      $$renderer2.push(` <div class="flex justify-center">`);
      push_element($$renderer2, "div", 269, 6);
      $$renderer2.push(`<div class="flex space-x-2">`);
      push_element($$renderer2, "div", 270, 8);
      $$renderer2.push(`<button class="px-3 py-2 bg-white/10 rounded-lg text-gray-300 hover:text-white">`);
      push_element($$renderer2, "button", 271, 10);
      $$renderer2.push(`Previous</button>`);
      pop_element();
      $$renderer2.push(` <button class="px-3 py-2 bg-purple-600 rounded-lg text-white">`);
      push_element($$renderer2, "button", 272, 10);
      $$renderer2.push(`1</button>`);
      pop_element();
      $$renderer2.push(` <button class="px-3 py-2 bg-white/10 rounded-lg text-gray-300 hover:text-white">`);
      push_element($$renderer2, "button", 273, 10);
      $$renderer2.push(`2</button>`);
      pop_element();
      $$renderer2.push(` <button class="px-3 py-2 bg-white/10 rounded-lg text-gray-300 hover:text-white">`);
      push_element($$renderer2, "button", 274, 10);
      $$renderer2.push(`3</button>`);
      pop_element();
      $$renderer2.push(` <button class="px-3 py-2 bg-white/10 rounded-lg text-gray-300 hover:text-white">`);
      push_element($$renderer2, "button", 275, 10);
      $$renderer2.push(`Next</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 282, 2);
      $$renderer2.push(`<h3 class="text-lg font-bold text-white mb-4">`);
      push_element($$renderer2, "h3", 283, 4);
      $$renderer2.push(`🔥 Trending This Week</h3>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-3 gap-4">`);
      push_element($$renderer2, "div", 284, 4);
      $$renderer2.push(`<div class="text-center">`);
      push_element($$renderer2, "div", 285, 6);
      $$renderer2.push(`<div class="text-2xl mb-2">`);
      push_element($$renderer2, "div", 286, 8);
      $$renderer2.push(`🎬</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-white font-medium">`);
      push_element($$renderer2, "div", 287, 8);
      $$renderer2.push(`Video Production Tips</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-gray-400">`);
      push_element($$renderer2, "div", 288, 8);
      $$renderer2.push(`45 new posts</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center">`);
      push_element($$renderer2, "div", 290, 6);
      $$renderer2.push(`<div class="text-2xl mb-2">`);
      push_element($$renderer2, "div", 291, 8);
      $$renderer2.push(`🙏</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-white font-medium">`);
      push_element($$renderer2, "div", 292, 8);
      $$renderer2.push(`Prayer &amp; Ministry</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-gray-400">`);
      push_element($$renderer2, "div", 293, 8);
      $$renderer2.push(`38 new posts</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center">`);
      push_element($$renderer2, "div", 295, 6);
      $$renderer2.push(`<div class="text-2xl mb-2">`);
      push_element($$renderer2, "div", 296, 8);
      $$renderer2.push(`📊</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-white font-medium">`);
      push_element($$renderer2, "div", 297, 8);
      $$renderer2.push(`Analytics &amp; Growth</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-gray-400">`);
      push_element($$renderer2, "div", 298, 8);
      $$renderer2.push(`29 new posts</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
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
//# sourceMappingURL=_page.svelte-CYzrHD1b.js.map
