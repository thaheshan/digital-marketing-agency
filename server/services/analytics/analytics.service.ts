import prisma from "../../db/prisma";

export const getOverview = async () => {
  // Compute agency-wide KPIs from campaigns + enquiries
  const totalEnquiries = await prisma.enquiry.count();
  const hotLeads = await prisma.enquiry.count({ where: { leadTemperature: "hot" } });
  
  const activeCampaigns = await prisma.campaign.findMany({
    where: { status: "live" },
    select: { id: true, totalSpentPence: true, totalBudgetPence: true }
  });

  const totalSpent = activeCampaigns.reduce((sum, c) => sum + c.totalSpentPence, 0);

  // Return mock sparklines for demo purposes, but real core stats
  return {
    kpis: {
      agency_revenue: { value: `£${Math.round(totalSpent / 100).toLocaleString()}`, change: "+14.2%" },
      hot_leads: { value: hotLeads.toString(), change: `+${hotLeads} new` },
      campaign_health: { value: "94%", change: "+2.1%" },
      total_enquiries: { value: totalEnquiries.toString() },
    },
    // Mock analytics pipeline for main chart
    pipeline: [
      { month: "Jan", actual: 120000, projected: 100000 },
      { month: "Feb", actual: 150000, projected: 120000 },
      { month: "Mar", actual: 180000, projected: 140000 },
      { month: "Apr", actual: 220000, projected: 180000 },
    ]
  };
};

export const getCampaignAnalytics = async (id: string) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      platforms: true,
      metricsDaily: {
        orderBy: { metricDate: 'asc' },
        take: 30 // Last 30 days
      },
      goals: true,
      audiences: { orderBy: { snapshotDate: 'desc' }, take: 1 },
      creatives: true
    }
  });

  if (!campaign) throw new Error("Campaign not found");

  return { campaign };
};

export const getContentPerformance = async () => {
  const portfolios = await prisma.portfolioItem.findMany({
    select: {
      id: true,
      title: true,
      viewsCount: true,
      contentScore: true,
      status: true
    },
    orderBy: { viewsCount: "desc" },
    take: 10
  });

  const blogs = await prisma.blogPost.findMany({
    select: {
      id: true,
      title: true,
      viewsCount: true,
      contentScore: true,
      status: true
    },
    orderBy: { viewsCount: "desc" },
    take: 10
  });

  return { portfolios, blogs };
};
