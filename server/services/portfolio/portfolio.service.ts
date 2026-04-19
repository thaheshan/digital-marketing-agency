import prisma from "../../db/prisma";
import { env } from "../../config/env.config";

export const getPublishedItems = async () => {
  return await prisma.portfolioItem.findMany({
    where: { status: "published" },
    include: { images: true, metrics: true, service: true },
    orderBy: { sortOrder: "asc" }
  });
};

export const getItemBySlug = async (slug: string) => {
  const item = await prisma.portfolioItem.findUnique({
    where: { slug },
    include: { images: true, metrics: true, service: true }
  });
  if (!item) throw new Error("Portfolio item not found");
  
  // Increment view count
  await prisma.portfolioItem.update({
    where: { id: item.id },
    data: { viewsCount: { increment: 1 } }
  });
  
  return item;
};

export const createItem = async (data: any, userId: string) => {
  // Generate a rudimentary slug
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random()*1000);
  
  return await prisma.portfolioItem.create({
    data: {
      slug,
      title: data.title,
      clientName: data.clientName,
      clientIndustry: data.clientIndustry,
      serviceCategory: data.serviceCategory,
      challengeText: data.challengeText,
      solutionText: data.solutionText,
      status: "draft",
      createdBy: userId,
      metrics: {
        create: data.metrics || [] // [{metricLabel, metricValue}]
      }
    }
  });
};

export const updateItem = async (id: string, data: any) => {
  return await prisma.portfolioItem.update({
    where: { id },
    data: {
      title: data.title,
      clientName: data.clientName,
      clientIndustry: data.clientIndustry,
      serviceCategory: data.serviceCategory,
      description: data.description,
      challengeText: data.challengeText,
      solutionText: data.solutionText,
      status: data.status,
      selectedAiOption: data.selectedAiOption,
    }
  });
};

export const deleteItem = async (id: string) => {
  return await prisma.portfolioItem.delete({
    where: { id }
  });
};

export const generateDescription = async (id: string, context: any) => {
  // Call Python ML Service
  const response = await fetch(`${env.ML_SERVICE_URL}/ml/generate-portfolio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(context)
  });
  
  if (!response.ok) throw new Error("ML Generator Service failed");
  const result = await response.json();
  
  const descriptions = result.variations.map((v: any) => v.text);
  
  await prisma.portfolioItem.update({
    where: { id },
    data: {
      aiGeneratedOption1: descriptions[0],
      aiGeneratedOption2: descriptions[1],
      aiGeneratedOption3: descriptions[2],
    }
  });
  
  return { options: result.variations };
};

export const generateDraftDescription = async (context: any) => {
  // Call Python ML Service without an ID
  const response = await fetch(`${env.ML_SERVICE_URL}/ml/generate-portfolio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(context)
  });
  
  if (!response.ok) throw new Error("ML Generator Service failed");
  const result = await response.json();
  return { options: result.variations };
};
