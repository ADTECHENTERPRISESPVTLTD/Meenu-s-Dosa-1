import { Document, Schema, model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80, unique: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    image: { type: String, required: true, trim: true },
    sortOrder: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.index({ sortOrder: 1 });

export const Category = model<ICategory>('Category', categorySchema);
