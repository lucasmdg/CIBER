import { describe, it, expect } from "vitest";
import { assetCreateSchema, postureScanRequestSchema } from "../lib/security/validation";
import { cn, severityColor } from "../lib/utils";
import { can } from "../lib/rbac/roles";

describe("validation", () => {
  it("accepts a well-formed asset", () => {
    const r = assetCreateSchema.safeParse({
      name: "edge-fw-01",
      ip: "10.0.0.1",
      os: "JunOS 22.4",
      owner: "netops",
      type: "network",
      criticality: "critical",
      riskScore: 70
    });
    expect(r.success).toBe(true);
  });

  it("rejects a malformed asset", () => {
    const r = assetCreateSchema.safeParse({
      name: "x",
      ip: "not-an-ip",
      os: "",
      owner: "x",
      type: "server",
      criticality: "medium",
      riskScore: 500
    });
    expect(r.success).toBe(false);
  });

  it("rejects posture targets outside loopback/RFC1918", () => {
    const ok = postureScanRequestSchema.safeParse({ target: "http://example.com" });
    expect(ok.success).toBe(false);
    const yes = postureScanRequestSchema.safeParse({ target: "http://127.0.0.1:3000" });
    expect(yes.success).toBe(true);
  });
});

describe("rbac", () => {
  it("viewer cannot write", () => expect(can("viewer", "assets:write")).toBe(false));
  it("engineer can run posture", () => expect(can("engineer", "posture:run")).toBe(true));
  it("admin can read audit", () => expect(can("admin", "audit:read")).toBe(true));
});

describe("utils", () => {
  it("cn merges classes", () => expect(cn("a", "b", false && "c")).toBe("a b"));
  it("severity color exists for critical", () => expect(severityColor("critical")).toContain("text-threat-critical"));
});
