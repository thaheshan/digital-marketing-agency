import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: "127.0.0.1",
  ssl: false,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("[Seed] Starting...");

  // ── First Admin ───────────────────────────────────────────
  const adminEmail = "admin@agency.com";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existing) {
    console.log("[Seed] Admin already exists — skipping");
  } else {
    const passwordHash = await bcrypt.hash("Admin@1234", 12);

    const admin = await prisma.user.create({
      data: {
        email:         adminEmail,
        passwordHash,
        firstName:     "Agency",
        lastName:      "Admin",
        role:          "admin",
        status:        "active",
        emailVerified: true,
      },
    });

    await prisma.staffProfile.create({
      data: {
        userId:   admin.id,
        jobTitle: "System Administrator",
      },
    });

    await prisma.staffPermissions.create({
      data: {
        userId:               admin.id,
        canManagePortfolio:   true,
        canManageBlog:        true,
        canManageTestimonials:true,
        canViewEnquiries:     true,
        canManageEnquiries:   true,
        canViewClients:       true,
        canManageClients:     true,
        canViewAnalytics:     true,
        canManageServices:    true,
        canManageChatbot:     true,
        canManageTeam:        true,
        canManageSettings:    true,
      },
    });

    console.log("[Seed] Admin created successfully!");
    console.log(`[Seed] Email:    ${adminEmail}`);
    console.log(`[Seed] Password: Admin@1234`);
    console.log(`[Seed] Role:     admin`);
    console.log(`[Seed] ID:       ${admin.id}`);
  }

  console.log("[Seed] Done!");
}

main()
  .catch((e) => { console.error("[Seed] Error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
