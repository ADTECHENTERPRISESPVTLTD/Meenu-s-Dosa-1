"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItem = void 0;
const mongoose_1 = require("mongoose");
const menuItemSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number'],
    },
    isAvailable: { type: Boolean, default: true },
    isVegetarian: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true });
menuItemSchema.index({ category: 1, sortOrder: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ isFeatured: 1 });
exports.MenuItem = (0, mongoose_1.model)('MenuItem', menuItemSchema);
