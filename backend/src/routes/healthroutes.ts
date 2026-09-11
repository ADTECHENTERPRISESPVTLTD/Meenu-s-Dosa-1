import { Router } from 'express';
import { isDatabaseConnected } from '../config/database';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Meenu\'s Dosa API is running',
    status: 'ok',
    database: isDatabaseConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

export default router;
