import { Request, Response, Router } from "express";
import AuthMiddleware from "../middleware/middleware";
import { userValid } from "@repo/common/zod";
import bcrypt from "bcrypt"
import prisma from "@repo/database";

const signInRouter : Router = Router()

signInRouter.post("/signIn",AuthMiddleware,async function(req : Request,res:Response){
   
    
         const parshed = userValid.safeParse(req.body)
         
         if(!parshed.success){
            return res.json({
                error : parshed.error.format()
            })

         }
         try{
         const {email,password} = parshed.data
         const findUser = await prisma.user.findUnique({
            where:{
                email
            }
            
         })

         const comparePassword = await bcrypt.compare(password,findUser?.password as string)

         if(comparePassword){
            return res.json({
                message : "user successfully signedIn"
            })
         }
         return res.json({
            message : "unauthorized accesss"
         })


        
    } catch (error) {
        throw error
    }

})


export default signInRouter