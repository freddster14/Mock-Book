import { Router } from "express";
import { verifyUserToken } from "../middleware/authentication";
import { follow, followers, following, remove, unfollow } from "../controllers/connection";

const connection = Router();

connection.get('/following', verifyUserToken, following);
connection.get('/followers', verifyUserToken, followers);

connection.post('/follow/:recipientId', verifyUserToken, follow);

connection.delete('/unfollow/:recipientId', verifyUserToken, unfollow);
connection.delete('/remove/:recipientId', verifyUserToken, remove);