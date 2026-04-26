import { Request, Response, NextFunction } from "express";
import * as portalService from "../services/portal/portal.service";
import { z } from "zod";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

const createStaffSchema = z.object({
  firstName:   z.string().min(1).max(100),
  lastName:    z.string().min(1).max(100),
  email:       z.string().email(),
  role:        z.enum(["staff"]),
  department:  z.string().optional(),
  jobTitle:    z.string().optional(),
  phone:       z.string().optional(),
});

const createClientSchema = z.object({
  firstName:          z.string().min(1).max(100),
  lastName:           z.string().min(1).max(100),
  email:              z.string().email(),
  phone:              z.string().optional(),
  companyName:        z.string().min(1),
  industry:           z.string().optional(),
  companySize:        z.string().optional(),
  websiteUrl:         z.string().optional(),
  monthlyBudgetPence: z.number().optional(),
  notes:              z.string().optional(),
  accountManagerId:   z.string().uuid().optional(),
});

const updatePermissionsSchema = z.object({
  canManagePortfolio:    z.boolean().optional(),
  canManageBlog:         z.boolean().optional(),
  canManageTestimonials: z.boolean().optional(),
  canViewEnquiries:      z.boolean().optional(),
  canManageEnquiries:    z.boolean().optional(),
  canViewClients:        z.boolean().optional(),
  canManageClients:      z.boolean().optional(),
  canViewAnalytics:      z.boolean().optional(),
  canManageServices:     z.boolean().optional(),
  canManageChatbot:      z.boolean().optional(),
  canManageTeam:         z.boolean().optional(),
  canManageSettings:     z.boolean().optional(),
});

export const createStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input    = createStaffSchema.parse(req.body);
    const adminId  = (req as Request & { userId?: string }).userId!;
    const result   = await portalService.createStaff(input, adminId);
    ok(res, result, 201);
  } catch (e) { err(next, e); }
};

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input   = createClientSchema.parse(req.body);
    const adminId = (req as Request & { userId?: string }).userId!;
    const result  = await portalService.createClient(input, adminId);
    ok(res, result, 201);
  } catch (e) { err(next, e); }
};

export const getAllStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const staff = await portalService.getAllStaff();
    ok(res, { staff });
  } catch (e) { err(next, e); }
};

export const getAllClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await portalService.getAllClients();
    ok(res, { clients });
  } catch (e) { err(next, e); }
};

export const updatePermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const permissions = updatePermissionsSchema.parse(req.body);
    const result = await portalService.updateStaffPermissions(userId as string, permissions);
    ok(res, result);
  } catch (e) { err(next, e); }
};

export const getClientDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { from, to } = req.query;
    const dashboard = await portalService.getClientDashboard(userId, from as string, to as string);
    ok(res, dashboard);
  } catch (e) { err(next, e); }
};

export const getClientCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const campaigns = await portalService.getClientCampaigns(userId);
    ok(res, { campaigns });
  } catch (e) { err(next, e); }
};

export const getClientGoals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const goals = await portalService.getClientGoals(userId);
    ok(res, { goals });
  } catch (e) { err(next, e); }
};

export const getClientReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const reports = await portalService.getClientReports(userId);
    ok(res, { reports });
  } catch (e) { err(next, e); }
};

export const getClientCampaignData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const campaign = await portalService.getClientCampaignData(userId, req.params.id as string);
    ok(res, { campaign });
  } catch (e) { err(next, e); }
};

export const getClientAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { from, to } = req.query;
    const analytics = await portalService.getClientAnalytics(userId, from as string, to as string);
    ok(res, { analytics });
  } catch (e) { err(next, e); }
};
const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName:  z.string().min(1).max(100).optional(),
  phone:      z.string().optional(),
  websiteUrl: z.string().optional(),
});

export const updateClientProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const input = updateProfileSchema.parse(req.body);
    const result = await portalService.updateClientProfile(userId, input);
    ok(res, { message: "Profile updated successfully", user: result });
  } catch (e) { err(next, e); }
};

