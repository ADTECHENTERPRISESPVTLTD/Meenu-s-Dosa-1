import { Document, Schema, Types, model } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;
  description?: string;
  price: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
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
  },
  { timestamps: true }
);

menuItemSchema.index({ category: 1, sortOrder: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ isFeatured: 1 });

export const MenuItem = model<IMenuItem>('MenuItem', menuItemSchema);
