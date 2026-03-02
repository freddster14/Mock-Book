import { ApiResult, Comment, CommentBody, Like, Post, PostBody, PostComments, PostLikes, PostsRes, UserToken } from "shared-types";
import { prisma } from "../../prisma/client";
import { Request, Response } from "express";
import { handleValidation, validateComment, validatePost } from "../middleware/validation";

export const followingPosts = async (req: Request, res: Response<ApiResult<PostsRes[]>>) => {
  try {
    // Find posts from users the current user is following
    const posts: PostsRes[] = await prisma.post.findMany({
      where: { 
        author: { followers: { some: { userId: req.user.userId }}},
        authorId: { not: req.user.userId }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      },
    });
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const discoverPosts = async (req: Request, res: Response<ApiResult<PostsRes[]>>) => {
  try {
    // Find posts from users the current user is not following
    const posts: PostsRes[]  = await prisma.post.findMany({
      where: {
        author: { followers: { none: { userId: req.user.userId }}},
        authorId: { not: req.user.userId } ,
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      }
    });
    return res.status(200).json({ success: true, data: posts })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
    }
  }
  
export const createPost = [
  ...validatePost,
  handleValidation,
  async (req: Request<{}, {}, PostBody>, res: Response<ApiResult<Post>>) => {
    const { content, imgUrl } = req.body;
    try {
      // Create the post
      const post: Post = await prisma.post.create({
        data: {
          content,
          imgUrl: imgUrl || null,
          authorId: req.user.userId
        },
      });
      return res.status(201).json({ success: true, data: post });
    } catch (error) {
      return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
    }
  }
]

export const remove = async (req: Request<{ id: string }>, res: Response<ApiResult<{ msg: string }>>) => {
  const { id } = req.params;
  try {
    // Check if the post exists
    const post: Post | null = await prisma.post.findUnique({ where: { id: parseInt(id) }});
    if (!post) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "Post not found" }});

    // Check if the user is the author of the post
    if (post.authorId !== req.user.userId) return res.status(403).json({ success: false, error: { type: "authentication", msg: "Can not delete this post"}});

    // Delete the post
    await prisma.post.delete({ where: { id: parseInt(id) }});
    return res.status(200).json({ success: true, data: { msg: "Deleted" }})
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  } 
}