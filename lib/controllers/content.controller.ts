import { store } from '../store'

export const contentController = {
  async get() {
    return { ok: true, content: store.get().content }
  },

  async save(payload: Record<string, unknown>) {
    const s = store.get()
    s.content = { ...s.content, ...payload }
    return { ok: true, content: s.content }
  },
}