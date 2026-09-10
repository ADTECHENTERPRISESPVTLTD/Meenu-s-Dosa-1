"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantSettings = void 0;
const mongoose_1 = require("mongoose");
const restaurantSettingsSchema = new mongoose_1.Schema({
    restaurantName: { type: String, required: true, trim: true, default: "Meenu's Dosa" },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    phone: { type: String, trim: true, default: '' },
    whatsapp: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' },
    zomato: { type: String, trim: true, default: '' },
    swiggy: { type: String, trim: true, default: '' },
    googleMaps: { type: String, trim: true, default: '' },
    openingHoursSummary: { type: String, trim: true, default: '' },
}, { timestamps: true });
exports.RestaurantSettings = (0, mongoose_1.model)('RestaurantSettings', restaurantSettingsSchema);
