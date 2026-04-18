import app from "./app";
import { env } from "./config/env.config";
import prisma from "./db/prisma";

const start = async () => {
  try {
    await prisma.$connect();
    console.log("[DB] PostgreSQL connected");
    app.listen(env.PORT, () => {
      console.log(`[Server] Running on http://localhost:${env.PORT}`);
      console.log(`[Server] Environment: ${env.NODE_ENV}`);
    });
  } catch (err) {
    console.error("[Server] Failed to start:", err);
    process.exit(1);
  }
};
start();
