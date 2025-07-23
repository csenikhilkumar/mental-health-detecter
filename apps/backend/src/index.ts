import express, { Request, Response } from "express";
import signUpRouter from "./routers/signUp";
import signInRouter from "./routers/signIn";
import JournalRoute from "./routers/Journal";
const app = express()
const Port = 3000
app.use(express.json())

app.use("/api/v1/routes",signUpRouter)
app.use("/api/v1/routes",signInRouter)
app.use("/api/v1/routes",JournalRoute)

app.listen(Port,()=>{
    console.log(`server is running on the port ${Port}`)
})
