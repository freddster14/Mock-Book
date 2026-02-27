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
}
export type UserRes = Omit<User, "hashedPass">;
export interface Connection {
    userId: number;
    recipientId: number;
    createdAt: Date;
}
