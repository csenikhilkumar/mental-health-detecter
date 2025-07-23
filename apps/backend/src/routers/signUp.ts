import { Request, Response, Router } from "express";
import prisma from "@repo/database"
import bcrypt from "bcrypt"
import { userValid } from "@repo/common/zod"
import jwt  from "jsonwebtoken";
import env from "dotenv"
env.config()
const signUpRouter: Router = Router()

signUpRouter.post("/signUp", async function (req: Request, res: Response) {
    try {
        const parsed = userValid.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({
                error: parsed.error.format()

            })
        }
        const { username, email, password } = parsed.data


            const checkUser = await prisma.user.findUnique({
                where: {
                    email
                }
            })
            const hashedPassword = await bcrypt.hash(password, 10)
            if (checkUser) {
                res.status(400).json({
                    message: "user allready exist"
                })
            }
            const createUser = await prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    password: hashedPassword

                }
            })
            const id = createUser.id
            if (createUser) {
                const token = await jwt.sign({id:id},process.env.JWT_SECRET!)
                return res.json({
                    message: "user created ",
                    token: token
                })

            }
            else{
                return res.status(400).json({
                    error:"internal server error "
                })
            }

        

    } catch (error) {
        throw error

    }

})

export default signUpRouter