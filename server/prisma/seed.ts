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
const prisma  = new PrismaClient({ adapter });

async function main() {
  console.log("[Seed] Starting...");

  // ── 1 Admin ───────────────────────────────────────────
  const adminEmail = "admin@agency.com";
  const existing   = await prisma.user.findUnique({ where: { email: adminEmail } });

  let adminId: string;

  if (existing) {
    console.log("[Seed] Admin already exists — skipping");
    adminId = existing.id;
  } else {
    const passwordHash = await bcrypt.hash("Admin@1234", 12);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail, passwordHash,
        firstName: "Agency", lastName: "Admin",
        role: "admin", status: "active", emailVerified: true,
      },
    });
    await prisma.staffProfile.create({ data: { userId: admin.id, jobTitle: "System Administrator" } });
    await prisma.staffPermissions.create({
      data: {
        userId: admin.id,
        canManagePortfolio: true, canManageBlog: true, canManageTestimonials: true,
        canViewEnquiries: true, canManageEnquiries: true, canViewClients: true,
        canManageClients: true, canViewAnalytics: true, canManageServices: true,
        canManageChatbot: true, canManageTeam: true, canManageSettings: true,
      },
    });
    adminId = admin.id;
    console.log(`[Seed] Admin created: ${adminEmail}`);
  }

  // ── 6 Testimonials ────────────────────────────────────
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount < 6) {
    await prisma.testimonial.deleteMany();
    await prisma.testimonial.createMany({
      data: [
        {
          clientName: "Sarah Johnson", clientTitle: "CEO", clientCompany: "TechFlow Solutions",
          reviewText: "The ROI calculator gave us clear insights into what to expect. We saw a 180% increase in conversions within 4 months! Outstanding work from the whole team.",
          rating: 5, platform: "Google", isVerified: true, isFeatured: true,
          approvalStatus: "approved", approvedBy: adminId, sortOrder: 1,
        },
        {
          clientName: "Michael Chen", clientTitle: "CMO", clientCompany: "Growth Dynamics",
          reviewText: "The client portal makes it incredibly easy to stay on top of our campaigns. Everything we need is right there. Real-time analytics have transformed how we make decisions.",
          rating: 5, platform: "LinkedIn", isVerified: true, isFeatured: true,
          approvalStatus: "approved", approvedBy: adminId, sortOrder: 2,
        },
        {
          clientName: "Emma Williams", clientTitle: "Marketing Director", clientCompany: "RetailEdge",
          reviewText: "We saw a 285% ROI within 6 months. The team is incredibly responsive and the campaign strategy was perfectly tailored to our e-commerce business.",
          rating: 5, platform: "Clutch", isVerified: true, isFeatured: true,
          approvalStatus: "approved", approvedBy: adminId, sortOrder: 3,
        },
        {
          clientName: "James Peterson", clientTitle: "Founder", clientCompany: "StartupBoost",
          reviewText: "Best decision we made for our business. ROI increased by 285% in 6 months. The dedicated account manager made all the difference.",
          rating: 5, platform: "Facebook", isVerified: true, isFeatured: false,
          approvalStatus: "approved", approvedBy: adminId, sortOrder: 4,
        },
        {
          clientName: "Lisa Thompson", clientTitle: "Head of Growth", clientCompany: "ScaleUp Co",
          reviewText: "The chatbot captured 3x more leads than our previous contact form. The lead scoring system helped us focus on the right prospects immediately.",
          rating: 4, platform: "Google", isVerified: true, isFeatured: false,
          approvalStatus: "approved", approvedBy: adminId, sortOrder: 5,
        },
        {
          clientName: "David Kumar", clientTitle: "CEO", clientCompany: "InnovateTech",
          reviewText: "Professional, data-driven, and results-focused. The portfolio AI descriptions saved our content team hours every week. Highly recommended.",
          rating: 5, platform: "Direct", isVerified: true, isFeatured: false,
          approvalStatus: "approved", approvedBy: adminId, sortOrder: 6,
        },
      ],
    });
    console.log("[Seed] 6 testimonials created ✅");
  } else {
    console.log("[Seed] Testimonials already exist — skipping");
  }

  // ── 4 Portfolio Items ─────────────────────────────────
  const portfolioCount = await prisma.portfolioItem.count();
  if (portfolioCount < 4) {
    await prisma.portfolioItem.deleteMany();

    const p1 = await prisma.portfolioItem.create({
      data: {
        slug: "techflow-facebook-lead-gen", title: "Facebook Lead Generation Campaign",
        clientName: "TechFlow Solutions", clientIndustry: "SaaS",
        serviceCategory: "Social Media Marketing",
        description: "A comprehensive Facebook and Instagram lead generation campaign that drove 1,847 qualified leads in 90 days.",
        challengeText: "TechFlow needed to scale their B2B lead generation without increasing their cost-per-acquisition.",
        solutionText: "We deployed targeted Facebook and Instagram campaigns with custom audiences and lookalike modeling.",
        channelsUsed: ["Facebook", "Instagram"],
        status: "published", isFeatured: true, sortOrder: 1, viewsCount: 245,
        createdBy: adminId, publishedAt: new Date(),
      },
    });
    await prisma.portfolioMetric.createMany({
      data: [
        { portfolioItemId: p1.id, metricLabel: "ROI", metricValue: "312%", metricSuffix: "", sortOrder: 1 },
        { portfolioItemId: p1.id, metricLabel: "Leads Generated", metricValue: "1,847", sortOrder: 2 },
        { portfolioItemId: p1.id, metricLabel: "Cost Per Lead", metricValue: "£4.20", sortOrder: 3 },
        { portfolioItemId: p1.id, metricLabel: "Conversion Rate", metricValue: "8.4%", sortOrder: 4 },
      ],
    });

    const p2 = await prisma.portfolioItem.create({
      data: {
        slug: "retailedge-seo-optimization", title: "SEO Optimization & Content Strategy",
        clientName: "RetailEdge", clientIndustry: "E-commerce",
        serviceCategory: "SEO Optimization",
        description: "A 6-month SEO overhaul that took RetailEdge from page 4 to page 1 for 47 target keywords.",
        challengeText: "RetailEdge was invisible in search results despite having a strong product range.",
        solutionText: "We conducted a full technical SEO audit, rebuilt their content strategy, and implemented a backlink acquisition program.",
        channelsUsed: ["Google", "Content Marketing"],
        status: "published", isFeatured: true, sortOrder: 2, viewsCount: 189,
        createdBy: adminId, publishedAt: new Date(),
      },
    });
    await prisma.portfolioMetric.createMany({
      data: [
        { portfolioItemId: p2.id, metricLabel: "Organic Traffic", metricValue: "+285%", sortOrder: 1 },
        { portfolioItemId: p2.id, metricLabel: "Keywords on Page 1", metricValue: "47", sortOrder: 2 },
        { portfolioItemId: p2.id, metricLabel: "Revenue Increase", metricValue: "£142,800", metricPrefix: "+", sortOrder: 3 },
        { portfolioItemId: p2.id, metricLabel: "Domain Authority", metricValue: "+18 points", sortOrder: 4 },
      ],
    });

    const p3 = await prisma.portfolioItem.create({
      data: {
        slug: "growthco-google-ads-campaign", title: "Google Ads PPC Campaign",
        clientName: "Growth Dynamics", clientIndustry: "Professional Services",
        serviceCategory: "PPC Advertising",
        description: "A precision-targeted Google Ads campaign achieving 4.2x ROAS for a B2B professional services firm.",
        challengeText: "Growth Dynamics was spending £15,000/month on Google Ads with minimal return.",
        solutionText: "We restructured their account, implemented smart bidding strategies, and created industry-specific landing pages.",
        channelsUsed: ["Google", "LinkedIn"],
        status: "published", isFeatured: false, sortOrder: 3, viewsCount: 134,
        createdBy: adminId, publishedAt: new Date(),
      },
    });
    await prisma.portfolioMetric.createMany({
      data: [
        { portfolioItemId: p3.id, metricLabel: "ROAS", metricValue: "4.2x", sortOrder: 1 },
        { portfolioItemId: p3.id, metricLabel: "Cost Per Acquisition", metricValue: "-62%", sortOrder: 2 },
        { portfolioItemId: p3.id, metricLabel: "Conversions", metricValue: "+340", sortOrder: 3 },
        { portfolioItemId: p3.id, metricLabel: "Monthly Revenue", metricValue: "+£67,000", sortOrder: 4 },
      ],
    });

    const p4 = await prisma.portfolioItem.create({
      data: {
        slug: "innovatetech-email-drip-campaign", title: "Email Marketing Drip Campaign",
        clientName: "InnovateTech", clientIndustry: "SaaS",
        serviceCategory: "Email Marketing",
        description: "A 14-email automated drip campaign that converted 23% of cold leads into paying customers.",
        challengeText: "InnovateTech had 8,000 cold leads sitting in their CRM with no nurture strategy.",
        solutionText: "We built a behaviour-triggered email sequence with personalised content based on user actions.",
        channelsUsed: ["Email Marketing"],
        status: "published", isFeatured: false, sortOrder: 4, viewsCount: 98,
        createdBy: adminId, publishedAt: new Date(),
      },
    });
    await prisma.portfolioMetric.createMany({
      data: [
        { portfolioItemId: p4.id, metricLabel: "Conversion Rate", metricValue: "23%", sortOrder: 1 },
        { portfolioItemId: p4.id, metricLabel: "Open Rate", metricValue: "47%", sortOrder: 2 },
        { portfolioItemId: p4.id, metricLabel: "Revenue Generated", metricValue: "£284,000", sortOrder: 3 },
        { portfolioItemId: p4.id, metricLabel: "Unsubscribe Rate", metricValue: "0.8%", sortOrder: 4 },
      ],
    });

    console.log("[Seed] 4 portfolio items created ✅");
  } else {
    console.log("[Seed] Portfolio items already exist — skipping");
  }

  console.log("\n[Seed] ✅ Done!");
  console.log("[Seed] → 1 Admin, 6 Testimonials, 4 Portfolio Items");
}

main()
  .catch((e) => { console.error("[Seed] Error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
