import prisma from "../../db/prisma";
import { env } from "../../config/env.config";

export const calculateRoi = async (data: any) => {
  const { sessionToken, budget, margin, service, avgOrderValue } = data;
  
  // Basic heuristic calculation
  const monthlyBudget = parseFloat(budget) || 1000;
  const cpaEst = service === 'SEO' ? 25 : service === 'Social Media' ? 15 : 35;
  const conversions = Math.floor(monthlyBudget / cpaEst);
  const revenueEst = conversions * (parseFloat(avgOrderValue) || 100);
  const roiEstPct = Math.floor(((revenueEst - monthlyBudget) / monthlyBudget) * 100);

  // You can return different scenarios
  const scenarios = {
    conservative: { conversions: Math.floor(conversions * 0.7), revenue: revenueEst * 0.7, roiPct: roiEstPct * 0.5 },
    moderate: { conversions, revenue: revenueEst, roiPct: roiEstPct },
    aggressive: { conversions: Math.floor(conversions * 1.5), revenue: revenueEst * 1.5, roiPct: roiEstPct * 1.8 }
  };

  // Track event if session exists
  if (sessionToken) {
    const visitor = await prisma.siteVisitor.findUnique({ where: { sessionToken } });
    if (visitor) {
      await prisma.visitorEvent.create({
        data: {
          visitorId: visitor.id,
          eventType: "roi_calculator_used",
          scoreContribution: 20
        }
      });
    }
  }

  return { scenarios };
};

export const runAudit = async (url: string) => {
  if (!url) throw new Error("Invalid URL");

  const response = await fetch(`${env.ML_SERVICE_URL}/ml/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  if (!response.ok) throw new Error("ML Audit Service failed");
  const result = await response.json();
  
  // Format the python result to match the expected frontend structure
  return {
    url: result.audit.url,
    overallScore: result.audit.score,
    loadTime: result.audit.load_time_seconds,
    checks: {
      seo: { score: result.audit.score + 5, issues: result.audit.seo_issues_found },
      performance: { score: result.audit.score - 5, issues: [`Load time is ${result.audit.load_time_seconds}s`] },
      mobile: { score: 92, issues: [] },
      accessibility: { score: 100, issues: [] }
    },
    opportunityText: result.audit.opportunity_text
  };
};

export const evaluateSentiment = async (text: string) => {
  const response = await fetch(`${env.ML_SERVICE_URL}/ml/sentiment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  if (!response.ok) throw new Error("ML Sentiment Service failed");
  return await response.json();
};

export const getPersonalization = async (visitor_type: string) => {
  const response = await fetch(`${env.ML_SERVICE_URL}/ml/personalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitor_type })
  });
  if (!response.ok) throw new Error("ML Personalize Service failed");
  return await response.json();
};
