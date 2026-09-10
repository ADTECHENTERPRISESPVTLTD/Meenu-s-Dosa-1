import { Request, Response } from 'express';
import { MenuItem } from '../models/menuitem';
import { Booking } from '../models/booking';
import { asyncHandler } from '../middleware/errorhandler';
import { sendSuccess } from '../utils/apiresponse';

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const [totalMenuItems, availableItems, unavailableItems, pendingBookings, confirmedBookings, recentBookings] =
    await Promise.all([
      MenuItem.countDocuments(),
      MenuItem.countDocuments({ isAvailable: true }),
      MenuItem.countDocuments({ isAvailable: false }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.find().sort({ createdAt: -1 }).limit(5).populate('location', 'name'),
    ]);

  sendSuccess(res, {
    menu: {
      total: totalMenuItems,
      available: availableItems,
      unavailable: unavailableItems,
    },
    bookings: {
      pending: pendingBookings,
      confirmed: confirmedBookings,
      recent: recentBookings,
    },
  });
});
