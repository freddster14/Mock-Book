import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { UserToken } from "shared-types";


export const verifyUserToken = (req: Request, res: Response, next: NextFunction) => {
  const token: string | null = req.cookies.token || null;

  if (!token) {
    return res.status(401).json({ success: false, error: { type: 'authentication', msg: "No token, authorization denied" }});
  }

  jwt.verify(token, process.env.SECRET!, (err, decoded) => {
    if(err instanceof TokenExpiredError) return res.status(401).json({ success: false, error: { type: 'authentication', msg: "Token expired" }})
    if (err instanceof JsonWebTokenError) return res.status(401).json({ success: false, error: { type: 'authentication', msg: "Invalid Token"}})
    
    const payload = decoded as UserToken;
    req.user = { userId: payload.userId, username: payload.username };
    next();
  });
}