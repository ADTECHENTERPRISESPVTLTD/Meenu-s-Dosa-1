import { Router } from 'express';
import { requireAdminAuth, requireRole } from '../middleware/auth';
import { handleValidation } from '../middleware/validate';
import {
  listMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menucontroller';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categorycontroller';
import {
  listBookings,
  getBooking,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingcontroller';
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/locationcontroller';
import { listLocations } from '../controllers/locationcontroller';
import {
  updateRestaurantSettings,
  updateIntegrationSettings,
} from '../controllers/settingscontroller';
import { getRestaurantSettings, getPublicIntegrationSettings } from '../controllers/settingscontroller';
import { getDashboard } from '../controllers/dashboardcontroller';
import { listOrders, updateOrder, deleteOrder } from '../controllers/ordercontroller';
import {
  menuItemValidator,
  menuItemUpdateValidator,
  categoryValidator,
  categoryUpdateValidator,
  bookingStatusValidator,
  locationValidator,
  locationUpdateValidator,
  restaurantSettingsValidator,
  mongoIdParamValidator,
} from '../validators/validators';

const router = Router();

// All admin routes require a valid admin JWT.
router.use(requireAdminAuth);

// Dashboard
router.get('/dashboard', getDashboard);

// Menu management
router.get('/menu', listMenuItems);
router.post('/menu', menuItemValidator, handleValidation, createMenuItem);
router.put(
  '/menu/:id',
  mongoIdParamValidator(),
  menuItemUpdateValidator,
  handleValidation,
  updateMenuItem
);
router.delete(
  '/menu/:id',
  mongoIdParamValidator(),
  handleValidation,
  requireRole('super_admin', 'admin'),
  deleteMenuItem
);

// Category management
router.get('/categories', listCategories);
router.post('/categories', categoryValidator, handleValidation, createCategory);
router.put(
  '/categories/:id',
  mongoIdParamValidator(),
  categoryUpdateValidator,
  handleValidation,
  updateCategory
);
router.delete(
  '/categories/:id',
  mongoIdParamValidator(),
  handleValidation,
  requireRole('super_admin', 'admin'),
  deleteCategory
);

// Booking management
router.get('/bookings', listBookings);
router.get('/bookings/:id', mongoIdParamValidator(), handleValidation, getBooking);
router.put(
  '/bookings/:id',
  mongoIdParamValidator(),
  bookingStatusValidator,
  handleValidation,
  updateBookingStatus
);
router.delete('/bookings/:id', mongoIdParamValidator(), handleValidation, requireRole('super_admin', 'admin'), deleteBooking);

// Order management
router.get('/orders', listOrders);
router.put('/orders/:id', mongoIdParamValidator(), handleValidation, updateOrder);
router.delete('/orders/:id', mongoIdParamValidator(), handleValidation, requireRole('super_admin', 'admin'), deleteOrder);

// Location management
router.get('/locations', listLocations);
router.post('/locations', locationValidator, handleValidation, createLocation);
router.put(
  '/locations/:id',
  mongoIdParamValidator(),
  locationUpdateValidator,
  handleValidation,
  updateLocation
);
router.delete(
  '/locations/:id',
  mongoIdParamValidator(),
  handleValidation,
  requireRole('super_admin', 'admin'),
  deleteLocation
);

// Restaurant + integration settings
router.get('/settings', getRestaurantSettings);
router.get('/settings/integrations', getPublicIntegrationSettings);
router.put('/settings', restaurantSettingsValidator, handleValidation, updateRestaurantSettings);
router.put('/settings/integrations', requireRole('super_admin', 'admin'), updateIntegrationSettings);

export default router;
