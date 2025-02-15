import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      error: 'Token is not provided',
    });
    return;
  }

  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET!);

    if (!sub) {
      res.status(401).json({
        error: 'Invalid token',
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { id: +sub },
    });

    if (!user) {
      res.status(401).json({
        error: 'Invalid token',
      });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({
      error: 'Invalid token',
    });
    return;
  }
}
