import { Router } from "express";
import { verifyUserToken } from "../middleware/authentication";
import { follow, followers, following, remove, unfollow } from "../controllers/connection";

export const connections = Router();

connections.get('/following', verifyUserToken, following);
connections.get('/followers', verifyUserToken, followers);

connections.post('/follow/:recipientId', verifyUserToken, follow);

connections.delete('/unfollow/:recipientId', verifyUserToken, unfollow);
connections.delete('/remove/:recipientId', verifyUserToken, remove);