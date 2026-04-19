import prisma from "../../db/prisma";
import { env } from "../../config/env.config";

export const trackVisitor = async (data: any, ipAddress: string, userAgent: string) => {
  const { sessionToken, eventType, pageUrl, pageTitle, timeOnPageSeconds } = data;

  if (!sessionToken) {
    throw new Error("Session token is required");
  }

  let visitor = await prisma.siteVisitor.findUnique({
    where: { sessionToken }
  });

  if (!visitor) {
    visitor = await prisma.siteVisitor.create({
      data: {
        sessionToken,
        ipAddress,
        userAgent,
        totalPageViews: 1,
      }
    });
  } else {
    // Optionally update last seen
    await prisma.siteVisitor.update({
      where: { id: visitor.id },
      data: { 
        lastSeenAt: new Date(),
        totalPageViews: { increment: eventType === 'page_view' ? 1 : 0 }
      }
    });
  }

  if (eventType) {
    await prisma.visitorEvent.create({
      data: {
        visitorId: visitor.id,
        eventType,
        pageUrl,
        pageTitle,
        timeOnPageSeconds,
        // basic manual score contribution heuristic for now
        scoreContribution: eventType === 'pdf_download' ? 25 : (timeOnPageSeconds && timeOnPageSeconds > 120 ? 10 : 2)
      }
    });
  }

  return { message: "Tracked" };
};

export const submitEnquiry = async (data: any) => {
  const { firstName, lastName, email, phone, companyName, serviceInterest, budgetRange, timeline, message, source, sessionToken } = data;

  let visitorId = null;
  if (sessionToken) {
    const visitor = await prisma.siteVisitor.findUnique({ where: { sessionToken } });
    if (visitor) {
      visitorId = visitor.id;
    }
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      companyName,
      serviceInterest: serviceInterest,
      budgetRange,
      timeline,
      message,
      source,
      visitorId,
      status: "new",
    }
  });

  try {
    // Attempt ML Lead Scoring using the ml-service API
    // We send a minimal placeholder for behaviour as we don't fetch all events here yet
    // In a fully integrated system, we'd pull visitorEvents and aggregate them.
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        behaviour: {
          pages_viewed: 3, 
          time_on_site_sec: 120
        },
        form: {
          budget_range: budgetRange,
          timeline: timeline,
          phone_provided: !!phone
        }
      })
    });
    
    if (response.ok) {
      const mlResult = await response.json();
      if (mlResult.success) {
        await prisma.enquiry.update({
          where: { id: enquiry.id },
          data: {
            leadScore: mlResult.score,
            leadTemperature: mlResult.temperature
          }
        });
        
        await prisma.enquiryLeadScore.create({
          data: {
            enquiryId: enquiry.id,
            behaviourScore: mlResult.behaviour_score,
            formScore: mlResult.form_score,
            totalScore: mlResult.score,
            scoreBreakdown: mlResult.breakdown || {}
          }
        });
      }
    }
  } catch (err) {
    console.error("Failed to contact ML score service:", err);
  }

  return { message: "Enquiry submitted successfully", enquiryId: enquiry.id };
};
