import { Request, Response } from 'express';
import { MenuItem } from '../models/menuitem';
import { Order, OrderStatus } from '../models/order';
import { asyncHandler } from '../middleware/errorhandler';
import { sendSuccess } from '../utils/apiresponse';
import { NotFoundError, ValidationError } from '../utils/errors';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { items, paymentMethod, source } = req.body;
  if (!Array.isArray(items) || items.length === 0) throw new ValidationError('Order must contain at least one item');

  const menuItems = await MenuItem.find({ _id: { $in: items.map((item: { id: string }) => item.id) }, isAvailable: true });
  const byId = new Map(menuItems.map((item) => [String(item._id), item]));
  const orderItems = items.map((item: { id: string; quantity: number }) => {
    const menuItem = byId.get(item.id);
    if (!menuItem || !Number.isInteger(item.quantity) || item.quantity < 1) throw new ValidationError('Invalid menu item in order');
    return { menuItem: menuItem._id, name: menuItem.name, price: menuItem.price, quantity: item.quantity };
  });
  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({ items: orderItems, total, paymentMethod, source: source || 'direct' });
  sendSuccess(res, order, 'Order created', 201);
});

export const listOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  sendSuccess(res, orders);
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const updates: Record<string, unknown> = {};
  if (req.body.status) updates.status = req.body.status as OrderStatus;
  if (req.body.paid !== undefined) updates.paid = Boolean(req.body.paid);
  const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!order) throw new NotFoundError('Order not found');
  sendSuccess(res, order, 'Order updated');
});

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw new NotFoundError('Order not found');
  sendSuccess(res, null, 'Order deleted');
});
