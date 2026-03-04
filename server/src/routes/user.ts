import { Router } from "express";
import { edit, profile, remove, users } from "../controllers/user";
import { verifyUserToken } from "../middleware/authentication";

export const user = Router();


user.get('/', verifyUserToken, users)
user.get('/:username', verifyUserToken, profile)


user.patch('/', verifyUserToken, edit)
user.delete('/', verifyUserToken, remove)