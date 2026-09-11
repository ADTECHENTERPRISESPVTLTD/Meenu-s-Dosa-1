"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.listCategories = void 0;
const category_1 = require("../models/category");
const menuitem_1 = require("../models/menuitem");
const errorhandler_1 = require("../middleware/errorhandler");
const apiresponse_1 = require("../utils/apiresponse");
const errors_1 = require("../utils/errors");
const slug_1 = require("../utils/slug");
exports.listCategories = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const includeInactive = req.query.includeInactive === 'true';
    const filter = includeInactive ? {} : { isActive: true };
    const categories = await category_1.Category.find(filter).sort({ sortOrder: 1, name: 1 });
    (0, apiresponse_1.sendSuccess)(res, categories);
});
exports.getCategory = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const category = await category_1.Category.findById(req.params.id);
    if (!category)
        throw new errors_1.NotFoundError('Category not found');
    (0, apiresponse_1.sendSuccess)(res, category);
});
exports.createCategory = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const { name, image, sortOrder, isActive } = req.body;
    const category = await category_1.Category.create({
        name,
        slug: (0, slug_1.toSlug)(name),
        image,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
    });
    (0, apiresponse_1.sendSuccess)(res, category, 'Category created', 201);
});
exports.updateCategory = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const updates = { ...req.body };
    if (typeof updates.name === 'string') {
        updates.slug = (0, slug_1.toSlug)(updates.name);
    }
    const category = await category_1.Category.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });
    if (!category)
        throw new errors_1.NotFoundError('Category not found');
    (0, apiresponse_1.sendSuccess)(res, category, 'Category updated');
});
exports.deleteCategory = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const inUse = await menuitem_1.MenuItem.exists({ category: req.params.id });
    if (inUse) {
        return (0, apiresponse_1.sendError)(res, 'Category has menu items assigned and cannot be deleted. Reassign or remove those items first.', 409);
    }
    const category = await category_1.Category.findByIdAndDelete(req.params.id);
    if (!category)
        throw new errors_1.NotFoundError('Category not found');
    (0, apiresponse_1.sendSuccess)(res, null, 'Category deleted');
});
