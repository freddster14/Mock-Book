import { UserRes } from "./user"

export interface Connection {
  userId: number,
  recipientId: number,
  createdAt: Date
}

export type Follower = Pick<Connection, "userId" | "createdAt"> & Omit<UserRes, "id">

export type Following = Pick<Connection, "userId" | "createdAt"> & Omit<UserRes, "id">
