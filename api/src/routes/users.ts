import { PrismaClient } from '@prisma/client';
import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

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

  res.json({
    token: jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' }),
  });
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

  res.json({
    token: jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' }),
  });
});

export default r;
