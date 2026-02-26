import { UserToken } from "shared-types";

declare global {
  namespace Express {
    interface Request {
      user: UserToken
    }
  }
}


export {}