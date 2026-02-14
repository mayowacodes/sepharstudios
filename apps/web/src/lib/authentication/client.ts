import { browser } from "$app/environment";
import { signIn } from "$lib/auth-client";
import { Constants } from "$lib/constants";
import { toast } from "svelte-sonner";

export const getRedirectUrl = (): string => {
  if (!browser) return Constants.AFTERAUTH;
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirectTo') || urlParams.get('redirect') || Constants.AFTERAUTH;
  try {
    const url = new URL(redirectTo, window.location.origin);
    if (url.origin === window.location.origin) return redirectTo;
  } catch {}
  return Constants.AFTERAUTH;
};

export const handleSocialSignin = async (provider: 'apple' | 'google', callbackURL: string) => {
  await signIn.social({ provider, callbackURL }, {
    onSuccess: () => toast.success("Success Alert", { description: "Successful Sign in" }),
    onError: (ctx) => toast.error("Error Alert", { description: ctx.error.message })
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
    onError: (ctx) => { toast.error(ctx.error.message); }
  });
};
