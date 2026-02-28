import { UserRes } from "./user"

export interface Like {
  postId: number,
  userId: number,
  createdAt: Date
}

export type PostLikes = Like & {
  user: UserRes
}