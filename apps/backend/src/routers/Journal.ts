import express, { Request, Response, Router } from "express"
import AuthMiddleware from "../middleware/middleware"
import prisma from "@repo/database"
import { AnalyzeEntry } from "../ai_Integeration/analyzentry"
const JournalRoute : Router= Router()



JournalRoute.post("/Journal",AuthMiddleware,async function (req:Request,res:Response){
  try{
    const {entry} = req.body
        if(!entry){
            return res.json({
                message : "all fields are required"
            })
        }
        const ai = await AnalyzeEntry(entry);
        const createJournal = await prisma.journal.create({
            data:{
                entry:entry,
                mood:ai.mood,
                suggestion :ai.reply,
                userId :(req as any).userId
            }
        })
            if(createJournal){
            return res.json({
                data:ai.reply
                
            })
        }
            else{
                return res.json({
                    message : "journal is not created "
                })
            }

  }catch(error){
    throw error
  }

         
})

export default JournalRoute