import { Document, Schema, model } from 'mongoose';

/**
 * Stores only public-facing integration configuration (links, toggle flags).
 * Private API credentials (Trilio, WhatsApp Business API tokens) live exclusively
 * in environment variables and are never persisted here or returned to clients.
 */
export interface IIntegrationSettings extends Document {
  whatsappNumber: string;
  whatsappEnabled: boolean;
  zomatoUrl: string;
  zomatoEnabled: boolean;
  swiggyUrl: string;
  swiggyEnabled: boolean;
  trilioEnabled: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const integrationSettingsSchema = new Schema<IIntegrationSettings>(
  {
    whatsappNumber: { type: String, trim: true, default: '' },
    whatsappEnabled: { type: Boolean, default: true },
    zomatoUrl: { type: String, trim: true, default: '' },
    zomatoEnabled: { type: Boolean, default: true },
    swiggyUrl: { type: String, trim: true, default: '' },
    swiggyEnabled: { type: Boolean, default: true },
    trilioEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const IntegrationSettings = model<IIntegrationSettings>(
  'IntegrationSettings',
  integrationSettingsSchema
);
