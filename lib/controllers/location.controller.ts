import { getStore, saveStore, uuid, mongoInsertOne, mongoDeleteOne } from '../store'
import { isMongoAvailable } from '../mongo'

export const locationController = {
  async list() {
    return { ok: true, locations: (await getStore()).locations }
  },

  async create(payload: {
    name?: string
    address?: string
    phone?: string
    hours?: string
    mapsUrl?: string
    zomatoUrl?: string
    swiggyUrl?: string
  }) {
    if (!payload.name || !payload.address) {
      return { ok: false, error: 'name and address required', status: 400 }
    }
    const loc = {
      id: uuid(),
      name: String(payload.name),
      address: String(payload.address),
      phone: String(payload.phone || ''),
      hours: String(payload.hours || ''),
      mapsUrl: String(payload.mapsUrl || ''),
      zomatoUrl: String(payload.zomatoUrl || ''),
      swiggyUrl: String(payload.swiggyUrl || ''),
    }
    if (isMongoAvailable()) {
      const inserted = await mongoInsertOne('locations', loc)
      if (inserted) return { ok: true, location: loc, status: 201 }
    }
    const s = await getStore()
    s.locations.push(loc)
    await saveStore(s)
    return { ok: true, location: loc, status: 201 }
  },

  async remove(id: string) {
    if (!id) return { ok: false, error: 'id required', status: 400 }
    if (isMongoAvailable()) {
      const deleted = await mongoDeleteOne('locations', id)
      if (deleted) return { ok: true, deleted: 1 }
    }
    const s = await getStore()
    const before = s.locations.length
    s.locations = s.locations.filter((l) => l.id !== id)
    await saveStore(s)
    return { ok: true, deleted: before - s.locations.length }
  },
}