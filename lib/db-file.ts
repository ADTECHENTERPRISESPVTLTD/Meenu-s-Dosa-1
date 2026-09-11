import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { Store } from './store'

const DB_DIR = join(process.cwd(), '.db')
const DB_FILE = join(DB_DIR, 'store.json')

function ensureDir() {
  if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true })
}

export function readDb(seedFactory: () => Store): Store {
  try {
    ensureDir()
    if (!existsSync(DB_FILE)) {
      const seed = seedFactory()
      writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8')
      return seed
    }
    const raw = readFileSync(DB_FILE, 'utf-8')
    return JSON.parse(raw) as Store
  } catch {
    return seedFactory()
  }
}

export function writeDb(store: Store): void {
  try {
    ensureDir()
    writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8')
  } catch {}
}