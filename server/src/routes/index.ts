import { Router } from "express";
import { accountSetup, create, logout, me, signIn } from "../controllers";
import { verifyUserToken } from "../middleware/authentication";

export const index = Router();

//index.patch('/:id', update)
index.get('/auth/me', verifyUserToken, me)
index.post('/sign-up', create);
index.post('/set-up', accountSetup);
index.post('/sign-in', signIn);
index.post('/logout', logout)
// index.post('/logout', logout)