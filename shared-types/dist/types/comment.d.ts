import { UserRes } from "./user";
export interface Comment {
    id: number;
    content: string;
    postId: number;
    authorId: number;
    createdAt: Date;
}
export type PostComments = Comment & {
    author: UserRes;
};
export type CommentBody = Pick<Comment, "content" | "authorId">;
