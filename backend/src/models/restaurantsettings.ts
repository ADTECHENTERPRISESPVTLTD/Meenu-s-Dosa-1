import { Document, Schema, model } from 'mongoose';

export interface IRestaurantSettings extends Document {
  restaurantName: string;
  description: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  zomato: string;
  swiggy: string;
  googleMaps: string;
  openingHoursSummary: string;
  updatedAt: Date;
  createdAt: Date;
}

const restaurantSettingsSchema = new Schema<IRestaurantSettings>(
  {
    restaurantName: { type: String, required: true, trim: true, default: "Meenu's Dosa" },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    phone: { type: String, trim: true, default: '' },
    whatsapp: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' },
    zomato: { type: String, trim: true, default: '' },
    swiggy: { type: String, trim: true, default: '' },
    googleMaps: { type: String, trim: true, default: '' },
    openingHoursSummary: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const RestaurantSettings = model<IRestaurantSettings>(
  'RestaurantSettings',
  restaurantSettingsSchema
);
