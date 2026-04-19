import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const ok  = (res: Response, data: object, status = 200) => res.status(status).json({ success: true, ...data });
const err = (next: NextFunction, error: unknown) => next(error);

const enquirySchema = z.object({
  firstName:       z.string().min(1),
  lastName:        z.string().min(1),
  email:           z.string().email(),
  phone:           z.string().optional(),
  companyName:     z.string().optional(),
  companySize:     z.string().optional(),
  websiteUrl:      z.string().optional(),
  serviceInterest: z.array(z.string()).optional(),
  budgetRange:     z.string().optional(),
  timeline:        z.string().optional(),
  message:         z.string().optional(),
  source:          z.string().optional(),
});

export const submitEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = enquirySchema.parse(req.body);
    ok(res, { message: "Enquiry submitted successfully", input }, 201);
  } catch (e) { err(next, e); }
};
