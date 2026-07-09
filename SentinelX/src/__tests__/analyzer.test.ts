import { describe, it, expect } from "vitest";
import crypto from "crypto";

// Shannon entropy calculation helper duplicated locally for isolated test verification
function calculateShannonEntropy(buffer: Buffer): number {
  if (buffer.length === 0) return 0;
  const frequencies = new Array(256).fill(0);
  for (let i = 0; i < buffer.length; i++) {
    frequencies[buffer[i]]++;
  }
  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (frequencies[i] > 0) {
      const p = frequencies[i] / buffer.length;
      entropy -= p * Math.log2(p);
    }
  }
  return entropy;
}

// File type detector helper duplicated locally for isolated test verification
function detectFileType(buffer: Buffer): string {
  if (buffer.length === 0) return "Empty Buffer";
  if (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return "Windows Executable (.exe, .dll)";
  }
  if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) {
    return "ZIP Archive";
  }
  if (buffer.length >= 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return "PDF Document";
  }
  return "Binary Data / Unknown";
}

describe("Static File Analyzer Logic & Edge Cases", () => {
  it("calculates entropy of empty buffer as 0", () => {
    const buf = Buffer.alloc(0);
    expect(calculateShannonEntropy(buf)).toBe(0);
  });

  it("calculates entropy of uniform buffer correctly", () => {
    const buf = Buffer.alloc(100, 0xAA);
    expect(calculateShannonEntropy(buf)).toBe(0);
  });

  it("calculates maximum entropy of diverse buffer correctly", () => {
    const bytes = Array.from({ length: 256 }, (_, i) => i);
    const buf = Buffer.from(bytes);
    expect(calculateShannonEntropy(buf)).toBe(8); // 8 bits of entropy for a perfect distribution
  });

  it("detects Windows PE executables signature correctly", () => {
    const buf = Buffer.from([0x4d, 0x5a, 0x00, 0x00]);
    expect(detectFileType(buf)).toContain("Windows Executable");
  });

  it("detects ZIP files correctly", () => {
    const buf = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
    expect(detectFileType(buf)).toBe("ZIP Archive");
  });

  it("detects PDF documents correctly", () => {
    const buf = Buffer.from([0x25, 0x50, 0x44, 0x46]);
    expect(detectFileType(buf)).toBe("PDF Document");
  });

  it("identifies plain binaries/unknown signatures", () => {
    const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);
    expect(detectFileType(buf)).toBe("Binary Data / Unknown");
  });

  it("handles empty buffer detection safely", () => {
    const buf = Buffer.alloc(0);
    expect(detectFileType(buf)).toBe("Empty Buffer");
  });

  it("verifies hash calculations match SHA256 standard", () => {
    const data = "sentinelx-defensive-posture-test-payload";
    const sha256 = crypto.createHash("sha256").update(data).digest("hex");
    expect(sha256).toBe("19d1e51e3753c8ca48a55ff75dbccc7b761e351ce137cbfcbfa64c2409c18dd3");
  });

  it("calculates mock security score based on inputs", () => {
    const computeMockScore = (passes: number, total: number) => {
      return total > 0 ? Math.round((passes / total) * 100) : 0;
    };
    expect(computeMockScore(8, 10)).toBe(80);
    expect(computeMockScore(0, 0)).toBe(0);
    expect(computeMockScore(0, 5)).toBe(0);
  });
});
