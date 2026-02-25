export type ApiResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: ApiError;
};
type ApiError = ValidationError | NotFoundError | ServerError | AuthenticationError;
type ExpressError = {
    msg: string;
    params: string;
    value: string;
};
type ValidationError = {
    type: "validation";
    data: ExpressError[];
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
