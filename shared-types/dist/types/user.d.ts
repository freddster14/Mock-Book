export interface User {
    id: number;
    username: string;
    email: string;
    bio: string;
    hashedPass: string;
    avatarUrl?: string;
    createdAt: Date;
}
export type UserBody = Omit<User, "id" | "hashedPass" | "createdAt"> & {
    password: string;
};
export type UserForm = Omit<UserBody, "hashedPass" | "id" | "createdAt"> & {
    confirm: string;
};
export type UserRes = Omit<User, "hashedPass">;
export interface Connection {
    userId: number;
    recipientId: number;
    createdAt: Date;
}
