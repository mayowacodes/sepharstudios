import { B as bind_props, b as push_element, d as pop_element, p as prevent_snippet_stringification, l as escape_html, e as ensure_array_like, g as attr, C as fallback, k as attr_class, ag as Popover$1, s as spread_props, ah as Popover_trigger$1, ai as Popover_content$1, aj as Command$1, ak as Command_input$1, al as Command_list$1, am as Command_empty$1, an as Command_item$1, P as Portal, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import './client2-D3ciM3yf.js';
import { C as Check } from './check-BU5QHt2h.js';
import { C as Circle_alert } from './circle-alert-C-nqt6_x.js';
import { X } from './x-Cylf_7jQ.js';
import { B as Button } from './button-C1v8XzqW.js';
import { I as Input } from './input-CTVv5zOe.js';
import { T as Textarea } from './textarea-Ba-I0uui.js';
import { c as cn } from './utils2-DYlu6U_t.js';
import './dialog-trigger-D7AZl1_Y.js';
import { S as Search } from './search-CieO2tsJ.js';
import { C as Chevron_down } from './chevron-down-z9VFSzi1.js';
import './exports-BuGzoaN1.js';
import './Icon-DVHDtCfs.js';
import './index-D4iwt0su.js';

Notifications[FILENAME] = "src/lib/components/Notifications.svelte";
function Notifications($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let type = fallback($$props["type"], "success");
      let message = $$props["message"];
      let duration = fallback($$props["duration"], 5e3);
      let visible = true;
      if (duration > 0) {
        setTimeout(
          () => {
            visible = false;
          },
          duration
        );
      }
      if (visible) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="fixed top-4 right-4 z-50">`);
        push_element($$renderer2, "div", 19, 2);
        $$renderer2.push(`<div${attr_class("flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg", void 0, {
          "bg-green-500": type === "success",
          "bg-red-500": type === "error"
        })}>`);
        push_element($$renderer2, "div", 23, 4);
        if (type === "success") {
          $$renderer2.push("<!--[-->");
          Check($$renderer2, { class: "w-5 h-5 text-white" });
        } else {
          $$renderer2.push("<!--[!-->");
          Circle_alert($$renderer2, { class: "w-5 h-5 text-white" });
        }
        $$renderer2.push(`<!--]--> <p class="text-white">`);
        push_element($$renderer2, "p", 34, 6);
        $$renderer2.push(`${escape_html(message)}</p>`);
        pop_element();
        $$renderer2.push(` <button class="ml-2 text-white hover:text-white/80">`);
        push_element($$renderer2, "button", 36, 6);
        X($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { type, message, duration });
    },
    Notifications
  );
}
Notifications.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Popover[FILENAME] = "src/lib/components/ui/popover/popover.svelte";
function Popover($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { open = false, $$slots, $$events, ...restProps } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Popover$1($$renderer3, spread_props([
          restProps,
          {
            get open() {
              return open;
            },
            set open($$value) {
              open = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { open });
    },
    Popover
  );
}
Popover.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Popover_portal[FILENAME] = "src/lib/components/ui/popover/popover-portal.svelte";
function Popover_portal($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...restProps } = $$props;
      $$renderer2.push(`<!---->`);
      Portal($$renderer2, spread_props([restProps]));
      $$renderer2.push(`<!---->`);
    },
    Popover_portal
  );
}
Popover_portal.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Popover_content[FILENAME] = "src/lib/components/ui/popover/popover-content.svelte";
function Popover_content($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        sideOffset = 4,
        align = "center",
        portalProps,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        Popover_portal($$renderer3, spread_props([
          portalProps,
          {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Popover_content$1($$renderer4, spread_props([
                {
                  "data-slot": "popover-content",
                  sideOffset,
                  align,
                  class: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--bits-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden", className)
                },
                restProps,
                {
                  get ref() {
                    return ref;
                  },
                  set ref($$value) {
                    ref = $$value;
                    $$settled = false;
                  }
                }
              ]));
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          }
        ]));
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Popover_content
  );
}
Popover_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Popover_trigger[FILENAME] = "src/lib/components/ui/popover/popover-trigger.svelte";
function Popover_trigger($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Popover_trigger$1($$renderer3, spread_props([
          { "data-slot": "popover-trigger", class: cn("", className) },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Popover_trigger
  );
}
Popover_trigger.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command[FILENAME] = "src/lib/components/ui/command/command.svelte";
function Command($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        api = null,
        ref = null,
        value = "",
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Command$1($$renderer3, spread_props([
          {
            "data-slot": "command",
            class: cn("bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md", className)
          },
          restProps,
          {
            get value() {
              return value;
            },
            set value($$value) {
              value = $$value;
              $$settled = false;
            },
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { api, ref, value });
    },
    Command
  );
}
Command.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_empty[FILENAME] = "src/lib/components/ui/command/command-empty.svelte";
function Command_empty($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Command_empty$1($$renderer3, spread_props([
          {
            "data-slot": "command-empty",
            class: cn("py-6 text-center text-sm", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Command_empty
  );
}
Command_empty.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_item[FILENAME] = "src/lib/components/ui/command/command-item.svelte";
function Command_item($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Command_item$1($$renderer3, spread_props([
          {
            "data-slot": "command-item",
            class: cn("aria-selected:bg-accent aria-selected:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Command_item
  );
}
Command_item.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_input[FILENAME] = "src/lib/components/ui/command/command-input.svelte";
function Command_input($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        value = "",
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="flex h-9 items-center gap-2 border-b ps-3 pe-8" data-slot="command-input-wrapper">`);
        push_element($$renderer3, "div", 14, 0);
        Search($$renderer3, { class: "size-4 shrink-0 opacity-50" });
        $$renderer3.push(`<!----> <!---->`);
        Command_input$1($$renderer3, spread_props([
          {
            "data-slot": "command-input",
            class: cn("placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            },
            get value() {
              return value;
            },
            set value($$value) {
              value = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!----></div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref, value });
    },
    Command_input
  );
}
Command_input.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Command_list[FILENAME] = "src/lib/components/ui/command/command-list.svelte";
function Command_list($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Command_list$1($$renderer3, spread_props([
          {
            "data-slot": "command-list",
            class: cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Command_list
  );
}
Command_list.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
FileUpload[FILENAME] = "src/lib/components/FileUpload.svelte";
function FileUpload($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let label = $$props["label"];
      let name = $$props["name"];
      let accept = fallback($$props["accept"], "*");
      let required = fallback($$props["required"], false);
      let file = fallback(
        $$props["file"],
        null
        // Allow external binding
      );
      const dispatchChange = () => {
        dispatchEvent(new CustomEvent("change", { detail: { file } }));
      };
      function handleFileChange(event) {
        const input = event.target;
        if (input.files?.length) {
          file = input.files[0];
          dispatchChange();
        }
      }
      function removeFile() {
        file = null;
        dispatchChange();
      }
      $$renderer2.push(`<div class="space-y-2">`);
      push_element($$renderer2, "div", 30, 0);
      $$renderer2.push(`<label${attr("for", name)} class="text-sm font-medium">`);
      push_element($$renderer2, "label", 31, 2);
      $$renderer2.push(`${escape_html(label)}</label>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center gap-2">`);
      push_element($$renderer2, "div", 32, 2);
      Input($$renderer2, {
        id: name,
        type: "file",
        name,
        accept,
        required,
        onchange: handleFileChange
      });
      $$renderer2.push(`<!----> `);
      if (file) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center gap-2 text-sm border rounded-md p-2">`);
        push_element($$renderer2, "div", 35, 6);
        $$renderer2.push(`${escape_html(file.name)} `);
        Button($$renderer2, {
          size: "icon",
          variant: "ghost",
          onclick: removeFile,
          children: prevent_snippet_stringification(($$renderer3) => {
            X($$renderer3, { size: 16 });
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { label, name, accept, required, file });
    },
    FileUpload
  );
}
FileUpload.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/sponsorships/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let data = $$props["data"];
      let form = $$props["form"];
      let isSubmitting = false;
      let files = { script: null, budget_breakdown: null, storyboard: null };
      let selectedGenre = "";
      const genres = [
        "Drama",
        "Documentary",
        "Educational",
        "Family",
        "Christian",
        "Historical",
        "Inspirational"
      ];
      function selectGenre(genre) {
        selectedGenre = genre;
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="container mx-auto py-12 px-4">`);
        push_element($$renderer3, "div", 42, 0);
        $$renderer3.push(`<div class="max-w-4xl mx-auto space-y-8">`);
        push_element($$renderer3, "div", 43, 2);
        $$renderer3.push(`<div class="text-center space-y-4">`);
        push_element($$renderer3, "div", 44, 4);
        $$renderer3.push(`<h1 class="text-4xl font-bold">`);
        push_element($$renderer3, "h1", 45, 6);
        $$renderer3.push(`Movie Production Sponsorship</h1>`);
        pop_element();
        $$renderer3.push(` <p class="text-xl text-muted-foreground">`);
        push_element($$renderer3, "p", 46, 6);
        $$renderer3.push(`Partner with Sephar Studios to bring your Christian movie project to life</p>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        if (form) {
          $$renderer3.push("<!--[-->");
          Notifications($$renderer3, {
            type: form.success ? "success" : "error",
            message: form.message
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <form method="POST" action="?/submit" class="space-y-8" enctype="multipart/form-data">`);
        push_element($$renderer3, "form", 53, 4);
        $$renderer3.push(`<div class="space-y-4">`);
        push_element($$renderer3, "div", 54, 6);
        $$renderer3.push(`<h2 class="text-2xl font-semibold">`);
        push_element($$renderer3, "h2", 55, 8);
        $$renderer3.push(`Contact Information</h2>`);
        pop_element();
        $$renderer3.push(` <div class="grid gap-4 md:grid-cols-2">`);
        push_element($$renderer3, "div", 57, 8);
        if (!data?.session) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="space-y-2">`);
          push_element($$renderer3, "div", 59, 12);
          $$renderer3.push(`<label for="name" class="text-sm font-medium">`);
          push_element($$renderer3, "label", 60, 14);
          $$renderer3.push(`Full Name</label>`);
          pop_element();
          $$renderer3.push(` `);
          Input($$renderer3, { id: "name", name: "name", required: true });
          $$renderer3.push(`<!----></div>`);
          pop_element();
          $$renderer3.push(` <div class="space-y-2">`);
          push_element($$renderer3, "div", 64, 12);
          $$renderer3.push(`<label for="email" class="text-sm font-medium">`);
          push_element($$renderer3, "label", 65, 14);
          $$renderer3.push(`Email Address</label>`);
          pop_element();
          $$renderer3.push(` `);
          Input($$renderer3, { id: "email", name: "email", type: "email", required: true });
          $$renderer3.push(`<!----></div>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="space-y-4">`);
        push_element($$renderer3, "div", 72, 6);
        $$renderer3.push(`<h2 class="text-2xl font-semibold">`);
        push_element($$renderer3, "h2", 73, 8);
        $$renderer3.push(`Project Details</h2>`);
        pop_element();
        $$renderer3.push(` <div class="grid gap-4 md:grid-cols-2">`);
        push_element($$renderer3, "div", 75, 8);
        $$renderer3.push(`<div class="space-y-2">`);
        push_element($$renderer3, "div", 76, 10);
        $$renderer3.push(`<label for="title" class="text-sm font-medium">`);
        push_element($$renderer3, "label", 77, 12);
        $$renderer3.push(`Project Title</label>`);
        pop_element();
        $$renderer3.push(` `);
        Input($$renderer3, { id: "title", name: "title", required: true });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(` <div class="space-y-2">`);
        push_element($$renderer3, "div", 81, 10);
        $$renderer3.push(`<label for="genre" class="text-sm font-medium">`);
        push_element($$renderer3, "label", 82, 12);
        $$renderer3.push(`Genre</label>`);
        pop_element();
        $$renderer3.push(` `);
        Popover($$renderer3, {
          children: prevent_snippet_stringification(($$renderer4) => {
            Popover_trigger($$renderer4, {
              children: prevent_snippet_stringification(($$renderer5) => {
                Button($$renderer5, {
                  class: "w-full justify-between",
                  children: prevent_snippet_stringification(($$renderer6) => {
                    $$renderer6.push(`<!---->${escape_html(selectedGenre || "Select genre")} `);
                    Chevron_down($$renderer6, { size: 16 });
                    $$renderer6.push(`<!---->`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Popover_content($$renderer4, {
              class: "w-[200px] p-2",
              children: prevent_snippet_stringification(($$renderer5) => {
                Command($$renderer5, {
                  children: prevent_snippet_stringification(($$renderer6) => {
                    Command_input($$renderer6, { placeholder: "Search genre..." });
                    $$renderer6.push(`<!----> `);
                    Command_list($$renderer6, {
                      children: prevent_snippet_stringification(($$renderer7) => {
                        Command_empty($$renderer7, {
                          children: prevent_snippet_stringification(($$renderer8) => {
                            $$renderer8.push(`<!---->No genres found.`);
                          }),
                          $$slots: { default: true }
                        });
                        $$renderer7.push(`<!----> <!--[-->`);
                        const each_array = ensure_array_like(genres);
                        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                          let genre = each_array[$$index];
                          Command_item($$renderer7, {
                            onclick: () => selectGenre(genre),
                            children: prevent_snippet_stringification(($$renderer8) => {
                              $$renderer8.push(`<!---->${escape_html(genre)}`);
                            }),
                            $$slots: { default: true }
                          });
                        }
                        $$renderer7.push(`<!--]-->`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!---->`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> <input type="hidden" name="genre"${attr("value", selectedGenre)} required/>`);
        push_element($$renderer3, "input", 103, 12);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="space-y-2">`);
        push_element($$renderer3, "div", 107, 8);
        $$renderer3.push(`<label for="synopsis" class="text-sm font-medium">`);
        push_element($$renderer3, "label", 108, 10);
        $$renderer3.push(`Project Synopsis</label>`);
        pop_element();
        $$renderer3.push(` `);
        Textarea($$renderer3, {
          id: "synopsis",
          name: "synopsis",
          rows: 4,
          required: true,
          placeholder: "Provide a brief overview of your project..."
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="space-y-4">`);
        push_element($$renderer3, "div", 113, 6);
        $$renderer3.push(`<h2 class="text-2xl font-semibold">`);
        push_element($$renderer3, "h2", 114, 8);
        $$renderer3.push(`Supporting Documents</h2>`);
        pop_element();
        $$renderer3.push(` <div class="grid gap-6">`);
        push_element($$renderer3, "div", 116, 8);
        FileUpload($$renderer3, {
          label: "Script or Treatment",
          name: "script",
          accept: ".pdf,.doc,.docx",
          required: true,
          get file() {
            return files.script;
          },
          set file($$value) {
            files.script = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        FileUpload($$renderer3, {
          label: "Budget Breakdown",
          name: "budget_breakdown",
          accept: ".pdf,.xls,.xlsx",
          required: true,
          get file() {
            return files.budget_breakdown;
          },
          set file($$value) {
            files.budget_breakdown = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        FileUpload($$renderer3, {
          label: "Storyboard/Visual References",
          name: "storyboard",
          accept: ".pdf,.zip,.jpg,.png",
          get file() {
            return files.storyboard;
          },
          set file($$value) {
            files.storyboard = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="flex justify-end gap-4">`);
        push_element($$renderer3, "div", 128, 6);
        Button($$renderer3, {
          type: "reset",
          variant: "outline",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->Reset`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        Button($$renderer3, {
          type: "submit",
          disabled: isSubmitting,
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html("Submit Request")}`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</form>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { data, form });
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-3-pSYCqz.js.map
