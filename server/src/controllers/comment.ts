import { ApiResult, Comment, CommentBody, PostComments } from "shared-types";
import { handleValidation, validateComment } from "../middleware/validation";
import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { Post, Prisma } from "../../generated/prisma/client";

export const comment = [
  ...validateComment,
  handleValidation,
  async (req: Request<{ postId: string }, {}, CommentBody>, res: Response<ApiResult<Comment>>) => {
    const { postId } = req.params;
    const { content } = req.body;
    try {
      // Check if the post exists
      const post: Post | null = await prisma.post.findUnique({ where: { id: parseInt(postId) }});
      if (!post) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "Post not found" }});

      // Create the comment
      const comment = await prisma.comment.create({
        data: {
          content,
          postId: parseInt(postId),
          authorId: req.user.userId
        },
        include: {
          author: {
            select: {
              username: true,
              id: true,
              avatarUrl: true
            }
          }
        }
      });
      return res.status(201).json({ success: true, data: comment})
    } catch (error) {
      return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
    }
  }
]

export const postComments = async(req: Request<{ postId: string }, {}, {}, { cursor: string}>, res: Response<ApiResult<PostComments[]>>) => {
  const { postId } = req.params;
  const { cursor } = req.query
  try {
    // Check if the post exists
    const post = await prisma.post.count({
      where: { id: parseInt(postId)}
    }) 
    if (post === 0) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "Post not found" }});
    
    const queryArgs: Prisma.CommentFindManyArgs = {
      where: { postId: parseInt(postId) },
      orderBy: {
        id: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          }
        },
      }
    }

    if (cursor) {
      queryArgs.cursor = { id: Number(cursor) };
      queryArgs.skip = 1;
    }
    // Find all the comments for the post
    const postComments: PostComments[] = await prisma.comment.findMany(queryArgs) as unknown as PostComments[];

    return res.status(200).json({ success: true , data: postComments })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const remove = async (req: Request<{ id: string }>, res: Response<ApiResult<{ msg: string }>>) => {
  const { id } = req.params;
  try {
    // Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
      include: { 
        post: {
          select: { authorId: true }
        }
      }
    });
    if (!comment) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "Commment not found" }});
    if(comment.authorId !== req.user.userId && comment.post.authorId !== req.user.userId) return res.status(403).json({ success: false, error: { type: 'authentication', msg: "Can not remove"}})
    
    // Delete the comment
    await prisma.comment.delete({ where: { id: parseInt(id) }});
    return res.status(200).json({ success: true, data: { msg: "Deleted" }})
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}
