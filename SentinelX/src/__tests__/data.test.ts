import { describe, it, expect } from "vitest";
import { sampleAssets, sampleVulns, sampleAttackPaths } from "../lib/data/samples";

describe("sample data", () => {
  it("contains unique asset names", () => {
    const names = sampleAssets.map((a) => a.name);
    expect(new Set(names).size).toBe(names.length);
  });
  it("contains at least one critical vuln", () => {
    expect(sampleVulns.some((v) => v.severity === "critical")).toBe(true);
  });
  it("attack path steps are unique", () => {
    sampleAttackPaths.forEach((p) => {
      const ids = p.steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
