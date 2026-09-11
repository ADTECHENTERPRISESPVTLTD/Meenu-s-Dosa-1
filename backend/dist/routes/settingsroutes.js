"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settingscontroller_1 = require("../controllers/settingscontroller");
const router = (0, express_1.Router)();
router.get('/', settingscontroller_1.getRestaurantSettings);
router.get('/integrations', settingscontroller_1.getPublicIntegrationSettings);
exports.default = router;
