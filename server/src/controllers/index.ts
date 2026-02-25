import { Request, Response } from "express";
import { ApiResult, UserBody, UserRes } from "shared-types";
import { User } from "../../generated/prisma/client";
import { prisma } from "../../prisma/client";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { handleValidation, validateProfile, validateSignUp } from "../middleware/validation";

export const create = [
  ...validateProfile,
  handleValidation,
  async (req: Request<{}, {}, UserBody>, res: Response<ApiResult<{ msg: string }>>) => {
    const { username, email, password, bio } = req.body;

    try {
      const existingUser: User | null = await prisma.user.findUnique({ where: { username }});     
      if (existingUser) return res.status(400).json({ success: false, error: { type: "validation", data: [{ msg: "Username is taken", path: "username", value: username }]}})

      const hashedPass = await bcrypt.hash(password, 10)
      const user: User = await prisma.user.create({
        data: {
          username,
          email,
          bio,
          hashedPass,
        }
      })

      const token = jwt.sign(
        { userId: user.id, userName: user.username }, 
        process.env.SECRET!,
        { expiresIn: "15m" }
      )

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes
      })

      return res.status(201).json({ success: true, data: { msg: "Created" } })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, error: { type: 'server', msg: error.message }})
      } else {
        return res.status(500).json({ success: false, error: { type: "server", msg: "Server Error" }})
      }
    }
  }
]

export const accountSetup = [
  ...validateSignUp,
  handleValidation,
  async (req: Request<{}, {}, { email: string }>, res: Response<ApiResult<{ msg: string }>>) => {
    const { email } = req.body;
    try {
      const existingUser: User | null = await prisma.user.findUnique({ where: { email }});
      if (existingUser) return res.status(400).json({ success: false, error: { type: "validation", data: [{ msg: "Email is in use", path: "email", value: email }]}})
      
      return res.status(200).json({ success: true, data: { msg: "Valid info" }})
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, error: { type: 'server', msg: error.message }})
      } else {
        return res.status(500).json({ success: false, error: { type: "server", msg: "Server Error" }})
      }
    }
  
  }
]

export const signIn = async (req:Request <{}, {}, { input: string, password: string }>, res: Response<ApiResult<{ msg: string }>>) => {
  const { input, password } = req.body;
  let user: User | null;

  try {
    if(input.includes("@")) {
      user = await prisma.user.findUnique({ where: { email: input }})
    } else {
      user = await prisma.user.findUnique({ where: { username: input }})
    }

    if(!user) return res.status(401).json({ success: false, error: { type: 'authentication', msg: "Invalid credentials"}})
    
    const match = await bcrypt.compare(password, user.hashedPass);
    if(!match) return res.status(401).json({ success: false, error: { type: 'authentication', msg: "Invalid credentials" }})

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.SECRET!,
      { expiresIn: '15m'}
    );

    res.cookie("token", token, {
      sameSite: 'strict',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000 // 15 minutes
    })

    return res.status(200).json({ success: true, data: { msg: "Logged in"} })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }})
    } else {
      return res.status(500).json({ success: false, error: { type: "server", msg: "Server Error" }})
    }
  }
}