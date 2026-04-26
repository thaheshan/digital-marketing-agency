import { Role } from '@prisma/client';
import prisma from '../db/prisma';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Cleaning up existing data...');
  try {
    const tableNames = await prisma.$queryRaw<Array<{ tablename: string }>>`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
    const tables = tableNames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');
    if (tables.length > 0) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    }
  } catch (error) {
    console.error('Failed to truncate tables:', error);
  }

  console.log('Seeding massive 2-year enterprise data...');
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // --- 1. STAFF & ADMINS (6+) ---
  const staffData = [
    { email: 'priya@digitalpulse.agency', f: 'Priya', l: 'Nanthakumar', role: Role.admin, job: 'Agency Owner', dept: 'Leadership' },
    { email: 'alex@digitalpulse.agency', f: 'Alex', l: 'Chen', role: Role.staff, job: 'SEO Specialist', dept: 'Marketing' },
    { email: 'jordan@digitalpulse.agency', f: 'Jordan', l: 'Smith', role: Role.staff, job: 'PPC Lead', dept: 'Advertising' },
    { email: 'sarah@digitalpulse.agency', f: 'Sarah', l: 'Jenkins', role: Role.staff, job: 'Content Manager', dept: 'Content' },
    { email: 'michael@digitalpulse.agency', f: 'Michael', l: 'Ross', role: Role.staff, job: 'Account Manager', dept: 'Client Success' },
    { email: 'emily@digitalpulse.agency', f: 'Emily', l: 'Wong', role: Role.admin, job: 'Operations Director', dept: 'Leadership' }
  ];

  const staffUsers = [];
  for (const s of staffData) {
    const user = await prisma.user.create({
      data: {
        email: s.email, passwordHash, role: s.role, firstName: s.f, lastName: s.l, status: 'active', emailVerified: true,
        staffProfile: { create: { jobTitle: s.job, department: s.dept } },
        staffPermissions: {
          create: {
            canManagePortfolio: s.role === Role.admin, canManageBlog: true, canManageTestimonials: s.role === Role.admin,
            canViewEnquiries: true, canManageEnquiries: s.role === Role.admin, canViewClients: true,
            canManageClients: s.role === Role.admin, canViewAnalytics: true, canManageServices: s.role === Role.admin,
            canManageChatbot: s.role === Role.admin, canManageTeam: s.role === Role.admin, canManageSettings: s.role === Role.admin
          }
        }
      }
    });
    staffUsers.push(user);
  }
  const adminId = staffUsers[0].id;

  // --- 2. CLIENTS (10+) ---
  const clientData = [
    { email: 'thaheshan@futura.com', f: 'Thaheshan', l: 'Suresh', company: 'Futura Systems', industry: 'Technology' },
    { email: 'john@vertex.io', f: 'John', l: 'Doe', company: 'Vertex IO', industry: 'SaaS' },
    { email: 'jane@ecommerce.net', f: 'Jane', l: 'Smith', company: 'Eco Store', industry: 'Retail' },
    { email: 'mark@buildright.com', f: 'Mark', l: 'Johnson', company: 'BuildRight', industry: 'Construction' },
    { email: 'lisa@medcare.org', f: 'Lisa', l: 'Williams', company: 'MedCare Clinics', industry: 'Healthcare' },
    { email: 'david@fintech.co', f: 'David', l: 'Brown', company: 'FinTech Solutions', industry: 'Finance' },
    { email: 'emma@fashionhub.com', f: 'Emma', l: 'Davis', company: 'Fashion Hub', industry: 'Apparel' },
    { email: 'robert@logistics.com', f: 'Robert', l: 'Miller', company: 'Global Logistics', industry: 'Transport' },
    { email: 'olivia@eduplatform.com', f: 'Olivia', l: 'Wilson', company: 'EduPlatform', industry: 'Education' },
    { email: 'william@greenenergy.com', f: 'William', l: 'Moore', company: 'Green Energy', industry: 'Energy' },
    { email: 'sophia@realestate.com', f: 'Sophia', l: 'Taylor', company: 'Prime Real Estate', industry: 'Real Estate' }
  ];

  const clientUsers = [];
  for (const c of clientData) {
    const user = await prisma.user.create({
      data: {
        email: c.email, passwordHash, role: Role.client, firstName: c.f, lastName: c.l, status: 'active', emailVerified: true,
        clientProfile: {
          create: { companyName: c.company, industry: c.industry, monthlyBudgetPence: 500000 + Math.floor(Math.random() * 500000), accountManagerId: adminId }
        }
      }
    });
    clientUsers.push(user);
  }

  // --- 3. CAMPAIGNS & METRICS (2 YEARS) ---
  console.log('Generating Campaigns and 2 Years of Metrics...');
  const metricsData = [];
  const campaigns = [];
  
  for (const client of clientUsers) {
    // 2 campaigns per client
    for (let cNum = 1; cNum <= 2; cNum++) {
      const isSEO = cNum === 2;
      const campaign = await prisma.campaign.create({
        data: {
          clientId: client.id, name: isSEO ? `${client.firstName} SEO Growth` : `${client.firstName} PPC Ads`,
          status: 'live', totalBudgetPence: isSEO ? 0 : 1500000, totalSpentPence: isSEO ? 0 : 800000 + Math.floor(Math.random() * 400000),
          startDate: new Date(Date.now() - 730 * 86400000), createdBy: staffUsers[Math.floor(Math.random() * 5) + 1].id,
          platforms: { create: [{ platform: isSEO ? 'Organic' : 'Google', isActive: true }] }
        }
      });
      campaigns.push(campaign);

      // 730 days (2 years) of metrics
      for (let i = 0; i < 730; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        metricsData.push({
          campaignId: campaign.id,
          platform: isSEO ? 'Organic' : 'Google',
          metricDate: d,
          impressions: Math.floor(Math.random() * 10000) + 1000,
          clicks: Math.floor(Math.random() * 1000) + 50,
          conversions: Math.floor(Math.random() * 20) + 1,
          spendPence: isSEO ? 0 : Math.floor(Math.random() * 20000) + 5000,
          reach: Math.floor(Math.random() * 5000) + 500,
        });
      }
    }
  }

  // Batch insert metrics
  const batchSize = 5000;
  for (let i = 0; i < metricsData.length; i += batchSize) {
    await prisma.campaignMetricsDaily.createMany({ data: metricsData.slice(i, i + batchSize) });
  }

  // --- 4. INVOICES (2 YEARS) ---
  console.log('Generating 24 Months of Invoices...');
  const invoicesData = [];
  for (const client of clientUsers) {
    for (let i = 0; i < 24; i++) {
      const issue = new Date(Date.now() - i * 30 * 86400000);
      const due = new Date(issue.getTime() + 14 * 86400000);
      const paid = i > 0 ? new Date(due.getTime() - 2 * 86400000) : null;
      const amount = 300000 + Math.floor(Math.random() * 200000); // Between £3k and £5k
      invoicesData.push({
        clientId: client.id, invoiceNumber: `INV-${client.firstName.toUpperCase().slice(0,3)}-${String(24-i).padStart(3, '0')}`,
        issueDate: issue, dueDate: due, paymentDate: paid, subtotalPence: amount, totalPence: amount,
        status: paid ? 'paid' : 'sent', createdBy: adminId
      });
    }
  }
  await prisma.invoice.createMany({ data: invoicesData });

  // --- 5. ENQUIRIES (15 realistic leads) ---
  await prisma.enquiry.createMany({
    data: [
      { firstName: 'James', lastName: 'Okoro', email: 'james@techflowsaas.com', companyName: 'TechFlow SaaS', phone: '+44 7700 900001', serviceInterest: ['SEO', 'PPC'], budgetRange: '£5,000–£10,000/mo', message: 'Looking to scale our organic traffic and run Google Ads for Q3 launch.', status: 'new', leadScore: 95, leadTemperature: 'hot', assignedTo: adminId, createdAt: new Date(Date.now() - 10 * 60000) },
      { firstName: 'Sarah', lastName: 'Thompson', email: 'sarah@glowskincare.co.uk', companyName: 'Glow Skincare', phone: '+44 7700 900002', serviceInterest: ['Social Media', 'Email Marketing'], budgetRange: '£2,000–£4,000/mo', message: 'We need a complete social media overhaul and email newsletter strategy.', status: 'new', leadScore: 88, leadTemperature: 'hot', assignedTo: staffUsers[1].id, createdAt: new Date(Date.now() - 60 * 60000) },
      { firstName: 'Robert', lastName: 'Chen', email: 'robert@zenithlogistics.com', companyName: 'Zenith Logistics', phone: '+44 7700 900003', serviceInterest: ['SEO', 'Content Marketing'], budgetRange: '£8,000+/mo', message: 'Our website gets almost no organic traffic. We need a full SEO audit and content strategy.', status: 'new', leadScore: 75, leadTemperature: 'hot', assignedTo: staffUsers[2].id, createdAt: new Date(Date.now() - 3 * 3600000) },
      { firstName: 'Emma', lastName: 'Wilson', email: 'emma@novafashion.co', companyName: 'Nova Fashion', phone: '+44 7700 900004', serviceInterest: ['Social Media', 'Influencer Marketing'], budgetRange: '£3,000–£6,000/mo', message: 'Looking to build brand awareness through Instagram and TikTok.', status: 'new', leadScore: 82, leadTemperature: 'hot', assignedTo: adminId, createdAt: new Date(Date.now() - 5 * 3600000) },
      { firstName: 'Michael', lastName: 'Davies', email: 'michael@proptechlabs.io', companyName: 'PropTech Labs', phone: '+44 7700 900005', serviceInterest: ['PPC', 'LinkedIn Ads'], budgetRange: '£10,000+/mo', message: 'We need B2B lead generation via LinkedIn and Google. Enterprise budget available.', status: 'contacted', leadScore: 91, leadTemperature: 'hot', assignedTo: staffUsers[1].id, createdAt: new Date(Date.now() - 1 * 86400000) },
      { firstName: 'Charlotte', lastName: 'Evans', email: 'charlotte@brightlawfirm.com', companyName: 'Bright Law Firm', phone: '+44 7700 900006', serviceInterest: ['SEO', 'PPC'], budgetRange: '£4,000–£7,000/mo', message: 'We compete in a very saturated legal market. Need local SEO and Google Ads.', status: 'contacted', leadScore: 70, leadTemperature: 'warm', assignedTo: staffUsers[3].id, createdAt: new Date(Date.now() - 2 * 86400000) },
      { firstName: 'Oliver', lastName: 'Murphy', email: 'oliver@irishbrewery.ie', companyName: 'Murphy Brewery', phone: '+44 7700 900007', serviceInterest: ['Social Media', 'Content Marketing'], budgetRange: '£1,500–£3,000/mo', message: 'Small craft brewery. Want to grow local awareness and online shop sales.', status: 'contacted', leadScore: 58, leadTemperature: 'warm', assignedTo: staffUsers[4].id, createdAt: new Date(Date.now() - 3 * 86400000) },
      { firstName: 'Ava', lastName: 'Harrison', email: 'ava@luxuryhotels.com', companyName: 'Harrison Luxury Hotels', phone: '+44 7700 900008', serviceInterest: ['SEO', 'PPC', 'Social Media'], budgetRange: '£15,000+/mo', message: 'Premium hotel group. Seeking a full-service digital marketing partner.', status: 'qualified', leadScore: 97, leadTemperature: 'hot', assignedTo: adminId, createdAt: new Date(Date.now() - 4 * 86400000) },
      { firstName: 'Liam', lastName: 'Foster', email: 'liam@greengadgets.com', companyName: 'Green Gadgets', phone: '+44 7700 900009', serviceInterest: ['Email Marketing', 'PPC'], budgetRange: '£2,000–£3,500/mo', message: 'Eco-friendly electronics brand looking to grow our customer base.', status: 'qualified', leadScore: 65, leadTemperature: 'warm', assignedTo: staffUsers[2].id, createdAt: new Date(Date.now() - 5 * 86400000) },
      { firstName: 'Isabella', lastName: 'Scott', email: 'isabella@scottarchitects.co.uk', companyName: 'Scott Architects', phone: '+44 7700 900010', serviceInterest: ['SEO', 'Portfolio Website'], budgetRange: '£1,000–£2,000/mo', message: 'Architecture firm seeking better online presence. Interested in SEO.', status: 'new', leadScore: 50, leadTemperature: 'warm', assignedTo: staffUsers[3].id, createdAt: new Date(Date.now() - 6 * 86400000) },
      { firstName: 'Noah', lastName: 'Baker', email: 'noah@bakerfitness.com', companyName: 'Baker Fitness', phone: '+44 7700 900011', serviceInterest: ['Social Media', 'Email Marketing'], budgetRange: '£500–£1,500/mo', message: 'Personal trainer looking to grow online coaching client base.', status: 'new', leadScore: 38, leadTemperature: 'cold', assignedTo: staffUsers[4].id, createdAt: new Date(Date.now() - 7 * 86400000) },
      { firstName: 'Mia', lastName: 'Clark', email: 'mia@pettreats.co.uk', companyName: 'Paws & Treats', phone: '+44 7700 900012', serviceInterest: ['SEO', 'Google Shopping'], budgetRange: '£2,500–£4,000/mo', message: 'Pet food e-commerce store. Struggling with Google Shopping performance.', status: 'new', leadScore: 72, leadTemperature: 'warm', assignedTo: staffUsers[1].id, createdAt: new Date(Date.now() - 8 * 86400000) },
      { firstName: 'Ethan', lastName: 'Hughes', email: 'ethan@autoshowrooms.com', companyName: 'Premier Auto', phone: '+44 7700 900013', serviceInterest: ['PPC', 'SEO'], budgetRange: '£6,000–£12,000/mo', message: 'Car dealership group with 4 locations. Need local SEO and PPC across all sites.', status: 'contacted', leadScore: 85, leadTemperature: 'hot', assignedTo: adminId, createdAt: new Date(Date.now() - 9 * 86400000) },
      { firstName: 'Sophie', lastName: 'Price', email: 'sophie@naturalbeautyco.com', companyName: 'Natural Beauty Co', phone: '+44 7700 900014', serviceInterest: ['Social Media', 'Influencer Marketing', 'Email Marketing'], budgetRange: '£3,000–£5,000/mo', message: 'Natural cosmetics brand. Want to grow through influencer partnerships.', status: 'new', leadScore: 79, leadTemperature: 'warm', assignedTo: staffUsers[3].id, createdAt: new Date(Date.now() - 10 * 86400000) },
      { firstName: 'William', lastName: 'Young', email: 'william@techventures.io', companyName: 'Tech Ventures VC', phone: '+44 7700 900015', serviceInterest: ['Content Marketing', 'LinkedIn Ads'], budgetRange: '£8,000+/mo', message: 'VC firm looking to establish thought leadership in the UK tech ecosystem.', status: 'qualified', leadScore: 89, leadTemperature: 'hot', assignedTo: adminId, createdAt: new Date(Date.now() - 11 * 86400000) },
    ]
  });

  // --- 6. ACTIVITY LOGS ---
  console.log('Generating Activity Logs...');
  await prisma.activityLog.createMany({
    data: [
      { userId: adminId, portal: 'system', action: 'Massive dataset initialized', resourceType: 'system', createdAt: new Date() },
      { userId: staffUsers[1].id, portal: 'staff', action: 'Generated quarterly report for Futura', resourceType: 'report', createdAt: new Date(Date.now() - 3600000) },
      { userId: clientUsers[0].id, portal: 'client', action: 'Downloaded latest invoice', resourceType: 'invoice', createdAt: new Date(Date.now() - 7200000) }
    ]
  });

  console.log('Massive 2-Year Enterprise Seeding Complete!');
  console.log('--- CREDENTIALS ---');
  console.log('Passwords for everyone: Password123!');
  console.log('Admin: priya@digitalpulse.agency');
  console.log('Staff: alex@digitalpulse.agency');
  console.log('Client 1: thaheshan@futura.com');
  console.log('Client 2: john@vertex.io');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
