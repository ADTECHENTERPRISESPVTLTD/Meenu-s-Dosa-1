import { Request, Response } from 'express';
import { MenuItem } from '../models/menuitem';
import { Category } from '../models/category';
import { asyncHandler } from '../middleware/errorhandler';
import { sendSuccess } from '../utils/apiresponse';
import { NotFoundError, ValidationError } from '../utils/errors';
import { toSlug } from '../utils/slug';

export const listMenuItems = asyncHandler(async (req: Request, res: Response) => {
  const { category, available, featured, vegetarian } = req.query;

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (available !== undefined) filter.isAvailable = available === 'true';
  if (featured !== undefined) filter.isFeatured = featured === 'true';
  if (vegetarian !== undefined) filter.isVegetarian = vegetarian === 'true';

  const items = await MenuItem.find(filter)
    .populate('category', 'name slug image')
    .sort({ sortOrder: 1, name: 1 });

  sendSuccess(res, items);
});

export const getMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await MenuItem.findById(req.params.id).populate('category', 'name slug image');
  if (!item) throw new NotFoundError('Menu item not found');
  sendSuccess(res, item);
});

export const createMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const { name, category, description, price, isAvailable, isVegetarian, isFeatured, sortOrder } =
    req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ValidationError('Category does not exist', [
      { field: 'category', message: 'No category found with this id' },
    ]);
  }

  const item = await MenuItem.create({
    name,
    slug: toSlug(name),
    category,
    description,
    price,
    isAvailable: isAvailable ?? true,
    isVegetarian: isVegetarian ?? true,
    isFeatured: isFeatured ?? false,
    sortOrder: sortOrder ?? 0,
  });

  sendSuccess(res, item, 'Menu item created', 201);
});

export const updateMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const updates: Record<string, unknown> = { ...req.body };

  if (updates.category) {
    const categoryExists = await Category.findById(updates.category);
    if (!categoryExists) {
      throw new ValidationError('Category does not exist', [
        { field: 'category', message: 'No category found with this id' },
      ]);
    }
  }

  if (typeof updates.name === 'string') {
    updates.slug = toSlug(updates.name);
  }

  const item = await MenuItem.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug image');

  if (!item) throw new NotFoundError('Menu item not found');
  sendSuccess(res, item, 'Menu item updated');
});

export const deleteMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) throw new NotFoundError('Menu item not found');
  sendSuccess(res, null, 'Menu item deleted');
});
