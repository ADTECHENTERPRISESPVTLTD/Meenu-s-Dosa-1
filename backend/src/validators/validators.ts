import { body, param } from 'express-validator';

export const loginValidator = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
];

export const mongoIdParamValidator = (field = 'id') =>
  param(field).isMongoId().withMessage('Invalid identifier');

export const menuItemValidator = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 characters'),
  body('category').isMongoId().withMessage('A valid category id is required'),
  body('description').optional().trim().isLength({ max: 500 }),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('isAvailable').optional().isBoolean(),
  body('isVegetarian').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
  body('sortOrder').optional().isInt({ min: 0 }),
];

export const menuItemUpdateValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 120 }),
  body('category').optional().isMongoId(),
  body('description').optional().trim().isLength({ max: 500 }),
  body('price').optional().isFloat({ min: 0 }),
  body('isAvailable').optional().isBoolean(),
  body('isVegetarian').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
  body('sortOrder').optional().isInt({ min: 0 }),
];

export const categoryValidator = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('image').trim().isLength({ min: 1 }).withMessage('Image reference is required'),
  body('sortOrder').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
];

export const categoryUpdateValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 80 }),
  body('image').optional().trim().isLength({ min: 1 }),
  body('sortOrder').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
];

export const bookingValidator = [
  body('customerName').trim().isLength({ min: 2, max: 100 }).withMessage('Customer name is required'),
  body('phone')
    .trim()
    .matches(/^[+]?[0-9\s-]{7,15}$/)
    .withMessage('A valid phone number is required'),
  body('date').isISO8601().withMessage('A valid date is required'),
  body('time')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Time must be in HH:mm format'),
  body('guestCount').isInt({ min: 1, max: 50 }).withMessage('Guest count must be between 1 and 50'),
  body('message').optional().trim().isLength({ max: 500 }),
  body('location')
    .isString()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('A valid outlet is required'),
];

export const bookingStatusValidator = [
  body('status')
    .isIn(['pending', 'confirmed', 'rejected', 'completed', 'cancelled'])
    .withMessage('Invalid booking status'),
];

export const locationValidator = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Outlet name is required'),
  body('address').trim().isLength({ min: 5, max: 300 }).withMessage('Address is required'),
  body('phone')
    .trim()
    .matches(/^[+]?[0-9\s-]{7,15}$/)
    .withMessage('A valid phone number is required'),
  body('hours').optional().trim().isLength({ max: 100 }),
  body('openingHours').optional().isArray(),
  body('mapsUrl').optional().trim().isURL().withMessage('Maps URL must be a valid URL'),
  body('zomatoUrl').optional({ checkFalsy: true }).trim().isURL(),
  body('swiggyUrl').optional({ checkFalsy: true }).trim().isURL(),
  body('isActive').optional().isBoolean(),
];

export const locationUpdateValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 120 }),
  body('address').optional().trim().isLength({ min: 5, max: 300 }),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[0-9\s-]{7,15}$/),
  body('hours').optional().trim().isLength({ max: 100 }),
  body('openingHours').optional().isArray(),
  body('mapsUrl').optional({ checkFalsy: true }).trim().isURL(),
  body('zomatoUrl').optional({ checkFalsy: true }).trim().isURL(),
  body('swiggyUrl').optional({ checkFalsy: true }).trim().isURL(),
  body('isActive').optional().isBoolean(),
];

export const restaurantSettingsValidator = [
  body('restaurantName').optional().trim().isLength({ min: 2, max: 120 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('whatsapp').optional().trim().isLength({ max: 20 }),
  body('instagram').optional().trim().isLength({ max: 200 }),
  body('zomato').optional({ checkFalsy: true }).trim().isURL(),
  body('swiggy').optional({ checkFalsy: true }).trim().isURL(),
  body('googleMaps').optional({ checkFalsy: true }).trim().isURL(),
  body('openingHoursSummary').optional().trim().isLength({ max: 300 }),
];
