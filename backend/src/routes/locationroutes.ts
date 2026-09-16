import { Router } from 'express';
import { listLocations, getLocation } from '../controllers/locationcontroller';
import { mongoIdParamValidator } from '../validators/validators';
import { handleValidation } from '../middleware/validate';

const router = Router();

router.get('/', listLocations);
router.get('/:id', mongoIdParamValidator(), handleValidation, getLocation);

export default router;
