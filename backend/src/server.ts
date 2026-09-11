import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { logger } from './utils/logger';

async function start() {
  try {
    await connectDatabase();
  } catch (err) {
    logger.error('Unable to connect to the database. Server will not start.');
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(env.port, () => {
    logger.info(`Meenu's Dosa API listening on port ${env.port} (${env.nodeEnv})`);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled promise rejection: ${(reason as Error)?.message || reason}`);
  });

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err.message}`);
    server.close(() => process.exit(1));
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => process.exit(0));
  });
}

start();
