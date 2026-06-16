import { prisma } from "@/lib/prisma";

export type AuditEvent = {
  actor: string;
  action: string;
  target?: string;
  meta?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
};

export async function audit(event: AuditEvent) {
  try {
    await prisma.auditLog.create({
      data: {
        actor: event.actor,
        action: event.action,
        target: event.target ?? null,
        meta: event.meta ? JSON.stringify(event.meta) : null,
        ip: event.ip ?? null,
        userAgent: event.userAgent ?? null
      }
    });
  } catch (err) {
    console.warn("audit_failed", err);
  }
}
