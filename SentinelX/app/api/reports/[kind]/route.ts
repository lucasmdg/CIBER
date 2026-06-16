import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { sampleAssets, sampleVulns, sampleThreatActors, sampleMalware, sampleIncidents } from "@/lib/data/samples";
import { audit } from "@/lib/audit/logger";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";

function header(doc: jsPDF, title: string) {
  doc.setFillColor(5, 7, 13);
  doc.rect(0, 0, 210, 28, "F");
  doc.setTextColor(77, 220, 255);
  doc.setFontSize(16);
  doc.text("SENTINELX", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(180, 200, 220);
  doc.text(title, 196, 18, { align: "right" });
  doc.setTextColor(20, 20, 20);
}

function footer(doc: jsPDF, page: number, total: number) {
  doc.setFontSize(8);
  doc.setTextColor(120, 130, 145);
  doc.text(`Page ${page}/${total} · Generated ${new Date().toISOString()} · CONFIDENTIAL`, 14, 290);
  doc.setTextColor(20, 20, 20);
}

export async function GET(_req: Request, { params }: { params: { kind: string } }) {
  const session = await getServerSession(authOptions) as any;
  const kind = params.kind;
  const doc = new jsPDF();

  header(doc, labelFor(kind));

  if (kind === "executive") {
    doc.setFontSize(18);
    doc.text("Executive Security Report", 14, 42);
    doc.setFontSize(11);
    doc.text(
      "This report summarises SentinelX posture, top risks, threat landscape, and the recommended executive actions for the next 30 days.",
      14,
      52,
      { maxWidth: 180 }
    );
    autoTable(doc, {
      startY: 72,
      head: [["Metric", "Value"]],
      body: [
        ["Assets under management", String(sampleAssets.length)],
        ["Critical vulnerabilities open", String(sampleVulns.filter((v) => v.severity === "critical" && v.status !== "closed").length)],
        ["High vulnerabilities open", String(sampleVulns.filter((v) => v.severity === "high" && v.status !== "closed").length)],
        ["Tracked threat actors", String(sampleThreatActors.length)],
        ["Active incidents", String(sampleIncidents.length)]
      ],
      headStyles: { fillColor: [0, 180, 230] },
      styles: { fontSize: 9 }
    });
    autoTable(doc, {
      startY: (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8,
      head: [["Recommendation", "Owner", "Due"]],
      body: [
        ["Patch all critical CVEs (CVSS = 9) within 14 days", "Eng leads", "T+14d"],
        ["Enforce phishing-resistant MFA for admins", "IAM", "T+30d"],
        ["Roll out EDR to remaining 12 endpoints", "SecOps", "T+21d"],
        ["Review SaaS OAuth grants quarterly", "Cloud", "Quarterly"]
      ],
      headStyles: { fillColor: [0, 180, 230] },
      styles: { fontSize: 9 }
    });
  }

  if (kind === "technical") {
    doc.setFontSize(18);
    doc.text("Technical Vulnerability Report", 14, 42);
    autoTable(doc, {
      startY: 50,
      head: [["CVE", "Title", "Severity", "CVSS", "Status"]],
      body: sampleVulns.map((v) => [v.cve, v.title, v.severity, v.cvss.toFixed(1), v.status]),
      headStyles: { fillColor: [0, 180, 230] },
      styles: { fontSize: 8 }
    });
    autoTable(doc, {
      startY: (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8,
      head: [["Asset", "IP", "OS", "Criticality", "Risk"]],
      body: sampleAssets.map((a) => [a.name, a.ip, a.os, a.criticality, String(a.riskScore)]),
      headStyles: { fillColor: [0, 180, 230] },
      styles: { fontSize: 8 }
    });
  }

  if (kind === "threat") {
    doc.setFontSize(18);
    doc.text("Threat Intelligence Brief", 14, 42);
    autoTable(doc, {
      startY: 50,
      head: [["Actor", "Origin", "Motivation", "MITRE"]],
      body: sampleThreatActors.map((a) => [a.name, a.origin, a.motivation, a.mitre]),
      headStyles: { fillColor: [0, 180, 230] },
      styles: { fontSize: 8 }
    });
    autoTable(doc, {
      startY: (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8,
      head: [["Malware", "Type", "Campaign"]],
      body: sampleMalware.map((m) => [m.family, m.type, m.campaign]),
      headStyles: { fillColor: [0, 180, 230] },
      styles: { fontSize: 8 }
    });
  }

  if (kind === "incident") {
    doc.setFontSize(18);
    doc.text("Incident Response Report", 14, 42);
    sampleIncidents.forEach((i, idx) => {
      const y = idx === 0 ? 52 : (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      doc.setFontSize(13);
      doc.text(`${i.title} · ${i.severity.toUpperCase()} · ${i.phase}`, 14, y);
      autoTable(doc, {
        startY: y + 4,
        head: [["Phase", "Title", "Description"]],
        body: i.events.map((e) => [e.phase, e.title, e.description]),
        headStyles: { fillColor: [0, 180, 230] },
        styles: { fontSize: 8 }
      });
    });
  }

  if (!["executive", "technical", "threat", "incident"].includes(kind)) {
    return NextResponse.json({ error: "unknown_report" }, { status: 404 });
  }

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    footer(doc, p, total);
  }

  await audit({
    actor: session?.user?.email ?? "anonymous",
    action: "report.export",
    target: kind
  });

  const buf = Buffer.from(doc.output("arraybuffer"));
  return new NextResponse(buf, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="sentinelx-${kind}-${Date.now()}.pdf"`
    }
  });
}

function labelFor(k: string) {
  return ({
    executive: "Executive Security Report",
    technical: "Technical Vulnerability Report",
    threat: "Threat Intelligence Brief",
    incident: "Incident Response Report"
  } as Record<string, string>)[k] ?? "SentinelX Report";
}

