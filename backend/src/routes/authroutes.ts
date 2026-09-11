import { Router } from 'express';
import { login, logout, me } from '../controllers/authcontroller';
import { loginValidator } from '../validators/validators';
import { handleValidation } from '../middleware/validate';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

router.post('/login', loginValidator, handleValidation, login);
router.post('/logout', requireAdminAuth, logout);
router.get('/me', requireAdminAuth, me);

export default router;
