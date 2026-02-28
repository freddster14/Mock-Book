import { UserRes } from "./user";
export interface Post {
    id: number;
    content: string;
    imgUrl?: string | null;
    createdAt: Date;
    authorId: number;
}
export type PostBody = Omit<Post, "id" | "createdAt">;
export type PostsRes = Post & {
    author: UserRes;
    _count: {
        likes: number;
        comments: number;
    };
};
