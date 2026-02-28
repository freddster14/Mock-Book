import { ApiResult, CommentBody, PostComments } from "shared-types";
import { handleValidation, validateComment } from "../middleware/validation";
import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { Post } from "../../generated/prisma/client";

export const comment = [
  ...validateComment,
  handleValidation,
  async (req: Request<{ postId: string }, {}, CommentBody>, res: Response<ApiResult<{ msg: string }>>) => {
    const { postId } = req.params;
    const { content } = req.body;
    try {
      const post: Post | null = await prisma.post.findUnique({ where: { id: parseInt(postId) }});
      if (!post) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "Post not found" }});

      await prisma.comment.create({
        data: {
          content,
          postId: parseInt(postId),
          authorId: req.user.userId
        }
      });
      return res.status(201).json({ success: true, data: { msg: "Commented" }})
    } catch (error) {
      return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
    }
  }
]

export const postComments = async(req: Request<{ postId: string }>, res: Response<ApiResult<PostComments[]>>) => {
  const { postId } = req.params;
  try {
    const post = await prisma.post.count({
      where: { id: parseInt(postId)}
    }) 
    if (post === 0) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "Post not found" }});
    
    const postComments: PostComments[] = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          }
        },
      }
    });

    return res.status(200).json({ success: true , data: postComments })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const remove = async (req: Request<{ id: string }>, res: Response<ApiResult<{ msg: string }>>) => {
  const { id } = req.params;
  try {
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) }});
    if (!comment) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "Commment not found" }});
    if(comment.authorId !== req.user.userId) return res.status(403).json({ success: false, error: { type: 'authentication', msg: "Can not remove"}})
    
    await prisma.comment.delete({ where: { id: parseInt(id) }});
    return res.status(200).json({ success: true, data: { msg: "Deleted" }})
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}
