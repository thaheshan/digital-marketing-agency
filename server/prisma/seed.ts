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
  let adminId: string;

  if (existingAdmin) {
    console.log("[Seed] Admin already exists — skipping");
    adminId = existingAdmin.id;
  } else {
    const passwordHash = await bcrypt.hash("Admin@1234", 12);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail, passwordHash,
        firstName: "Agency", lastName: "Admin",
        role: "admin", status: "active", emailVerified: true,
        staffProfile: { create: { jobTitle: "System Administrator" } },
        staffPermissions: {
          create: {
            canManagePortfolio: true, canManageBlog: true, canManageTestimonials: true,
            canViewEnquiries: true, canManageEnquiries: true, canViewClients: true,
            canManageClients: true, canViewAnalytics: true, canManageServices: true,
            canManageChatbot: true, canManageTeam: true, canManageSettings: true,
          }
        }
      },
    });
    adminId = admin.id;
    console.log(`[Seed] Admin created: ${adminEmail} / Admin@1234`);
  }

  // ── Client User ────────────────────────────────────────────
  const clientEmail = "client@demo.com";
  const existingClient = await prisma.user.findUnique({ where: { email: clientEmail } });
  let clientUser = existingClient;

  if (!existingClient) {
    const passwordHashClient = await bcrypt.hash("Client@1234", 12);
    clientUser = await prisma.user.create({
      data: {
        email: clientEmail, passwordHash: passwordHashClient,
        firstName: "James", lastName: "Smith",
        role: "client", status: "active", emailVerified: true,
        clientProfile: {
          create: { companyName: "Acme Corp Ltd.", websiteUrl: "https://acme-demo.com", industry: "Technology" }
        }
      },
    });
    console.log(`[Seed] Client created: ${clientEmail} / Client@1234`);
  } else {
    console.log("[Seed] Client already exists — skipping");
  }

  // ── Service ────────────────────────────────────────────────
  const svc = await prisma.service.upsert({
    where: { slug: "seo-optimization" }, update: {},
    create: {
      slug: "seo-optimization", name: "SEO Optimization",
      tagline: "Rank higher on Google and dominate search.",
      description: "Comprehensive SEO services tailored to your niche.",
      isPublished: true, sortOrder: 1,
    }
  });
  console.log(`[Seed] Service seeded: ${svc.name}`);

  // ── 4 Portfolio Items ─────────────────────────────────────
  await prisma.portfolioMetric.deleteMany();
  await prisma.portfolioItem.deleteMany();

  const p1 = await prisma.portfolioItem.create({
    data: {
      slug: "tech-startup-growth", title: "Tech Startup Growth Campaign",
      clientName: "TechFlow Solutions", clientIndustry: "SaaS",
      serviceCategory: "Growth Marketing",
      description: "A comprehensive digital marketing campaign to increase brand awareness and revenue.",
      challengeText: "The client struggled with low engagement and poor organic visibility.",
      solutionText: "We developed a multi-platform strategy combining SEO, paid ads, and content.",
      status: "published", isFeatured: true, sortOrder: 1,
      createdBy: adminId, publishedAt: new Date(),
      metrics: { create: [
        { metricLabel: "Engagement Increase", metricValue: "287%",  sortOrder: 1 },
        { metricLabel: "Revenue Generated",   metricValue: "$2.1M", sortOrder: 2 },
        { metricLabel: "New Customers",       metricValue: "1,240", sortOrder: 3 },
      ]}
    }
  });

  const p2 = await prisma.portfolioItem.create({
    data: {
      slug: "retailedge-seo-optimization", title: "SEO Optimization & Content Strategy",
      clientName: "RetailEdge", clientIndustry: "E-commerce",
      serviceCategory: "SEO Optimization",
      description: "A 6-month SEO overhaul that took RetailEdge from page 4 to page 1 for 47 keywords.",
      challengeText: "RetailEdge was invisible in search results despite a strong product range.",
      solutionText: "We rebuilt their content strategy and implemented a backlink acquisition program.",
      status: "published", isFeatured: true, sortOrder: 2,
      createdBy: adminId, publishedAt: new Date(),
      metrics: { create: [
        { metricLabel: "Organic Traffic",    metricValue: "+285%",    sortOrder: 1 },
        { metricLabel: "Keywords on Page 1", metricValue: "47",       sortOrder: 2 },
        { metricLabel: "Revenue Increase",   metricValue: "£142,800", sortOrder: 3 },
      ]}
    }
  });

  const p3 = await prisma.portfolioItem.create({
    data: {
      slug: "growthco-google-ads", title: "Google Ads PPC Campaign",
      clientName: "Growth Dynamics", clientIndustry: "Professional Services",
      serviceCategory: "PPC Advertising",
      description: "A precision-targeted Google Ads campaign achieving 4.2x ROAS.",
      challengeText: "Growth Dynamics was spending £15,000/month on Google Ads with minimal return.",
      solutionText: "We restructured their account and implemented smart bidding strategies.",
      status: "published", isFeatured: false, sortOrder: 3,
      createdBy: adminId, publishedAt: new Date(),
      metrics: { create: [
        { metricLabel: "ROAS",               metricValue: "4.2x",     sortOrder: 1 },
        { metricLabel: "Cost Per Acquisition",metricValue: "-62%",    sortOrder: 2 },
        { metricLabel: "Monthly Revenue",    metricValue: "+£67,000", sortOrder: 3 },
      ]}
    }
  });

  const p4 = await prisma.portfolioItem.create({
    data: {
      slug: "innovatetech-email-drip", title: "Email Marketing Drip Campaign",
      clientName: "InnovateTech", clientIndustry: "SaaS",
      serviceCategory: "Email Marketing",
      description: "A 14-email automated drip campaign that converted 23% of cold leads.",
      challengeText: "InnovateTech had 8,000 cold leads with no nurture strategy.",
      solutionText: "We built a behaviour-triggered email sequence with personalised content.",
      status: "published", isFeatured: false, sortOrder: 4,
      createdBy: adminId, publishedAt: new Date(),
      metrics: { create: [
        { metricLabel: "Conversion Rate",   metricValue: "23%",      sortOrder: 1 },
        { metricLabel: "Open Rate",         metricValue: "47%",      sortOrder: 2 },
        { metricLabel: "Revenue Generated", metricValue: "£284,000", sortOrder: 3 },
      ]}
    }
  });

  console.log("[Seed] 4 portfolio items created ✅");

  // ── Campaign for Client ────────────────────────────────────
  if (clientUser) {
    const existingCamp = await prisma.campaign.findFirst({
      where: { clientId: clientUser.id, name: "Google Search - Brand Awareness" }
    });
    if (!existingCamp) {
      await prisma.campaign.create({
        data: {
          clientId: clientUser.id,
          name: "Google Search - Brand Awareness",
          status: "live", startDate: new Date("2026-01-01"),
          totalBudgetPence: 400000, totalSpentPence: 284000,
          objective: "Brand awareness & lead generation",
          platforms: { create: [{ platform: "Google", isActive: true }, { platform: "Facebook", isActive: true }] },
          goals: { create: [
            { metricName: "Impressions", targetValue: 150000, currentValue: 125000, unit: "count", period: "monthly", status: "on_track" },
            { metricName: "Conversions", targetValue: 400,    currentValue: 340,    unit: "count", period: "monthly", status: "on_track" },
          ]}
        }
      });
      console.log("[Seed] Campaign seeded");
    }
  }

  // ── Blog Post ──────────────────────────────────────────────
  await prisma.blogPost.upsert({
    where: { slug: "why-seo-matters-2026" }, update: {},
    create: {
      slug: "why-seo-matters-2026", title: "Why SEO Matters More Than Ever in 2026",
      excerpt: "Discover the key SEO strategies driving results in 2026.",
      content: "<h2>The SEO Landscape Has Shifted</h2><p>With AI-powered search results now dominating...</p>",
      status: "published", readTimeMinutes: 5, viewsCount: 1240, publishedAt: new Date("2026-03-15"),
    }
  });
  console.log("[Seed] Blog post seeded");

  // ── 6 Testimonials ────────────────────────────────────────
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: "Sarah Mitchell", clientTitle: "Head of Marketing", clientCompany: "TechFlow Solutions",
        reviewText: "Digital Pulse transformed our online presence. Our lead generation went up by 287% in just 6 months.",
        rating: 5, isFeatured: true, isVerified: true, approvalStatus: "approved",
        approvedBy: adminId, servicesUsed: ["SEO", "PPC", "Content Marketing"], sortOrder: 1,
      },
      {
        clientName: "Michael Chen", clientTitle: "CMO", clientCompany: "Growth Dynamics",
        reviewText: "The client portal makes it incredibly easy to stay on top of campaigns. Real-time analytics transformed how we make decisions.",
        rating: 5, isFeatured: true, isVerified: true, approvalStatus: "approved",
        approvedBy: adminId, servicesUsed: ["Social Media", "Analytics"], sortOrder: 2,
      },
      {
        clientName: "Emma Williams", clientTitle: "Marketing Director", clientCompany: "RetailEdge",
        reviewText: "We saw a 285% ROI within 6 months. The team is incredibly responsive and the strategy was perfectly tailored.",
        rating: 5, isFeatured: true, isVerified: true, approvalStatus: "approved",
        approvedBy: adminId, servicesUsed: ["SEO", "Content"], sortOrder: 3,
      },
      {
        clientName: "James Peterson", clientTitle: "Founder", clientCompany: "StartupBoost",
        reviewText: "Best decision we made for our business. ROI increased by 285% in 6 months. The dedicated account manager made all the difference.",
        rating: 5, isFeatured: false, isVerified: true, approvalStatus: "approved",
        approvedBy: adminId, servicesUsed: ["PPC", "Social Media"], sortOrder: 4,
      },
      {
        clientName: "Lisa Thompson", clientTitle: "Head of Growth", clientCompany: "ScaleUp Co",
        reviewText: "The chatbot captured 3x more leads than our previous contact form. Lead scoring helped us focus on the right prospects.",
        rating: 4, isFeatured: false, isVerified: true, approvalStatus: "approved",
        approvedBy: adminId, servicesUsed: ["Chatbot", "Lead Generation"], sortOrder: 5,
      },
      {
        clientName: "David Kumar", clientTitle: "CEO", clientCompany: "InnovateTech",
        reviewText: "Professional, data-driven, and results-focused. The portfolio AI descriptions saved our content team hours every week.",
        rating: 5, isFeatured: false, isVerified: true, approvalStatus: "approved",
        approvedBy: adminId, servicesUsed: ["Email Marketing", "AI Content"], sortOrder: 6,
      },
    ],
  });
  console.log("[Seed] 6 testimonials created ✅");

  console.log("\n[Seed] ✅ All done!");
  console.log("[Seed] → 1 Admin, 1 Client, 4 Portfolio Items, 6 Testimonials");
  console.log("\nDemo Credentials:");
  console.log("  Admin:  admin@agency.com / Admin@1234");
  console.log("  Client: client@demo.com  / Client@1234");
}

main()
  .catch((e) => { console.error("[Seed] Error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
