import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL || "";
const isSupabase = dbUrl.includes("supabase.com");

const pool = new Pool({
  connectionString: dbUrl,
  ssl: isSupabase ? { rejectUnauthorized: false } : false,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("[Seed] Starting...");

  // ── Admin User ─────────────────────────────────────────────
  const adminEmail = "admin@agency.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existingAdmin) {
    console.log("[Seed] Admin already exists — skipping admin creation");
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
        staffProfile: {
          create: { jobTitle: "System Administrator" }
        },
        staffPermissions: {
          create: {
            canManagePortfolio:    true,
            canManageBlog:         true,
            canManageTestimonials: true,
            canViewEnquiries:      true,
            canManageEnquiries:    true,
            canViewClients:        true,
            canManageClients:      true,
            canViewAnalytics:      true,
            canManageServices:     true,
            canManageChatbot:      true,
            canManageTeam:         true,
            canManageSettings:     true,
          }
        }
      },
    });
    console.log(`[Seed] Admin created: ${adminEmail} / Admin@1234 (id: ${admin.id})`);
  }

  // ── Client User ────────────────────────────────────────────
  const clientEmail = "client@demo.com";
  const existingClient = await prisma.user.findUnique({ where: { email: clientEmail } });

  let clientUser = existingClient;
  if (!existingClient) {
    const passwordHashClient = await bcrypt.hash("Client@1234", 12);
    clientUser = await prisma.user.create({
      data: {
        email:         clientEmail,
        passwordHash:  passwordHashClient,
        firstName:     "James",
        lastName:      "Smith",
        role:          "client",
        status:        "active",
        emailVerified: true,
        clientProfile: {
          create: {
            companyName: "Acme Corp Ltd.",
            websiteUrl:  "https://acme-demo.com",
            industry:    "Technology",
          }
        }
      },
    });
    console.log(`[Seed] Client created: ${clientEmail} / Client@1234`);
  } else {
    console.log("[Seed] Client already exists — skipping");
  }

  // ── Service ────────────────────────────────────────────────
  const svc = await prisma.service.upsert({
    where:  { slug: "seo-optimization" },
    update: {},
    create: {
      slug:         "seo-optimization",
      name:         "SEO Optimization",
      tagline:      "Rank higher on Google and dominate search.",
      description:  "Comprehensive SEO services tailored to your niche.",
      isPublished:  true,
      sortOrder:    1,
    }
  });
  console.log(`[Seed] Service seeded: ${svc.name}`);

  // ── Portfolio Case Study ───────────────────────────────────
  const port = await prisma.portfolioItem.upsert({
    where:  { slug: "tech-startup-growth" },
    update: {},
    create: {
      slug:            "tech-startup-growth",
      title:           "Tech Startup Growth Campaign",
      clientName:      "TechFlow Solutions",
      serviceCategory: "Growth Marketing",
      description:     "A comprehensive digital marketing campaign designed to increase brand awareness and revenue.",
      challengeText:   "The client struggled with low engagement rates and poor organic visibility.",
      solutionText:    "We developed a multi-platform content strategy combining SEO, paid ads, and influencer partnerships.",
      status:          "published",
      isFeatured:      true,
      metrics: {
        create: [
          { metricLabel: "Engagement Increase", metricValue: "287%", sortOrder: 1 },
          { metricLabel: "Revenue Generated",   metricValue: "$2.1M", sortOrder: 2 },
          { metricLabel: "New Customers",       metricValue: "1,240", sortOrder: 3 },
        ]
      }
    }
  });
  console.log(`[Seed] Portfolio seeded: ${port.slug}`);

  // ── Campaign for Client ────────────────────────────────────
  if (clientUser) {
    const existingCamp = await prisma.campaign.findFirst({
      where: { clientId: clientUser.id, name: "Google Search - Brand Awareness" }
    });

    if (!existingCamp) {
      const camp = await prisma.campaign.create({
        data: {
          clientId:        clientUser.id,
          name:            "Google Search - Brand Awareness",
          status:          "live",
          startDate:       new Date("2026-01-01"),
          totalBudgetPence: 400000,
          totalSpentPence:  284000,
          objective:        "Brand awareness & lead generation",
          platforms: {
            create: [
              { platform: "Google",   isActive: true },
              { platform: "Facebook", isActive: true },
            ]
          },
          goals: {
            create: [
              { metricName: "Impressions", targetValue: 150000, currentValue: 125000, unit: "count",   period: "monthly", status: "on_track" },
              { metricName: "Clicks",      targetValue: 5000,   currentValue: 4200,   unit: "count",   period: "monthly", status: "on_track" },
              { metricName: "Conversions", targetValue: 400,    currentValue: 340,    unit: "count",   period: "monthly", status: "on_track" },
            ]
          }
        }
      });
      console.log(`[Seed] Campaign seeded: ${camp.name}`);
    } else {
      console.log("[Seed] Campaign already exists — skipping");
    }
  }

  // ── Blog Post ──────────────────────────────────────────────
  const post = await prisma.blogPost.upsert({
    where:  { slug: "why-seo-matters-2026" },
    update: {},
    create: {
      slug:            "why-seo-matters-2026",
      title:           "Why SEO Matters More Than Ever in 2026",
      excerpt:         "Discover the key SEO strategies that are driving results in 2026, from AI search to Core Web Vitals.",
      content:         "<h2>The SEO Landscape Has Shifted</h2><p>With AI-powered search results now dominating, organic traffic strategies must evolve...</p>",
      status:          "published",
      readTimeMinutes: 5,
      viewsCount:      1240,
      publishedAt:     new Date("2026-03-15"),
    }
  });
  console.log(`[Seed] Blog post seeded: ${post.slug}`);

  // ── Testimonial ────────────────────────────────────────────
  const testimonial = await prisma.testimonial.findFirst({
    where: { clientName: "Sarah Mitchell" }
  });
  if (!testimonial) {
    await prisma.testimonial.create({
      data: {
        clientName:    "Sarah Mitchell",
        clientTitle:   "Head of Marketing",
        clientCompany: "TechFlow Solutions",
        reviewText:    "Digital Pulse transformed our online presence completely. Our lead generation went up by 287% in just 6 months. The team is responsive, creative, and results-driven.",
        rating:        5,
        isFeatured:    true,
        isVerified:    true,
        approvalStatus: "approved",
        servicesUsed:   ["SEO", "PPC", "Content Marketing"],
      }
    });
    console.log("[Seed] Testimonial seeded");
  }

  console.log("[Seed] ✅ All done! Database is ready for the FYP demo.");
  console.log("\nDemo Credentials:");
  console.log("  Admin:  admin@agency.com  / Admin@1234");
  console.log("  Client: client@demo.com   / Client@1234");
}

main()
  .catch((e) => { console.error("[Seed] Error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
