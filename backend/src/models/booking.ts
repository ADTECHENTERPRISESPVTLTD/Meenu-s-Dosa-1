import { Document, Schema, Types, model } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

export interface IBooking extends Document {
  customerName: string;
  phone: string;
  date: Date;
  time: string;
  guestCount: number;
  message?: string;
  location: Types.ObjectId;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[+]?[0-9\s-]{7,15}$/, 'Invalid phone number'],
    },
    date: { type: Date, required: true },
    time: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format'],
    },
    guestCount: { type: Number, required: true, min: 1, max: 50 },
    message: { type: String, trim: true, maxlength: 500, default: '' },
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ location: 1 });
bookingSchema.index({ date: 1 });

export const Booking = model<IBooking>('Booking', bookingSchema);
