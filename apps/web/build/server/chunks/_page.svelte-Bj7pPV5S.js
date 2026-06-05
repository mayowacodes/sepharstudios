import { ah as attr, as as ensure_array_like, au as escape_html, ai as attr_class, aR as stringify, ap as derived } from './ui-libs-BjzLDLAh.js';
import { M as Message_square } from './message-square-COJcPtWs.js';
import './toast-state.svelte-Cuuior_F.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import { S as StatChip } from './StatChip-QDTW_eIe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';

//#region src/routes/(admin)/admin/communications/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let messages = [];
		let selectedFilter = "all";
		let selectedType = "all";
		let searchTerm = "";
		const filteredMessages = derived(() => messages.filter((message) => {
			return true;
		}));
		function getTypeColor(type) {
			switch (type) {
				case "approval": return "bg-green-600 text-white";
				case "rejection": return "bg-red-600 text-white";
				case "feedback": return "bg-blue-600 text-white";
				case "clarification": return "bg-yellow-600 text-black";
				case "general": return "bg-gray-600 text-foreground";
				default: return "bg-gray-600 text-foreground";
			}
		}
		function getStatusColor(status) {
			switch (status) {
				case "sent": return "text-blue-400";
				case "read": return "text-yellow-400";
				case "replied": return "text-green-400";
				case "archived": return "text-muted-foreground";
				default: return "text-muted-foreground";
			}
		}
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<button class="text-xs surface-1 hover:surface-2 rounded-full px-3 py-1.5 text-foreground transition-colors">Templates</button> <button class="text-xs bg-primary hover:opacity-90 rounded-full px-3 py-1.5 text-primary-foreground font-medium transition-opacity">Compose</button>`);
			}
			PageHeader($$renderer, {
				icon: Message_square,
				title: "Communications",
				subtitle: "Manage creator messages and templates.",
				actions});
		}
		$$renderer.push(`<!----> <div class="flex flex-wrap gap-2">`);
		StatChip($$renderer, {
			label: "sent",
			value: messages.filter((m) => m.status === "sent").length,
			tone: "blue"
		});
		$$renderer.push(`<!----> `);
		StatChip($$renderer, {
			label: "awaiting reply",
			value: messages.filter((m) => !m.isFromAdmin && m.status === "sent").length,
			tone: "yellow"
		});
		$$renderer.push(`<!----> `);
		StatChip($$renderer, {
			label: "approvals",
			value: messages.filter((m) => m.type === "approval").length,
			tone: "green"
		});
		$$renderer.push(`<!----> `);
		StatChip($$renderer, {
			label: "rejections",
			value: messages.filter((m) => m.type === "rejection").length,
			tone: "red"
		});
		$$renderer.push(`<!----></div> <div class="surface-2 rounded-xl p-6"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label for="search" class="block text-sm font-medium text-foreground mb-2">Search</label> <input id="search" type="text"${attr("value", searchTerm)} placeholder="Search messages..." class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground placeholder-gray-400"/></div> <div><label for="status" class="block text-sm font-medium text-foreground mb-2">Status</label> `);
		$$renderer.select({
			id: "status",
			value: selectedFilter,
			class: "w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Status`);
			});
			$$renderer.option({ value: "sent" }, ($$renderer) => {
				$$renderer.push(`Sent`);
			});
			$$renderer.option({ value: "read" }, ($$renderer) => {
				$$renderer.push(`Read`);
			});
			$$renderer.option({ value: "replied" }, ($$renderer) => {
				$$renderer.push(`Replied`);
			});
			$$renderer.option({ value: "archived" }, ($$renderer) => {
				$$renderer.push(`Archived`);
			});
		});
		$$renderer.push(`</div> <div><label for="type" class="block text-sm font-medium text-foreground mb-2">Type</label> `);
		$$renderer.select({
			id: "type",
			value: selectedType,
			class: "w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Types`);
			});
			$$renderer.option({ value: "approval" }, ($$renderer) => {
				$$renderer.push(`Approvals`);
			});
			$$renderer.option({ value: "rejection" }, ($$renderer) => {
				$$renderer.push(`Rejections`);
			});
			$$renderer.option({ value: "feedback" }, ($$renderer) => {
				$$renderer.push(`Feedback`);
			});
			$$renderer.option({ value: "clarification" }, ($$renderer) => {
				$$renderer.push(`Clarification`);
			});
			$$renderer.option({ value: "general" }, ($$renderer) => {
				$$renderer.push(`General`);
			});
		});
		$$renderer.push(`</div></div></div> <div class="space-y-4"><!--[-->`);
		const each_array = ensure_array_like(filteredMessages());
		for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
			let message = each_array[$$index_1];
			$$renderer.push(`<div class="surface-2 rounded-xl p-6 hover:surface-3 transition-colors"><div class="flex justify-between items-start mb-3"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-foreground font-bold">${escape_html(message.isFromAdmin ? "A" : message.creatorName.charAt(0))}</div> <div><div class="font-medium text-foreground">${escape_html(message.creatorName)}</div> <div class="text-sm text-muted-foreground">${escape_html(message.isFromAdmin ? "Admin" : "Creator")} • ${escape_html(message.createdAt.toLocaleDateString())}</div></div></div> <div class="flex items-center space-x-2"><span${attr_class(`px-3 py-1 text-xs rounded-full ${stringify(getTypeColor(message.type))}`)}>${escape_html(message.type)}</span> <span${attr_class(`text-sm ${stringify(getStatusColor(message.status))}`)}>${escape_html(message.status)}</span></div></div> <div class="mb-3"><h3 class="text-lg font-medium text-foreground mb-1">${escape_html(message.subject)}</h3> `);
			if (message.contentTitle) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-sm text-purple-300 mb-2">Re: ${escape_html(message.contentTitle)}</div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <p class="text-foreground/80 text-sm line-clamp-3">${escape_html(message.message)}</p></div> `);
			if (message.attachments && message.attachments.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mb-3"><div class="text-sm text-muted-foreground mb-1">Attachments:</div> <div class="flex flex-wrap gap-2"><!--[-->`);
				const each_array_1 = ensure_array_like(message.attachments);
				for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
					let attachment = each_array_1[$$index];
					$$renderer.push(`<span class="bg-blue-600 text-white px-2 py-1 text-xs rounded">📎 ${escape_html(attachment)}</span>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex justify-between items-center pt-3 border-t border-gray-600"><div class="text-xs text-muted-foreground">${escape_html(message.isFromAdmin ? `Sent by ${message.adminName || "Admin"}` : "From Creator")}</div> <div class="flex space-x-2">`);
			if (!message.isFromAdmin && message.status === "sent") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">Mark Read</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">Reply</button> <button class="bg-gray-600 hover:bg-gray-700 text-foreground px-3 py-1 rounded text-sm">Archive</button></div></div></div>`);
		}
		$$renderer.push(`<!--]--> `);
		if (filteredMessages().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><div class="text-4xl mb-4">💬</div> <div class="text-xl text-foreground mb-2">No messages found</div> <div class="text-muted-foreground">Try adjusting your filters or search terms</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Bj7pPV5S.js.map
