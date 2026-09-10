"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIntegrationSettings = exports.getPublicIntegrationSettings = exports.updateRestaurantSettings = exports.getRestaurantSettings = void 0;
const RestaurantSettings_1 = require("../models/RestaurantSettings");
const IntegrationSettings_1 = require("../models/IntegrationSettings");
const errorHandler_1 = require("../middleware/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const env_1 = require("../config/env");
async function getOrCreateSettings() {
    let settings = await RestaurantSettings_1.RestaurantSettings.findOne();
    if (!settings) {
        settings = await RestaurantSettings_1.RestaurantSettings.create({});
    }
    return settings;
}
async function getOrCreateIntegrationSettings() {
    let settings = await IntegrationSettings_1.IntegrationSettings.findOne();
    if (!settings) {
        settings = await IntegrationSettings_1.IntegrationSettings.create({
            whatsappNumber: env_1.env.whatsapp.phoneNumber,
            zomatoUrl: env_1.env.zomatoUrl,
            swiggyUrl: env_1.env.swiggyUrl,
        });
    }
    return settings;
}
exports.getRestaurantSettings = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const settings = await getOrCreateSettings();
    (0, apiResponse_1.sendSuccess)(res, settings);
});
exports.updateRestaurantSettings = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body);
    await settings.save();
    (0, apiResponse_1.sendSuccess)(res, settings, 'Settings updated');
});
// Public integration config: only non-secret destinations/flags are exposed.
exports.getPublicIntegrationSettings = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const settings = await getOrCreateIntegrationSettings();
    (0, apiResponse_1.sendSuccess)(res, {
        whatsappNumber: settings.whatsappEnabled ? settings.whatsappNumber : '',
        zomatoUrl: settings.zomatoEnabled ? settings.zomatoUrl : '',
        swiggyUrl: settings.swiggyEnabled ? settings.swiggyUrl : '',
    });
});
exports.updateIntegrationSettings = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
    (0, apiResponse_1.sendSuccess)(res, settings, 'Integration settings updated');
});
