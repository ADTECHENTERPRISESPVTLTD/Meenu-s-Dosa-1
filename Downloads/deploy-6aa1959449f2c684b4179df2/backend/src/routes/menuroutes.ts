import { Router } from 'express';
import { listMenuItems, getMenuItem } from '../controllers/menucontroller';
import { mongoIdParamValidator } from '../validators/validators';
import { handleValidation } from '../middleware/validate';

const router = Router();

router.get('/', listMenuItems);
router.get('/:id', mongoIdParamValidator(), handleValidation, getMenuItem);

export default router;
