import { z } from "zod";

export const assetTypeSchema = z.enum([
  "server",
  "workstation",
  "container",
  "cloud",
  "network"
]);

export const criticalitySchema = z.enum(["low", "medium", "high", "critical"]);

export const assetCreateSchema = z.object({
  name: z.string().min(2).max(80).regex(/^[a-zA-Z0-9._-]+$/, "invalid hostname"),
  ip: z.string().ip({ version: "v4" }),
  os: z.string().min(2).max(60),
  owner: z.string().min(2).max(80),
  type: assetTypeSchema,
  criticality: criticalitySchema,
  riskScore: z.number().int().min(0).max(100)
});
export type AssetCreateInput = z.infer<typeof assetCreateSchema>;

export const vulnSeveritySchema = z.enum(["low", "medium", "high", "critical"]);
export const vulnStatusSchema = z.enum([
  "open",
  "in_review",
  "remediating",
  "mitigated",
  "closed"
]);

export const loginSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(8).max(128)
});

export const postureScanRequestSchema = z.object({
  target: z
    .string()
    .refine((v) => /^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\]|10\.|192\.168\.)/.test(v), {
      message: "Target must be loopback or RFC1918"
    })
});

export const incidentPhaseSchema = z.enum([
  "detection",
  "investigation",
  "containment",
  "eradication",
  "recovery",
  "post_incident"
]);
