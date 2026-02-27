import { Router } from "express";
import { verifyUserToken } from "../middleware/authentication";
import { comment, createPost, discoverPosts, followingPosts, like, postComments, postLikes, remove } from "../controllers/post";

export const post = Router();


post.get('/', verifyUserToken, followingPosts);
post.get('/discover', verifyUserToken, discoverPosts);
post.get('/:id/likes', verifyUserToken, postLikes);
post.get('/:id/comments', verifyUserToken, postComments);

post.post("/", verifyUserToken, createPost);
post.post('/:id/like', verifyUserToken, like);
post.post('/:id/comment', verifyUserToken, comment);

post.delete('/:id', verifyUserToken, remove);
// post.put('/:id', verifyUserToken, updatePost);