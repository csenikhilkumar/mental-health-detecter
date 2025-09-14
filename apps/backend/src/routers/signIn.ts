import { Request, Response, Router } from "express";
import AuthMiddleware from "../middleware/middleware";
import { userValid1 } from "@repo/common/zod";
import bcrypt from "bcrypt";
import prisma from "@repo/database";
import jwt from "jsonwebtoken";

const signInRouter: Router = Router();

signInRouter.post("/signIn", async function (req: Request, res: Response) {
  const parshed = userValid1.safeParse(req.body);

  if (!parshed.success) {
    return res.json({
      error: parshed.error.format(),
    });
  }
  try {
    const { email, password } = parshed.data;
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!findUser) {
      res.json("user not found");
    } else {
      const comparePassword = await bcrypt.compare(
        password,
        findUser?.password as string
      );

      const id = findUser.id;
      if (!findUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!comparePassword) {
        return res.status(401).json({ error: "Password is wrong" });
      }

      const token = jwt.sign({ id }, process.env.JWT_SECRET!);
      return res.json({ message: "User successfully signed in", token });
    }
  } catch (error) {
    throw error;
  }
});
console.log(process.env.DATABASE_URL);

export default signInRouter;
