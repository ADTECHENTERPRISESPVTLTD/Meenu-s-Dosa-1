import { NextFunction, Request, Response } from 'express';
import { Admin } from '../models/admin';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { verifyAdminToken, AdminTokenPayload } from '../utils/jwt';
import { asyncHandler } from './errorhandler';

export interface AuthenticatedRequest extends Request {
  admin?: AdminTokenPayload;
}

export const requireAdminAuth = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token is missing');
    }

    const token = authHeader.split(' ')[1];

    let payload: AdminTokenPayload;
    try {
      payload = verifyAdminToken(token);
    } catch {
      throw new UnauthorizedError('Invalid or expired authentication token');
    }

    const admin = await Admin.findById(payload.id);
    if (!admin || !admin.isActive) {
      throw new UnauthorizedError('Account no longer has access');
    }

    req.admin = payload;
    next();
  }
);

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }
    next();
  };
}
