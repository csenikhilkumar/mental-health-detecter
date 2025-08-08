import { Request, Response, Router } from "express";
import AuthMiddleware from "../middleware/middleware";
import prisma from "@repo/database";
const JournalExistRouter : Router = Router();



JournalExistRouter.get("/Journal/:id",AuthMiddleware,async function(req:Request,res:Response){
    try{
    const params  = req.params.id!
    const id = parseInt(params)
    const findUserInfo = await prisma.journal.findMany({
        where:{
             id : id 
             
        },
        
    }) 
        if(findUserInfo){
            return res.json({
                success : true,
                message : "journal found",
                data : [
                    findUserInfo
                ]
                
                

            })
        }
        else{
            return res.json({
                success:false,
                message : "journal not found"
                
            })
        }
  }catch(error){
    throw error

  }
    
})

export default JournalExistRouter;