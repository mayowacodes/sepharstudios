import { F as FILENAME } from './index-client-DVey9PBT.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { p as prevent_snippet_stringification, E as escape_html, g as spread_props } from './index-C14HL8mA.js';
import { B as Button } from './button-B5TxIyzE.js';
import { C as Card, a as Card_header, b as Card_title, d as Card_description, c as Card_content } from './card-title-C-y0C6UW.js';
import { I as Input } from './input-BHRan7UY.js';
import { L as Label } from './label-Bh2yW0Jf.js';
import './loading-spinner-BYlcQqmo.js';
import './auth-client-BmG0Nu2w.js';
import { C as Constants } from './index4-Cnd3Rmm9.js';
import { A as Avatar, a as Avatar_image, b as Avatar_fallback } from './avatar-fallback-Sz8ic2oI.js';
import { I as Icon } from './Icon-DLeFNkXp.js';
import { p as page } from './index2-DN4t2Pgp.js';
import { U as User } from './user-CU8eWwNU.js';
import { M as Mail } from './mail-DSF3JMME.js';
import { L as Lock } from './lock-COBq3UOp.js';
import { E as Eye } from './eye-Da_d-AVQ.js';
import { E as Eye_off } from './eye-off-Wh0l7jZa.js';
import { S as Separator } from './separator-C0wSgEAM.js';
import './utils2-C-_3GP94.js';
import './create-id-ozwDP4rH.js';
import './defu-BDNAzC90.js';
import 'zod';
import './shared-server-BeisX7n9.js';
import './users-CMHMaCG6.js';
import './watch.svelte-ALR66MkX.js';
import './index-server-_G0R5Qhl.js';
import './dom-context.svelte-DOhd7vND.js';
import './client-CreTuECU.js';
import './client2-BtPpI286.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';

