"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const menuitem_1 = require("../models/menuitem");
const booking_1 = require("../models/booking");
const errorhandler_1 = require("../middleware/errorhandler");
const apiresponse_1 = require("../utils/apiresponse");
exports.getDashboard = (0, errorhandler_1.asyncHandler)(async (_req, res) => {
    const [totalMenuItems, availableItems, unavailableItems, pendingBookings, confirmedBookings, recentBookings] = await Promise.all([
        menuitem_1.MenuItem.countDocuments(),
        menuitem_1.MenuItem.countDocuments({ isAvailable: true }),
        menuitem_1.MenuItem.countDocuments({ isAvailable: false }),
        booking_1.Booking.countDocuments({ status: 'pending' }),
        booking_1.Booking.countDocuments({ status: 'confirmed' }),
        booking_1.Booking.find().sort({ createdAt: -1 }).limit(5).populate('location', 'name'),
    ]);
    (0, apiresponse_1.sendSuccess)(res, {
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
