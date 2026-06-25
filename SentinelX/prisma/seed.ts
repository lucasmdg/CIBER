import { PrismaClient } from "@prisma/client";
import { sampleAssets, sampleVulns, sampleThreatActors, sampleMalware, sampleAttackPaths, sampleIncidents, samplePosture } from "../lib/data/samples";

const prisma = new PrismaClient();

async function main() {
  console.info("Seeding SentinelX demo data...");

  for (const a of sampleAssets) {
    await prisma.asset.upsert({ where: { name: a.name }, create: a, update: a });
  }
  for (const v of sampleVulns) {
    const { affectedNames, ...vulnData } = v;
    const vuln = await prisma.vulnerability.upsert({
      where: { cve: v.cve },
      create: vulnData,
      update: vulnData
    });
    const targets = affectedNames ?? [];
    for (const assetName of targets) {
      const asset = await prisma.asset.findUnique({ where: { name: assetName } });
      if (!asset) continue;
      await prisma.finding.upsert({
        where: { assetId_vulnerabilityId: { assetId: asset.id, vulnerabilityId: vuln.id } },
        create: { assetId: asset.id, vulnerabilityId: vuln.id },
        update: {}
      });
    }
  }
  for (const t of sampleThreatActors) {
    await prisma.threatActor.upsert({ where: { name: t.name }, create: t, update: t });
  }
  for (const m of sampleMalware) {
    await prisma.malware.upsert({ where: { family: m.family }, create: m, update: m });
  }
  for (const p of sampleAttackPaths) {
    await prisma.attackPath.upsert({
      where: { id: p.id ?? "demo" },
      create: { id: p.id ?? "demo", name: p.name, scenario: p.scenario, steps: JSON.stringify(p.steps) },
      update: { name: p.name, scenario: p.scenario, steps: JSON.stringify(p.steps) }
    });
  }
  for (const i of sampleIncidents) {
    const inc = await prisma.incident.upsert({
      where: { id: i.id ?? "demo-incident" },
      create: { id: i.id ?? "demo-incident", title: i.title, severity: i.severity, phase: i.phase, summary: i.summary },
      update: { title: i.title, severity: i.severity, phase: i.phase, summary: i.summary }
    });
    await prisma.incidentEvent.deleteMany({ where: { incidentId: inc.id } });
    for (const e of i.events) {
      await prisma.incidentEvent.create({
        data: { incidentId: inc.id, phase: e.phase, title: e.title, description: e.description }
      });
    }
  }
  await prisma.postureCheck.deleteMany({});
  for (const p of samplePosture) {
    await prisma.postureCheck.create({ data: p });
  }
  console.info("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
