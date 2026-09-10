"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^[+]?[0-9\s-]{7,15}$/, 'Invalid phone number'],
    },
    date: { type: Date, required: true },
    time: {
        type: String,
        required: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format'],
    },
    guestCount: { type: Number, required: true, min: 1, max: 50 },
    message: { type: String, trim: true, maxlength: 500, default: '' },
    location: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Location', required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
        default: 'pending',
    },
}, { timestamps: true });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ location: 1 });
bookingSchema.index({ date: 1 });
exports.Booking = (0, mongoose_1.model)('Booking', bookingSchema);
