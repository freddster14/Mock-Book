import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { ApiResult, ProfileRes, User, UserRes } from "shared-types";
import jwt from "jsonwebtoken"
import multer from "multer"
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "../utils/cloudinary";
import { Prisma } from "../../generated/prisma/client";
import { handleValidation, validateProfile } from "../middleware/validation";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

export const users = async (req: Request<{}, {}, {}, { limit: string | undefined, search: string | undefined }>, res: Response<ApiResult<UserRes[]>>) => {
  const { limit, search } = req.query;
  const take = limit ? parseInt(limit) : 20
  try {
    if (!search) return res.status(200).json({ success: true, data: []})
    const newUsers: UserRes[] = await prisma.user.findMany({
      // Take users searched users
      take: take,
      where: {
        username: {
          contains: search,
          mode: 'insensitive'
        },
        id: { not: req.user.userId },
        // Excludes users that the user's follows
        followers: { none: { userId: req.user.userId }}
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true
      }
    })

    return res.status(200).json({ success: true, data: newUsers });
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const profileAndPost = async (req: Request<{ username: string }>, res: Response<ApiResult<ProfileRes>>) => {
  const { username } = req.params;
  try {
    const user: ProfileRes | null = await prisma.user.findFirst({
      where: { username },
      omit: {
        hashedPass: true,
        email: true,
        createdAt: true,
      },
      include: {
        posts: {
          take: 6,
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
          orderBy: {
            id: 'desc'
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          }
        }
      }
    });
    if (!user) return res.status(404).json({ success: false, error: { type: "not_found", msg: "User not found" }});

    return res.status(200).json({ success: true, data: user })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const profile = async (req: Request, res: Response<ApiResult<Omit<User, "hashedPass" | "createdAt">>>) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      omit: {
        hashedPass: true,
        createdAt: true,
      }
    })
    if (!user) return res.status(404).json({ success: false, error: { type: "not_found", msg: "User not found"}})
    return res.status(200).json({ success: true, data: user})
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}
export const edit = [ 
  upload.single('avatar'),
  ...validateProfile,
  handleValidation,
  async (req: Request<{}, {}, { username: string, bio: string }>, res: Response) => {
    const { username, bio } = req.body;
    try {
      let result;

      const existingUser: User | null = await prisma.user.findUnique({ where: { username }});     
      if (existingUser) return res.status(400).json({ success: false, error: { type: "validation", data: [{ msg: "Username is taken", path: "username", value: username }]}})

      if (req.file) {
        result = await new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'mock_book' },
            ( error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
              if(result) resolve(result);
              else reject(error);
            }
          );
          uploadStream.end(req.file!.buffer)
        })
      } 

      const queryOptions: Prisma.UserUpdateArgs = {
        where: { id: req.user.userId },
        data: {
          username,
          bio,
        },
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        }
      };

      if (result) queryOptions.data.avatarUrl = result?.secure_url;
      const user  = await prisma.user.update(queryOptions)

      const token = jwt.sign(
        { userId: user.id, username: user.username, avatarUrl: user.avatarUrl }, 
        process.env.SECRET!,
        { expiresIn: "15m" }
      )

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      return res.status(200).json({ success: true, data: { userId: user.id, username: user.username, avatarUrl: user.avatarUrl } })
    } catch (error) {
      return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
    }
  }
]

export const remove = async (req: Request, res: Response<ApiResult<{ msg: string }>>) => {
  try {
    await prisma.user.delete({ where: { id: req.user.userId }});
    return res.status(200).json({ success: true, data: { msg: "Deleted" }})
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}