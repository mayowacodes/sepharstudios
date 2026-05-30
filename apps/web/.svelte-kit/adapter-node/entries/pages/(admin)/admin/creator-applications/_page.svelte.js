import { gt as ensure_array_like, jt as escape_html, kt as attr } from "../../../../../chunks/ui-libs.js";
import { t as Loader_circle } from "../../../../../chunks/loader-circle.js";
import { t as Button } from "../../../../../chunks/button.js";
//#region src/routes/(admin)/admin/creator-applications/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let applications = [];
		let selectedApplication = null;
		let showModal = false;
		let statusFilter = "pending";
		let isLoading = true;
		let errorMessage = "";
		const loadApplications = async () => {
			isLoading = true;
			errorMessage = "";
			try {
				const res = await fetch(`/api/admin/creator-applications?status=${statusFilter}`);
				if (!res.ok) throw new Error("Failed to load applications");
				applications = await res.json();
			} catch (err) {
				errorMessage = err?.message || "Failed to load applications";
			} finally {
				isLoading = false;
			}
		};
		const reviewApplication = async (id, status) => {
			const reason = status === "rejected" ? prompt("Reason for rejection (optional):") ?? "" : "";
			try {
				if (!(await fetch(`/api/admin/creator-applications/${id}/review`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						status,
						rejectionReason: reason
					})
				})).ok) throw new Error("Failed to update application");
				await loadApplications();
			} catch (err) {
				alert(err?.message || "Failed to update application");
			}
		};
		function openApplication(app) {
			selectedApplication = app;
			showModal = true;
		}
		$$renderer.push(`<div class="space-y-6"><div class="flex flex-col gap-2"><h1 class="text-2xl font-bold text-white">Creator Applications</h1> <p class="text-gray-300">Review and approve creators before they can publish content.</p></div> <div class="flex flex-wrap items-center gap-3"><label for="statusFilter" class="text-sm text-gray-300">Status</label> `);
		$$renderer.select({
			id: "statusFilter",
			class: "rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white",
			value: statusFilter,
			onchange: loadApplications
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All`);
			});
			$$renderer.option({ value: "pending" }, ($$renderer) => {
				$$renderer.push(`Pending`);
			});
			$$renderer.option({ value: "approved" }, ($$renderer) => {
				$$renderer.push(`Approved`);
			});
			$$renderer.option({ value: "rejected" }, ($$renderer) => {
				$$renderer.push(`Rejected`);
			});
		});
		$$renderer.push(`</div> `);
		if (isLoading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center justify-center py-16">`);
			Loader_circle($$renderer, { class: "h-8 w-8 animate-spin text-primary" });
			$$renderer.push(`<!----></div>`);
		} else if (errorMessage) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200">${escape_html(errorMessage)}</div>`);
		} else if (applications.length === 0) {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<div class="rounded-lg border border-white/10 bg-black/20 p-6 text-gray-300">No applications found.</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="overflow-x-auto rounded-lg border border-white/10 bg-black/30"><table class="w-full text-left text-sm text-gray-200"><thead class="bg-black/40 text-xs uppercase text-gray-400"><tr><th class="px-4 py-3">Applicant</th><th class="px-4 py-3">Type</th><th class="px-4 py-3">Organization</th><th class="px-4 py-3">Submitted</th><th class="px-4 py-3 text-right">Actions</th></tr></thead><tbody><!--[-->`);
			const each_array = ensure_array_like(applications);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let app = each_array[$$index];
				$$renderer.push(`<tr class="border-t border-white/5"><td class="px-4 py-3"><div class="font-medium text-white">${escape_html(app.displayName || app.userName || "Creator")}</div> <div class="text-xs text-gray-400">${escape_html(app.userEmail || app.contactEmail)}</div></td><td class="px-4 py-3 capitalize">${escape_html(app.creatorType)}</td><td class="px-4 py-3">${escape_html(app.organizationName || "—")}</td><td class="px-4 py-3">${escape_html(new Date(app.createdAt).toLocaleDateString())}</td><td class="px-4 py-3"><div class="flex justify-end gap-2">`);
				Button($$renderer, {
					size: "sm",
					variant: "outline",
					onclick: () => openApplication(app),
					children: ($$renderer) => {
						$$renderer.push(`<!---->View`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				if (app.status === "pending") {
					$$renderer.push("<!--[0-->");
					Button($$renderer, {
						size: "sm",
						onclick: () => reviewApplication(app.id, "approved"),
						children: ($$renderer) => {
							$$renderer.push(`<!---->Approve`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						size: "sm",
						variant: "destructive",
						onclick: () => reviewApplication(app.id, "rejected"),
						children: ($$renderer) => {
							$$renderer.push(`<!---->Reject`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase text-gray-300">${escape_html(app.status)}</span>`);
				}
				$$renderer.push(`<!--]--></div></td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table></div>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (showModal && selectedApplication) {
			$$renderer.push("<!--[0-->");
			const app = selectedApplication;
			$$renderer.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div class="w-full max-w-3xl rounded-xl border border-white/10 bg-black/90 p-6 text-gray-200"><div class="flex items-start justify-between"><div><h2 class="text-2xl font-bold text-white">${escape_html(app.displayName || app.userName || "Creator")}</h2> <div class="text-sm text-gray-400">${escape_html(app.userEmail || app.contactEmail)}</div></div> <button class="text-gray-400 hover:text-white">✕</button></div> <div class="mt-6 grid gap-4 md:grid-cols-2"><div><div class="text-xs uppercase text-gray-500">Creator Type</div> <div class="mt-1 capitalize">${escape_html(app.creatorType)}</div></div> <div><div class="text-xs uppercase text-gray-500">Organization</div> <div class="mt-1">${escape_html(app.organizationName || "—")}</div></div> <div><div class="text-xs uppercase text-gray-500">Organization Type</div> <div class="mt-1">${escape_html(app.organizationType || "—")}</div></div> <div><div class="text-xs uppercase text-gray-500">Website</div> <div class="mt-1">${escape_html(app.organizationWebsite || "—")}</div></div> <div class="md:col-span-2"><div class="text-xs uppercase text-gray-500">Bio</div> <div class="mt-1 text-sm">${escape_html(app.bio || "—")}</div></div> <div class="md:col-span-2"><div class="text-xs uppercase text-gray-500">Portfolio</div> <div class="mt-1">${escape_html(app.portfolioUrl || "—")}</div></div></div> <div class="mt-6"><div class="text-xs uppercase text-gray-500">Documents</div> `);
			if (app.documents && app.documents.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mt-2 space-y-2"><!--[-->`);
				const each_array_1 = ensure_array_like(app.documents);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let doc = each_array_1[$$index_1];
					const docUrl = typeof doc === "string" ? doc : doc.url;
					const docName = typeof doc === "string" ? doc : doc.name;
					$$renderer.push(`<a class="block rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-blue-300 hover:underline"${attr("href", docUrl)} target="_blank" rel="noreferrer">${escape_html(docName)}</a>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="mt-2 text-sm text-gray-400">No documents uploaded.</div>`);
			}
			$$renderer.push(`<!--]--></div> <div class="mt-6 flex justify-end gap-2">`);
			if (app.status === "pending") {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					onclick: () => reviewApplication(app.id, "approved"),
					children: ($$renderer) => {
						$$renderer.push(`<!---->Approve`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					variant: "destructive",
					onclick: () => reviewApplication(app.id, "rejected"),
					children: ($$renderer) => {
						$$renderer.push(`<!---->Reject`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<span class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase text-gray-300">${escape_html(app.status)}</span>`);
			}
			$$renderer.push(`<!--]--></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
