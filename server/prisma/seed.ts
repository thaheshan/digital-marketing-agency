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
  console.log("[Seed] Starting Massive Data Injection for FYP Showcase...");

  const passwordHash = await bcrypt.hash("Password123!", 12);

  // --- 0. CLEANUP ---
  console.log("[Seed] Cleaning up existing data...");
  await prisma.campaignMetricsDaily.deleteMany();
  await prisma.campaignPlatform.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.portfolioImage.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.invoice.deleteMany();

  // --- 1. ADMIN USER ---
  const admin = await prisma.user.upsert({
    where: { email: "admin@digitalpulse.agency" },
    update: {},
    create: {
      email: "admin@digitalpulse.agency",
      passwordHash,
      firstName: "Priya",
      lastName: "Nanthakumar",
      role: "admin",
      status: "active",
      emailVerified: true,
      staffProfile: { create: { jobTitle: "Agency Founder & CEO", department: "Executive" } },
      staffPermissions: {
        create: {
          canManagePortfolio: true, canManageBlog: true, canManageTestimonials: true,
          canViewEnquiries: true, canManageEnquiries: true, canViewClients: true,
          canManageClients: true, canViewAnalytics: true, canManageServices: true,
          canManageChatbot: true, canManageTeam: true, canManageSettings: true,
        }
      }
    }
  });
  console.log("✔ Admin Created: admin@digitalpulse.agency / Password123!");

  // --- 2. STAFF USERS (3) ---
  const staffData = [
    { email: "alex.staff@digitalpulse.agency", first: "Alex", last: "Chen", title: "Senior Content Manager", dept: "Creative" },
    { email: "jordan.staff@digitalpulse.agency", first: "Jordan", last: "Smith", title: "PPC Specialist", dept: "Paid Media" },
    { email: "casey.staff@digitalpulse.agency", first: "Casey", last: "Lowe", title: "SEO Strategist", dept: "Search" },
  ];

  for (const s of staffData) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        passwordHash,
        firstName: s.first,
        lastName: s.last,
        role: "content_manager",
        status: "active",
        emailVerified: true,
        staffProfile: { create: { jobTitle: s.title, department: s.dept } },
        staffPermissions: {
          create: {
            canManagePortfolio: true, canManageBlog: true, canManageTestimonials: true,
            canViewEnquiries: true, canViewClients: true, canViewAnalytics: true,
          }
        }
      }
    });
    console.log(`✔ Staff Created: ${s.email} / Password123!`);
  }

  // --- 3. CLIENT USERS (12) ---
  const clientData = [
    { email: "client.retail@miller.com", first: "Sarah", last: "Miller", company: "Miller Retail Group", industry: "E-commerce", budget: 1500000 },
    { email: "client.saas@datasync.com", first: "Mark", last: "Zuck", company: "DataSync Pro", industry: "SaaS", budget: 2500000 },
    { email: "client.health@carewell.com", first: "Dr. Jane", last: "Goodall", company: "CareWell Health", industry: "Healthcare", budget: 800000 },
    { email: "client.realestate@prime.com", first: "Robert", last: "Kiyosaki", company: "Prime Properties", industry: "Real Estate", budget: 1200000 },
    { email: "client.edu@bright.com", first: "Elena", last: "Gilbert", company: "Bright Academy", industry: "Education", budget: 500000 },
    { email: "client.fin@wealth.com", first: "Warren", last: "Buffet", company: "Wealth Stream", industry: "Finance", budget: 3000000 },
    { email: "client.food@tasty.com", first: "Gordon", last: "Ramsay", company: "Tasty Bites", industry: "Food & Beverage", budget: 600000 },
    { email: "client.fit@pulse.com", first: "Chris", last: "Bumstead", company: "Pulse Fitness", industry: "Fitness", budget: 700000 },
    { email: "client.legal@justice.com", first: "Harvey", last: "Specter", company: "Pearson Hardman", industry: "Legal", budget: 2000000 },
    { email: "client.const@build.com", first: "Bob", last: "Builder", company: "BuildIt Corp", industry: "Construction", budget: 1800000 },
    { email: "client.travel@globe.com", first: "Marco", last: "Polo", company: "Globe Trotters", industry: "Travel", budget: 1000000 },
    { email: "client.fashion@vogue.com", first: "Anna", last: "Wintour", company: "Vogue Styles", industry: "Fashion", budget: 2200000 },
  ];

  const clients = [];
  for (const c of clientData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        passwordHash,
        firstName: c.first,
        lastName: c.last,
        role: "client",
        status: "active",
        emailVerified: true,
        clientProfile: {
          create: {
            companyName: c.company,
            industry: c.industry,
            monthlyBudgetPence: c.budget,
            websiteUrl: `https://www.${c.company.toLowerCase().replace(/\s/g, "")}.com`,
            accountManagerId: admin.id
          }
        }
      }
    });
    clients.push(user);
    console.log(`✔ Client Created: ${user.email} / Password123!`);
  }

  // --- 4. CAMPAIGNS & METRICS ---
  console.log("[Seed] Generating 1-year historical performance data...");
  
  const platforms = ["Google", "Facebook", "Instagram", "LinkedIn", "TikTok"];
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  for (const client of clients) {
    const campCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < campCount; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const campaign = await prisma.campaign.create({
        data: {
          clientId: client.id,
          name: `${platform} ${i % 2 === 0 ? "Growth" : "Awareness"} Q${Math.floor(i/2)+1}`,
          status: "live",
          startDate: oneYearAgo,
          totalBudgetPence: 500000 + Math.floor(Math.random() * 1000000),
          totalSpentPence: 400000 + Math.floor(Math.random() * 800000),
          objective: "Performance Marketing",
          platforms: { create: [{ platform, isActive: true }] },
          goals: {
            create: [
              { metricName: "Conversions", targetValue: 500, currentValue: 412, unit: "leads", period: "monthly", status: "on_track" },
            ]
          }
        }
      });

      const dailyMetrics = [];
      let baseImpressions = 5000 + Math.floor(Math.random() * 5000);
      for (let d = 0; d < 365; d++) {
        const date = new Date(oneYearAgo);
        date.setDate(date.getDate() + d);
        const growthFactor = 1 + (d / 365) * 0.5;
        const volatility = 0.8 + Math.random() * 0.4;
        const impressions = Math.floor(baseImpressions * growthFactor * volatility);
        const clicks = Math.floor(impressions * 0.03);
        const conversions = Math.floor(clicks * 0.08);
        const spendPence = Math.floor(impressions * 0.4);

        dailyMetrics.push({
          campaignId: campaign.id,
          platform: platform,
          metricDate: date,
          impressions,
          clicks,
          conversions,
          spendPence
        });
      }
      await prisma.campaignMetricsDaily.createMany({ data: dailyMetrics });
    }
  }

  // --- 5. BLOG POSTS ---
  const blogPosts = [];
  const blogCats = ["SEO", "Social Media", "PPC", "Content", "Branding"];
  for (let i = 1; i <= 15; i++) {
    blogPosts.push({
      title: `${blogCats[i % 5]} Trends for 2026: What You Need to Know`,
      slug: `marketing-trends-2026-${i}`,
      content: `<p>Digital marketing is evolving at a breakneck pace. As we look towards 2026, the integration of AI and hyper-personalization is no longer a luxury but a necessity for brand survival.</p><h2>The Shift to Conversational ROI</h2><p>Our data shows that 78% of customers prefer brands that provide immediate, value-driven interactions via automated channels.</p>`,
      excerpt: "Explore the most critical digital marketing shifts coming in 2026 and how to prepare your business.",
      status: "published",
      authorId: admin.id,
      category: blogCats[i % 5],
      featuredImageUrl: `https://picsum.photos/seed/blog${i}/1200/800`,
      readTimeMinutes: 5,
    });
  }
  await prisma.blogPost.createMany({ data: blogPosts });

  // --- 6. PORTFOLIO ITEMS ---
  const portCats = ["Social Media", "SEO", "Branding", "PPC", "Content Marketing"];
  for (let i = 1; i <= 8; i++) {
    const item = await prisma.portfolioItem.create({
      data: {
        title: `Growth Campaign for ${clients[i % clients.length].firstName}'s Project`,
        slug: `growth-campaign-${i}`,
        description: "A complete overhaul of digital presence leading to a 400% increase in lead volume within 6 months.",
        serviceCategory: portCats[i % 5],
        clientName: "Confidential Client",
        challengeText: "The client was struggling with high CAC and low organic visibility.",
        solutionText: "Implemented an integrated SEO and PPC strategy with automated lead scoring.",
        isFeatured: i <= 3,
        status: "published",
      }
    });

    await prisma.portfolioImage.create({
      data: {
        portfolioItemId: item.id,
        url: `https://picsum.photos/seed/port${i}/1200/800`,
        isFeatured: true,
        sortOrder: 0
      }
    });
  }

  // --- 7. INVOICES ---
  for (const client of clients) {
    for (let m = 0; m < 6; m++) {
      const date = new Date();
      date.setMonth(date.getMonth() - m);
      const subtotal = 200000 + Math.floor(Math.random() * 300000);
      const tax = Math.floor(subtotal * 0.2);
      await prisma.invoice.create({
        data: {
          clientId: client.id,
          invoiceNumber: `INV-${client.id.slice(0, 4)}-${1000 + m}`,
          issueDate: date,
          subtotalPence: subtotal,
          taxPence: tax,
          totalPence: subtotal + tax,
          status: m === 0 ? "sent" : "paid",
          dueDate: new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000),
          createdAt: date
        }
      });
    }
  }

  console.log("\n[Seed] Massive Seeding Complete!");

  // --- 8. NOTIFICATIONS ---
  console.log("[Seed] Generating initial notifications...");
  const notificationTypes = ["Lead", "Campaign", "System", "Invoice"];
  for (let i = 0; i < 5; i++) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        type: notificationTypes[i % 4],
        title: `New ${notificationTypes[i % 4]} Activity`,
        body: `System generated notification for ${notificationTypes[i % 4].toLowerCase()} related events.`,
        isRead: false
      }
    });
  }

  console.log("--------------------------------------------------");
  console.log("Admin:  admin@digitalpulse.agency / Password123!");
  console.log("Staff:  alex.staff@digitalpulse.agency / Password123!");
  console.log("12 Clients: e.g., client.retail@miller.com / Password123!");
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => { console.error("[Seed] Error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
