import { getStore, saveStore } from '../store'

export const contentController = {
  async get() {
    return { ok: true, content: getStore().content }
  },

  async save(payload: Record<string, unknown>) {
    const s = getStore()
    s.content = { ...s.content, ...payload }
    saveStore(s)
    return { ok: true, content: s.content }
  },
}