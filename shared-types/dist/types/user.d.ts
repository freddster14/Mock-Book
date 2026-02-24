export interface User {
    id: null;
    username: string;
    email: string;
    hashedPass: string;
    avatarUrl?: string;
    createdAt: Date;
}
export type UserBody = Omit<User, "id" | "hashedPass" | "createdAt"> & {
    password: string;
    confirm: string;
};
export interface Connection {
    userId: number;
    recipientId: number;
    createdAt: Date;
}
