import express, { Request, Response } from "express";
import signUpRouter from "./routers/signUp";
import signInRouter from "./routers/signIn";
import JournalRoute from "./routers/Journal";
import getinfoRouter from "./routers/GetJournalInfo";
import JournalExistRouter from "./routers/JournalExist";
import JournalUpdateRouter from "./routers/UpdateJournal";
import JournalDeleteRouter from "./routers/deletejournalInfo";
import moodTrendRouter from "./routers/mood_trends";
import cors from "cors"
const app = express()
const Port = 3000
app.use(express.json())
app.use(cors())

app.use("/api/v1/routes",signUpRouter)//router for sign up
app.use("/api/v1/routes",signInRouter)//router for sign in
app.use("/api/v1/routes",JournalRoute)//router for ai response 
app.use("/api/v1/routes",getinfoRouter)//router for get journal info
app.use("/api/v1/routes",JournalExistRouter)//router for check journal exist
app.use("/api/v1/routes",JournalUpdateRouter)//router for update journal
app.use("/api/v1/routes",JournalDeleteRouter)//router for delete journal        
app.use("/api/v1/routes",moodTrendRouter)//router for mood trends




app.listen(Port,()=>{
    console.log(`server is running on the port ${Port}`)
})
