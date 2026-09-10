import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) {
    return;
  }

  if (!env.mongodbUri) {
    logger.error('MONGODB_URI is not set. Refusing to start without a database connection.');
    throw new Error('MONGODB_URI is not configured');
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    isConnected = true;
    logger.info('MongoDB connection established');
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    logger.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    logger.warn('MongoDB disconnected');
  });

  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 8000,
    } as mongoose.ConnectOptions);
  } catch (err) {
    isConnected = false;
    logger.error(`Failed to connect to MongoDB: ${(err as Error).message}`);
    throw err;
  }
}

export function isDatabaseConnected(): boolean {
  return isConnected;
}

export async function disconnectDatabase(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}
