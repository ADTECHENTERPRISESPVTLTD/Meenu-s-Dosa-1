import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { logger } from './utils/logger';
import { notFoundHandler, errorHandler } from './middleware/errorhandler';

import healthRoutes from './routes/healthroutes';
import authRoutes from './routes/authroutes';
import menuRoutes from './routes/menuroutes';
import categoryRoutes from './routes/categoryroutes';
import locationRoutes from './routes/locationroutes';
import bookingRoutes from './routes/bookingroutes';
import orderRoutes from './routes/orderroutes';
import settingsRoutes from './routes/settingsroutes';
import adminRoutes from './routes/adminroutes';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());

  const allowedOrigins = [env.frontendUrl, ...env.additionalAllowedOrigins].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow same-origin/non-browser requests and configured/localhost origins.
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return callback(null, true);
        }
        logger.warn(`Blocked CORS request from origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  if (env.nodeEnv !== 'test') {
    app.use(
      morgan(env.nodeEnv === 'production' ? 'combined' : 'dev', {
        stream: { write: (message: string) => logger.info(message.trim()) },
      })
    );
  }

  const apiLimiter = rateLimit({
    windowMs: env.rateLimitWindowMinutes * 60 * 1000,
    max: env.rateLimitMaxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests, please try again later',
    },
  });
  app.use('/api', apiLimiter);

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many login attempts, please try again later',
    },
  });
  app.use('/api/admin/auth/login', authLimiter);

  app.use('/api/health', healthRoutes);
  app.use('/api/admin/auth', authRoutes);
  app.use('/api/menu', menuRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/locations', locationRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
