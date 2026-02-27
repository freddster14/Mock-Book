import { User } from "./user"

export interface Post {
  id: number,
  content: string,
  imgUrl?: string | null,
  createdAt: Date,
  authorId: number
}


export type PostBody = Omit<Post, "id" | "createdAt">

export interface Like {
  postId: number,
  userId: number,
  createdAt: Date
}

export type PostsRes = Post & {
  author: Pick<User, "id" | "avatarUrl" | "username"> ,
  _count: {
    likes: number,
    comments: number,
  }
}

export type PostLikes = Like & {
  user: Pick<User, "id" | "username">
}

export type PostComments = Comment & {
  author:  Pick<User, "id" | "username">
}


export interface Comment {
  id: number,
  content: string,
  postId: number,
  authorId: number,
  createdAt: Date
}

export type CommentBody = Pick<Comment, "content" | "authorId">