import { Request, Response, Router } from "express";
import AuthMiddleware from "../middleware/middleware";
import prisma from "@repo/database";
const getinfoRouter : Router = Router();



getinfoRouter.get("/Journal",AuthMiddleware,async function(req:Request,res:Response){
    try{
    const findUserInfo = await prisma.journal.findMany({
        where:{
             userId : (req as any).userId
             
        },
        orderBy:{
            createAt : "desc"
        }
    }) 
        if(findUserInfo){
            return res.json({
                success : true,
                data : findUserInfo
                

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

export default getinfoRouter;