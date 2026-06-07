import { Request, Response, NextFunction } from 'express';

// Extend Express Request type locally for safety
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'customer' | 'artist' | 'admin';
  };
}

const JWT_SECRET = 'glambook-super-secret-key-2026';

// Decodes a simple custom base64-encoded JWT lookalike token to avoid library dependency failures
export function signToken(payload: { id: string; email: string; role: string }) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = Buffer.from(`${header}.${body}.${JWT_SECRET}`).toString('base64').substring(0, 32);
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const bodyStr = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(bodyStr);
  } catch (e) {
    return null;
  }
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Authentication token is required.' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(403).json({ message: 'Invalid or expired token.' });
    return;
  }

  req.user = decoded;
  next();
};

export const requireRole = (roles: Array<'customer' | 'artist' | 'admin'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
      return;
    }

    next();
  };
};
