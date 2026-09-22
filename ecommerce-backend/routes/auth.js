import crypto from 'crypto';
import express from 'express';
import { promisify } from 'util';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { createToken, requireAuth, serializeUser } from '../middleware/auth.js';

const router = express.Router();
const scrypt = promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const derivedKey = await scrypt(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
}

function validateCredentials(email, password) {
  return typeof email === 'string'
    && email.trim().length > 0
    && typeof password === 'string'
    && password.length >= 8;
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (typeof name !== 'string' || name.trim().length < 2 || !validateCredentials(email, password)) {
    return res.status(400).json({ error: 'Name, valid email, and password of at least 8 characters are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password)
  });
  await Order.update({ userId: user.id }, { where: { userId: null } });
  res.status(201).json({ user: serializeUser(user), token: createToken(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!validateCredentials(email, password)) {
    return res.status(400).json({ error: 'Email and password of at least 8 characters are required' });
  }

  const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({ user: serializeUser(user), token: createToken(user) });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

export default router;
