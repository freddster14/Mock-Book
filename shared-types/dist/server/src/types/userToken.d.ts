declare global {
    namespace Express {
        interface Request {
            user: UserToken;
        }
    }
}
export interface UserToken {
    userId: number;
    username: string;
}
