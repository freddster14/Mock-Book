import { Router } from "express";
import { like, postLikes } from "../controllers/like";
import { remove } from "../controllers/post";
import { verifyUserToken } from "../middleware/authentication";

export const likes = Router();

likes.get('/:postId', postLikes);

likes.post('/:postId', verifyUserToken, like)

likes.delete('/:postId', verifyUserToken, remove)