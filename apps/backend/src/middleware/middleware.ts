import { userValid } from "@repo/common/zod";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Payload } from "../../../../packages/database/src/generated/prisma/runtime/library";

async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const token =await req.headers.token;
  if (!token || typeof token !== "string") {
    return res.json({
      message: "unauthorized access ",
    });
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

      const decoded = jwt.verify(token, secret) as JwtPayload;
      (req as any).userId =decoded.id
      return next()
  } catch (error) {
    throw error;
  }
}

export default AuthMiddleware