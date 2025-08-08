import express, { Request, Response, Router } from "express";
import AuthMiddleware from "../middleware/middleware";
import prisma from "@repo/database";
const moodTrendRouter: Router = Router();

moodTrendRouter.get(
  "/mood_trends",
  AuthMiddleware,
  async function (req: Request, res: Response) {
    try {
      const moodTrend = await prisma.journal.findMany({
        where: {
          userId: (req as any).userId,
        },
        select: {
          createAt: true,
          mood: true,
        },
        orderBy: { createAt: "asc" },
      });

      const enteries = await prisma.journal.findMany({
        where: {
          userId: (req as any).userId,
        },
        select: {
          createAt: true,
        },
      });
      
      res.status(200).json({
        moodTrend: moodTrend,
        enteries: enteries,
      });
    } catch (error) {
      throw error;
    }
  }
);

export default moodTrendRouter;
