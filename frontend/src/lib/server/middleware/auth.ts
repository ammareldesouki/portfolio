import { verifyToken } from '../config/jwt';

export function getAuthUser(request: Request): { id: string; email: string } | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    return verifyToken(authHeader.slice(7));
  } catch {
    return null;
  }
}
