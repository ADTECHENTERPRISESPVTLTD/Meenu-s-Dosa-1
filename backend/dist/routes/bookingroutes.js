"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingcontroller_1 = require("../controllers/bookingcontroller");
const validators_1 = require("../validators/validators");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.post('/', validators_1.bookingValidator, validate_1.handleValidation, bookingcontroller_1.createBooking);
exports.default = router;
