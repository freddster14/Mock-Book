import { Router } from "express";
import * as controller from "../controllers/user"

export const user = Router();

user.get('/', controller.users)