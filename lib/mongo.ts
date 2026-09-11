import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || ''
const DB_NAME = process.env.MONGODB_DB_NAME || 'meenusdosa'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var __MEENU_MONGO_CLIENT__: MongoClient | undefined
}

let client: MongoClient | null = null
let db: Db | null = null
let connected = false

export function isMongoAvailable(): boolean {
  return Boolean(MONGODB_URI)
}

export async function connectMongo(): Promise<Db | null> {
  if (!MONGODB_URI) return null
  if (db && connected) return db

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = globalThis as any
    if (g.__MEENU_MONGO_CLIENT__) {
      client = g.__MEENU_MONGO_CLIENT__
      db = client.db(DB_NAME)
      connected = true
      return db
    }

    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    })
    await client.connect()
    db = client.db(DB_NAME)
    connected = true
    g.__MEENU_MONGO_CLIENT__ = client
    return db
  } catch (err) {
    console.error('[mongo] connection failed, falling back to file store:', err)
    connected = false
    return null
  }
}

export function getMongoDb(): Db | null {
  return connected ? db : null
}

export async function withCollection<T>(name: string, fn: (col: any) => Promise<T>): Promise<T | null> {
  const database = await connectMongo()
  if (!database) return null
  try {
    return await fn(database.collection(name))
  } catch (err) {
    console.error(`[mongo] ${name} error:`, err)
    return null
  }
}