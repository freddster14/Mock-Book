import { Post } from "./post";
export interface User {
    id: number;
    username: string;
    email: string;
    bio: string;
    hashedPass: string;
    avatarUrl?: string | null;
    createdAt: Date;
}
export type UserBody = Omit<User, "id" | "hashedPass" | "createdAt"> & {
    password: string;
};
export type UserForm = UserBody & {
    confirm: string;
};
export type UserSignInForm = {
    identifier: string;
    password: string;
};
export interface UserToken {
    userId: number;
    username: string;
    avatarUrl: string | null;
}
export type UserRes = Pick<User, "id" | "username" | "avatarUrl">;
export type ProfileRes = UserRes & {
    posts: Pick<Post, "id" | "content">[];
    bio: string;
    _count: {
        followers: number;
        following: number;
    };
};
