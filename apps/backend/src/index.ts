import express, { Request, Response } from "express";
import signUpRouter from "./routers/signUp";
import signInRouter from "./routers/signIn";
import JournalRoute from "./routers/Journal";
import getinfoRouter from "./routers/GetJournalInfo";
import JournalExistRouter from "./routers/JournalExist";
import JournalUpdateRouter from "./routers/UpdateJournal";
import JournalDeleteRouter from "./routers/deletejournalInfo";
import moodTrendRouter from "./routers/mood_trends";
const app = express()
const Port = 3000
app.use(express.json())

app.use("/api/v1/routes",signUpRouter)
app.use("/api/v1/routes",signInRouter)
app.use("/api/v1/routes",JournalRoute)
app.use("/api/v1/routes",getinfoRouter)
app.use("/api/v1/routes",JournalExistRouter)
app.use("/api/v1/routes",JournalUpdateRouter)
app.use("/api/v1/routes",JournalDeleteRouter)
app.use("/api/v1/routes",moodTrendRouter)




app.listen(Port,()=>{
    console.log(`server is running on the port ${Port}`)
})
