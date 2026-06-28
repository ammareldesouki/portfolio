import jwt from 'jsonwebtoken';
import { env } from './env';

export interface JwtPayload {
  userId: string;
  email: string;
}

export function signToken(payload: JwtPayload): string {
  const expiresIn = env.jwtExpiresIn;
  return jwt.sign(payload, env.jwtSecret, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
