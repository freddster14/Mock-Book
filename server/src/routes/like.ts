import { Router } from "express";
import { like, likeStatus, postLikes, recentLikes, remove } from "../controllers/like";
import { verifyUserToken } from "../middleware/authentication";

export const likes = Router();

likes.get('/:postId', postLikes);
likes.get('/status/:postId', verifyUserToken, likeStatus)
likes.get('/recent/:username', verifyUserToken, recentLikes)

likes.post('/:postId', verifyUserToken, like)

likes.delete('/:postId', verifyUserToken, remove)