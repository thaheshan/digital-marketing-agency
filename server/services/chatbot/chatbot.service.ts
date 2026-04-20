import prisma from "../../db/prisma";
import { env } from "../../config/env.config";

interface MLChatResult {
  success?: boolean; reply?: string; intent?: string;
  score_delta?: number; session_id?: string; error?: string;
  quick_replies?: string[];
}

export const processMessage = async (data: any) => {
  const { sessionId, message, pageContext, sessionToken } = data;
  try {
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/chat/session`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, message, page_context: pageContext }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("ML Chatbot Service failed");
    const result = await response.json() as MLChatResult;

    let session;
    if (!sessionId) {
      let visitorId = null;
      if (sessionToken) {
        const visitor = await prisma.siteVisitor.findUnique({ where: { sessionToken } });
        if (visitor) visitorId = visitor.id;
      }
      session = await prisma.chatbotSession.create({ data: { visitorId, status: "active" } });
    } else {
      session = await prisma.chatbotSession.findUnique({ where: { id: sessionId } });
    }

    if (session) {
      if (message) await prisma.chatbotMessage.create({ data: { sessionId: session.id, sender: "user", messageText: message } });
      await prisma.chatbotMessage.create({ data: { sessionId: session.id, sender: "bot", messageText: result.reply || "", intentDetected: result.intent } });
    }
    return result;
  } catch (e) {
    console.error("Chatbot processing error:", e);
    return {
      session_id: sessionId || "fallback-" + Math.random().toString(36).substring(7),
      reply: "I'm having a little trouble connecting right now. Could you use our contact form?",
      intent: "fallback", score_delta: 0, quick_replies: ["Contact Form", "Home"],
    };
  }
};

export const getSessions = async () => {
  return prisma.chatbotSession.findMany({
    include: { messages: { orderBy: { createdAt: "asc" } } },
    orderBy: { startedAt: "desc" }
  });
};

export const getSessionDetail = async (id: string) => {
  return prisma.chatbotSession.findUnique({ where: { id }, include: { messages: { orderBy: { createdAt: "asc" } } } });
};

export const getKnowledgeBase = async () => {
  return prisma.chatbotKnowledgeBase.findMany({ orderBy: { sortOrder: "asc" } });
};

export const updateKnowledgeBaseItem = async (id: string, data: any) => {
  return prisma.chatbotKnowledgeBase.update({ where: { id }, data: { question: data.question, answer: data.answer, isActive: data.isActive } });
};