export const getSupportTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const tickets = await portalService.getSupportTickets(userId);
    ok(res, { tickets });
  } catch (e) { err(next, e); }
};

const createTicketSchema = z.object({
  subject:  z.string().min(5),
  category: z.string().min(2),
  message:  z.string().min(10),
});

export const createSupportTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const input = createTicketSchema.parse(req.body);
    const ticket = await portalService.createSupportTicket(userId, input);
    ok(res, { message: "Ticket created successfully", ticket }, 201);
  } catch (e) { err(next, e); }
};

// --- PORTAL SEARCH ---
export const portalSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const q = (req.query.q as string) || '';
    if (q.trim().length < 2) { res.json({ results: [] }); return; }

    const prisma = (await import('../db/prisma')).default;
    const [campaigns, reports] = await Promise.all([
      prisma.campaign.findMany({
        where: {
          clientId: userId,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { objective: { contains: q, mode: 'insensitive' } },
          ]
        },
        select: { id: true, name: true, status: true },
        take: 5,
      }),
      prisma.report.findMany({
        where: {
          clientId: userId,
          title: { contains: q, mode: 'insensitive' }
        },
        select: { id: true, title: true, reportType: true, createdAt: true },
        take: 5,
      }),
    ]);

    res.json({
      results: [
        ...campaigns.map(c => ({ type: 'campaign', id: c.id, title: c.name, subtitle: c.status, href: `/portal/campaigns` })),
        ...reports.map(r => ({ type: 'report', id: r.id, title: r.title, subtitle: r.reportType, href: `/portal/reports` })),
      ]
    });
  } catch (e) { err(next, e); }
};

// --- NOTIFICATIONS ---
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const prisma = (await import('../db/prisma')).default;

    // Fetch real data to construct intelligent notifications
    const [campaigns, reports, invoices] = await Promise.all([
      prisma.campaign.findMany({ where: { clientId: userId }, orderBy: { updatedAt: 'desc' }, take: 3, select: { id: true, name: true, status: true, updatedAt: true } }),
      prisma.report.findMany({ where: { clientId: userId }, orderBy: { createdAt: 'desc' }, take: 3, select: { id: true, title: true, createdAt: true } }),
      prisma.invoice.findMany({ where: { clientId: userId }, orderBy: { createdAt: 'desc' }, take: 3, select: { id: true, invoiceNumber: true, status: true, totalPence: true, dueDate: true } }),
    ]);

    const notifications = [
      ...campaigns.map(c => ({
        id: `campaign-${c.id}`,
        type: c.status === 'active' ? 'success' : 'info',
        title: `Campaign "${c.name}"`,
        message: `Status: ${c.status}`,
        time: c.updatedAt.toISOString(),
        read: false,
        href: `/portal/campaigns`,
        icon: 'megaphone',
      })),
      ...reports.map(r => ({
        id: `report-${r.id}`,
        type: 'info',
        title: 'New Report Available',
        message: r.title,
        time: r.createdAt.toISOString(),
        read: false,
        href: `/portal/reports`,
        icon: 'file',
      })),
      ...invoices
        .filter(i => i.status === 'sent' || i.status === 'overdue')
        .map(i => ({
          id: `invoice-${i.id}`,
          type: i.status === 'overdue' ? 'warning' : 'info',
          title: `Invoice ${i.invoiceNumber}`,
          message: `£${(i.totalPence / 100).toFixed(2)} — ${i.status}`,
          time: i.dueDate.toISOString(),
          read: false,
          href: `/portal/settings`,
          icon: 'credit-card',
        })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

    res.json({ notifications });
  } catch (e) { err(next, e); }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  // Client-side managed; acknowledge gracefully
  res.json({ success: true });
};

export const markAllNotificationsRead = async (req: Request, res: Response) => {
  res.json({ success: true });
};

