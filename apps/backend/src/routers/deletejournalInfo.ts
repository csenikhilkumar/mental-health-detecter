import { Request, Response, Router } from "express";
import AuthMiddleware from "../middleware/middleware";
import prisma from "@repo/database";
const JournalDeleteRouter: Router = Router();

JournalDeleteRouter.delete("/Journal/:id",AuthMiddleware,async function (req: Request, res: Response) {
    try {
      const params = req.params.id!;
     
      const id = parseInt(params);
      const findUserInfo = await prisma.journal.findUnique({
        where: {
          id: id,
        }
      });
      if(!findUserInfo){
        return res.status(501).json({
            message : "journal not found "
        })
      }
      else{
      const deleteUserInfo = await prisma.journal.delete({
        where: {
          id: id,
        }
      });
      if (deleteUserInfo) {
        return res.json({
          success: true,
          message: "journal deleted",
        });
      } 
       
          return res.json({
            success: false,
            message: "journal doent deleted ",
          
          })
        }
      
    } catch (error) {
      throw error
    }
  }
);

export default JournalDeleteRouter;
