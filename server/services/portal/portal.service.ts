import crypto from "crypto";
import prisma from "../../db/prisma";
import { hashPassword } from "../auth/bcrypt.service";
import { sendOtpEmail } from "../email/email.service";

// ── Admin creates Staff ───────────────────────────────────
export const createStaff = async (
  input: {
    firstName:   string;
    lastName:    string;
    email:       string;
    role:        "content_manager";
    department?: string;
    jobTitle?:   string;
    phone?:      string;
  },
  createdByAdminId: string
) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new Error("Email already registered");

  // Generate temp password
  const tempPassword = crypto.randomBytes(8).toString("hex");
  const passwordHash = await hashPassword(tempPassword);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email:         input.email,
        passwordHash,
        firstName:     input.firstName,
        lastName:      input.lastName,
        phone:         input.phone,
        role:          input.role,
        status:        "active",
        emailVerified: true,
      },
    });

    await tx.staffProfile.create({
      data: {
        userId:     newUser.id,
        department: input.department,
        jobTitle:   input.jobTitle,
      },
    });

    await tx.staffPermissions.create({
      data: {
        userId:               newUser.id,
        canManagePortfolio:   false,
        canManageBlog:        false,
        canManageTestimonials:false,
        canViewEnquiries:     true,
        canManageEnquiries:   false,
        canViewClients:       true,
        canManageClients:     false,
        canViewAnalytics:     true,
        canManageServices:    false,
        canManageChatbot:     false,
        canManageTeam:        false,
        canManageSettings:    false,
      },
    });

    return newUser;
  });

  // Send welcome email with temp password
  // TODO: replace with proper welcome email template
  await sendOtpEmail(user.email, tempPassword, user.firstName);

  await prisma.activityLog.create({
    data: {
      userId:       createdByAdminId,
      portal:       "staff",
      action:       "created_staff_account",
      resourceType: "user",
      resourceId:   user.id,
    },
  });

  return {
    message:  "Staff account created successfully",
    userId:   user.id,
    email:    user.email,
    role:     user.role,
    tempPassword,
  };
};

// ── Admin creates Client ──────────────────────────────────
export const createClient = async (
  input: {
    firstName:          string;
    lastName:           string;
    email:              string;
    phone?:             string;
    companyName:        string;
    industry?:          string;
    companySize?:       string;
    websiteUrl?:        string;
    monthlyBudgetPence?: number;
    notes?:             string;
    accountManagerId?:  string;
  },
  createdByAdminId: string
) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new Error("Email already registered");

  const tempPassword = crypto.randomBytes(8).toString("hex");
  const passwordHash = await hashPassword(tempPassword);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email:         input.email,
        passwordHash,
        firstName:     input.firstName,
        lastName:      input.lastName,
        phone:         input.phone,
        role:          "client",
        status:        "active",
        emailVerified: true,
      },
    });

    await tx.clientProfile.create({
      data: {
        userId:             newUser.id,
        companyName:        input.companyName,
        industry:           input.industry,
        companySize:        input.companySize,
        websiteUrl:         input.websiteUrl,
        monthlyBudgetPence: input.monthlyBudgetPence,
        notes:              input.notes,
        accountManagerId:   input.accountManagerId,
      },
    });

    return newUser;
  });

  // Send welcome email with temp password
  await sendOtpEmail(user.email, tempPassword, user.firstName);

  await prisma.activityLog.create({
    data: {
      userId:       createdByAdminId,
      portal:       "staff",
      action:       "created_client_account",
      resourceType: "user",
      resourceId:   user.id,
    },
  });

  return {
    message:     "Client account created successfully",
    userId:      user.id,
    email:       user.email,
    role:        user.role,
    tempPassword,
  };
};

// ── Get all staff ─────────────────────────────────────────
export const getAllStaff = async () => {
  return prisma.user.findMany({
    where: { role: { in: ["admin", "content_manager"] } },
    select: {
      id:        true,
      email:     true,
      firstName: true,
      lastName:  true,
      role:      true,
      status:    true,
      createdAt: true,
      staffProfile: {
        select: { department: true, jobTitle: true },
      },
      staffPermissions: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// ── Get all clients ───────────────────────────────────────
export const getAllClients = async () => {
  return prisma.user.findMany({
    where: { role: "client" },
    select: {
      id:        true,
      email:     true,
      firstName: true,
      lastName:  true,
      role:      true,
      status:    true,
      createdAt: true,
      clientProfile: {
        select: {
          companyName:        true,
          industry:           true,
          companySize:        true,
          monthlyBudgetPence: true,
          portalAccess:       true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// ── Update staff permissions ──────────────────────────────
export const updateStaffPermissions = async (
  userId: string,
  permissions: {
    canManagePortfolio?:    boolean;
    canManageBlog?:         boolean;
    canManageTestimonials?: boolean;
    canViewEnquiries?:      boolean;
    canManageEnquiries?:    boolean;
    canViewClients?:        boolean;
    canManageClients?:      boolean;
    canViewAnalytics?:      boolean;
    canManageServices?:     boolean;
    canManageChatbot?:      boolean;
    canManageTeam?:         boolean;
    canManageSettings?:     boolean;
  }
) => {
  const updated = await prisma.staffPermissions.update({
    where: { userId },
    data:  permissions,
  });
  return { message: "Permissions updated", permissions: updated };
};
