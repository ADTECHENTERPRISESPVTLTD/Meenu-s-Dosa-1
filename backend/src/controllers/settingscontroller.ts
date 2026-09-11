import { Request, Response } from 'express';
import { RestaurantSettings } from '../models/restaurantsettings';
import { IntegrationSettings } from '../models/integrationsettings';
import { asyncHandler } from '../middleware/errorhandler';
import { sendSuccess } from '../utils/apiresponse';
import { env } from '../config/env';

async function getOrCreateSettings() {
  let settings = await RestaurantSettings.findOne();
  if (!settings) {
    settings = await RestaurantSettings.create({});
  }
  return settings;
}

async function getOrCreateIntegrationSettings() {
  let settings = await IntegrationSettings.findOne();
  if (!settings) {
    settings = await IntegrationSettings.create({
      whatsappNumber: env.whatsapp.phoneNumber,
      zomatoUrl: env.zomatoUrl,
      swiggyUrl: env.swiggyUrl,
    });
  }
  return settings;
}

export const getRestaurantSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getOrCreateSettings();
  sendSuccess(res, settings);
});

export const updateRestaurantSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await getOrCreateSettings();
  Object.assign(settings, req.body);
  await settings.save();
  sendSuccess(res, settings, 'Settings updated');
});

// Public integration config: only non-secret destinations/flags are exposed.
export const getPublicIntegrationSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getOrCreateIntegrationSettings();
  sendSuccess(res, {
    whatsappNumber: settings.whatsappEnabled ? settings.whatsappNumber : '',
    zomatoUrl: settings.zomatoEnabled ? settings.zomatoUrl : '',
    swiggyUrl: settings.swiggyEnabled ? settings.swiggyUrl : '',
  });
});

export const updateIntegrationSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await getOrCreateIntegrationSettings();
  const {
    whatsappNumber,
    whatsappEnabled,
    zomatoUrl,
    zomatoEnabled,
    swiggyUrl,
    swiggyEnabled,
    trilioEnabled,
  } = req.body;

  Object.assign(settings, {
    ...(whatsappNumber !== undefined ? { whatsappNumber } : {}),
    ...(whatsappEnabled !== undefined ? { whatsappEnabled } : {}),
    ...(zomatoUrl !== undefined ? { zomatoUrl } : {}),
    ...(zomatoEnabled !== undefined ? { zomatoEnabled } : {}),
    ...(swiggyUrl !== undefined ? { swiggyUrl } : {}),
    ...(swiggyEnabled !== undefined ? { swiggyEnabled } : {}),
    ...(trilioEnabled !== undefined ? { trilioEnabled } : {}),
  });

  await settings.save();
  sendSuccess(res, settings, 'Integration settings updated');
});
