import { Router } from 'express';
import { createOrder } from '../controllers/ordercontroller';

const router = Router();
router.post('/', createOrder);

export default router;
