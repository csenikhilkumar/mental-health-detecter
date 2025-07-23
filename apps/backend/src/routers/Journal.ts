import express, { Request, Response, Router } from "express"
import AuthMiddleware from "../middleware/middleware"
import prisma from "@repo/database"
const JournalRoute : Router= Router()



JournalRoute.post("/Journal",AuthMiddleware,async function (req:Request,res:Response){
  try{
    const {entry,mood} = req.body
        if(!entry || !mood){
            return res.json({
                message : "all fields are required"
            })
        }
        const createJournal = await prisma.journal.create({
            data:{
                entry:entry,
                mood:mood,
                userId :(req as any).userId
            }
        })
            if(createJournal){
            return res.json({
                message : "journal successfully created "
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