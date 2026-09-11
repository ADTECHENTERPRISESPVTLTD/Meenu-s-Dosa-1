import { Document, Schema, Types, model } from 'mongoose';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type OrderSource = 'direct' | 'zomato' | 'swiggy';
export type PaymentMethod = 'qr' | 'cash' | 'zomato' | 'swiggy';

export interface IOrder extends Document {
  items: { menuItem: Types.ObjectId; name: string; price: number; quantity: number }[];
  total: number;
  paymentMethod: PaymentMethod;
  source: OrderSource;
  status: OrderStatus;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  items: [{
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  }],
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['qr', 'cash', 'zomato', 'swiggy'], required: true },
  source: { type: String, enum: ['direct', 'zomato', 'swiggy'], required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'], default: 'pending' },
  paid: { type: Boolean, default: false },
}, { timestamps: true });

orderSchema.index({ status: 1, createdAt: -1 });

export const Order = model<IOrder>('Order', orderSchema);
