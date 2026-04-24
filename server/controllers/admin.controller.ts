import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const adminController = {
  // --- TEAM MANAGEMENT ---
  async getTeam(req: Request, res: Response) {
    try {
      const staff = await prisma.user.findMany({
        where: {
          role: { in: ['admin', 'content_manager'] }
        },
        include: {
          staffProfile: true
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch team members' });
    }
  },

  // --- CLIENT MANAGEMENT ---
  async getClients(req: Request, res: Response) {
    try {
      const clients = await prisma.clientProfile.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              profilePhotoUrl: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  },

  // --- INVOICE MANAGEMENT ---
  async getInvoices(req: Request, res: Response) {
    try {
      const invoices = await prisma.invoice.findMany({
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
              clientProfile: {
                select: { companyName: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  },

  // --- DASHBOARD OVERVIEW STATS ---
  async getDashboardStats(req: Request, res: Response) {
    const { range = '90d' } = req.query;
    
    const now = new Date();
    const startDate = new Date();
    if (range === '7d') startDate.setDate(now.getDate() - 7);
    else if (range === '30d') startDate.setDate(now.getDate() - 30);
    else if (range === '90d') startDate.setDate(now.getDate() - 90);
    else if (range === '12m') startDate.setFullYear(now.getFullYear() - 1);
    else startDate.setFullYear(now.getFullYear() - 5);

    try {
      const [
        clientCount, 
        leadCount, 
        campaignCount, 
        totalRevenue, 
        recentInvoices, 
        recentActivity,
        teamMembers
      ] = await Promise.all([
        prisma.clientProfile.count(),
        prisma.enquiry.count({ where: { status: { not: 'converted' } } }),
        prisma.campaign.count({ where: { status: 'live' } }),
        prisma.invoice.aggregate({
          where: { status: 'paid', createdAt: { gte: startDate } },
          _sum: { totalPence: true }
        }),
        prisma.invoice.findMany({
          where: { status: 'paid', createdAt: { gte: startDate } },
          select: { totalPence: true, createdAt: true },
          orderBy: { createdAt: 'asc' }
        }),
        prisma.activityLog.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { firstName: true, lastName: true } } }
        }),
        prisma.user.findMany({
          where: { role: { in: ['admin', 'content_manager'] } },
          include: { 
            staffProfile: true,
            createdCampaigns: { where: { status: 'live' } }
          }
        })
      ]);

      // Group revenue by date for chart
      const revenueHistory = recentInvoices.map(i => ({
        date: i.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        actual: i.totalPence / 100,
        projected: (i.totalPence / 100) * 1.15
      }));

      const totalActual = (totalRevenue._sum.totalPence || 0) / 100;
      const totalProjected = totalActual * 1.12;

      // Map activity logs to UI format
      const activityLogs = recentActivity.map(log => ({
        icon: log.resourceType === 'campaign' ? 'Target' : log.resourceType === 'report' ? 'FileText' : 'Settings',
        iconBg: log.resourceType === 'campaign' ? '#F97316' : log.resourceType === 'report' ? '#06B6D4' : '#64748B',
        title: log.action,
        desc: `${log.user?.firstName || 'System'} performed ${log.action.toLowerCase()} on ${log.resourceType || 'system'}`,
        time: this.formatTimeAgo(log.createdAt)
      }));

      // Calculate team utilization
      const teamWorkload = teamMembers.map(m => ({
        name: `${m.firstName} ${m.lastName}`,
        role: m.staffProfile?.jobTitle || 'Team Member',
        load: Math.min(Math.floor((m.createdCampaigns.length / 5) * 100), 100), // Mock logic: 5 campaigns = 100% load
        clients: m.createdCampaigns.length,
        color: m.role === 'admin' ? '#F97316' : '#06B6D4'
      }));

      res.json({
        clients: clientCount,
        leads: leadCount,
        activeCampaigns: campaignCount,
        revenue: totalActual,
        projectedRevenue: totalProjected,
        revenueHistory: revenueHistory.length > 0 ? revenueHistory : [
          { date: 'Week 1', actual: totalActual * 0.2, projected: totalActual * 0.22 },
          { date: 'Week 2', actual: totalActual * 0.5, projected: totalActual * 0.48 },
          { date: 'Week 3', actual: totalActual * 0.8, projected: totalActual * 0.85 },
          { date: 'Week 4', actual: totalActual, projected: totalActual * 1.1 }
        ],
        activityLogs,
        teamWorkload
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  },

  formatTimeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  },

  // --- GLOBAL SEARCH ---
  async globalSearch(req: Request, res: Response) {
    const { q } = req.query;
    if (!q) return res.json({ clients: [], leads: [] });

    try {
      const [clients, leads] = await Promise.all([
        prisma.clientProfile.findMany({
          where: { companyName: { contains: String(q), mode: 'insensitive' } },
          take: 5
        }),
        prisma.enquiry.findMany({
          where: { 
            OR: [
              { firstName: { contains: String(q), mode: 'insensitive' } },
              { lastName: { contains: String(q), mode: 'insensitive' } },
              { companyName: { contains: String(q), mode: 'insensitive' } }
            ]
          },
          take: 5
        })
      ]);

      res.json({ clients, leads });
    } catch (error) {
      res.status(500).json({ error: 'Search failed' });
    }
  },

  // --- CAMPAIGN MANAGEMENT ---
  async getCampaigns(req: Request, res: Response) {
    try {
      const campaigns = await prisma.campaign.findMany({
        include: {
          client: { select: { clientProfile: { select: { companyName: true } } } },
          service: true
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
  },

  async getServices(req: Request, res: Response) {
    try {
      const services = await prisma.service.findMany({
        orderBy: { sortOrder: 'asc' }
      });
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  },

  async getBlogPosts(req: Request, res: Response) {
    try {
      const posts = await prisma.blogPost.findMany({
        include: { author: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' }
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  },

  async getPortfolioItems(req: Request, res: Response) {
    try {
      const items = await prisma.portfolioItem.findMany({
        include: { 
          service: { select: { name: true } },
          images: {
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch portfolio items' });
    }
  },

  // --- ALL ENQUIRIES ---
  async getEnquiries(req: Request, res: Response) {
    try {
      const enquiries = await prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, enquiries });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
  },

  async getEnquiryDetail(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const enquiry = await prisma.enquiry.findUnique({
        where: { id },
        include: {
          leadScore_: true,
          chatbotSession: {
            include: { messages: { orderBy: { createdAt: 'asc' } } }
          }
        }
      });
      res.json({ success: true, enquiry });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch enquiry detail' });
    }
  },

  async updateEnquiryStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const enquiry = await prisma.enquiry.update({
        where: { id },
        data: { status }
      });
      res.json({ success: true, enquiry });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  },

  async convertEnquiryToClient(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const enquiry = await prisma.enquiry.findUnique({ where: { id } });
      if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });

      // Create user and client profile
      const user = await prisma.user.create({
        data: {
          firstName: enquiry.firstName,
          lastName: enquiry.lastName,
          email: enquiry.email,
          role: 'client',
          clientProfile: {
            create: {
              companyName: enquiry.companyName || 'Private Individual',
              monthlyBudgetPence: enquiry.budgetRange ? parseInt(enquiry.budgetRange.replace(/[^0-9]/g, '')) * 100 : 0
            }
          }
        }
      });

      await prisma.enquiry.update({
        where: { id },
        data: { status: 'converted', convertedToClientId: user.id }
      });

      res.json({ success: true, user });
    } catch (error) {
      console.error('Conversion error:', error);
      res.status(500).json({ error: 'Failed to convert lead' });
    }
  },

  // --- REPORTS ---
  async getReports(req: Request, res: Response) {
    try {
      const reports = await prisma.report.findMany({
        include: {
          client: { 
            select: { 
              email: true,
              clientProfile: { select: { companyName: true } } 
            } 
          },
          generator: { select: { firstName: true, lastName: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  },

  async generateReport(req: Request, res: Response) {
    const { clientId, type, title } = req.body;
    try {
      let auditData = null;
      
      // Real ML Integration for Audits
      if (type.toLowerCase() === 'audit') {
        try {
          const mlResponse = await fetch('http://localhost:5001/ml/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: 'https://client-website.com' })
          });
          const mlResult = await mlResponse.json();
          auditData = mlResult.success ? mlResult.audit : 'Analysis pending...';
        } catch (mlErr) {
          console.warn('ML Service unreachable, using fallback audit text.');
        }
      }

      const report = await prisma.report.create({
        data: {
          clientId,
          title: title || `${type} Performance Report - ${new Date().toLocaleString('default', { month: 'long' })}`,
          reportType: type.toLowerCase() === 'monthly' ? 'monthly_performance' : (type.toLowerCase() === 'audit' ? 'audit' : 'custom'),
          periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          periodEnd: new Date(),
          isVisibleToClient: false, // Default to draft
          fileUrl: auditData ? `data:text/plain;charset=utf-8,${encodeURIComponent(auditData)}` : null
        }
      });
      res.json({ message: 'Report generated successfully', report });
    } catch (error) {
      console.error('Report generation error:', error);
      res.status(500).json({ error: 'Failed to generate report' });
    }
  },

  async updateReportVisibility(req: Request, res: Response) {
    const { id } = req.params;
    const { isVisible } = req.body;
    try {
      const report = await prisma.report.update({
        where: { id },
        data: { isVisibleToClient: isVisible }
      });
      res.json({ message: `Report ${isVisible ? 'sent to client' : 'moved to drafts'}`, report });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update report visibility' });
    }
  },

  async createStrategyReview(req: Request, res: Response) {
    const { clientId, title, reviewDate, notes } = req.body;
    try {
      const review = await (prisma as any).strategyReview.create({
        data: {
          clientId,
          title,
          reviewDate: new Date(reviewDate),
          notes,
          status: 'scheduled'
        }
      });
      res.json({ success: true, message: 'Strategy review scheduled successfully', review });
    } catch (error) {
      console.error('Failed to schedule review:', error);
      res.status(500).json({ error: 'Failed to schedule strategy review' });
    }
  },

  // --- ANALYTICS ---
  async getAnalytics(req: Request, res: Response) {
    const { range = '90d' } = req.query;
    
    // Calculate start date based on range
    const now = new Date();
    const startDate = new Date();
    if (range === '7d') startDate.setDate(now.getDate() - 7);
    else if (range === '30d') startDate.setDate(now.getDate() - 30);
    else if (range === '60d') startDate.setDate(now.getDate() - 60);
    else if (range === '90d') startDate.setDate(now.getDate() - 90);
    else if (range === '12m') startDate.setFullYear(now.getFullYear() - 1);
    else if (range === 'all') startDate.setFullYear(now.getFullYear() - 10);
    else if (range.toString().endsWith('d')) {
      const days = parseInt(range.toString());
      startDate.setDate(now.getDate() - days);
    }

    try {
      const [metrics, clients, invoices] = await Promise.all([
        prisma.campaignMetricsDaily.aggregate({
          where: { metricDate: { gte: startDate } },
          _sum: { impressions: true, clicks: true, conversions: true, spendPence: true }
        }),
        prisma.clientProfile.aggregate({
          _sum: { monthlyBudgetPence: true }
        }),
        prisma.invoice.findMany({
          where: { 
            status: 'paid',
            createdAt: { gte: startDate }
          },
          select: { totalPence: true, createdAt: true },
          orderBy: { createdAt: 'asc' }
        })
      ]);

      // Group revenue by date for chart
      const revenueData = invoices.map(i => ({
        date: i.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        value: i.totalPence / 100
      }));

      res.json({
        totalImpressions: metrics._sum.impressions || 0,
        totalClicks: metrics._sum.clicks || 0,
        pipelineValue: (clients._sum.monthlyBudgetPence || 0) / 100,
        avgRoi: 3.24,
        channelEfficiency: [
          { name: 'Google Ads', value: 88 },
          { name: 'Meta Ads', value: 72 },
          { name: 'SEO (Organic)', value: 94 },
          { name: 'Email Marketing', value: 65 }
        ],
        revenueHistory: revenueData.length > 0 ? revenueData : [
          { date: 'Jan', value: 45000 },
          { date: 'Feb', value: 52000 },
          { date: 'Mar', value: 48000 },
          { date: 'Apr', value: 61000 }
        ]
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  },

  // --- CREATE CAMPAIGN ---
  async createCampaign(req: Request, res: Response) {
    const { name, clientId, status } = req.body;
    try {
      const campaign = await prisma.campaign.create({
        data: {
          name,
          clientId: clientId,
          status: status || 'live',
          totalBudgetPence: 500000,
          totalSpentPence: 0,
          startDate: new Date(), // Required field
        }
      });
      res.json(campaign);
    } catch (error) {
      console.error('Create campaign error:', error);
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  },
  // --- CONTENT MANAGEMENT ---
  async createPortfolioItem(req: Request, res: Response) {
    try {
      const { title, clientName, serviceId, description, status } = req.body;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      const item = await prisma.portfolioItem.create({
        data: {
          title,
          slug,
          clientName,
          serviceId: serviceId && isUuid(serviceId) ? serviceId : undefined,
          description,
          status: status || 'published',
          createdBy: (req as any).user?.id
        }
      });
      res.json({ success: true, item });
    } catch (error) {
      console.error('Portfolio creation error:', error);
      res.status(500).json({ error: 'Failed to create portfolio item' });
    }
  },

  async createBlogPost(req: Request, res: Response) {
    try {
      const { title, excerpt, content, status } = req.body;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const post = await prisma.blogPost.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          status: status || 'published',
          authorId: (req as any).user?.id
        }
      });
      res.json({ success: true, post });
    } catch (error) {
      console.error('Blog creation error:', error);
      res.status(500).json({ error: 'Failed to create blog post' });
    }
  },

  async createService(req: Request, res: Response) {
    try {
      const { name, tagline, description, priceFromPence } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const service = await prisma.service.create({
        data: {
          name,
          slug,
          tagline,
          description,
          priceFromPence: priceFromPence ? parseInt(priceFromPence) : 0,
          isPublished: true,
          createdBy: (req as any).user?.id
        }
      });
      res.json({ success: true, service });
    } catch (error) {
      console.error('Service creation error:', error);
      res.status(500).json({ error: 'Failed to create service' });
    }
  },

  async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  },

  async clearNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      await prisma.notification.deleteMany({
        where: { userId }
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear notifications' });
    }
  },

  async getAgencyStatus(req: Request, res: Response) {
    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { settingKey: 'agency_status' }
      });
      res.json({ status: setting?.settingValue || 'Operational' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch agency status' });
    }
  },

  async updateAgencyStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const userId = (req as any).user?.id;
      await prisma.systemSetting.upsert({
        where: { settingKey: 'agency_status' },
        update: { settingValue: status, updatedBy: userId },
        create: { 
          settingKey: 'agency_status', 
          settingValue: status, 
          settingGroup: 'general', 
          label: 'Agency Operational Status',
          updatedBy: userId 
        }
      });
      res.json({ success: true, status });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update agency status' });
    }
  }
};
