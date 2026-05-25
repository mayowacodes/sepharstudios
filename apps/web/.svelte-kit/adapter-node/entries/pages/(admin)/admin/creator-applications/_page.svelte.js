import { a as push_element, b as pop_element, F as FILENAME, e as escape_html, i as ensure_array_like, p as prevent_snippet_stringification, n as attr } from "../../../../../chunks/ui-libs.js";
import { B as Button } from "../../../../../chunks/button.js";
import { L as Loader_circle } from "../../../../../chunks/loader-circle.js";
_page[FILENAME] = "src/routes/(admin)/admin/creator-applications/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
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
          const res = await fetch(`/api/admin/creator-applications/${id}/review`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, rejectionReason: reason })
          });
          if (!res.ok) throw new Error("Failed to update application");
          await loadApplications();
        } catch (err) {
          alert(err?.message || "Failed to update application");
        }
      };
      function openApplication(app) {
        selectedApplication = app;
        showModal = true;
      }
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 76, 0);
      $$renderer2.push(`<div class="flex flex-col gap-2">`);
      push_element($$renderer2, "div", 77, 2);
      $$renderer2.push(`<h1 class="text-2xl font-bold text-white">`);
      push_element($$renderer2, "h1", 78, 4);
      $$renderer2.push(`Creator Applications</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 79, 4);
      $$renderer2.push(`Review and approve creators before they can publish content.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex flex-wrap items-center gap-3">`);
      push_element($$renderer2, "div", 82, 2);
      $$renderer2.push(`<label for="statusFilter" class="text-sm text-gray-300">`);
      push_element($$renderer2, "label", 83, 4);
      $$renderer2.push(`Status</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "statusFilter",
          class: "rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white",
          value: statusFilter,
          onchange: loadApplications
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All`);
          });
          $$renderer3.option({ value: "pending" }, ($$renderer4) => {
            $$renderer4.push(`Pending`);
          });
          $$renderer3.option({ value: "approved" }, ($$renderer4) => {
            $$renderer4.push(`Approved`);
          });
          $$renderer3.option({ value: "rejected" }, ($$renderer4) => {
            $$renderer4.push(`Rejected`);
          });
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (isLoading) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center justify-center py-16">`);
        push_element($$renderer2, "div", 98, 4);
        Loader_circle($$renderer2, { class: "h-8 w-8 animate-spin text-primary" });
        $$renderer2.push(`<!----></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        if (errorMessage) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200">`);
          push_element($$renderer2, "div", 102, 4);
          $$renderer2.push(`${escape_html(errorMessage)}</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
          if (applications.length === 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="rounded-lg border border-white/10 bg-black/20 p-6 text-gray-300">`);
            push_element($$renderer2, "div", 104, 4);
            $$renderer2.push(`No applications found.</div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div class="overflow-x-auto rounded-lg border border-white/10 bg-black/30">`);
            push_element($$renderer2, "div", 108, 4);
            $$renderer2.push(`<table class="w-full text-left text-sm text-gray-200">`);
            push_element($$renderer2, "table", 109, 6);
            $$renderer2.push(`<thead class="bg-black/40 text-xs uppercase text-gray-400">`);
            push_element($$renderer2, "thead", 110, 8);
            $$renderer2.push(`<tr>`);
            push_element($$renderer2, "tr", 111, 10);
            $$renderer2.push(`<th class="px-4 py-3">`);
            push_element($$renderer2, "th", 112, 12);
            $$renderer2.push(`Applicant</th>`);
            pop_element();
            $$renderer2.push(`<th class="px-4 py-3">`);
            push_element($$renderer2, "th", 113, 12);
            $$renderer2.push(`Type</th>`);
            pop_element();
            $$renderer2.push(`<th class="px-4 py-3">`);
            push_element($$renderer2, "th", 114, 12);
            $$renderer2.push(`Organization</th>`);
            pop_element();
            $$renderer2.push(`<th class="px-4 py-3">`);
            push_element($$renderer2, "th", 115, 12);
            $$renderer2.push(`Submitted</th>`);
            pop_element();
            $$renderer2.push(`<th class="px-4 py-3 text-right">`);
            push_element($$renderer2, "th", 116, 12);
            $$renderer2.push(`Actions</th>`);
            pop_element();
            $$renderer2.push(`</tr>`);
            pop_element();
            $$renderer2.push(`</thead>`);
            pop_element();
            $$renderer2.push(`<tbody>`);
            push_element($$renderer2, "tbody", 119, 8);
            $$renderer2.push(`<!--[-->`);
            const each_array = ensure_array_like(applications);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let app = each_array[$$index];
              $$renderer2.push(`<tr class="border-t border-white/5">`);
              push_element($$renderer2, "tr", 121, 12);
              $$renderer2.push(`<td class="px-4 py-3">`);
              push_element($$renderer2, "td", 122, 14);
              $$renderer2.push(`<div class="font-medium text-white">`);
              push_element($$renderer2, "div", 123, 16);
              $$renderer2.push(`${escape_html(app.displayName || app.userName || "Creator")}</div>`);
              pop_element();
              $$renderer2.push(` <div class="text-xs text-gray-400">`);
              push_element($$renderer2, "div", 124, 16);
              $$renderer2.push(`${escape_html(app.userEmail || app.contactEmail)}</div>`);
              pop_element();
              $$renderer2.push(`</td>`);
              pop_element();
              $$renderer2.push(`<td class="px-4 py-3 capitalize">`);
              push_element($$renderer2, "td", 126, 14);
              $$renderer2.push(`${escape_html(app.creatorType)}</td>`);
              pop_element();
              $$renderer2.push(`<td class="px-4 py-3">`);
              push_element($$renderer2, "td", 127, 14);
              $$renderer2.push(`${escape_html(app.organizationName || "—")}</td>`);
              pop_element();
              $$renderer2.push(`<td class="px-4 py-3">`);
              push_element($$renderer2, "td", 128, 14);
              $$renderer2.push(`${escape_html(new Date(app.createdAt).toLocaleDateString())}</td>`);
              pop_element();
              $$renderer2.push(`<td class="px-4 py-3">`);
              push_element($$renderer2, "td", 129, 14);
              $$renderer2.push(`<div class="flex justify-end gap-2">`);
              push_element($$renderer2, "div", 130, 16);
              Button($$renderer2, {
                size: "sm",
                variant: "outline",
                onclick: () => openApplication(app),
                children: prevent_snippet_stringification(($$renderer3) => {
                  $$renderer3.push(`<!---->View`);
                }),
                $$slots: { default: true }
              });
              $$renderer2.push(`<!----> `);
              if (app.status === "pending") {
                $$renderer2.push("<!--[-->");
                Button($$renderer2, {
                  size: "sm",
                  onclick: () => reviewApplication(app.id, "approved"),
                  children: prevent_snippet_stringification(($$renderer3) => {
                    $$renderer3.push(`<!---->Approve`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer2.push(`<!----> `);
                Button($$renderer2, {
                  size: "sm",
                  variant: "destructive",
                  onclick: () => reviewApplication(app.id, "rejected"),
                  children: prevent_snippet_stringification(($$renderer3) => {
                    $$renderer3.push(`<!---->Reject`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer2.push(`<!---->`);
              } else {
                $$renderer2.push("<!--[!-->");
                $$renderer2.push(`<span class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase text-gray-300">`);
                push_element($$renderer2, "span", 136, 20);
                $$renderer2.push(`${escape_html(app.status)}</span>`);
                pop_element();
              }
              $$renderer2.push(`<!--]--></div>`);
              pop_element();
              $$renderer2.push(`</td>`);
              pop_element();
              $$renderer2.push(`</tr>`);
              pop_element();
            }
            $$renderer2.push(`<!--]--></tbody>`);
            pop_element();
            $$renderer2.push(`</table>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (showModal && selectedApplication) {
        $$renderer2.push("<!--[-->");
        const app = selectedApplication;
        $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">`);
        push_element($$renderer2, "div", 150, 2);
        $$renderer2.push(`<div class="w-full max-w-3xl rounded-xl border border-white/10 bg-black/90 p-6 text-gray-200">`);
        push_element($$renderer2, "div", 151, 4);
        $$renderer2.push(`<div class="flex items-start justify-between">`);
        push_element($$renderer2, "div", 152, 6);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 153, 8);
        $$renderer2.push(`<h2 class="text-2xl font-bold text-white">`);
        push_element($$renderer2, "h2", 154, 10);
        $$renderer2.push(`${escape_html(app.displayName || app.userName || "Creator")}</h2>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm text-gray-400">`);
        push_element($$renderer2, "div", 157, 10);
        $$renderer2.push(`${escape_html(app.userEmail || app.contactEmail)}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <button class="text-gray-400 hover:text-white">`);
        push_element($$renderer2, "button", 159, 8);
        $$renderer2.push(`✕</button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="mt-6 grid gap-4 md:grid-cols-2">`);
        push_element($$renderer2, "div", 162, 6);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 163, 8);
        $$renderer2.push(`<div class="text-xs uppercase text-gray-500">`);
        push_element($$renderer2, "div", 164, 10);
        $$renderer2.push(`Creator Type</div>`);
        pop_element();
        $$renderer2.push(` <div class="mt-1 capitalize">`);
        push_element($$renderer2, "div", 165, 10);
        $$renderer2.push(`${escape_html(app.creatorType)}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 167, 8);
        $$renderer2.push(`<div class="text-xs uppercase text-gray-500">`);
        push_element($$renderer2, "div", 168, 10);
        $$renderer2.push(`Organization</div>`);
        pop_element();
        $$renderer2.push(` <div class="mt-1">`);
        push_element($$renderer2, "div", 169, 10);
        $$renderer2.push(`${escape_html(app.organizationName || "—")}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 171, 8);
        $$renderer2.push(`<div class="text-xs uppercase text-gray-500">`);
        push_element($$renderer2, "div", 172, 10);
        $$renderer2.push(`Organization Type</div>`);
        pop_element();
        $$renderer2.push(` <div class="mt-1">`);
        push_element($$renderer2, "div", 173, 10);
        $$renderer2.push(`${escape_html(app.organizationType || "—")}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 175, 8);
        $$renderer2.push(`<div class="text-xs uppercase text-gray-500">`);
        push_element($$renderer2, "div", 176, 10);
        $$renderer2.push(`Website</div>`);
        pop_element();
        $$renderer2.push(` <div class="mt-1">`);
        push_element($$renderer2, "div", 177, 10);
        $$renderer2.push(`${escape_html(app.organizationWebsite || "—")}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="md:col-span-2">`);
        push_element($$renderer2, "div", 179, 8);
        $$renderer2.push(`<div class="text-xs uppercase text-gray-500">`);
        push_element($$renderer2, "div", 180, 10);
        $$renderer2.push(`Bio</div>`);
        pop_element();
        $$renderer2.push(` <div class="mt-1 text-sm">`);
        push_element($$renderer2, "div", 181, 10);
        $$renderer2.push(`${escape_html(app.bio || "—")}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="md:col-span-2">`);
        push_element($$renderer2, "div", 183, 8);
        $$renderer2.push(`<div class="text-xs uppercase text-gray-500">`);
        push_element($$renderer2, "div", 184, 10);
        $$renderer2.push(`Portfolio</div>`);
        pop_element();
        $$renderer2.push(` <div class="mt-1">`);
        push_element($$renderer2, "div", 185, 10);
        $$renderer2.push(`${escape_html(app.portfolioUrl || "—")}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="mt-6">`);
        push_element($$renderer2, "div", 189, 6);
        $$renderer2.push(`<div class="text-xs uppercase text-gray-500">`);
        push_element($$renderer2, "div", 190, 8);
        $$renderer2.push(`Documents</div>`);
        pop_element();
        $$renderer2.push(` `);
        if (app.documents && app.documents.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="mt-2 space-y-2">`);
          push_element($$renderer2, "div", 192, 10);
          $$renderer2.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(app.documents);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let doc = each_array_1[$$index_1];
            const docUrl = typeof doc === "string" ? doc : doc.url;
            const docName = typeof doc === "string" ? doc : doc.name;
            $$renderer2.push(`<a class="block rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-blue-300 hover:underline"${attr("href", docUrl)} target="_blank" rel="noreferrer">`);
            push_element($$renderer2, "a", 196, 14);
            $$renderer2.push(`${escape_html(docName)}</a>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="mt-2 text-sm text-gray-400">`);
          push_element($$renderer2, "div", 200, 10);
          $$renderer2.push(`No documents uploaded.</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="mt-6 flex justify-end gap-2">`);
        push_element($$renderer2, "div", 204, 6);
        if (app.status === "pending") {
          $$renderer2.push("<!--[-->");
          Button($$renderer2, {
            onclick: () => reviewApplication(app.id, "approved"),
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->Approve`);
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!----> `);
          Button($$renderer2, {
            variant: "destructive",
            onclick: () => reviewApplication(app.id, "rejected"),
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->Reject`);
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<span class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase text-gray-300">`);
          push_element($$renderer2, "span", 209, 10);
          $$renderer2.push(`${escape_html(app.status)}</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
