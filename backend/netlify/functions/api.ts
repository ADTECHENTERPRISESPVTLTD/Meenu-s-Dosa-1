import serverless from 'serverless-http';
import { createApp } from '../../src/app';
import { connectDatabase } from '../../src/config/database';

const app = createApp();
const handlerPromise = serverless(app);

export async function handler(event: unknown, context: unknown) {
  await connectDatabase();
  const serverlessHandler = await handlerPromise;
  return serverlessHandler(event as never, context as never);
}
