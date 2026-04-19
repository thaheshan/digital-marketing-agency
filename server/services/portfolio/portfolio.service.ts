import prisma from "../../db/prisma";
import { env } from "../../config/env.config";

interface MLDescriptionResult {
  variations?: Array<{ text: string }>;
  option_1?: string; option_2?: string; option_3?: string;
}

export const getPublishedItems = async () => {
  return prisma.portfolioItem.findMany({
    where: { status: "published" },
    include: { images: true, metrics: true, service: true },
    orderBy: { sortOrder: "asc" }
  });
};

export const getItemBySlug = async (slug: string) => {
  const item = await prisma.portfolioItem.findUnique({
    where: { slug }, include: { images: true, metrics: true, service: true }
  });
  if (!item) throw new Error("Portfolio item not found");
  await prisma.portfolioItem.update({ where: { id: item.id }, data: { viewsCount: { increment: 1 } } });
  return item;
};

export const createItem = async (data: any, userId: string) => {
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000);
  return prisma.portfolioItem.create({
    data: {
      slug, title: data.title, clientName: data.clientName,
      clientIndustry: data.clientIndustry, serviceCategory: data.serviceCategory,
      challengeText: data.challengeText, solutionText: data.solutionText,
      status: "draft", createdBy: userId,
      metrics: { create: data.metrics || [] }
    }
  });
};

export const updateItem = async (id: string, data: any) => {
  return prisma.portfolioItem.update({
    where: { id },
    data: {
      title: data.title, clientName: data.clientName, clientIndustry: data.clientIndustry,
      serviceCategory: data.serviceCategory, description: data.description,
      challengeText: data.challengeText, solutionText: data.solutionText,
      status: data.status, selectedAiOption: data.selectedAiOption,
    }
  });
};

export const deleteItem = async (id: string) => {
  return prisma.portfolioItem.delete({ where: { id } });
};

export const generateDescription = async (id: string, context: any) => {
  try {
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/generate-portfolio`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("ML Generator Service failed");
    const result = await response.json() as MLDescriptionResult;

    const opt1 = result.option_1 || result.variations?.[0]?.text || "";
    const opt2 = result.option_2 || result.variations?.[1]?.text || "";
    const opt3 = result.option_3 || result.variations?.[2]?.text || "";

    await prisma.portfolioItem.update({
      where: { id },
      data: { aiGeneratedOption1: opt1, aiGeneratedOption2: opt2, aiGeneratedOption3: opt3 }
    });
    return { option_1: opt1, option_2: opt2, option_3: opt3 };
  } catch {
    return {
      option_1: "Professional description - AI engine warming up",
      option_2: "Conversational description - AI engine warming up",
      option_3: "Data-driven description - AI engine warming up",
    };
  }
};

export const generateDraftDescription = async (context: any) => {
  try {
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/generate-portfolio`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("ML Generator Service failed");
    const result = await response.json() as MLDescriptionResult;
    return { option_1: result.option_1 || "", option_2: result.option_2 || "", option_3: result.option_3 || "" };
  } catch {
    return { option_1: "", option_2: "", option_3: "" };
  }
};