Camera[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/camera.svelte";
function Camera($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"
          }
        ],
        ["circle", { "cx": "12", "cy": "13", "r": "3" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "camera" },
        /**
         * @component @name Camera
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTMuOTk3IDRhMiAyIDAgMCAxIDEuNzYgMS4wNWwuNDg2LjlBMiAyIDAgMCAwIDE4LjAwMyA3SDIwYTIgMiAwIDAgMSAyIDJ2OWEyIDIgMCAwIDEtMiAySDRhMiAyIDAgMCAxLTItMlY5YTIgMiAwIDAgMSAyLTJoMS45OTdhMiAyIDAgMCAwIDEuNzU5LTEuMDQ4bC40ODktLjkwNEEyIDIgMCAwIDEgMTAuMDA0IDR6IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTMiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/camera
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
    Camera
  );
}
Camera.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const getFileFromUrl = async (url, name = "image.png") => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type });
};
User_profile_image_cropper[FILENAME] = "src/lib/authentication/ui/user-profile-image-cropper.svelte";
function User_profile_image_cropper($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { src, onCropped } = $$props;
      $$renderer2.push(`<div class="relative group cursor-pointer inline-block">`);
      push_element($$renderer2, "div", 19, 0);
      Avatar($$renderer2, {
        class: "h-24 w-24 border-2 border-border transition-opacity group-hover:opacity-80",
        children: prevent_snippet_stringification(($$renderer3) => {
          Avatar_image($$renderer3, { src });
          $$renderer3.push(`<!----> `);
          Avatar_fallback($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->User`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <div class="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">`);
      push_element($$renderer2, "div", 24, 2);
      Camera($$renderer2, { class: "h-6 w-6 text-white" });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <input type="file" accept="image/*" class="hidden"/>`);
      push_element($$renderer2, "input", 27, 2);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    User_profile_image_cropper
  );
}
User_profile_image_cropper.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
function resizeImage(file, options = {}) {
  const { maxWidth = 800, maxHeight = 800, quality = 0.8, format = "jpeg" } = options;
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      let width = img.width, height = img.height;
      if (width > maxWidth) {
        height = height * maxWidth / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = width * maxHeight / height;
        height = maxHeight;
      }
      canvas.width = Math.floor(width);
      canvas.height = Math.floor(height);
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) resolve(new File([blob], file.name, { type: `image/${format}`, lastModified: Date.now() }));
        else reject(new Error("Failed to compress image"));
      }, `image/${format}`, quality);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}
Update_user_form[FILENAME] = "src/lib/authentication/ui/update-user-form.svelte";
function Update_user_form($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let saving = false;
      let image = null;
      let user = page.data.session?.user;
      const onCropped = async (url) => {
        const file = await getFileFromUrl(url);
        image = await resizeImage(file);
      };
      $$renderer2.push(`<form class="w-full">`);
      push_element($$renderer2, "form", 40, 0);
      Card($$renderer2, {
        class: "shadow-sm",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            class: "pb-6 text-center",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="mb-4 flex justify-center">`);
              push_element($$renderer4, "div", 43, 6);
              User_profile_image_cropper($$renderer4, {
                src: image ? URL.createObjectURL(image) : user.image,
                onCropped
              });
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(` `);
              Card_title($$renderer4, {
                class: "text-xl",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(user.name || user.email)}`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Card_description($$renderer4, {
                class: "capitalize",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(user?.role)}`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            class: "space-y-6",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="space-y-2">`);
              push_element($$renderer4, "div", 51, 6);
              Label($$renderer4, {
                for: "name",
                class: "flex items-center gap-2",
                children: prevent_snippet_stringification(($$renderer5) => {
                  User($$renderer5, { class: "h-4 w-4" });
                  $$renderer5.push(`<!----> Name`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Input($$renderer4, {
                id: "name",
                name: "name",
                value: user.name,
                placeholder: "Enter your name"
              });
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(` <div class="space-y-2">`);
              push_element($$renderer4, "div", 56, 6);
              Label($$renderer4, {
                for: "email",
                class: "flex items-center gap-2",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Mail($$renderer5, { class: "h-4 w-4" });
                  $$renderer5.push(`<!----> Email`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Input($$renderer4, {
                id: "email",
                type: "email",
                value: user.email,
                disabled: true,
                class: "bg-muted text-muted-foreground"
              });
              $$renderer4.push(`<!----> <p class="text-xs text-muted-foreground">`);
              push_element($$renderer4, "p", 59, 8);
              $$renderer4.push(`Email cannot be changed directly.</p>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="pt-4">`);
              push_element($$renderer4, "div", 62, 6);
              Button($$renderer4, {
                type: "submit",
                disabled: saving,
                class: "w-full sm:w-fit",
                size: "lg",
                children: prevent_snippet_stringification(($$renderer5) => {
                  {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push(`Save Changes`);
                  }
                  $$renderer5.push(`<!--]-->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></form>`);
      pop_element();
    },
    Update_user_form
  );
}
Update_user_form.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Change_password_form[FILENAME] = "src/lib/authentication/ui/change-password-form.svelte";
function Change_password_form($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let isPending = false;
      let showPassword = false;
      $$renderer2.push(`<form class="w-full">`);
      push_element($$renderer2, "form", 31, 0);
      Card($$renderer2, {
        class: "shadow-sm",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "flex items-center gap-2",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Lock($$renderer5, { class: "size-4" });
                  $$renderer5.push(`<!----> Security`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Card_description($$renderer4, {
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Update your password to keep your account secure.`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            class: "space-y-4",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="space-y-2">`);
              push_element($$renderer4, "div", 38, 12);
              Label($$renderer4, {
                for: "password",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Current Password`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Input($$renderer4, {
                id: "password",
                name: "password",
                type: showPassword ? "text" : "password",
                required: true
              });
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(` <div class="space-y-2">`);
              push_element($$renderer4, "div", 42, 12);
              Label($$renderer4, {
                for: "newPassword",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->New Password`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> <div class="relative">`);
              push_element($$renderer4, "div", 44, 16);
              Input($$renderer4, {
                id: "newPassword",
                name: "newPassword",
                type: showPassword ? "text" : "password",
                required: true,
                class: "pr-10"
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                onclick: () => showPassword = !showPassword,
                class: "absolute right-0 top-0 h-full px-3",
                variant: "ghost",
                size: "icon",
                children: prevent_snippet_stringification(($$renderer5) => {
                  if (showPassword) {
                    $$renderer5.push("<!--[-->");
                    Eye($$renderer5, { class: "size-4" });
                  } else {
                    $$renderer5.push("<!--[!-->");
                    Eye_off($$renderer5, { class: "size-4" });
                  }
                  $$renderer5.push(`<!--]-->`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` `);
              Button($$renderer4, {
                type: "submit",
                disabled: isPending,
                children: prevent_snippet_stringification(($$renderer5) => {
                  {
                    $$renderer5.push("<!--[!-->");
                  }
                  $$renderer5.push(`<!--]--> Change Password`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></form>`);
      pop_element();
    },
    Change_password_form
  );
}
Change_password_form.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
User_profile[FILENAME] = "src/lib/authentication/ui/pages/user-profile.svelte";
function User_profile($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      page.data.session?.user?.id.includes(Constants.CREDENTIAL);
      $$renderer2.push(`<div class="container max-w-4xl py-6 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">`);
      push_element($$renderer2, "div", 13, 0);
      $$renderer2.push(`<div class="flex flex-col gap-2">`);
      push_element($$renderer2, "div", 14, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold tracking-tight">`);
      push_element($$renderer2, "h1", 15, 4);
      $$renderer2.push(`Profile Settings</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 16, 4);
      $$renderer2.push(`Manage your account information and preferences.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      Separator($$renderer2, {});
      $$renderer2.push(`<!----> <div class="grid gap-8 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]">`);
      push_element($$renderer2, "div", 20, 2);
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 21, 4);
      Update_user_form($$renderer2);
      $$renderer2.push(`<!----> `);
      Change_password_form($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-6">`);
      push_element($$renderer2, "div", 26, 4);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    User_profile
  );
}
User_profile.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(protected)/profile/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      User_profile($$renderer2);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-DfNzFDaq.js.map
