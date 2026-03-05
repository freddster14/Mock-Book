import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { ApiResult, PostsRes, ProfileRes, User, UserRes } from "shared-types";

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

export const profile = async (req: Request<{ username: string }>, res: Response<ApiResult<ProfileRes>>) => {
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
          select: {
            id: true,
            content: true,
            imgUrl: true,
          },
          orderBy: {
            createdAt: 'desc'
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
    console.log(error)
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const edit = async (req: Request, res: Response) => {
  const { username, avatarUrl, bio } = req.body;
  try {
    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        username,
        avatarUrl,
        bio
      }
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const remove = async (req: Request, res: Response<ApiResult<{ msg: string }>>) => {
  try {
    await prisma.user.delete({ where: { id: req.user.userId }});
    return res.status(200).json({ success: true, data: { msg: "Deleted" }})
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}