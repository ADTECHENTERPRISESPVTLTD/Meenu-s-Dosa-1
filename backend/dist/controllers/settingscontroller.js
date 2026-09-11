"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIntegrationSettings = exports.getPublicIntegrationSettings = exports.updateRestaurantSettings = exports.getRestaurantSettings = void 0;
const restaurantsettings_1 = require("../models/restaurantsettings");
const integrationsettings_1 = require("../models/integrationsettings");
const errorhandler_1 = require("../middleware/errorhandler");
const apiresponse_1 = require("../utils/apiresponse");
const env_1 = require("../config/env");
async function getOrCreateSettings() {
    let settings = await restaurantsettings_1.RestaurantSettings.findOne();
    if (!settings) {
        settings = await restaurantsettings_1.RestaurantSettings.create({});
    }
    return settings;
}
async function getOrCreateIntegrationSettings() {
    let settings = await integrationsettings_1.IntegrationSettings.findOne();
    if (!settings) {
        settings = await integrationsettings_1.IntegrationSettings.create({
            whatsappNumber: env_1.env.whatsapp.phoneNumber,
            zomatoUrl: env_1.env.zomatoUrl,
            swiggyUrl: env_1.env.swiggyUrl,
        });
    }
    return settings;
}
exports.getRestaurantSettings = (0, errorhandler_1.asyncHandler)(async (_req, res) => {
    const settings = await getOrCreateSettings();
    (0, apiresponse_1.sendSuccess)(res, settings);
});
exports.updateRestaurantSettings = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body);
    await settings.save();
    (0, apiresponse_1.sendSuccess)(res, settings, 'Settings updated');
});
// Public integration config: only non-secret destinations/flags are exposed.
exports.getPublicIntegrationSettings = (0, errorhandler_1.asyncHandler)(async (_req, res) => {
    const settings = await getOrCreateIntegrationSettings();
    (0, apiresponse_1.sendSuccess)(res, {
        whatsappNumber: settings.whatsappEnabled ? settings.whatsappNumber : '',
        zomatoUrl: settings.zomatoEnabled ? settings.zomatoUrl : '',
        swiggyUrl: settings.swiggyEnabled ? settings.swiggyUrl : '',
    });
});
exports.updateIntegrationSettings = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const settings = await getOrCreateIntegrationSettings();
    const { whatsappNumber, whatsappEnabled, zomatoUrl, zomatoEnabled, swiggyUrl, swiggyEnabled, trilioEnabled, } = req.body;
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
    (0, apiresponse_1.sendSuccess)(res, settings, 'Integration settings updated');
});
