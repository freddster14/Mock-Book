import { Router } from "express";
import { verifyUserToken } from "../middleware/authentication";
import { follow, followers, following, followingStatus, remove, unfollow } from "../controllers/connection";

export const connections = Router();

connections.get('/:username/following', verifyUserToken, following);
connections.get('/:username/followers', verifyUserToken, followers);
connections.get('/status/:recipientId', verifyUserToken, followingStatus)

connections.post('/follow/:recipientId', verifyUserToken, follow);

connections.delete('/unfollow/:recipientId', verifyUserToken, unfollow);
connections.delete('/remove/:recipientId', verifyUserToken, remove);