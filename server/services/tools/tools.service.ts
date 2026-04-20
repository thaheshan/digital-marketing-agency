import prisma from "../../db/prisma";
import { env } from "../../config/env.config";

interface AuditResult {
  url?: string; overall_score?: number; performance_score?: number;
  seo_score?: number; mobile_score?: number; security_score?: number;
  issues_count?: number; critical_count?: number; page_load_ms?: number;
  full_report?: object;
}

export const calculateRoi = async (data: any) => {
  const { sessionToken, budget, service, avgOrderValue } = data;
  const monthlyBudget = parseFloat(budget) || 1000;
  const cpaEst = service === "SEO" ? 25 : service === "Social Media" ? 15 : 35;
  const conversions = Math.floor(monthlyBudget / cpaEst);
  const revenueEst = conversions * (parseFloat(avgOrderValue) || 100);
  const roiEstPct = Math.floor(((revenueEst - monthlyBudget) / monthlyBudget) * 100);
  const scenarios = {
    conservative: { conversions: Math.floor(conversions * 0.7), revenue: revenueEst * 0.7, roiPct: roiEstPct * 0.5 },
    moderate:     { conversions, revenue: revenueEst, roiPct: roiEstPct },
    aggressive:   { conversions: Math.floor(conversions * 1.5), revenue: revenueEst * 1.5, roiPct: roiEstPct * 1.8 }
  };
  if (sessionToken) {
    try {
      const visitor = await prisma.siteVisitor.findUnique({ where: { sessionToken } });
      if (visitor) {
        await prisma.visitorEvent.create({
          data: { visitorId: visitor.id, eventType: "roi_calculator_used", scoreContribution: 20 }
        });
      }
    } catch { /* non-critical */ }
  }
  return { scenarios };
};

export const runAudit = async (url: string) => {
  if (!url) throw new Error("Invalid URL");
  try {
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`ML responded ${response.status}`);
    const result = await response.json() as AuditResult;
    return {
      url:          result.url || url,
      overallScore: result.overall_score || 50,
      loadTime:     result.page_load_ms || 0,
      checks: {
        seo:         { score: result.seo_score || 50,         issues: [] },
        performance: { score: result.performance_score || 50, issues: [] },
        mobile:      { score: result.mobile_score || 50,      issues: [] },
        security:    { score: result.security_score || 50,    issues: [] },
      },
    };
  } catch (err) {
    console.error("[ML Proxy] Website audit failed:", err);
    return {
      error:        true,
      message:      "AI Engine is currently warming up. Please try again in a moment.",
      overallScore: 50,
    };
  }
};

export const evaluateSentiment = async (text: string) => {
  try {
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/sentiment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`ML responded ${response.status}`);
    return await response.json() as object;
  } catch (err) {
    console.error("[ML Proxy] Sentiment failed:", err);
    return { label: "neutral", polarity: 0, auto_approve: false };
  }
};

export const getPersonalization = async (visitor_type: string) => {
  try {
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/personalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_type }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`ML responded ${response.status}`);
    return await response.json() as object;
  } catch (err) {
    console.error("[ML Proxy] Personalization failed:", err);
    return { content: { hero: "Grow Your Business", cta: "Get Started" } };
  }
};
