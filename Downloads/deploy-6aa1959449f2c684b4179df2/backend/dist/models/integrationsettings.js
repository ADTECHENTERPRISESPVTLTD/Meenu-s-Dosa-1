"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSettings = void 0;
const mongoose_1 = require("mongoose");
const integrationSettingsSchema = new mongoose_1.Schema({
    whatsappNumber: { type: String, trim: true, default: '' },
    whatsappEnabled: { type: Boolean, default: true },
    zomatoUrl: { type: String, trim: true, default: '' },
    zomatoEnabled: { type: Boolean, default: true },
    swiggyUrl: { type: String, trim: true, default: '' },
    swiggyEnabled: { type: Boolean, default: true },
    trilioEnabled: { type: Boolean, default: false },
}, { timestamps: true });
exports.IntegrationSettings = (0, mongoose_1.model)('IntegrationSettings', integrationSettingsSchema);
