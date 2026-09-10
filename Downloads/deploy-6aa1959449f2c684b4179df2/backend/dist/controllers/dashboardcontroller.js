"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const MenuItem_1 = require("../models/MenuItem");
const Booking_1 = require("../models/Booking");
const errorHandler_1 = require("../middleware/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
exports.getDashboard = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const [totalMenuItems, availableItems, unavailableItems, pendingBookings, confirmedBookings, recentBookings] = await Promise.all([
        MenuItem_1.MenuItem.countDocuments(),
        MenuItem_1.MenuItem.countDocuments({ isAvailable: true }),
        MenuItem_1.MenuItem.countDocuments({ isAvailable: false }),
        Booking_1.Booking.countDocuments({ status: 'pending' }),
        Booking_1.Booking.countDocuments({ status: 'confirmed' }),
        Booking_1.Booking.find().sort({ createdAt: -1 }).limit(5).populate('location', 'name'),
    ]);
    (0, apiResponse_1.sendSuccess)(res, {
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
