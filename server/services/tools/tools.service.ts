import prisma from "../../db/prisma";
import { env } from "../../config/env.config";

interface AuditResult {
  audit?: { url?: string; score?: number; load_time_seconds?: number; seo_issues_found?: string[]; opportunity_text?: string; };
  url?: string; overall_score?: number; page_load_ms?: number;
}

export const calculateRoi = async (data: any) => {
  const { sessionToken, budget, margin, service, avgOrderValue } = data;
  const monthlyBudget = parseFloat(budget) || 1000;
  const cpaEst = service === 'SEO' ? 25 : service === 'Social Media' ? 15 : 35;
  const conversions = Math.floor(monthlyBudget / cpaEst);
  const revenueEst = conversions * (parseFloat(avgOrderValue) || 100);
  const roiEstPct = Math.floor(((revenueEst - monthlyBudget) / monthlyBudget) * 100);
  const scenarios = {
    conservative: { conversions: Math.floor(conversions * 0.7), revenue: revenueEst * 0.7, roiPct: roiEstPct * 0.5 },
    moderate:     { conversions, revenue: revenueEst, roiPct: roiEstPct },
    aggressive:   { conversions: Math.floor(conversions * 1.5), revenue: revenueEst * 1.5, roiPct: roiEstPct * 1.8 }
  };
  if (sessionToken) {
    const visitor = await prisma.siteVisitor.findUnique({ where: { sessionToken } });
    if (visitor) {
      await prisma.visitorEvent.create({ data: { visitorId: visitor.id, eventType: "roi_calculator_used", scoreContribution: 20 } });
    }
  }
  return { scenarios };
};

export const runAudit = async (url: string) => {
  if (!url) throw new Error("Invalid URL");
  try {
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/audit`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("ML Audit Service failed");
    const result = await response.json() as AuditResult;
    return {
      url:          result.url || url,
      overallScore: result.overall_score || result.audit?.score || 50,
      loadTime:     result.page_load_ms || result.audit?.load_time_seconds || 0,
      checks: {
        seo:           { score: result.overall_score || 50, issues: [] },
        performance:   { score: result.overall_score || 50, issues: [] },
        mobile:        { score: 92, issues: [] },
        accessibility: { score: 100, issues: [] }
      },
    };
  } catch {
    return { error: true, message: "AI Engine is currently warming up. Please try again in a moment.", overallScore: 50 };
  }
};

export const evaluateSentiment = async (text: string) => {
  try {
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/sentiment`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("ML Sentiment Service failed");
    return await response.json() as object;
  } catch {
    return { label: "neutral", polarity: 0 };
  }
};

export const getPersonalization = async (visitor_type: string) => {
  try {
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/personalize`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_type }), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("ML Personalize Service failed");
    return await response.json() as object;
  } catch {
    return { content: { hero: "Grow Your Business", cta: "Get Started" } };
  }
};
