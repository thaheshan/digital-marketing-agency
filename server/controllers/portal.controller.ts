import { Request, Response, NextFunction } from "express";
import * as portalService from "../services/portal/portal.service";
import { z } from "zod";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

const createStaffSchema = z.object({
  firstName:   z.string().min(1).max(100),
  lastName:    z.string().min(1).max(100),
  email:       z.string().email(),
  role:        z.enum(["content_manager"]),
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
    const dashboard = await portalService.getClientDashboard(userId);
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

export const getClientCampaignData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const campaign = await portalService.getClientCampaignData(userId as string, req.params.id as string);
    ok(res, { campaign });
  } catch (e) { err(next, e); }
};
