import { ExpressError, UserToken } from "shared-types";

export class ApiError extends Error {
  msg: string;
  type: string;
  data: ExpressError[];

  constructor( message: string, type: string, data: ExpressError[]) {
    super(message);
    this.msg = message
    this.type = type;
    this.data = data;
  }
}


export interface UserContext {
  user: UserToken | null,
  loading: boolean,
  setUser: React.Dispatch<React.SetStateAction<UserToken | null>>
}