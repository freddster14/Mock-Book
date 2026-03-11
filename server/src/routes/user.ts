import { Router } from "express";
import { edit, profile, profileAndPost, remove, users } from "../controllers/user";
import { verifyUserToken } from "../middleware/authentication";

export const user = Router();


user.get('/', verifyUserToken, users)
user.get('/info', verifyUserToken, profile)
user.get('/:username', verifyUserToken, profileAndPost)


user.patch('/', verifyUserToken, edit)
user.delete('/', verifyUserToken, remove)