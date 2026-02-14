import { R as Role } from './index4-Cnd3Rmm9.js';

const roles = [
  { value: Role.ADMIN, label: "Admin", color: "destructive" },
  { value: Role.EDITOR, label: "Editor", color: "default" },
  { value: Role.USER, label: "User", color: "secondary" }
];
const getRoleBadgeVariant = (role) => {
  const roleConfig = roles.find((r) => r.value.toLowerCase() === role.toLowerCase());
  return roleConfig?.color || "secondary";
};

export { getRoleBadgeVariant as g, roles as r };
//# sourceMappingURL=fxn-BOos7yUf.js.map
