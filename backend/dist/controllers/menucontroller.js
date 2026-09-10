"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenuItem = exports.updateMenuItem = exports.createMenuItem = exports.getMenuItem = exports.listMenuItems = void 0;
const MenuItem_1 = require("../models/MenuItem");
const Category_1 = require("../models/Category");
const errorHandler_1 = require("../middleware/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const errors_1 = require("../utils/errors");
const slug_1 = require("../utils/slug");
exports.listMenuItems = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { category, available, featured, vegetarian } = req.query;
    const filter = {};
    if (category)
        filter.category = category;
    if (available !== undefined)
        filter.isAvailable = available === 'true';
    if (featured !== undefined)
        filter.isFeatured = featured === 'true';
    if (vegetarian !== undefined)
        filter.isVegetarian = vegetarian === 'true';
    const items = await MenuItem_1.MenuItem.find(filter)
        .populate('category', 'name slug image')
        .sort({ sortOrder: 1, name: 1 });
    (0, apiResponse_1.sendSuccess)(res, items);
});
exports.getMenuItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await MenuItem_1.MenuItem.findById(req.params.id).populate('category', 'name slug image');
    if (!item)
        throw new errors_1.NotFoundError('Menu item not found');
    (0, apiResponse_1.sendSuccess)(res, item);
});
exports.createMenuItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, category, description, price, isAvailable, isVegetarian, isFeatured, sortOrder } = req.body;
    const categoryExists = await Category_1.Category.findById(category);
    if (!categoryExists) {
        throw new errors_1.ValidationError('Category does not exist', [
            { field: 'category', message: 'No category found with this id' },
        ]);
    }
    const item = await MenuItem_1.MenuItem.create({
        name,
        slug: (0, slug_1.toSlug)(name),
        category,
        description,
        price,
        isAvailable: isAvailable ?? true,
        isVegetarian: isVegetarian ?? true,
        isFeatured: isFeatured ?? false,
        sortOrder: sortOrder ?? 0,
    });
    (0, apiResponse_1.sendSuccess)(res, item, 'Menu item created', 201);
});
exports.updateMenuItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const updates = { ...req.body };
    if (updates.category) {
        const categoryExists = await Category_1.Category.findById(updates.category);
        if (!categoryExists) {
            throw new errors_1.ValidationError('Category does not exist', [
                { field: 'category', message: 'No category found with this id' },
            ]);
        }
    }
    if (typeof updates.name === 'string') {
        updates.slug = (0, slug_1.toSlug)(updates.name);
    }
    const item = await MenuItem_1.MenuItem.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    }).populate('category', 'name slug image');
    if (!item)
        throw new errors_1.NotFoundError('Menu item not found');
    (0, apiResponse_1.sendSuccess)(res, item, 'Menu item updated');
});
exports.deleteMenuItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await MenuItem_1.MenuItem.findByIdAndDelete(req.params.id);
    if (!item)
        throw new errors_1.NotFoundError('Menu item not found');
    (0, apiResponse_1.sendSuccess)(res, null, 'Menu item deleted');
});
