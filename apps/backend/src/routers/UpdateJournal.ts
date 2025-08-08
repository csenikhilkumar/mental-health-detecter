import { Request, Response, Router } from "express";
import AuthMiddleware from "../middleware/middleware";
import prisma from "@repo/database";
const JournalUpdateRouter: Router = Router();

JournalUpdateRouter.put("/Journal/:id",AuthMiddleware,async function (req: Request, res: Response) {
    try {
      const params = req.params.id!;
      const { entry, mood } = req.body;
      const id = parseInt(params);
      const findUserInfo = await prisma.journal.findUnique({
        where: {
          id: id,
        },
      });
      if (!findUserInfo) {
        return res.json({
          success: true,
          message: "journal not found",
        });
      } else {
        const updateUserInfo = await prisma.journal.update({
          where: {
            id: id,
          },
          data: {
            entry: entry,
            mood: mood,
          },
        });
        if (updateUserInfo) {
          return res.json({
            success: true,
            message: "journal update successfully",
            data : [
                updateUserInfo
            ]
          });
        } else {
          return res.json({
            success: false,
            message: "journal doent update",
          });
        }
      }
    } catch (error) {
      throw error;
    }
  }
);

export default JournalUpdateRouter;
