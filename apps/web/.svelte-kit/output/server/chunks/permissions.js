import { env } from "@better-auth/core/env";
import { BetterAuthError } from "@better-auth/core/error";
import { R as Role } from "./index.js";
function checkHasPath(url) {
  try {
    return (new URL(url).pathname.replace(/\/+$/, "") || "/") !== "/";
  } catch {
    throw new BetterAuthError(`Invalid base URL: ${url}. Please provide a valid base URL.`);
  }
}
function assertHasProtocol(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new BetterAuthError(`Invalid base URL: ${url}. URL must include 'http://' or 'https://'`);
  } catch (error) {
    if (error instanceof BetterAuthError) throw error;
    throw new BetterAuthError(`Invalid base URL: ${url}. Please provide a valid base URL.`, { cause: error });
  }
}
function withPath(url, path = "/api/auth") {
  assertHasProtocol(url);
  if (checkHasPath(url)) return url;
  const trimmedUrl = url.replace(/\/+$/, "");
  if (!path || path === "/") return trimmedUrl;
  path = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedUrl}${path}`;
}
function validateProxyHeader(header, type) {
  if (!header || header.trim() === "") return false;
  if (type === "proto") return header === "http" || header === "https";
  if (type === "host") {
    if ([
      /\.\./,
      /\0/,
      /[\s]/,
      /^[.]/,
      /[<>'"]/,
      /javascript:/i,
      /file:/i,
      /data:/i
    ].some((pattern) => pattern.test(header))) return false;
    return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(:[0-9]{1,5})?$/.test(header) || /^(\d{1,3}\.){3}\d{1,3}(:[0-9]{1,5})?$/.test(header) || /^\[[0-9a-fA-F:]+\](:[0-9]{1,5})?$/.test(header) || /^localhost(:[0-9]{1,5})?$/i.test(header);
  }
  return false;
}
function getBaseURL(url, path, request, loadEnv, trustedProxyHeaders) {
  if (url) return withPath(url, path);
  {
    const fromEnv = env.BETTER_AUTH_URL || env.NEXT_PUBLIC_BETTER_AUTH_URL || env.PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_AUTH_URL || (env.BASE_URL !== "/" ? env.BASE_URL : void 0);
    if (fromEnv) return withPath(fromEnv, path);
  }
  const fromRequest = request?.headers.get("x-forwarded-host");
  const fromRequestProto = request?.headers.get("x-forwarded-proto");
  if (fromRequest && fromRequestProto && trustedProxyHeaders) {
    if (validateProxyHeader(fromRequestProto, "proto") && validateProxyHeader(fromRequest, "host")) try {
      return withPath(`${fromRequestProto}://${fromRequest}`, path);
    } catch (_error) {
    }
  }
  if (request) {
    const url$1 = getOrigin(request.url);
    if (!url$1) throw new BetterAuthError("Could not get origin from request. Please provide a valid base URL.");
    return withPath(url$1, path);
  }
  if (typeof window !== "undefined" && window.location) return withPath(window.location.origin, path);
}
function getOrigin(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin === "null" ? null : parsedUrl.origin;
  } catch {
    return null;
  }
}
function getProtocol(url) {
  try {
    return new URL(url).protocol;
  } catch {
    return null;
  }
}
function getHost(url) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}
function role(statements2) {
  return {
    authorize(request, connector = "AND") {
      let success = false;
      for (const [requestedResource, requestedActions] of Object.entries(request)) {
        const allowedActions = statements2[requestedResource];
        if (!allowedActions) return {
          success: false,
          error: `You are not allowed to access resource: ${requestedResource}`
        };
        if (Array.isArray(requestedActions)) success = requestedActions.every((requestedAction) => allowedActions.includes(requestedAction));
        else if (typeof requestedActions === "object") {
          const actions = requestedActions;
          if (actions.connector === "OR") success = actions.actions.some((requestedAction) => allowedActions.includes(requestedAction));
          else success = actions.actions.every((requestedAction) => allowedActions.includes(requestedAction));
        } else throw new BetterAuthError("Invalid access control request");
        if (success && connector === "OR") return { success };
        if (!success && connector === "AND") return {
          success: false,
          error: `unauthorized to access resource "${requestedResource}"`
        };
      }
      if (success) return { success };
      return {
        success: false,
        error: "Not authorized"
      };
    },
    statements: statements2
  };
}
function createAccessControl(s) {
  return {
    newRole(statements2) {
      return role(statements2);
    },
    statements: s
  };
}
const defaultStatements$1 = {
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
    "get",
    "update"
  ],
  session: [
    "list",
    "revoke",
    "delete"
  ]
};
const defaultAc$1 = createAccessControl(defaultStatements$1);
const adminAc = defaultAc$1.newRole({
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
    "get",
    "update"
  ],
  session: [
    "list",
    "revoke",
    "delete"
  ]
});
const userAc = defaultAc$1.newRole({
  user: [],
  session: []
});
const defaultRoles = {
  admin: adminAc,
  user: userAc
};
const hasPermission = (input) => {
  if (input.userId && input.options?.adminUserIds?.includes(input.userId)) return true;
  if (!input.permissions && !input.permission) return false;
  const roles2 = (input.role || input.options?.defaultRole || "user").split(",");
  const acRoles = input.options?.roles || defaultRoles;
  for (const role2 of roles2) if (acRoles[role2]?.authorize(input.permission ?? input.permissions)?.success) return true;
  return false;
};
const defaultStatements = {
  organization: ["update", "delete"],
  member: [
    "create",
    "update",
    "delete"
  ],
  invitation: ["create", "cancel"],
  team: [
    "create",
    "update",
    "delete"
  ],
  ac: [
    "create",
    "read",
    "update",
    "delete"
  ]
};
const defaultAc = createAccessControl(defaultStatements);
defaultAc.newRole({
  organization: ["update"],
  invitation: ["create", "cancel"],
  member: [
    "create",
    "update",
    "delete"
  ],
  team: [
    "create",
    "update",
    "delete"
  ],
  ac: [
    "create",
    "read",
    "update",
    "delete"
  ]
});
defaultAc.newRole({
  organization: ["update", "delete"],
  member: [
    "create",
    "update",
    "delete"
  ],
  invitation: ["create", "cancel"],
  team: [
    "create",
    "update",
    "delete"
  ],
  ac: [
    "create",
    "read",
    "update",
    "delete"
  ]
});
defaultAc.newRole({
  organization: [],
  member: [],
  invitation: [],
  team: [],
  ac: ["read"]
});
const statements = {
  ...defaultStatements$1,
  files: ["create", "read", "update", "delete", "upload", "download"],
  users: ["create", "read", "update", "delete", "manage", "change-role", "invite", "ban", "unban"],
  roles: ["assign", "revoke", "elevate", "demote"],
  analytics: ["view-dashboard", "export-reports"],
  reports: ["create", "read", "schedule", "export"],
  settings: ["read", "update", "update:general", "update:notifications", "update:security"],
  system: ["configure", "backup", "restore", "audit", "monitor", "maintenance"]
};
const ac = createAccessControl(statements);
const roles = {
  [Role.ADMIN]: ac.newRole({
    ...adminAc.statements,
    files: ["create", "read", "update", "delete", "upload", "download"],
    users: ["create", "read", "update", "delete", "manage", "change-role", "invite", "ban", "unban"],
    roles: ["assign", "revoke", "elevate", "demote"],
    analytics: ["view-dashboard", "export-reports"],
    reports: ["create", "read", "schedule", "export"],
    settings: ["read", "update", "update:general", "update:notifications", "update:security"],
    system: ["configure", "backup", "restore", "audit", "monitor", "maintenance"]
  }),
  [Role.EDITOR]: ac.newRole({
    files: ["create", "read", "update", "delete", "upload", "download"],
    users: ["read"],
    roles: [],
    analytics: ["view-dashboard", "export-reports"],
    reports: ["read", "export"],
    settings: ["read"],
    system: ["audit"]
  }),
  [Role.CREATOR]: ac.newRole({
    files: ["create", "read", "upload", "download"],
    users: ["read"],
    roles: [],
    analytics: ["view-dashboard"],
    reports: ["read"],
    settings: ["read"],
    system: []
  }),
  [Role.USER]: ac.newRole({
    files: ["read"],
    users: ["read"],
    roles: [],
    analytics: ["view-dashboard"],
    reports: ["read"],
    settings: ["read"],
    system: []
  })
};
({ [Role.ADMIN]: 4, [Role.EDITOR]: 3, [Role.CREATOR]: 2, [Role.USER]: 1 });
export {
  adminAc as a,
  ac as b,
  getOrigin as c,
  getHost as d,
  getProtocol as e,
  defaultRoles as f,
  getBaseURL as g,
  hasPermission as h,
  roles as r,
  userAc as u
};
