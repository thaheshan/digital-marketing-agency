import prisma from "../../db/prisma";
import { env } from "../../config/env.config";

interface MLScoreResult {
  success?: boolean; score?: number; temperature?: string;
  behaviour_score?: number; form_score?: number; breakdown?: object;
}

export const trackVisitor = async (data: any, ipAddress: string, userAgent: string) => {
  const { sessionToken, eventType, pageUrl, pageTitle, timeOnPageSeconds } = data;
  if (!sessionToken) throw new Error("Session token is required");
  let visitor = await prisma.siteVisitor.findUnique({ where: { sessionToken } });
  if (!visitor) {
    visitor = await prisma.siteVisitor.create({ data: { sessionToken, ipAddress, userAgent, totalPageViews: 1 } });
  } else {
    await prisma.siteVisitor.update({ where: { id: visitor.id }, data: { lastSeenAt: new Date(), totalPageViews: { increment: eventType === "page_view" ? 1 : 0 } } });
  }
  if (eventType) {
    await prisma.visitorEvent.create({ data: { visitorId: visitor.id, eventType, pageUrl, pageTitle, timeOnPageSeconds, scoreContribution: eventType === "pdf_download" ? 25 : (timeOnPageSeconds && timeOnPageSeconds > 120 ? 10 : 2) } });
  }
  return { message: "Tracked" };
};

export const submitEnquiry = async (data: any) => {
  const { firstName, lastName, email, phone, companyName, serviceInterest, budgetRange, timeline, message, source, sessionToken } = data;
  let visitorId = null;
  if (sessionToken) {
    const visitor = await prisma.siteVisitor.findUnique({ where: { sessionToken } });
    if (visitor) visitorId = visitor.id;
  }
  const enquiry = await prisma.enquiry.create({
    data: { firstName, lastName, email, phone, companyName, serviceInterest, budgetRange, timeline, message, source, visitorId, status: "new" }
  });
  try {
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/score`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ behaviour: { pages_viewed: 3, time_on_site_sec: 120 }, form: { budget_range: budgetRange, timeline, phone_provided: !!phone } }),
      signal: AbortSignal.timeout(10000),
    });
    if (response.ok) {
      const mlResult = await response.json() as MLScoreResult;
      const score = mlResult.score || 50;
      const temperature = score >= 70 ? "hot" : score >= 40 ? "warm" : "cold";
      await prisma.enquiry.update({ where: { id: enquiry.id }, data: { leadScore: score, leadTemperature: temperature as "hot" | "warm" | "cold" } });
      await prisma.enquiryLeadScore.create({
        data: { enquiryId: enquiry.id, behaviourScore: mlResult.behaviour_score || 0, formScore: mlResult.form_score || score, totalScore: score, scoreBreakdown: mlResult.breakdown || {} }
      });
    }
  } catch (err) { console.error("[ML Proxy] Lead scoring failed:", err); }
  return { message: "Enquiry submitted successfully", enquiryId: enquiry.id };
};
