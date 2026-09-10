import { Document, Schema, model } from 'mongoose';

export interface IOpeningHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string;
  close: string;
  isClosed: boolean;
}

export interface ILocation extends Document {
  name: string;
  address: string;
  phone: string;
  openingHours: IOpeningHours[];
  mapsUrl?: string;
  zomatoUrl?: string;
  swiggyUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const openingHoursSchema = new Schema<IOpeningHours>(
  {
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    open: { type: String, default: '' },
    close: { type: String, default: '' },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const locationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    address: { type: String, required: true, trim: true, maxlength: 300 },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[+]?[0-9\s-]{7,15}$/, 'Invalid phone number'],
    },
    openingHours: { type: [openingHoursSchema], default: [] },
    mapsUrl: { type: String, trim: true, default: '' },
    zomatoUrl: { type: String, trim: true, default: '' },
    swiggyUrl: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

locationSchema.index({ isActive: 1 });

export const Location = model<ILocation>('Location', locationSchema);
