export interface Post {
  id: number,
  content: string,
  imgUrl?: string,
  createdAt: Date,
  authorId: number
}

export type PostBody = Omit<Post, "id" | "createdAt">

export interface Like {
  postId: number,
  userId: number,
  createdAt: Date
}

export interface Comment {
  id: number,
  content: string,
  postId: number,
  authorId: number,
  createdAt: Date
}

export type CommentBody = Pick<Comment, "content" | "authorId">