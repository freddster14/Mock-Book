import { ApiResult, Follower, Following } from "shared-types";
import { prisma } from "../../prisma/client";
import { Request, Response } from "express"

export const follow = async (req: Request<{ recipientId: string }>, res: Response<ApiResult<{ msg: string }>>) => {
  const { recipientId } = req.params;
  try {
    if(parseInt(recipientId) === req.user.userId) return res.status(400).json({ success: false, error: { type: "validation", data: [], msg: "You can not follow yourself dummy"} })
    const recipient = await prisma.user.count({ where: { id: parseInt(recipientId) }});
    if(recipient === 0) return res.status(404).json({ success: false, error: { type: 'not_found', msg: "User not found" }});

    await prisma.connection.create({
      data: {
        userId: req.user.userId,
        recipientId: parseInt(recipientId)
      }
    });
    return res.status(201).json({ success: true, data: { msg: "Followed" }})
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const followers = async (req: Request, res: Response<ApiResult<Follower[]>>) => {
  try {
    const followers = await prisma.connection.findMany({
      where: { recipientId: req.user.userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          }
        }
      }
    });

    return res.status(200).json({ success: true, data: followers })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const following = async (req: Request, res: Response<ApiResult<Following[]>>) => {
  try {
    const following = await prisma.connection.findMany({
      where: { userId: req.user.userId },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          }
        }
      }
    })
    return res.status(200).json({ success: true, data: following })
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const unfollow = async (req: Request<{ recipientId: string }>, res: Response<ApiResult<{ msg: string }>>) => {
  const { recipientId } = req.params;
  try {
    const connection = await prisma.connection.count({ where: { userId: req.user.userId, recipientId: parseInt(recipientId) }});
    if (connection === 0) return res.status(404).json({ success: false, error: { type: 'not_found', msg: 'Not following' }});

    await prisma.connection.delete({
      where: {
        userId_recipientId: {
          userId: req.user.userId,
          recipientId: parseInt(recipientId)
        }
      }
    });
    return res.status(200).json({ success: true, data: { msg: "Unfollowed" }});
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}

export const remove = async (req: Request<{ recipientId: string }>, res: Response<ApiResult<{ msg: string }>>) => {
  const { recipientId } = req.params;
  try {
    const connection = await prisma.connection.count({ where: { recipientId: req.user.userId, userId: parseInt(recipientId) }});
    if (connection === 0) return res.status(404).json({ success: false, error: { type: 'not_found', msg: 'Not a follower' }});

    await prisma.connection.delete({
      where: {
        userId_recipientId: {
          recipientId: req.user.userId,
          userId: parseInt(recipientId)
        }
      }
    });
    return res.status(200).json({ success: true, data: { msg: "Removed" }});
  } catch (error) {
    return res.status(500).json({ success: false, error: { type: 'server', msg: "Something went wrong, try again" }});
  }
}