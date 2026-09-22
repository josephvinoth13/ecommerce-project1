import crypto from 'crypto';
import { User } from '../models/User.js';

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || 'development-only-change-this-secret';
const TOKEN_DURATION_SECONDS = 7 * 24 * 60 * 60;

function sign(value) {
  return crypto.createHmac('sha256', TOKEN_SECRET).update(value).digest('base64url');
}

export function createToken(user) {
  const payload = Buffer.from(JSON.stringify({
    userId: user.id,
    expiresAt: Math.floor(Date.now() / 1000) + TOKEN_DURATION_SECONDS
  })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export async function requireAuth(req, res, next) {
  const authorization = req.get('Authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const [payload, signature] = token.split('.');
  if (!payload || !signature || !crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(sign(payload))
  )) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }

  try {
    const parsedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (parsedPayload.expiresAt <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: 'Authentication token has expired' });
    }

    const user = await User.findByPk(parsedPayload.userId, {
      attributes: ['id', 'name', 'email', 'role']
    });
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
}

export function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}
