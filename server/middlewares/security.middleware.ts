import helmet from "helmet";
import cors from "cors";
import { corsOptions } from "../config/cors.config";
import { Application } from "express";
export const applySecurity = (app: Application) => { app.use(helmet()); app.use(cors(corsOptions)); };
