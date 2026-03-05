import { Request, Response } from "express";
import { ApiResult, UserBody, UserToken } from "shared-types";
import { User } from "../../generated/prisma/client";
import { prisma } from "../../prisma/client";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { handleValidation, validateProfile, validateSignIn, validateSignUp } from "../middleware/validation";

export const create = [
  ...validateProfile,
  handleValidation,
  async (req: Request<{}, {}, UserBody>, res: Response<ApiResult<{ msg: string }>>) => {
    const { username, email, password, bio } = req.body;

    try {
      // Check if the username is already taken
      const existingUser: User | null = await prisma.user.findUnique({ where: { username }});     
      if (existingUser) return res.status(400).json({ success: false, error: { type: "validation", data: [{ msg: "Username is taken", path: "username", value: username }]}})

      // Hash the password
      const hashedPass = await bcrypt.hash(password, 10)

      // Create the user
      const user: User = await prisma.user.create({
        data: {
          username,
          email,
          bio,
          hashedPass,
        }
      })

      // Create the token
      const token = jwt.sign(
        { userId: user.id, userName: user.username, avatarUrl: user.avatarUrl }, 
        process.env.SECRET!,
        { expiresIn: "15m" }
      )

      // Set the token in the cookie
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
      // Check if the email is already in use
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

export const signIn = [
  ...validateSignIn,
  handleValidation,
  async (req:Request <{}, {}, { identifier: string, password: string }>, res: Response<ApiResult<UserToken>>) => {
    const { identifier, password } = req.body;
    let user: User | null;

    try {
      // Check if the email or username is valid
      if(identifier.includes("@")) {
        user = await prisma.user.findUnique({ where: { email: identifier }})
      } else {
        user = await prisma.user.findUnique({ where: { username: identifier }})
      }

      // Check if the user exists
      if(!user) return res.status(401).json({ success: false, error: { type: 'authentication', msg: "Invalid credentials"}})
      
      // Check if the password is correct
      const match = await bcrypt.compare(password, user.hashedPass);
      if(!match) return res.status(401).json({ success: false, error: { type: 'authentication', msg: "Invalid credentials" }})

      // Create the token
      const token = jwt.sign(
        { userId: user.id, username: user.username, avatarUrl: user.avatarUrl },
        process.env.SECRET!,
        { expiresIn: '15m'}
      );

      // Set the token in the cookie
      res.cookie("token", token, {
        sameSite: 'strict',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })

      return res.status(200).json({ success: true, data: { userId: user.id, username: user.username, avatarUrl: user.avatarUrl } })
    } catch (error) {
      return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }})
    }
  }
]

export const me = async (req: Request, res: Response<ApiResult<UserToken>>) => {
  try {
    // Return the user data
    return res.status(200).json({ success: true, data: req.user })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: "server", msg: "Something went wrong, try again" }})
  } 
}

export const logout = (req: Request, res: Response<ApiResult<{ msg: string }>>) => {
  // Clear the token from the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ success: true, data: { msg: "Logged out" }})
}