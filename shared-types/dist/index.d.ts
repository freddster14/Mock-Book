export type ApiResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: ApiError;
};
type ApiError = ValidationError | NotFoundError | ServerError | AuthenticationError;
export type ExpressError = {
    msg: string;
    path: string;
    value: string;
};
type ValidationError = {
    type: "validation";
    data: ExpressError[];
    msg: string;
};
type NotFoundError = {
    type: "not_found";
    msg: string;
};
type ServerError = {
    type: "server";
    msg: string;
};
type AuthenticationError = {
    type: "authentication";
    msg: string;
};
export * from "./types/user";
export * from "./types/post";
export * from "./types/comment";
export * from "./types/like";
export * from "./types/connection";
