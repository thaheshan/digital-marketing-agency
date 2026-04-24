import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";

export const getPublishedBlogPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      include: {
        author: { select: { firstName: true, lastName: true } },
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, items: posts });
  } catch (e) { next(e); }
};

export const getBlogPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: { select: { firstName: true, lastName: true } },
        tags: true,
      },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ success: true, item: post });
  } catch (e) { next(e); }
};
