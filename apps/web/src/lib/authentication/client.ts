import { browser } from "$app/environment";
import { signIn } from "$lib/auth-client";
import { authClient } from "$lib/auth-client";
import { Constants } from "$lib/constants";
import { toast } from "svelte-sonner";

/**
 * Allowed hostnames for cross-origin redirectTo. The set must include every
 * subdomain we route to so post-login redirects can land on the right portal
 * (admin.* / creators.* / kids.*) without being silently swapped for the apex
 * AFTERAUTH default. Open-redirect protection: anything outside this list
 * falls back to AFTERAUTH.
 */
const ALLOWED_REDIRECT_HOSTS = new Set([
  'sepharstudios.com',
  'www.sepharstudios.com',
  'admin.sepharstudios.com',
  'creators.sepharstudios.com',
  'creator.sepharstudios.com',
  'kids.sepharstudios.com',
  'localhost'
]);

const getDefaultRedirectUrl = (): string => {
  if (!browser) return Constants.AFTERAUTH;

  const { hostname, protocol } = window.location;
  if (hostname === 'admin.sepharstudios.com') {
    return `${protocol}//admin.sepharstudios.com/admin`;
  }
  if (hostname === 'creators.sepharstudios.com' || hostname === 'creator.sepharstudios.com') {
    return `${protocol}//creators.sepharstudios.com/creator`;
  }
  if (hostname === 'kids.sepharstudios.com') {
    return `${protocol}//kids.sepharstudios.com/kids`;
  }

  return Constants.AFTERAUTH;
};

export const getRedirectUrl = (): string => {
  if (!browser) return Constants.AFTERAUTH;
  const urlParams = new URLSearchParams(window.location.search);
  const defaultRedirect = getDefaultRedirectUrl();
  const redirectTo = urlParams.get('redirectTo') || urlParams.get('redirect') || defaultRedirect;
  try {
    const url = new URL(redirectTo, window.location.origin);
    // Same-origin redirects are always fine.
    if (url.origin === window.location.origin) return redirectTo;
    // Cross-subdomain redirects allowed within our own hostnames.
    if (ALLOWED_REDIRECT_HOSTS.has(url.hostname)) return redirectTo;
  } catch {}
  return defaultRedirect;
};

export const handleSocialSignin = async (provider: 'apple' | 'google', callbackURL: string) => {
  await signIn.social({ provider, callbackURL }, {
    onSuccess: () => {
      toast.success("Success Alert", { description: "Successful Sign in" });
    },
    onError: (ctx) => {
      toast.error("Error Alert", { description: ctx.error.message });
    }
  });
};

export const updateProfile = async (formData: FormData, userId: string) => {
  const file = formData.get('image');
  let image: string | undefined = undefined;
  if (file && file instanceof File && file.size > 0) {
    const { uploadFile } = await import('$lib/file');
    image = await uploadFile(file);
  }
  const name = formData.get('name') as string;
  await authClient.updateUser({ image, name }, {
    onSuccess: () => { toast.success('Profile updated successfully'); },
    onError: (ctx: { error: { message: string } }) => { toast.error(ctx.error.message); }
  });
};
