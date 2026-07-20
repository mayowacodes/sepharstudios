import { Et as derived, Ht as attr, Ot as ensure_array_like, Pt as stringify, St as attr_class, Wt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Message_square } from "../../../../../chunks/message-square.js";
import "../../../../../chunks/toast-state.svelte.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../chunks/PortalButton.js";
import { t as StatChip } from "../../../../../chunks/StatChip.js";
//#region src/routes/(admin)/admin/communications/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let messages = [];
		let templates = [];
		let creatorOptions = [];
		let selectedFilter = "all";
		let selectedType = "all";
		let showComposeModal = false;
		let showTemplateModal = false;
		let newMessage = {};
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
		function composeMessage() {
			showComposeModal = true;
			newMessage = {
				subject: "",
				message: "",
				type: "general",
				creatorId: "",
				creatorName: "",
				isFromAdmin: true
			};
		}
		let aiIntent = "";
		let drafting = false;
		$$renderer.push(`<div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					variant: "secondary",
					size: "sm",
					onclick: () => showTemplateModal = true,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Templates`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				PortalButton($$renderer, {
					variant: "primary",
					size: "sm",
					onclick: composeMessage,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Compose`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Outreach",
				title: "Communications",
				subtitle: "Manage creator messages and templates.",
				icon: Message_square,
				actions,
				$$slots: { actions: true }
			});
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
		if (showComposeModal) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"><div class="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"><div class="p-6"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-foreground">Compose Message</h2> <button class="text-muted-foreground hover:text-foreground" aria-label="Close compose message modal"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <div class="space-y-4"><div class="grid grid-cols-2 gap-4"><div><label for="creator" class="block text-sm font-medium text-foreground mb-2">Creator</label> <input id="creator" type="text" list="creatorOptions"${attr("value", newMessage.creatorName)} placeholder="Enter creator name..." class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground"/> <datalist id="creatorOptions"><!--[-->`);
			const each_array_2 = ensure_array_like(creatorOptions);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let creator = each_array_2[$$index_2];
				$$renderer.option({ value: creator.name }, ($$renderer) => {});
			}
			$$renderer.push(`<!--]--></datalist></div> <div><label for="messageType" class="block text-sm font-medium text-foreground mb-2">Message Type</label> `);
			$$renderer.select({
				id: "messageType",
				value: newMessage.type,
				class: "w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground"
			}, ($$renderer) => {
				$$renderer.option({ value: "general" }, ($$renderer) => {
					$$renderer.push(`General`);
				});
				$$renderer.option({ value: "approval" }, ($$renderer) => {
					$$renderer.push(`Approval`);
				});
				$$renderer.option({ value: "rejection" }, ($$renderer) => {
					$$renderer.push(`Rejection`);
				});
				$$renderer.option({ value: "feedback" }, ($$renderer) => {
					$$renderer.push(`Feedback`);
				});
				$$renderer.option({ value: "clarification" }, ($$renderer) => {
					$$renderer.push(`Clarification`);
				});
			});
			$$renderer.push(`</div></div> <div class="surface-1 rounded-lg p-3 space-y-2"><div class="flex items-center justify-between"><span class="text-xs text-purple-300">✨ AI draft</span> <button type="button"${attr("disabled", drafting, true)} class="text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40">${escape_html("Draft from intent")}</button></div> <input type="text"${attr("value", aiIntent)} placeholder="What is this message about? e.g. 'Thank Sarah for her sermon series and ask about Q3 plans'" class="w-full px-3 py-2 surface-1 border border-border/40 rounded text-sm text-foreground placeholder-gray-500"/></div> <div><label for="subject" class="block text-sm font-medium text-foreground mb-2">Subject</label> <input id="subject" type="text"${attr("value", newMessage.subject)} placeholder="Enter subject..." class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground"/></div> <div><label for="message" class="block text-sm font-medium text-foreground mb-2">Message</label> <textarea id="message" rows="8" placeholder="Type your message..." class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground resize-none">`);
			const $$body = escape_html(newMessage.message);
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea></div></div> <div class="flex justify-between items-center mt-6 pt-6 border-t border-gray-600"><button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Use Template</button> <div class="flex space-x-3"><button class="bg-gray-600 hover:bg-gray-700 text-foreground px-6 py-2 rounded-lg">Cancel</button> <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">Send Message</button></div></div></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (showTemplateModal) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"><div class="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"><div class="p-6"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-foreground">Message Templates</h2> <button class="text-muted-foreground hover:text-foreground" aria-label="Close templates modal"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
			const each_array_3 = ensure_array_like(templates);
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let template = each_array_3[$$index_3];
				$$renderer.push(`<div class="surface-2 rounded-lg p-4"><div class="flex justify-between items-center mb-3"><h3 class="font-medium text-foreground">${escape_html(template.name)}</h3> <span${attr_class(`px-2 py-1 text-xs rounded-full ${stringify(getTypeColor(template.type))}`)}>${escape_html(template.type)}</span></div> <div class="text-sm text-foreground/80 mb-3"><strong>Subject:</strong> ${escape_html(template.subject)}</div> <div class="text-sm text-muted-foreground mb-4 line-clamp-4">${escape_html(template.content)}</div> <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm">Use Template</button></div>`);
			}
			$$renderer.push(`<!--]--></div></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
