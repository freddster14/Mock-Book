import { Router } from "express";
import { accountSetup, create, signIn } from "../controllers";

export const index = Router();

//index.patch('/:id', update)
index.get('/', (req, res) => res.json("workin"))

index.post('/sign-up', create);
index.post('/set-up', accountSetup);
index.post('/sign-in', signIn);
// index.post('/logout', logout)