import { PrismaClient } from '@prisma/client';
import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../authMiddleware';

const prisma = new PrismaClient();
const r = express.Router();

r.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  const usernameTaken = await prisma.user.findFirst({
    where: { username },
  });

  if (usernameTaken) {
    res.status(409).json({
      error: 'Username is already in use',
    });
    return;
  }

  const emailTaken = await prisma.user.findFirst({
    where: { email },
  });

  if (emailTaken) {
    res.status(409).json({
      error: 'Email is already in use',
    });
    return;
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: await argon2.hash(password),
    },
  });

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' });

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  res.send();
});

r.post('/session', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    res.status(401).json({
      error: 'Invalid email or password!',
    });
    return;
  }

  const passwordValid = await argon2.verify(user.password, password);

  if (!passwordValid) {
    res.status(401).json({
      error: 'Invalid email or password!',
    });
    return;
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' });

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  res.send();
});

r.use(authMiddleware);

r.get('/users/:username', async (req, res) => {
  const username = req.params.username;
  
  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user) {
    res.status(404).json({
      error: 'User not found',
    });
    return;
  }

  res.json({
    username: user.username,
    displayName: user.displayName,
    streamName: user.streamName,
    bio: user.bio,
  });
});

export default r;
