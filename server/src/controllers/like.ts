import { ApiResult, Like, Post, PostLikes, PostsRes, ProfileRes } from "shared-types";
import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { Prisma } from "../../generated/prisma/client";

export const like = async (req: Request<{ postId: string }>, res: Response<ApiResult<{ msg: string }>>) => {
  const { postId } = req.params
  try {
    // Check if the post exists
    const post: Post | null = await prisma.post.findUnique({ where: { id: parseInt(postId) }});
    if (!post) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "Post not found" }});

    // Check if the like already exists
    const existingLike: Like | null = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: parseInt(postId),
          userId: req.user.userId
        }
      }
    });
    if (existingLike) return res.status(400).json({ success: false, error: { type: 'server', msg: "Post liked already"}})

    // Create the like
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
  const { cursor } = req.query;
  try {
    // Check if the post exists
    const post = await prisma.post.findFirst({
      where: { id: parseInt(postId)}
    }) 
    if (!post) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "Post not found" }});

    // Find all the likes for the post
    const queryArgs: Prisma.LikeFindManyArgs = {
      take: 10,
      where: { postId: parseInt(postId) },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          }
        }    
      }
    }

    if (cursor) {
      queryArgs.cursor = { postId_userId: { userId: Number(cursor), postId: post.id} };
      queryArgs.skip = 1;
    }

    const postLikes = await prisma.like.findMany(queryArgs) as unknown as PostLikes[];
    console.log(postLikes)
    return res.status(200).json({ success: true , data: postLikes })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}


export const recentLikes = async (
  req: Request<{ username: string }, {}, {}, { cursor: string }>,
  res: Response<ApiResult<PostsRes[]>>
) => {
  const { username } = req.params;
  const { cursor } = req.query;

  try {
    const user = await prisma.user.findUnique({ where: { username }});
    if (!user) return res.status(404).json({ success: false, error: { type: "not_found", msg: "User not found" }});

    const queryArgs: Prisma.LikeFindManyArgs = {
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6,
      include: {
        post: {
          include: {
            author: {
              select: {
                username: true,
                id: true,
                avatarUrl: true,
              }
            },
            _count: {
              select: {
                likes: true,
                comments: true
              }
            }
          }
        }
      }
    }
      
    if (cursor) {
      queryArgs.cursor = { postId_userId: { userId: user.id, postId: Number(cursor)} }
      queryArgs.skip = 1;
    }
    
    const recentLikes = await prisma.like.findMany(queryArgs) as unknown as {post: PostsRes}[];

    const posts = recentLikes.map(like => like.post);
   
    return res.status(200).json({ success: true, data: posts})
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
} 

export const likeStatus = async (req: Request<{ postId: string }>, res: Response<ApiResult<{ status: string }>>) => {
  const { postId } = req.params;
  try {
    const like = await prisma.like.count({
      where: {
        postId: parseInt(postId),
        userId: req.user.userId
      }
    })

    if (like !== 0) {
      return res.status(200).json({ success: true, data: { status: "liked"}})
    } else {
      return res.status(200).json({ success: true, data: { status: "not liked "}})
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const remove = async (req: Request<{ postId: string }>, res: Response<ApiResult<{ msg: string }>>) => {
  const { postId } = req.params;
  try {
    // Check if the like exists
    const like = await prisma.like.count({ where: { postId: parseInt(postId), userId: req.user.userId }});
    if(like === 0) return res.status(400).json({ success: false, error: { type: "not_found", msg: "Like does not exists"}});

    // Delete the like
    await prisma.like.delete({ where: { postId_userId: { postId: parseInt(postId), userId: req.user.userId }}});
    return res.status(200).json({ success: true, data: { msg: "Removed"}})
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}
  