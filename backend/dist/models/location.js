"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
const mongoose_1 = require("mongoose");
const openingHoursSchema = new mongoose_1.Schema({
    day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true,
    },
    open: { type: String, default: '' },
    close: { type: String, default: '' },
    isClosed: { type: Boolean, default: false },
}, { _id: false });
const locationSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    address: { type: String, required: true, trim: true, maxlength: 300 },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^[+]?[0-9\s-]{7,15}$/, 'Invalid phone number'],
    },
    hours: { type: String, trim: true, default: '' },
    openingHours: { type: [openingHoursSchema], default: [] },
    mapsUrl: { type: String, trim: true, default: '' },
    zomatoUrl: { type: String, trim: true, default: '' },
    swiggyUrl: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
locationSchema.index({ isActive: 1 });
exports.Location = (0, mongoose_1.model)('Location', locationSchema);
