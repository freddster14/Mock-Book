import { Router } from "express";
import { verifyUserToken } from "../middleware/authentication";
import { createPost, discoverPosts, followingPosts, remove } from "../controllers/post";

export const post = Router();


post.get('/', verifyUserToken, followingPosts);
post.get('/discover', verifyUserToken, discoverPosts);

post.post("/", verifyUserToken, createPost);

post.delete('/:id', verifyUserToken, remove);
// post.patch('/:id', verifyUserToken, updatePost);