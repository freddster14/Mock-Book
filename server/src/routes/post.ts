import { Router } from "express";
import { verifyUserToken } from "../middleware/authentication";
import { createPost, discoverPosts, followingPosts, remove, userPosts } from "../controllers/post";

export const post = Router();


post.get('/', verifyUserToken, followingPosts);
post.get('/discover', verifyUserToken, discoverPosts);
post.get('/:userId', verifyUserToken, userPosts)

post.post("/", verifyUserToken, createPost);


post.delete('/:id', verifyUserToken, remove);
