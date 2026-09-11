"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const menucontroller_1 = require("../controllers/menucontroller");
const categorycontroller_1 = require("../controllers/categorycontroller");
const bookingcontroller_1 = require("../controllers/bookingcontroller");
const locationcontroller_1 = require("../controllers/locationcontroller");
const locationcontroller_2 = require("../controllers/locationcontroller");
const settingscontroller_1 = require("../controllers/settingscontroller");
const settingscontroller_2 = require("../controllers/settingscontroller");
const dashboardcontroller_1 = require("../controllers/dashboardcontroller");
const ordercontroller_1 = require("../controllers/ordercontroller");
const validators_1 = require("../validators/validators");
const router = (0, express_1.Router)();
// All admin routes require a valid admin JWT.
router.use(auth_1.requireAdminAuth);
// Dashboard
router.get('/dashboard', dashboardcontroller_1.getDashboard);
// Menu management
router.get('/menu', menucontroller_1.listMenuItems);
router.post('/menu', validators_1.menuItemValidator, validate_1.handleValidation, menucontroller_1.createMenuItem);
router.put('/menu/:id', (0, validators_1.mongoIdParamValidator)(), validators_1.menuItemUpdateValidator, validate_1.handleValidation, menucontroller_1.updateMenuItem);
router.delete('/menu/:id', (0, validators_1.mongoIdParamValidator)(), validate_1.handleValidation, (0, auth_1.requireRole)('super_admin', 'admin'), menucontroller_1.deleteMenuItem);
// Category management
router.get('/categories', categorycontroller_1.listCategories);
router.post('/categories', validators_1.categoryValidator, validate_1.handleValidation, categorycontroller_1.createCategory);
router.put('/categories/:id', (0, validators_1.mongoIdParamValidator)(), validators_1.categoryUpdateValidator, validate_1.handleValidation, categorycontroller_1.updateCategory);
router.delete('/categories/:id', (0, validators_1.mongoIdParamValidator)(), validate_1.handleValidation, (0, auth_1.requireRole)('super_admin', 'admin'), categorycontroller_1.deleteCategory);
// Booking management
router.get('/bookings', bookingcontroller_1.listBookings);
router.get('/bookings/:id', (0, validators_1.mongoIdParamValidator)(), validate_1.handleValidation, bookingcontroller_1.getBooking);
router.put('/bookings/:id', (0, validators_1.mongoIdParamValidator)(), validators_1.bookingStatusValidator, validate_1.handleValidation, bookingcontroller_1.updateBookingStatus);
router.delete('/bookings/:id', (0, validators_1.mongoIdParamValidator)(), validate_1.handleValidation, (0, auth_1.requireRole)('super_admin', 'admin'), bookingcontroller_1.deleteBooking);
// Order management
router.get('/orders', ordercontroller_1.listOrders);
router.put('/orders/:id', (0, validators_1.mongoIdParamValidator)(), validate_1.handleValidation, ordercontroller_1.updateOrder);
router.delete('/orders/:id', (0, validators_1.mongoIdParamValidator)(), validate_1.handleValidation, (0, auth_1.requireRole)('super_admin', 'admin'), ordercontroller_1.deleteOrder);
// Location management
router.get('/locations', locationcontroller_2.listLocations);
router.post('/locations', validators_1.locationValidator, validate_1.handleValidation, locationcontroller_1.createLocation);
router.put('/locations/:id', (0, validators_1.mongoIdParamValidator)(), validators_1.locationUpdateValidator, validate_1.handleValidation, locationcontroller_1.updateLocation);
router.delete('/locations/:id', (0, validators_1.mongoIdParamValidator)(), validate_1.handleValidation, (0, auth_1.requireRole)('super_admin', 'admin'), locationcontroller_1.deleteLocation);
// Restaurant + integration settings
router.get('/settings', settingscontroller_2.getRestaurantSettings);
router.get('/settings/integrations', settingscontroller_2.getPublicIntegrationSettings);
router.put('/settings', validators_1.restaurantSettingsValidator, validate_1.handleValidation, settingscontroller_1.updateRestaurantSettings);
router.put('/settings/integrations', (0, auth_1.requireRole)('super_admin', 'admin'), settingscontroller_1.updateIntegrationSettings);
exports.default = router;
