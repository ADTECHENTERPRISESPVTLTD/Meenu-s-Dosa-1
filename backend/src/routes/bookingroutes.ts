import { Router } from 'express';
import { createBooking } from '../controllers/bookingcontroller';
import { bookingValidator } from '../validators/validators';
import { handleValidation } from '../middleware/validate';

const router = Router();

router.post('/', bookingValidator, handleValidation, createBooking);

export default router;
