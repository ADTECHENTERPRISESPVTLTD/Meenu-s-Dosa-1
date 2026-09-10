import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors';

export function handleValidation(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((e) => ({
      field: 'path' in e ? e.path : undefined,
      message: e.msg,
    }));
    return next(new ValidationError('Validation failed', errors));
  }
  next();
}
