import { Request, Response } from 'express';
import { Category } from '../models/category';
import { MenuItem } from '../models/menuitem';
import { asyncHandler } from '../middleware/errorhandler';
import { sendSuccess, sendError } from '../utils/apiresponse';
import { NotFoundError } from '../utils/errors';
import { toSlug } from '../utils/slug';

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.includeInactive === 'true';
  const filter = includeInactive ? {} : { isActive: true };
  const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 });
  sendSuccess(res, categories);
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new NotFoundError('Category not found');
  sendSuccess(res, category);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, image, sortOrder, isActive } = req.body;
  const category = await Category.create({
    name,
    slug: toSlug(name),
    image,
    sortOrder: sortOrder ?? 0,
    isActive: isActive ?? true,
  });
  sendSuccess(res, category, 'Category created', 201);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const updates: Record<string, unknown> = { ...req.body };
  if (typeof updates.name === 'string') {
    updates.slug = toSlug(updates.name);
  }

  const category = await Category.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new NotFoundError('Category not found');
  sendSuccess(res, category, 'Category updated');
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const inUse = await MenuItem.exists({ category: req.params.id });
  if (inUse) {
    return sendError(
      res,
      'Category has menu items assigned and cannot be deleted. Reassign or remove those items first.',
      409
    );
  }

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new NotFoundError('Category not found');
  sendSuccess(res, null, 'Category deleted');
});
