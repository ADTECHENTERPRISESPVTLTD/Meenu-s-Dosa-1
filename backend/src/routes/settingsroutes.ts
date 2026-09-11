import { Router } from 'express';
import { getRestaurantSettings, getPublicIntegrationSettings } from '../controllers/settingscontroller';

const router = Router();

router.get('/', getRestaurantSettings);
router.get('/integrations', getPublicIntegrationSettings);

export default router;
