import { UserRes } from "./user";
export interface Connection {
    userId: number;
    recipientId: number;
    createdAt: Date;
}
export type Follower = Connection & {
    user: UserRes;
};
export type Following = Connection & {
    recipient: UserRes;
};
