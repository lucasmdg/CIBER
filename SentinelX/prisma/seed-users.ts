import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: "analyst@sentinelx.local", name: "Demo Analyst", password: "SentinelX-Demo-2026", role: "analyst" },
    { email: "engineer@sentinelx.local", name: "Demo Engineer", password: "SentinelX-Demo-2026", role: "engineer" },
    { email: "admin@sentinelx.local", name: "Demo Admin", password: "SentinelX-Demo-2026", role: "admin" }
  ];
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { email: u.email },
      create: { email: u.email, name: u.name, passwordHash, role: u.role },
      update: { name: u.name, passwordHash, role: u.role }
    });
  }
  console.info("Users seeded.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
