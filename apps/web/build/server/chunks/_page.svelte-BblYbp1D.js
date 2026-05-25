import { b as push_element, d as pop_element, l as escape_html, p as prevent_snippet_stringification, e as ensure_array_like, k as attr_class, c as clsx, i as stringify, g as attr, s as spread_props, B as bind_props, ao as Radio_group$1, ap as Radio_group_item$1, t as validate_snippet_args, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { C as Card, c as Card_content } from './card-title-Bb6tCQUO.js';
import { c as cn } from './utils2-DYlu6U_t.js';
import { B as Button } from './button-C1v8XzqW.js';
import { L as Label } from './label-99BY3xOG.js';
import { D as Dialog, a as Dialog_trigger, b as Dialog_content, c as Dialog_header, d as Dialog_title, e as Dialog_description, f as Dialog_footer } from './dialog-trigger-D7AZl1_Y.js';
import { I as Icon } from './Icon-DVHDtCfs.js';
import { I as Input } from './input-CTVv5zOe.js';
import { T as Trash_2 } from './trash-2-662QTG8h.js';
import { U as User } from './user-CxFDLytf.js';
import './index-D4iwt0su.js';
import './x-Cylf_7jQ.js';

Circle[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/circle.svelte";
function Circle($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [["circle", { "cx": "12", "cy": "12", "r": "10" }]];
      Icon($$renderer2, spread_props([
        { name: "circle" },
        /**
         * @component @name Circle
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/circle
         * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
         *
         * @param {Object} props - Lucide icons props and any valid SVG attribute
         * @returns {FunctionalComponent} Svelte component
         *
         */
        props,
        {
          iconNode,
          children: prevent_snippet_stringification(($$renderer3) => {
            props.children?.($$renderer3);
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    Circle
  );
}
Circle.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Plus[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/plus.svelte";
function Plus($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]];
      Icon($$renderer2, spread_props([
        { name: "plus" },
        /**
         * @component @name Plus
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJNMTIgNXYxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/plus
         * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
         *
         * @param {Object} props - Lucide icons props and any valid SVG attribute
         * @returns {FunctionalComponent} Svelte component
         *
         */
        props,
        {
          iconNode,
          children: prevent_snippet_stringification(($$renderer3) => {
            props.children?.($$renderer3);
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    Plus
  );
}
Plus.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Radio_group[FILENAME] = "src/lib/components/ui/radio-group/radio-group.svelte";
function Radio_group($$renderer, $$props) {
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
        $$renderer3.push(`<!---->`);
        Radio_group$1($$renderer3, spread_props([
          {
            "data-slot": "radio-group",
            class: cn("grid gap-3", className)
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
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref, value });
    },
    Radio_group
  );
}
Radio_group.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Radio_group_item[FILENAME] = "src/lib/components/ui/radio-group/radio-group-item.svelte";
function Radio_group_item($$renderer, $$props) {
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
        {
          let children = function($$renderer4, { checked }) {
            validate_snippet_args($$renderer4);
            $$renderer4.push(`<div data-slot="radio-group-indicator" class="relative flex items-center justify-center">`);
            push_element($$renderer4, "div", 23, 2);
            if (checked) {
              $$renderer4.push("<!--[-->");
              Circle($$renderer4, {
                class: "fill-primary absolute start-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2"
              });
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></div>`);
            pop_element();
          };
          prevent_snippet_stringification(children);
          Radio_group_item$1($$renderer3, spread_props([
            {
              "data-slot": "radio-group-item",
              class: cn("border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className)
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
              children,
              $$slots: { default: true }
            }
          ]));
        }
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
    Radio_group_item
  );
}
Radio_group_item.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(protected)/profiles/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      const PROFILE_TYPES = [
        {
          id: "adult",
          label: "Adult",
          description: "Full access to all content"
        },
        {
          id: "teen",
          label: "Teen",
          description: "Age-appropriate content for teenagers"
        },
        {
          id: "kids",
          label: "Kids",
          description: "Child-friendly content only"
        }
      ];
      const AVATAR_COLORS = [
        "bg-red-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-orange-500",
        "bg-teal-500"
      ];
      const AVATAR_EMOJIS = ["😊", "🦁", "🐺", "🦊", "🐻", "🦅", "🌟", "🎭"];
      let profiles = data.profiles;
      let maxProfiles = data.maxProfiles;
      let newName = "";
      let newType = "adult";
      let newColor = "bg-blue-500";
      let newEmoji = "😊";
      let creating = false;
      let createError = "";
      let addDialogOpen = false;
      async function createProfile() {
        if (!newName.trim()) {
          createError = "Name is required";
          return;
        }
        creating = true;
        createError = "";
        try {
          const res = await fetch("/api/profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: newName.trim(),
              type: newType,
              avatarColor: newColor,
              avatarEmoji: newEmoji
            })
          });
          const data2 = await res.json();
          if (!res.ok) {
            createError = data2.error || "Failed to create profile";
            return;
          }
          profiles = [...profiles, data2];
          newName = "";
          newType = "adult";
          newColor = "bg-blue-500";
          newEmoji = "😊";
          addDialogOpen = false;
        } finally {
          creating = false;
        }
      }
      function selectProfile(profile) {
        document.cookie = `activeProfileId=${profile.id}; path=/; max-age=86400`;
        window.location.href = "/dashboard";
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div class="min-h-screen bg-linear-to-b from-background to-accent/10">`);
        push_element($$renderer3, "div", 93, 0);
        $$renderer3.push(`<div class="container mx-auto px-4 py-16">`);
        push_element($$renderer3, "div", 94, 2);
        $$renderer3.push(`<div class="mb-8 flex items-center justify-between">`);
        push_element($$renderer3, "div", 95, 4);
        $$renderer3.push(`<div>`);
        push_element($$renderer3, "div", 96, 6);
        $$renderer3.push(`<h1 class="mb-2 text-3xl font-bold">`);
        push_element($$renderer3, "h1", 97, 8);
        $$renderer3.push(`Who's Watching?</h1>`);
        pop_element();
        $$renderer3.push(` <p class="text-muted-foreground">`);
        push_element($$renderer3, "p", 98, 8);
        $$renderer3.push(`Choose a profile to start watching</p>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` <div class="flex items-center gap-3">`);
        push_element($$renderer3, "div", 100, 6);
        if (maxProfiles > 2) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<span class="text-xs text-muted-foreground">`);
          push_element($$renderer3, "span", 102, 10);
          $$renderer3.push(`Family plan: ${escape_html(profiles.length)}/${escape_html(maxProfiles)} profiles</span>`);
          pop_element();
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        Button($$renderer3, {
          variant: "outline",
          href: "/parental-controls",
          size: "sm",
          children: prevent_snippet_stringification(($$renderer4) => {
            $$renderer4.push(`<!---->Parental Controls`);
          }),
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<div class="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">`);
          push_element($$renderer3, "div", 115, 6);
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(profiles);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let profile = each_array_1[$$index_1];
            $$renderer3.push(`<div class="relative group">`);
            push_element($$renderer3, "div", 117, 10);
            Card($$renderer3, {
              class: "cursor-pointer transition-transform hover:scale-105",
              onclick: () => selectProfile(profile),
              children: prevent_snippet_stringification(($$renderer4) => {
                Card_content($$renderer4, {
                  class: "p-4 text-center",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<div${attr_class(clsx(cn("mx-auto h-32 w-32 rounded-lg", profile.avatarColor, "mb-4 flex items-center justify-center ring-primary group-hover:ring-4")))}>`);
                    push_element($$renderer5, "div", 123, 16);
                    $$renderer5.push(`<span class="text-5xl">`);
                    push_element($$renderer5, "span", 130, 18);
                    $$renderer5.push(`${escape_html(profile.avatarEmoji || "👤")}</span>`);
                    pop_element();
                    $$renderer5.push(`</div>`);
                    pop_element();
                    $$renderer5.push(` <h3 class="text-lg font-medium">`);
                    push_element($$renderer5, "h3", 132, 16);
                    $$renderer5.push(`${escape_html(profile.name)}</h3>`);
                    pop_element();
                    $$renderer5.push(` <p class="text-sm capitalize text-muted-foreground">`);
                    push_element($$renderer5, "p", 133, 16);
                    $$renderer5.push(`${escape_html(profile.type)}</p>`);
                    pop_element();
                    $$renderer5.push(` `);
                    if (profile.hasPin) {
                      $$renderer5.push("<!--[-->");
                      $$renderer5.push(`<p class="text-xs text-yellow-400 mt-1">`);
                      push_element($$renderer5, "p", 135, 18);
                      $$renderer5.push(`PIN protected</p>`);
                      pop_element();
                    } else {
                      $$renderer5.push("<!--[!-->");
                    }
                    $$renderer5.push(`<!--]-->`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            if (!profile.isDefault && profiles.length > 1) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<button class="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-red-600/80 p-1.5 rounded-full text-white" title="Delete profile">`);
              push_element($$renderer3, "button", 141, 14);
              Trash_2($$renderer3, { class: "w-3.5 h-3.5" });
              $$renderer3.push(`<!----></button>`);
              pop_element();
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div>`);
            pop_element();
          }
          $$renderer3.push(`<!--]--> `);
          if (profiles.length < maxProfiles) {
            $$renderer3.push("<!--[-->");
            Dialog($$renderer3, {
              get open() {
                return addDialogOpen;
              },
              set open($$value) {
                addDialogOpen = $$value;
                $$settled = false;
              },
              children: prevent_snippet_stringification(($$renderer4) => {
                Dialog_trigger($$renderer4, {
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<div class="cursor-pointer border-dashed transition-transform hover:scale-105 rounded-lg border-2 border-border bg-card text-card-foreground shadow-sm h-full min-h-48">`);
                    push_element($$renderer5, "div", 155, 14);
                    $$renderer5.push(`<div class="flex h-full flex-col items-center justify-center p-4 text-center">`);
                    push_element($$renderer5, "div", 156, 16);
                    $$renderer5.push(`<div class="mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-muted">`);
                    push_element($$renderer5, "div", 157, 18);
                    Plus($$renderer5, { class: "h-16 w-16 text-muted-foreground" });
                    $$renderer5.push(`<!----></div>`);
                    pop_element();
                    $$renderer5.push(` <h3 class="text-lg font-medium">`);
                    push_element($$renderer5, "h3", 160, 18);
                    $$renderer5.push(`Add Profile</h3>`);
                    pop_element();
                    $$renderer5.push(`</div>`);
                    pop_element();
                    $$renderer5.push(`</div>`);
                    pop_element();
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Dialog_content($$renderer4, {
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Dialog_header($$renderer5, {
                      children: prevent_snippet_stringification(($$renderer6) => {
                        Dialog_title($$renderer6, {
                          children: prevent_snippet_stringification(($$renderer7) => {
                            $$renderer7.push(`<!---->Create Profile`);
                          }),
                          $$slots: { default: true }
                        });
                        $$renderer6.push(`<!----> `);
                        Dialog_description($$renderer6, {
                          children: prevent_snippet_stringification(($$renderer7) => {
                            $$renderer7.push(`<!---->Add a new profile for another person watching Sephar Studios`);
                          }),
                          $$slots: { default: true }
                        });
                        $$renderer6.push(`<!---->`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> <div class="space-y-6">`);
                    push_element($$renderer5, "div", 171, 14);
                    $$renderer5.push(`<div class="space-y-2">`);
                    push_element($$renderer5, "div", 172, 16);
                    Label($$renderer5, {
                      for: "pname",
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->Profile Name`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> `);
                    Input($$renderer5, {
                      id: "pname",
                      placeholder: "Enter name",
                      get value() {
                        return newName;
                      },
                      set value($$value) {
                        newName = $$value;
                        $$settled = false;
                      }
                    });
                    $$renderer5.push(`<!----></div>`);
                    pop_element();
                    $$renderer5.push(` <div class="space-y-2">`);
                    push_element($$renderer5, "div", 176, 16);
                    Label($$renderer5, {
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->Profile Type`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> `);
                    Radio_group($$renderer5, {
                      get value() {
                        return newType;
                      },
                      set value($$value) {
                        newType = $$value;
                        $$settled = false;
                      },
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!--[-->`);
                        const each_array_2 = ensure_array_like(PROFILE_TYPES);
                        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                          let type = each_array_2[$$index_2];
                          $$renderer6.push(`<div class="flex items-center space-x-2">`);
                          push_element($$renderer6, "div", 180, 22);
                          Radio_group_item($$renderer6, { value: type.id, id: type.id });
                          $$renderer6.push(`<!----> `);
                          Label($$renderer6, {
                            for: type.id,
                            class: "flex-1",
                            children: prevent_snippet_stringification(($$renderer7) => {
                              $$renderer7.push(`<span class="font-medium">`);
                              push_element($$renderer7, "span", 183, 26);
                              $$renderer7.push(`${escape_html(type.label)}</span>`);
                              pop_element();
                              $$renderer7.push(` <span class="text-sm text-muted-foreground block">`);
                              push_element($$renderer7, "span", 184, 26);
                              $$renderer7.push(`${escape_html(type.description)}</span>`);
                              pop_element();
                            }),
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!----></div>`);
                          pop_element();
                        }
                        $$renderer6.push(`<!--]-->`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----></div>`);
                    pop_element();
                    $$renderer5.push(` <div class="space-y-2">`);
                    push_element($$renderer5, "div", 190, 16);
                    Label($$renderer5, {
                      children: prevent_snippet_stringification(($$renderer6) => {
                        $$renderer6.push(`<!---->Avatar`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> <div class="flex flex-wrap gap-2 mb-2">`);
                    push_element($$renderer5, "div", 192, 18);
                    $$renderer5.push(`<!--[-->`);
                    const each_array_3 = ensure_array_like(AVATAR_EMOJIS);
                    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
                      let emoji = each_array_3[$$index_3];
                      $$renderer5.push(`<button type="button"${attr_class(`w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl transition-all ${stringify(newEmoji === emoji ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : "")}`)}>`);
                      push_element($$renderer5, "button", 194, 22);
                      $$renderer5.push(`${escape_html(emoji)}</button>`);
                      pop_element();
                    }
                    $$renderer5.push(`<!--]--></div>`);
                    pop_element();
                    $$renderer5.push(` <div class="flex flex-wrap gap-2">`);
                    push_element($$renderer5, "div", 201, 18);
                    $$renderer5.push(`<!--[-->`);
                    const each_array_4 = ensure_array_like(AVATAR_COLORS);
                    for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
                      let color = each_array_4[$$index_4];
                      $$renderer5.push(`<button type="button"${attr("aria-label", `Select ${color.replace("bg-", "").replace("-", " ")} avatar color`)}${attr_class(`w-8 h-8 rounded-full ${color} transition-all ${newColor === color ? "ring-4 ring-offset-2 ring-offset-background ring-primary" : ""}`)}>`);
                      push_element($$renderer5, "button", 203, 22);
                      $$renderer5.push(`</button>`);
                      pop_element();
                    }
                    $$renderer5.push(`<!--]--></div>`);
                    pop_element();
                    $$renderer5.push(`</div>`);
                    pop_element();
                    $$renderer5.push(` `);
                    if (createError) {
                      $$renderer5.push("<!--[-->");
                      $$renderer5.push(`<p class="text-sm text-red-400">`);
                      push_element($$renderer5, "p", 213, 18);
                      $$renderer5.push(`${escape_html(createError)}</p>`);
                      pop_element();
                    } else {
                      $$renderer5.push("<!--[!-->");
                    }
                    $$renderer5.push(`<!--]--> `);
                    Dialog_footer($$renderer5, {
                      children: prevent_snippet_stringification(($$renderer6) => {
                        Button($$renderer6, {
                          onclick: createProfile,
                          disabled: creating,
                          children: prevent_snippet_stringification(($$renderer7) => {
                            $$renderer7.push(`<!---->${escape_html(creating ? "Creating..." : "Create Profile")}`);
                          }),
                          $$slots: { default: true }
                        });
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----></div>`);
                    pop_element();
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`<div class="rounded-lg border-2 border-border bg-card/50 text-card-foreground opacity-60 min-h-48">`);
            push_element($$renderer3, "div", 224, 10);
            $$renderer3.push(`<div class="flex h-full flex-col items-center justify-center p-4 text-center">`);
            push_element($$renderer3, "div", 225, 12);
            $$renderer3.push(`<div class="mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-muted">`);
            push_element($$renderer3, "div", 226, 14);
            User($$renderer3, { class: "h-16 w-16 text-muted-foreground" });
            $$renderer3.push(`<!----></div>`);
            pop_element();
            $$renderer3.push(` <h3 class="text-sm font-medium text-muted-foreground">`);
            push_element($$renderer3, "h3", 229, 14);
            $$renderer3.push(`Profile limit reached</h3>`);
            pop_element();
            $$renderer3.push(` `);
            if (maxProfiles <= 2) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<p class="text-xs text-muted-foreground mt-1">`);
              push_element($$renderer3, "p", 231, 16);
              $$renderer3.push(`Add Family add-on for up to 8</p>`);
              pop_element();
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div>`);
            pop_element();
            $$renderer3.push(`</div>`);
            pop_element();
          }
          $$renderer3.push(`<!--]--></div>`);
          pop_element();
        }
        $$renderer3.push(`<!--]--></div>`);
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
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-BblYbp1D.js.map
