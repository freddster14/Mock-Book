import { Router } from "express";
import { comment, postComments, remove } from "../controllers/comment";
import { verifyUserToken } from "../middleware/authentication";

export const comments = Router();

comments.get('/:postId', postComments)

comments.post('/:postId', verifyUserToken, comment)

//comments.patch('/:postId', verifyUserToken, edit)

comments.delete('/:id', verifyUserToken, remove)