import { getStore, saveStore, mongoUpdateOne } from '../store'
import { isMongoAvailable } from '../mongo'

export const contentController = {
  async get() {
    return { ok: true, content: (await getStore()).content }
  },

  async save(payload: Record<string, unknown>) {
    if (isMongoAvailable()) {
      const updated = await mongoUpdateOne('content', 'singleton', payload)
      if (updated) return { ok: true, content: payload as any }
    }
    const s = await getStore()
    s.content = { ...s.content, ...payload }
    await saveStore(s)
    return { ok: true, content: s.content }
  },
}