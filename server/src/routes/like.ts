import { Router } from "express";
import { like, postLikes, remove } from "../controllers/like";
import { verifyUserToken } from "../middleware/authentication";

export const likes = Router();

likes.get('/:postId', postLikes);

likes.post('/:postId', verifyUserToken, like)

likes.delete('/:postId', verifyUserToken, remove)