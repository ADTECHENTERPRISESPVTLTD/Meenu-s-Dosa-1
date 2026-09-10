"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const validators_1 = require("../validators/validators");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.post('/', validators_1.bookingValidator, validate_1.handleValidation, bookingController_1.createBooking);
exports.default = router;
