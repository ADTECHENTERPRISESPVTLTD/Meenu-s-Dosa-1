import { Router } from 'express';
import { listCategories, getCategory } from '../controllers/categorycontroller';
import { mongoIdParamValidator } from '../validators/validators';
import { handleValidation } from '../middleware/validate';

const router = Router();

router.get('/', listCategories);
router.get('/:id', mongoIdParamValidator(), handleValidation, getCategory);

export default router;
