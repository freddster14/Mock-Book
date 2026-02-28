import { ApiResult, Like, Post, PostLikes } from "shared-types";
import { Request, Response } from "express";
import { prisma } from "../../prisma/client";

export const like = async (req: Request<{ postId: string }>, res: Response<ApiResult<{ msg: string }>>) => {
  const { postId } = req.params
  try {
    const post: Post | null = await prisma.post.findUnique({ where: { id: parseInt(postId) }});
    if (!post) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "Post not found" }});

    const existingLike: Like | null = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: parseInt(postId),
          userId: req.user.userId
        }
      }
    });
    if (existingLike) return res.status(400).json({ success: false, error: { type: 'server', msg: "Post liked already"}})

    await prisma.like.create({
      data: {
        postId: parseInt(postId),
        userId: req.user.userId
      }
    });
    return res.status(201).json({ success: true, data: { msg: "Liked" }})
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const postLikes = async (req: Request<{ postId: string }>, res: Response<ApiResult<PostLikes[]>>) => {
  const { postId } = req.params
  try {
    const post = await prisma.post.count({
      where: { id: parseInt(postId)}
    }) 
    if (post === 0) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "Post not found" }});

    const postLikes: PostLikes[] = await prisma.like.findMany({
      where: { postId: parseInt(postId) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          }
        }    
      }
    });

    return res.status(200).json({ success: true , data: postLikes })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const remove = async (req: Request<{ postId: string }>, res: Response<ApiResult<{ msg: string }>>) => {
  const { postId } = req.params;
  try {
    const like = await prisma.like.count({ where: { postId: parseInt(postId), userId: req.user.userId }});
    if(like === 0) return res.status(400).json({ success: false, error: { type: "not_found", msg: "Like does not exists"}});

    await prisma.like.delete({ where: { postId_userId: { postId: parseInt(postId), userId: req.user.userId }}});
    return res.status(200).json({ success: true, data: { msg: "Removed"}})
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}
  