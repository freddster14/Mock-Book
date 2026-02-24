export type ApiResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: ApiError;
};
type ApiError = ValidationError | NotFoundError | ServerError;
type ValidationError = {
    type: "validation";
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
export * from "./types/user";
export * from "./types/post";
