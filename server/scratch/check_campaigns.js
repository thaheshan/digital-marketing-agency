const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const campaignCount = await prisma.campaign.count();
  const liveCampaignCount = await prisma.campaign.count({ where: { status: 'live' } });
  const clientCount = await prisma.user.count({ where: { role: 'client' } });
  const campaigns = await prisma.campaign.findMany({ take: 5, select: { id: true, clientId: true, status: true, name: true } });
  
  console.log({ campaignCount, liveCampaignCount, clientCount, sample: campaigns });
}

main().catch(console.error).finally(() => prisma.$disconnect());
