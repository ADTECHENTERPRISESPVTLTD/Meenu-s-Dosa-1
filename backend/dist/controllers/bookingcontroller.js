"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.updateBookingStatus = exports.getBooking = exports.listBookings = exports.createBooking = void 0;
const booking_1 = require("../models/booking");
const location_1 = require("../models/location");
const errorhandler_1 = require("../middleware/errorhandler");
const apiresponse_1 = require("../utils/apiresponse");
const errors_1 = require("../utils/errors");
const notificationservice_1 = require("../services/notificationservice");
exports.createBooking = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const { customerName, phone, date, time, guestCount, message, location } = req.body;
    const locationExists = await location_1.Location.findById(location);
    if (!locationExists || !locationExists.isActive) {
        throw new errors_1.ValidationError('Selected outlet is not available', [
            { field: 'location', message: 'No active outlet found with this id' },
        ]);
    }
    const parsedDate = new Date(date);
    if (parsedDate.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
        throw new errors_1.ValidationError('Booking date cannot be in the past', [
            { field: 'date', message: 'Please choose a current or future date' },
        ]);
    }
    const booking = await booking_1.Booking.create({
        customerName,
        phone,
        date: parsedDate,
        time,
        guestCount,
        message,
        location,
        status: 'pending',
    });
    await (0, notificationservice_1.notifyAdminOfBooking)(booking);
    (0, apiresponse_1.sendSuccess)(res, booking, 'Booking request received', 201);
});
exports.listBookings = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const { status, location, from, to, page = '1', limit = '20' } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    if (location)
        filter.location = location;
    if (from || to) {
        filter.date = {
            ...(from ? { $gte: new Date(from) } : {}),
            ...(to ? { $lte: new Date(to) } : {}),
        };
    }
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const [bookings, total] = await Promise.all([
        booking_1.Booking.find(filter)
            .populate('location', 'name address phone')
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum),
        booking_1.Booking.countDocuments(filter),
    ]);
    (0, apiresponse_1.sendSuccess)(res, {
        bookings,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum) || 1,
        },
    });
});
exports.getBooking = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const booking = await booking_1.Booking.findById(req.params.id).populate('location', 'name address phone');
    if (!booking)
        throw new errors_1.NotFoundError('Booking not found');
    (0, apiresponse_1.sendSuccess)(res, booking);
});
exports.updateBookingStatus = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const { status } = req.body;
    const booking = await booking_1.Booking.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }).populate('location', 'name address phone');
    if (!booking)
        throw new errors_1.NotFoundError('Booking not found');
    (0, apiresponse_1.sendSuccess)(res, booking, 'Booking updated');
});
exports.deleteBooking = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const booking = await booking_1.Booking.findByIdAndDelete(req.params.id);
    if (!booking)
        throw new errors_1.NotFoundError('Booking not found');
    (0, apiresponse_1.sendSuccess)(res, null, 'Booking deleted');
});
