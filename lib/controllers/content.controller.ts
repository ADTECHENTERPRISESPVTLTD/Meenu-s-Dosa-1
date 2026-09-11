import { getStore, saveStore } from '../store'

export const contentController = {
  async get() {
    return { ok: true, content: (await getStore()).content }
  },

  async save(payload: Record<string, unknown>) {
    const s = await getStore()
    s.content = { ...s.content, ...payload }
    await saveStore(s)
    return { ok: true, content: s.content }
  },
}