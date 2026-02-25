import { ExpressError } from "shared-types";

export class ApiError extends Error {
  type: string;
  data: ExpressError[];

  constructor(type: string, data: ExpressError[]) {
    super(type);
    this.type = type;
    this.data = data;
  }
}
