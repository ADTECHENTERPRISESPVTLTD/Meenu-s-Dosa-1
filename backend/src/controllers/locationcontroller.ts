import { Request, Response } from 'express';
import { Location } from '../models/location';
import { asyncHandler } from '../middleware/errorhandler';
import { sendSuccess } from '../utils/apiresponse';
import { NotFoundError } from '../utils/errors';

export const listLocations = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.includeInactive === 'true';
  const filter = includeInactive ? {} : { isActive: true };
  const locations = await Location.find(filter).sort({ name: 1 });
  sendSuccess(res, locations);
});

export const getLocation = asyncHandler(async (req: Request, res: Response) => {
  const location = await Location.findById(req.params.id);
  if (!location) throw new NotFoundError('Location not found');
  sendSuccess(res, location);
});

export const createLocation = asyncHandler(async (req: Request, res: Response) => {
  const location = await Location.create(req.body);
  sendSuccess(res, location, 'Location created', 201);
});

export const updateLocation = asyncHandler(async (req: Request, res: Response) => {
  const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!location) throw new NotFoundError('Location not found');
  sendSuccess(res, location, 'Location updated');
});

export const deleteLocation = asyncHandler(async (req: Request, res: Response) => {
  const location = await Location.findByIdAndDelete(req.params.id);
  if (!location) throw new NotFoundError('Location not found');
  sendSuccess(res, null, 'Location deleted');
});
