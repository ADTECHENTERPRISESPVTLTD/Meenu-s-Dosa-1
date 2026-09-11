"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantSettingsValidator = exports.locationUpdateValidator = exports.locationValidator = exports.bookingStatusValidator = exports.bookingValidator = exports.categoryUpdateValidator = exports.categoryValidator = exports.menuItemUpdateValidator = exports.menuItemValidator = exports.mongoIdParamValidator = exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidator = [
    (0, express_validator_1.body)('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 1 }).withMessage('Password is required'),
];
const mongoIdParamValidator = (field = 'id') => (0, express_validator_1.param)(field).isMongoId().withMessage('Invalid identifier');
exports.mongoIdParamValidator = mongoIdParamValidator;
exports.menuItemValidator = [
    (0, express_validator_1.body)('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 characters'),
    (0, express_validator_1.body)('category').isMongoId().withMessage('A valid category id is required'),
    (0, express_validator_1.body)('description').optional().trim().isLength({ max: 500 }),
    (0, express_validator_1.body)('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    (0, express_validator_1.body)('isAvailable').optional().isBoolean(),
    (0, express_validator_1.body)('isVegetarian').optional().isBoolean(),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean(),
    (0, express_validator_1.body)('sortOrder').optional().isInt({ min: 0 }),
];
exports.menuItemUpdateValidator = [
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 2, max: 120 }),
    (0, express_validator_1.body)('category').optional().isMongoId(),
    (0, express_validator_1.body)('description').optional().trim().isLength({ max: 500 }),
    (0, express_validator_1.body)('price').optional().isFloat({ min: 0 }),
    (0, express_validator_1.body)('isAvailable').optional().isBoolean(),
    (0, express_validator_1.body)('isVegetarian').optional().isBoolean(),
    (0, express_validator_1.body)('isFeatured').optional().isBoolean(),
    (0, express_validator_1.body)('sortOrder').optional().isInt({ min: 0 }),
];
exports.categoryValidator = [
    (0, express_validator_1.body)('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
    (0, express_validator_1.body)('image').trim().isLength({ min: 1 }).withMessage('Image reference is required'),
    (0, express_validator_1.body)('sortOrder').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('isActive').optional().isBoolean(),
];
exports.categoryUpdateValidator = [
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 2, max: 80 }),
    (0, express_validator_1.body)('image').optional().trim().isLength({ min: 1 }),
    (0, express_validator_1.body)('sortOrder').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('isActive').optional().isBoolean(),
];
exports.bookingValidator = [
    (0, express_validator_1.body)('customerName').trim().isLength({ min: 2, max: 100 }).withMessage('Customer name is required'),
    (0, express_validator_1.body)('phone')
        .trim()
        .matches(/^[+]?[0-9\s-]{7,15}$/)
        .withMessage('A valid phone number is required'),
    (0, express_validator_1.body)('date').isISO8601().withMessage('A valid date is required'),
    (0, express_validator_1.body)('time')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Time must be in HH:mm format'),
    (0, express_validator_1.body)('guestCount').isInt({ min: 1, max: 50 }).withMessage('Guest count must be between 1 and 50'),
    (0, express_validator_1.body)('message').optional().trim().isLength({ max: 500 }),
    (0, express_validator_1.body)('location').isMongoId().withMessage('A valid location id is required'),
];
exports.bookingStatusValidator = [
    (0, express_validator_1.body)('status')
        .isIn(['pending', 'confirmed', 'rejected', 'completed', 'cancelled'])
        .withMessage('Invalid booking status'),
];
exports.locationValidator = [
    (0, express_validator_1.body)('name').trim().isLength({ min: 2, max: 120 }).withMessage('Outlet name is required'),
    (0, express_validator_1.body)('address').trim().isLength({ min: 5, max: 300 }).withMessage('Address is required'),
    (0, express_validator_1.body)('phone')
        .trim()
        .matches(/^[+]?[0-9\s-]{7,15}$/)
        .withMessage('A valid phone number is required'),
    (0, express_validator_1.body)('hours').optional().trim().isLength({ max: 100 }),
    (0, express_validator_1.body)('openingHours').optional().isArray(),
    (0, express_validator_1.body)('mapsUrl').optional().trim().isURL().withMessage('Maps URL must be a valid URL'),
    (0, express_validator_1.body)('zomatoUrl').optional({ checkFalsy: true }).trim().isURL(),
    (0, express_validator_1.body)('swiggyUrl').optional({ checkFalsy: true }).trim().isURL(),
    (0, express_validator_1.body)('isActive').optional().isBoolean(),
];
exports.locationUpdateValidator = [
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 2, max: 120 }),
    (0, express_validator_1.body)('address').optional().trim().isLength({ min: 5, max: 300 }),
    (0, express_validator_1.body)('phone')
        .optional()
        .trim()
        .matches(/^[+]?[0-9\s-]{7,15}$/),
    (0, express_validator_1.body)('hours').optional().trim().isLength({ max: 100 }),
    (0, express_validator_1.body)('openingHours').optional().isArray(),
    (0, express_validator_1.body)('mapsUrl').optional({ checkFalsy: true }).trim().isURL(),
    (0, express_validator_1.body)('zomatoUrl').optional({ checkFalsy: true }).trim().isURL(),
    (0, express_validator_1.body)('swiggyUrl').optional({ checkFalsy: true }).trim().isURL(),
    (0, express_validator_1.body)('isActive').optional().isBoolean(),
];
exports.restaurantSettingsValidator = [
    (0, express_validator_1.body)('restaurantName').optional().trim().isLength({ min: 2, max: 120 }),
    (0, express_validator_1.body)('description').optional().trim().isLength({ max: 1000 }),
    (0, express_validator_1.body)('phone').optional().trim().isLength({ max: 20 }),
    (0, express_validator_1.body)('whatsapp').optional().trim().isLength({ max: 20 }),
    (0, express_validator_1.body)('instagram').optional().trim().isLength({ max: 200 }),
    (0, express_validator_1.body)('zomato').optional({ checkFalsy: true }).trim().isURL(),
    (0, express_validator_1.body)('swiggy').optional({ checkFalsy: true }).trim().isURL(),
    (0, express_validator_1.body)('googleMaps').optional({ checkFalsy: true }).trim().isURL(),
    (0, express_validator_1.body)('openingHoursSummary').optional().trim().isLength({ max: 300 }),
];
