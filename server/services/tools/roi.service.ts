import prisma from "../../db/prisma";

// ── Industry multipliers ──────────────────────────────────
const INDUSTRY_MULTIPLIERS: Record<string, { conservative: number; realistic: number; optimistic: number }> = {
  "E-commerce":          { conservative: 1.85, realistic: 2.85, optimistic: 4.10 },
  "SaaS":                { conservative: 1.70, realistic: 2.60, optimistic: 3.80 },
  "Healthcare":          { conservative: 1.50, realistic: 2.20, optimistic: 3.20 },
  "Real Estate":         { conservative: 1.60, realistic: 2.40, optimistic: 3.50 },
  "Education":           { conservative: 1.40, realistic: 2.10, optimistic: 3.00 },
  "Finance":             { conservative: 1.65, realistic: 2.50, optimistic: 3.60 },
  "Retail":              { conservative: 1.75, realistic: 2.70, optimistic: 3.90 },
  "Manufacturing":       { conservative: 1.45, realistic: 2.15, optimistic: 3.10 },
  "Professional Services":{ conservative: 1.55, realistic: 2.30, optimistic: 3.30 },
  "default":             { conservative: 1.60, realistic: 2.50, optimistic: 3.60 },
};

// ── Calculate ROI ─────────────────────────────────────────
export const calculateRoi = async (input: {
  // Step 1
  industry:              string;
  monthlyRevenuePence:   number;
  conversionRateX100:    number; // e.g. 250 = 2.50%
  monthlyTraffic:        number;
  monthlyBudgetPence:    number;
  // Step 2
  targetRevenueIncrease: number; // percentage e.g. 25
  conversionRateGoal:    number; // e.g. 400 = 4.00%
  timeframeMonths:       number; // 3, 6, or 12
  marketingFocus?:       string;
  additionalBudgetPence?: number;
  // Step 3
  targetConversionRate?: number;
  primaryPriority?:      string;
  // Contact
  firstName:             string;
  lastName:              string;
  email:                 string;
  phone?:                string;
  // Visitor tracking
  visitorId?:            string;
}) => {
  const multipliers = INDUSTRY_MULTIPLIERS[input.industry] || INDUSTRY_MULTIPLIERS["default"];

  const totalBudgetPence = input.monthlyBudgetPence + (input.additionalBudgetPence || 0);
  const currentRevenue   = input.monthlyRevenuePence;
  const currentConvRate  = input.conversionRateX100 / 10000; // convert to decimal

  // ── ROI Projections ───────────────────────────────────
  const conservativeRevenuePence = Math.round(currentRevenue * multipliers.conservative);
  const realisticRevenuePence    = Math.round(currentRevenue * multipliers.realistic);
  const optimisticRevenuePence   = Math.round(currentRevenue * multipliers.optimistic);

  const conservativeRoi = Math.round((multipliers.conservative - 1) * 100); // e.g. 85
  const realisticRoi    = Math.round((multipliers.realistic - 1) * 100);    // e.g. 185
  const optimisticRoi   = Math.round((multipliers.optimistic - 1) * 100);   // e.g. 310

  const additionalRevenueConservative = conservativeRevenuePence - currentRevenue;
  const additionalRevenueRealistic    = realisticRevenuePence - currentRevenue;
  const additionalRevenueOptimistic   = optimisticRevenuePence - currentRevenue;

  // ── Break-even calculation ────────────────────────────
  const breakEvenMonthsConservative = Math.ceil(totalBudgetPence / (additionalRevenueConservative / 12));
  const breakEvenMonthsRealistic    = Math.ceil(totalBudgetPence / (additionalRevenueRealistic / 12));
  const breakEvenMonthsOptimistic   = Math.ceil(totalBudgetPence / (additionalRevenueOptimistic / 12));

  // ── Month-by-month breakdown (realistic) ─────────────
  const monthlyBreakdown = [];
  for (let month = 1; month <= input.timeframeMonths; month++) {
    const growthRate    = (realisticRoi / 100) * (month / input.timeframeMonths);
    const revenue       = Math.round(currentRevenue * (1 + growthRate));
    const newCustomers  = Math.round((input.monthlyTraffic * currentConvRate) * (1 + growthRate * 0.5));
    const roi           = Math.round(growthRate * 100);
    monthlyBreakdown.push({
      month,
      revenuePence:  revenue,
      growthPercent: roi,
      marketingSpend: totalBudgetPence,
      newCustomers,
      roi,
    });
  }

  // ── Investment breakdown ──────────────────────────────
  const adSpendPence        = Math.round(totalBudgetPence * 0.45);
  const contentCreationPence= Math.round(totalBudgetPence * 0.25);
  const strategyPence       = Math.round(totalBudgetPence * 0.20);
  const analyticsPence      = Math.round(totalBudgetPence * 0.10);

  // ── Industry benchmarks ───────────────────────────────
  const industryBenchmarks = {
    conversionRate:    input.industry === "E-commerce" ? 350 : 300, // x100
    averageOrderValue: 8500,  // pence
    customerRetention: 7800,  // x100 = 78%
    emailOpenRate:     2200,  // x100 = 22%
  };

  // ── Save to DB ────────────────────────────────────────
  const result = await prisma.roiCalculatorResult.create({
    data: {
      visitorId:                     input.visitorId || null,
      industry:                      input.industry,
      monthlyRevenuePence:           input.monthlyRevenuePence,
      conversionRateX100:            input.conversionRateX100,
      monthlyTraffic:                input.monthlyTraffic,
      monthlyBudgetPence:            totalBudgetPence,
      projectedRoiConservative:      conservativeRoi,
      projectedRoiRealistic:         realisticRoi,
      projectedRoiOptimistic:        optimisticRoi,
      projectedRevenueRealisticPence: realisticRevenuePence,
    },
  });

  return {
    resultId: result.id,

    // Summary
    summary: {
      industry:          input.industry,
      monthlyBudgetPence: totalBudgetPence,
      timeframeMonths:   input.timeframeMonths,
      averageRoi:        realisticRoi,
      breakEvenMonth:    breakEvenMonthsRealistic,
    },

    // Three scenarios
    scenarios: {
      conservative: {
        roi:                conservativeRoi,
        additionalRevenuePence: additionalRevenueConservative,
        totalRevenuePence:  conservativeRevenuePence,
        conversionIncrease: Math.round(input.conversionRateX100 * 0.35),
        monthlyRevenueGrowth: Math.round(additionalRevenueConservative / 12),
        breakEvenMonth:     breakEvenMonthsConservative,
      },
      realistic: {
        roi:                realisticRoi,
        additionalRevenuePence: additionalRevenueRealistic,
        totalRevenuePence:  realisticRevenuePence,
        conversionIncrease: Math.round(input.conversionRateX100 * 0.95),
        monthlyRevenueGrowth: Math.round(additionalRevenueRealistic / 12),
        breakEvenMonth:     breakEvenMonthsRealistic,
      },
      optimistic: {
        roi:                optimisticRoi,
        additionalRevenuePence: additionalRevenueOptimistic,
        totalRevenuePence:  optimisticRevenuePence,
        conversionIncrease: Math.round(input.conversionRateX100 * 0.62),
        monthlyRevenueGrowth: Math.round(additionalRevenueOptimistic / 12),
        breakEvenMonth:     breakEvenMonthsOptimistic,
      },
    },

    // Month-by-month
    monthlyBreakdown,

    // Investment breakdown
    investmentBreakdown: {
      totalPence:          totalBudgetPence,
      adSpendPence,
      contentCreationPence,
      strategyPence,
      analyticsPence,
    },

    // Industry benchmarks comparison
    industryBenchmarks,
    yourMetrics: {
      conversionRate:    input.conversionRateX100,
      monthlyTraffic:    input.monthlyTraffic,
    },

    // Key insights
    insights: [
      {
        title: "Strong Growth Potential",
        body:  `Your current conversion rate of ${(input.conversionRateX100 / 100).toFixed(1)}% has significant room for improvement. Industry leaders achieve 3-5%.`,
      },
      {
        title: "Realistic Expectations",
        body:  `Based on similar ${input.industry} businesses, achieving ${realisticRoi}% ROI within 12 months is highly attainable.`,
      },
      {
        title: "Time to ROI",
        body:  `Expect break-even by month ${breakEvenMonthsRealistic}. Most growth happens in months 6-12 as campaigns optimize.`,
      },
      {
        title: "Quick Wins Available",
        body:  `SEO and retargeting campaigns typically show results within 60-90 days of launch.`,
      },
    ],

    // Contact info saved for follow-up
    contact: {
      firstName: input.firstName,
      lastName:  input.lastName,
      email:     input.email,
      phone:     input.phone,
    },
  };
};

// ── Get result by ID ──────────────────────────────────────
export const getRoiResult = async (id: string) => {
  const result = await prisma.roiCalculatorResult.findUnique({ where: { id } });
  if (!result) throw new Error("ROI result not found");
  return result;
};
