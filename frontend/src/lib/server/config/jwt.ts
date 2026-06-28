import jwt from 'jsonwebtoken';
import { env } from './env';

export function signToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as { id: string; email: string };
}
