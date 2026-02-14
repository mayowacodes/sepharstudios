import { createAuthClient } from "better-auth/svelte";
import { env } from "$env/dynamic/public";
import { adminClient as _admin, customSessionClient, inferAdditionalFields, magicLinkClient, multiSessionClient } from 'better-auth/client/plugins';
import { ac, roles } from "$lib/db/permissions";
import type { auth } from "./auth";

const authClient = createAuthClient({
  baseURL: env.PUBLIC_BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    _admin({ ac, roles }),
    customSessionClient<typeof auth>(),
    magicLinkClient(),
    multiSessionClient()
  ]
});

export const { signUp, signOut, signIn, useSession, admin, sendVerificationEmail, resetPassword, changePassword, listAccounts, accountInfo, requestPasswordReset } = authClient;
export { authClient };
