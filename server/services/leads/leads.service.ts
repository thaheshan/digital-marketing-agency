import prisma from "../../db/prisma";

export const getEnquiries = async (statusFilter?: string, tempFilter?: string) => {
  const whereArgs: any = {};
  if (statusFilter) whereArgs.status = statusFilter;
  if (tempFilter) whereArgs.leadTemperature = tempFilter;

  // For testing, mock data if database is empty or not seeded
  const items = await prisma.enquiry.findMany({
    where: whereArgs,
    include: { leadScore_: true },
    orderBy: { createdAt: "desc" }
  });

  return items.map(i => ({
    id: i.id,
    name: `${i.firstName} ${i.lastName}`,
    email: i.email,
    company: i.companyName,
    phone: i.phone,
    service: i.serviceInterest,
    budget: i.budgetRange,
    status: i.status,
    score: i.leadScore || 0,
    timestamp: i.createdAt,
    source: i.source,
    leadTemperature: i.leadTemperature
  }));
};

export const getEnquiryDetail = async (id: string) => {
  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: {
      leadScore_: true,
      chatbotSession: {
        include: { messages: { orderBy: { createdAt: "asc" } } }
      },
      siteVisitors: {
        include: { events: { orderBy: { createdAt: "asc" } } }
      },
      notes: {
        include: { author: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!enquiry) throw new Error("Enquiry not found");

  const visitorEvents = enquiry.siteVisitors.length > 0 ? enquiry.siteVisitors[0].events : [];
  
  return {
    id: enquiry.id,
    name: `${enquiry.firstName} ${enquiry.lastName}`,
    email: enquiry.email,
    company: enquiry.companyName,
    phone: enquiry.phone,
    service: enquiry.serviceInterest,
    budget: enquiry.budgetRange,
    message: enquiry.message,
    score: enquiry.leadScore || 0,
    status: enquiry.status,
    timestamp: enquiry.createdAt,
    source: enquiry.source,
    scoreBreakdown: enquiry.leadScore_?.scoreBreakdown || { behaviour: 0, form: 0, chatbot: 0, recency: 0 },
    chatLog: enquiry.chatbotSession?.messages.map(m => ({
      from: m.sender,
      text: m.messageText,
      time: m.createdAt.toISOString()
    })) || [],
    pageVisits: visitorEvents.map(e => ({
      page: e.pageUrl || e.eventType,
      duration: e.timeOnPageSeconds ? `${e.timeOnPageSeconds}s` : "0s",
      timestamp: e.createdAt.toISOString()
    }))
  };
};

export const updateStatus = async (id: string, status: any, userId: string) => {
  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) throw new Error("Enquiry not found");

  await prisma.enquiryStatusHistory.create({
    data: {
      enquiryId: id,
      changedBy: userId,
      fromStatus: enquiry.status,
      toStatus: status
    }
  });

  return await prisma.enquiry.update({
    where: { id },
    data: { status }
  });
};

export const convertToClient = async (id: string, adminId: string) => {
  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) throw new Error("Enquiry not found");

  if (enquiry.status === "converted") {
    throw new Error("Enquiry already converted");
  }

  // Create user
  // This logic normally lives in portal/auth service, but duplicating core bits for simplicity here
  const { hashPassword } = require("../../auth/bcrypt.service");
  const tempPassword = Math.random().toString(36).slice(-8); // Generate random password
  const passwordHash = await hashPassword(tempPassword);

  const user = await prisma.user.create({
    data: {
      email: enquiry.email,
      passwordHash,
      firstName: enquiry.firstName,
      lastName: enquiry.lastName,
      phone: enquiry.phone,
      role: "client",
      status: "active",
      emailVerified: true
    }
  });

  await prisma.clientProfile.create({
    data: {
      userId: user.id,
      companyName: enquiry.companyName || `${enquiry.firstName} ${enquiry.lastName}`,
    }
  });

  // Update enquiry
  await prisma.enquiry.update({
    where: { id },
    data: { 
      status: "converted",
      convertedToClientId: user.id
    }
  });

  // Send email with credentials - deferred to email service usually
  return { message: "Client created", clientId: user.id, tempPassword }; 
};

export const addNote = async (id: string, authorId: string, noteText: string) => {
  return await prisma.enquiryNote.create({
    data: {
      enquiryId: id,
      authorId,
      noteText
    }
  });
};
