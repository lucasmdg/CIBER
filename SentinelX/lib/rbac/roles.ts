export type Role = "viewer" | "analyst" | "engineer" | "admin";

export const ROLE_PERMS: Record<Role, ReadonlyArray<string>> = {
  viewer: ["dashboard:read", "assets:read", "vulns:read", "threats:read", "posture:read", "paths:read", "incidents:read", "reports:read"],
  analyst: [
    "dashboard:read", "assets:read", "vulns:read", "vulns:write", "threats:read",
    "posture:read", "paths:read", "incidents:read", "incidents:write", "reports:read"
  ],
  engineer: [
    "dashboard:read", "assets:read", "assets:write", "vulns:read", "vulns:write",
    "threats:read", "threats:write", "posture:read", "posture:run", "paths:read",
    "incidents:read", "incidents:write", "reports:read", "reports:export"
  ],
  admin: [
    "dashboard:read", "assets:read", "assets:write", "vulns:read", "vulns:write",
    "threats:read", "threats:write", "posture:read", "posture:run", "paths:read",
    "paths:write", "incidents:read", "incidents:write", "reports:read", "reports:export",
    "audit:read", "users:manage"
  ]
};

export function can(role: Role | undefined, perm: string) {
  if (!role) return false;
  return ROLE_PERMS[role].includes(perm);
}
