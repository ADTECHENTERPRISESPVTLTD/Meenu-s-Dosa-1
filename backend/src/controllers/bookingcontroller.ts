import { Request, Response } from 'express';
import { Booking } from '../models/booking';
import { Location } from '../models/location';
import { asyncHandler } from '../middleware/errorhandler';
import { sendSuccess } from '../utils/apiresponse';
import { NotFoundError, ValidationError } from '../utils/errors';
import { notifyAdminOfBooking } from '../services/notificationservice';

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const { customerName, phone, date, time, guestCount, message, location } = req.body;

  const locationExists = await Location.findById(location);
  if (!locationExists || !locationExists.isActive) {
    throw new ValidationError('Selected outlet is not available', [
      { field: 'location', message: 'No active outlet found with this id' },
    ]);
  }

  const parsedDate = new Date(date);
  if (parsedDate.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
    throw new ValidationError('Booking date cannot be in the past', [
      { field: 'date', message: 'Please choose a current or future date' },
    ]);
  }

  const booking = await Booking.create({
    customerName,
    phone,
    date: parsedDate,
    time,
    guestCount,
    message,
    location,
    status: 'pending',
  });

  await notifyAdminOfBooking(booking);

  sendSuccess(res, booking, 'Booking request received', 201);
});

export const listBookings = asyncHandler(async (req: Request, res: Response) => {
  const { status, location, from, to, page = '1', limit = '20' } = req.query as Record<
    string,
    string
  >;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (location) filter.location = location;
  if (from || to) {
    filter.date = {
      ...(from ? { $gte: new Date(from) } : {}),
      ...(to ? { $lte: new Date(to) } : {}),
    };
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('location', 'name address phone')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Booking.countDocuments(filter),
  ]);

  sendSuccess(res, {
    bookings,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id).populate('location', 'name address phone');
  if (!booking) throw new NotFoundError('Booking not found');
  sendSuccess(res, booking);
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('location', 'name address phone');

  if (!booking) throw new NotFoundError('Booking not found');
  sendSuccess(res, booking, 'Booking updated');
});
