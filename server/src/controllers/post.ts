import { ApiResult, Post, PostBody, PostsRes } from "shared-types";
import { prisma } from "../../prisma/client";
import { Request, Response } from "express";
import { handleValidation, validatePost } from "../middleware/validation";
import { Prisma } from "../../generated/prisma/client";
import multer from "multer";
import cloudinary from "../utils/cloudinary";
import { UploadApiResponse } from "cloudinary";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

export const followingPosts = async (req: Request<{}, {}, {}, { cursor: string }>, res: Response<ApiResult<PostsRes[]>>) => {
  const { cursor } = req.query;
  try {
    const queryArgs: Prisma.PostFindManyArgs = {
      take: 5,
      where: { 
        author: { followers: { some: { userId: req.user.userId }}},
        authorId: { not: req.user.userId }
      },
      orderBy: {
        id: 'desc'
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
    }

    if (cursor) {
      console.log(cursor, "ran")
      queryArgs.cursor = { id: Number(cursor) };
      queryArgs.skip = 1;
    } 
    // Find posts from users the current user is following
    const posts = await prisma.post.findMany(queryArgs) as unknown as PostsRes[];
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const discoverPosts = async (req: Request<{}, {}, {}, { cursor: string }>, res: Response<ApiResult<PostsRes[]>>) => {
  const { cursor } = req.query;
  try {

    const queryArgs: Prisma.PostFindManyArgs = {
      take: 5,
      where: {
        author: { followers: { none: { userId: req.user.userId }}},
        authorId: { not: req.user.userId } ,
      },
      orderBy: {
        id: 'desc'
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
    }

    if(cursor) {
      queryArgs.cursor = { id: Number(cursor) };
      queryArgs.skip = 1;
    }
    // Find posts from users the current user is not following
    const posts  = await prisma.post.findMany(queryArgs) as unknown as PostsRes[];
    return res.status(200).json({ success: true, data: posts })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
    }
  }
  
export const createPost = [
  upload.single("image"),
  ...validatePost,
  handleValidation,
  async (req: Request<{}, {}, PostBody>, res: Response<ApiResult<Post>>) => {
    const { content } = req.body;
    try {
      let result;
      if (req.file) {
        result = await new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "mock_book" },
            (error, result) => {
              if(result) resolve(result)
              else reject(error)
            }
          )
          uploadStream.end(req.file!.buffer)
        })
      }
      const queryArgs: Prisma.PostCreateArgs = {
        data: {
          content,
          authorId: req.user.userId
        },
      };

      if (result) queryArgs.data.imgUrl = result?.secure_url;
      // Create the post
      const post: Post = await prisma.post.create(queryArgs);
      return res.status(201).json({ success: true, data: post });
    } catch (error) {
      console.error(error)
      return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
    }
  }
]
// Add offset and skip - pagination for bigger posts queries
export const userPosts = async (req: Request<{ userId: string }, {}, {}, { index: string }>, res: Response<ApiResult<PostsRes[]>>) => {
  const { userId } = req.params;
  try {

    const user = await prisma.user.count({ where: { id: parseInt(userId) }});
    if (user === 0) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "User not found"}})

    const posts: PostsRes[] = await prisma.post.findMany({
      where: { authorId: parseInt(userId) },
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
    })
    return res.status(200).json({ success: true, data: posts })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

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