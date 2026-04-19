import prisma from "../db/prisma";
import * as emailService from "../services/email/email.service";

export const processDripEmails = async () => {
  console.log("[Job] Running Email Drip Job...");
  try {
    // Basic implementation: grab enquiries that haven't had their welcome email
    const newEnquiries = await prisma.enquiry.findMany({
      where: {
        status: "new",
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // past 24h
      }
    });

    for (const enquiry of newEnquiries) {
      const alreadySent = await prisma.enquiryNote.findFirst({
        where: { enquiryId: enquiry.id, noteText: { startsWith: "[Auto-Email]" } }
      });

      if (!alreadySent) {
        // Mock sending an email
        console.log(`[Job] Sending Day 0 Welcome Email to ${enquiry.email}`);
        
        // Log it as a note so we don't send it again
        await prisma.enquiryNote.create({
          data: {
            enquiryId: enquiry.id,
            authorId: "system", // usually would have a system user ID or just literal ID
            noteText: "[Auto-Email] Sent Day 0 Welcome Sequence"
          }
        });
      }
    }
  } catch (error) {
    console.error("[Job] Error in email drip job:", error);
  }
};
