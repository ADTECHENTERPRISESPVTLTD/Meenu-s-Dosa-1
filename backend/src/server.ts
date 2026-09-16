import { createApp } from './app'
import { connectDatabase, isFileStoreActive } from './config/database'
import { env } from './config/env'
import { logger } from './utils/logger'

async function start() {
  await connectDatabase()

  if (isFileStoreActive()) {
    logger.warn('Running with file store fallback — some features may be limited')
  }

  const app = createApp()

  const server = app.listen(env.port, () => {
    logger.info(`Meenu's Dosa API listening on port ${env.port} (${env.nodeEnv})`)
  })

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled promise rejection: ${(reason as Error)?.message || reason}`)
  })

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err.message}`)
    server.close(() => process.exit(1))
  })

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully')
    server.close(() => process.exit(0))
  })
}

start()
