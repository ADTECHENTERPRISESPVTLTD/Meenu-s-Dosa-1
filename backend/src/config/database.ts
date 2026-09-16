import mongoose from 'mongoose'
import { env } from './env'
import { logger } from '../utils/logger'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

let isConnected = false
let useFileStore = false

const DB_DIR = join(process.cwd(), '.db')
const DB_FILE = join(DB_DIR, 'store.json')

function ensureDir() {
  if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true })
}

function fileRead<T>(seed: T): T {
  try {
    ensureDir()
    if (!existsSync(DB_FILE)) {
      writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8')
      return seed
    }
    return JSON.parse(readFileSync(DB_FILE, 'utf-8')) as T
  } catch {
    return seed
  }
}

function fileWrite(data: unknown): void {
  try {
    ensureDir()
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch {}
}

export function isFileStoreActive(): boolean {
  return useFileStore
}

export async function connectDatabase(): Promise<void> {
  if (isConnected) return

  if (!env.mongodbUri) {
    useFileStore = true
    fileWrite({ menu: [], categories: [], locations: [], orders: [], bookings: [], settings: {}, integrations: {} })
    logger.info('MONGODB_URI not set — using local file store at ' + DB_FILE)
    return
  }

  mongoose.set('strictQuery', true)

  mongoose.connection.on('connected', () => {
    isConnected = true
    logger.info('MongoDB connection established')
  })

  mongoose.connection.on('error', (err) => {
    isConnected = false
    logger.error(`MongoDB connection error: ${err.message}`)
  })

  mongoose.connection.on('disconnected', () => {
    isConnected = false
    logger.warn('MongoDB disconnected')
  })

  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 8000,
    } as mongoose.ConnectOptions)
  } catch (err) {
    isConnected = false
    logger.error(`Failed to connect to MongoDB: ${(err as Error).message}`)
    logger.warn('Falling back to local file store')
    useFileStore = true
  }
}

export function isDatabaseConnected(): boolean {
  return isConnected
}

export async function disconnectDatabase(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect()
    isConnected = false
  }
}

// ── File store helpers (used when MongoDB is unavailable) ──
export const fileStore = {
  read: <T>(seed: T): T => fileRead<T>(seed),
  write: (data: unknown): void => fileWrite(data),
  get path(): string { return DB_FILE },
}

export function getDbStatus() {
  return {
    mongodb: isConnected,
    fileStore: useFileStore,
    fileStorePath: useFileStore ? DB_FILE : null,
  }
}
