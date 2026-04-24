import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Testing Prisma models...");
    console.log("User count:", await prisma.user.count());
    console.log("Campaign count:", await prisma.campaign.count());
    console.log("CampaignMetricsDaily count:", await prisma.campaignMetricsDaily.count());
    console.log("MessageThread count:", await prisma.messageThread.count());
    console.log("Report count:", await prisma.report.count());
    console.log("OK");
  } catch (err) {
    console.error("Prisma test failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
