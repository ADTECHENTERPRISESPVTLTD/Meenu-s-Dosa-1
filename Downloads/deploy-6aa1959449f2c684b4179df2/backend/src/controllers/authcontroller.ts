import { Request, Response } from 'express';
import { Admin } from '../models/admin';
import { asyncHandler } from '../middleware/errorhandler';
import { sendSuccess } from '../utils/apiresponse';
import { UnauthorizedError } from '../utils/errors';
import { signAdminToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
  if (!admin || !admin.isActive) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signAdminToken({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });

  sendSuccess(
    res,
    {
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    },
    'Login successful'
  );
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const admin = await Admin.findById(req.admin?.id);
  if (!admin) {
    throw new UnauthorizedError('Account not found');
  }
  sendSuccess(res, {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    lastLoginAt: admin.lastLoginAt,
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Stateless JWT: logout is handled client-side by discarding the token.
  // Endpoint exists so the frontend has a consistent, predictable session flow.
  sendSuccess(res, null, 'Logged out successfully');
});
