"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const menuController_1 = require("../controllers/menuController");
const categoryController_1 = require("../controllers/categoryController");
const bookingController_1 = require("../controllers/bookingController");
const locationController_1 = require("../controllers/locationController");
const settingsController_1 = require("../controllers/settingsController");
const dashboardController_1 = require("../controllers/dashboardController");
const validators_1 = require("../validators/validators");
const router = (0, express_1.Router)();
// All admin routes require a valid admin JWT.
router.use(auth_1.requireAdminAuth);
// Dashboard
router.get('/dashboard', dashboardController_1.getDashboard);
// Menu management
router.post('/menu', validators_1.menuItemValidator, validate_1.handleValidation, menuController_1.createMenuItem);
router.put('/menu/:id', (0, validators_1.mongoIdParamValidator)(), validators_1.menuItemUpdateValidator, validate_1.handleValidation, menuController_1.updateMenuItem);
router.delete('/menu/:id', (0, validators_1.mongoIdParamValidator)(), validate_1.handleValidation, (0, auth_1.requireRole)('super_admin', 'admin'), menuController_1.deleteMenuItem);
// Category management
router.post('/categories', validators_1.categoryValidator, validate_1.handleValidation, categoryController_1.createCategory);
router.put('/categories/:id', (0, validators_1.mongoIdParamValidator)(), validators_1.categoryUpdateValidator, validate_1.handleValidation, categoryController_1.updateCategory);
router.delete('/categories/:id', (0, validators_1.mongoIdParamValidator)(), validate_1.handleValidation, (0, auth_1.requireRole)('super_admin', 'admin'), categoryController_1.deleteCategory);
// Booking management
router.get('/bookings', bookingController_1.listBookings);
router.get('/bookings/:id', (0, validators_1.mongoIdParamValidator)(), validate_1.handleValidation, bookingController_1.getBooking);
router.put('/bookings/:id', (0, validators_1.mongoIdParamValidator)(), validators_1.bookingStatusValidator, validate_1.handleValidation, bookingController_1.updateBookingStatus);
// Location management
router.post('/locations', validators_1.locationValidator, validate_1.handleValidation, locationController_1.createLocation);
router.put('/locations/:id', (0, validators_1.mongoIdParamValidator)(), validators_1.locationUpdateValidator, validate_1.handleValidation, locationController_1.updateLocation);
router.delete('/locations/:id', (0, validators_1.mongoIdParamValidator)(), validate_1.handleValidation, (0, auth_1.requireRole)('super_admin', 'admin'), locationController_1.deleteLocation);
// Restaurant + integration settings
router.put('/settings', validators_1.restaurantSettingsValidator, validate_1.handleValidation, settingsController_1.updateRestaurantSettings);
router.put('/settings/integrations', (0, auth_1.requireRole)('super_admin', 'admin'), settingsController_1.updateIntegrationSettings);
exports.default = router;
