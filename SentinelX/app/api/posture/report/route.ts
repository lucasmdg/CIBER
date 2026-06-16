import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";

export async function GET() {
  const checks = await prisma.postureCheck.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("SentinelX – Posture Snapshot", 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toISOString()}`, 14, 26);
  doc.text(`Total checks: ${checks.length}`, 14, 32);

  let y = 44;
  doc.setFontSize(12);
  doc.text("Category", 14, y);
  doc.text("Name", 50, y);
  doc.text("Status", 130, y);
  doc.text("Detail", 150, y);
  y += 4;
  doc.line(14, y, 200, y);
  y += 6;
  doc.setFontSize(9);
  for (const c of checks) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(c.category, 14, y);
    doc.text(c.name.slice(0, 30), 50, y);
    doc.text(c.status, 130, y);
    const detail = doc.splitTextToSize(c.detail, 50);
    doc.text(detail, 150, y);
    y += Math.max(6, detail.length * 5);
  }

  const buf = Buffer.from(doc.output("arraybuffer"));
  return new NextResponse(buf, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="sentinelx-posture-${Date.now()}.pdf"`
    }
  });
}
