import prisma from "../../db/prisma";
import { env } from "../../config/env.config";

export const processMessage = async (data: any) => {
  const { sessionId, message, pageContext, sessionToken } = data;

  try {
    const response = await fetch(`${env.ML_SERVICE_URL}/ml/chat/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        message,
        page_context: pageContext,
      })
    });

    if (!response.ok) throw new Error("ML Chatbot Service failed");
    const result = await response.json();

    if (result.success) {
      // In a full implementation, we persist the chat messages to Postgres here
      // For the FYP demo, the ML service holds it in memory, but we will mock DB save
      let session;
      if (!sessionId) {
          // Creating a new session in DB
          let visitorId = null;
          if (sessionToken) {
              const visitor = await prisma.siteVisitor.findUnique({ where: { sessionToken }});
              if(visitor) visitorId = visitor.id;
          }

          session = await prisma.chatbotSession.create({
              data: {
                  id: result.session_id,
                  visitorId: visitorId,
                  status: "active"
              }
          });
      } else {
          session = await prisma.chatbotSession.findUnique({where: { id: sessionId }});
      }

      if (session) {
          if (message) {
             await prisma.chatbotMessage.create({
                 data: { sessionId: session.id, sender: "user", messageText: message }
             });
          }
          await prisma.chatbotMessage.create({
              data: { sessionId: session.id, sender: "bot", messageText: result.reply, intentDetected: result.intent }
          });
      }

      return result;
    }
    
    throw new Error(result.error || "Unknown error");
  } catch (e) {
    console.error("Chatbot processing error:", e);
    // Fallback response if ML service is down
    return {
      session_id: sessionId || "fallback-" + Math.random().toString(36).substring(7),
      reply: "I'm having a little trouble connecting right now. Could you use our contact form? I'll make sure the team gets it immediately.",
      intent: "fallback",
      score_delta: 0,
      quick_replies: ["Contact Form", "Home"],
    };
  }
};

export const getSessions = async () => {
  return await prisma.chatbotSession.findMany({
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      enquiry: { select: { id: true, firstName: true, lastName: true } }
    },
    orderBy: { startedAt: "desc" }
  });
};

export const getSessionDetail = async (id: string) => {
  return await prisma.chatbotSession.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } }
  });
};

export const getKnowledgeBase = async () => {
  return await prisma.chatbotKnowledgeBase.findMany({
    orderBy: { sortOrder: "asc" }
  });
};

export const updateKnowledgeBaseItem = async (id: string, data: any) => {
  return await prisma.chatbotKnowledgeBase.update({
    where: { id },
    data: {
      question: data.question,
      answer: data.answer,
      isActive: data.isActive
    }
  });
};
