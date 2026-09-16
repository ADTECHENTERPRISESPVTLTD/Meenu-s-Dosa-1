export type MenuItem = { id: string; name: string; price?: number; description?: string; category: string; available: boolean; vegetarian: boolean; image: string }
export type Category = { id: string; name: string; image: string; description: string }

export const siteConfig = {
  name: "Meenu's Dosa",
  tagline: 'Vanakkam! 40-year heritage of traditional South Indian Tawa Dosas, soda-free fluffy Idlis & Kumbakonam Degree Kapi.',
  description: 'Authentic South Indian vegetarian kitchen in Bhopal. 100% pure ghee, natural stone-ground fermentation, zero artificial soda. Served with love on banana-leaf style plates.',
  apiUrl: (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, ''),
  baseUrl: (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, ''),
  integrations: {
    whatsapp: 'https://linktr.ee/meenusdosa',
    zomato: 'https://www.zomato.com/bhopal/meenus-dosa-ayodhya-bypass/',
    swiggy: 'https://www.swiggy.com/city/bhopal/meenus-dosa-minal-minaal-residency-piplani-rest995939',
    trilio: '',
    instagram: 'https://instagram.com/meenusdosa',
  },
}

export const categories: Category[] = [
  ['dosas','Namma Dosas','dosa.jpg','Hand-swirled golden crisp dosas roasted with pure desi ghee on seasoned tawas.'],
  ['idli-vada-upma','Idli / Vada / Upma','idli.jpg','Fluffy 100% soda-free idlis, crunchy medu vadas & aromatic ghee rawa upma.'],
  ['rice','South Indian Rice Bowls','rice.jpg','Comforting homestyle curd rice, tangy tamarind rice & piping hot sambhar rice.'],
  ['uttapam','Savoury Uttapam','uttapam.jpg','Thick, fluffy rice pancakes loaded with fresh onions, tomatoes & podi spices.'],
  ['exclusives','South Indian Exclusives','exclusives.jpg','Specialities like Idiyappam served with freshly churned sweet coconut milk.'],
  ['desserts','Traditional Sweets','desserts.jpg','Authentic South Indian Payasam, Kesari Halwa & rich pineapple sheera.'],
  ['beverages','Degree Kapi & Beverages','beverages.jpg','Authentic Filter Coffee, Swadeshi Neer Mor (Buttermilk) & chilled shakes.'],
  ['mocktails','Mocktails & Refreshers','mocktails.jpg','Bright, cooling sodas & lemon iced teas to pair with your hot meal.'],
].map(([id,name,image,description]) => ({ id, name, image, description }))

const rows: [string, string, number][] = [
  ['Butter Masala Dosa','dosas',209],['Butter Plain Dosa','dosas',189],['Cheese Masala Dosa','dosas',293],['Cheese Plain Dosa','dosas',278],['Masala Dosa','dosas',195],['Plain Dosa','dosas',172],['Garlic Roast Plain Dosa','dosas',285],['Ghee Roast Masala Dosa','dosas',293],['Ghee Roast Plain Dosa','dosas',274],['Mysore Masala Dosa','dosas',213],['Mysore Plain Dosa','dosas',196],['Onion Dosa','dosas',196],['Paneer Masala Dosa','dosas',253],['Paneer Plain Dosa','dosas',228],['Plain Set Dosa','dosas',204],['Podi Seeragam Set Dosa','dosas',221],['Rawa Masala Dosa','dosas',264],['Plain Rawa Dosa','dosas',238],
  ['Button Idli Fry','idli-vada-upma',163],['Ghee Podi Thaat Idli','idli-vada-upma',199],['Ghee Veggie Rawa Upma','idli-vada-upma',221],['Idli Sambar','idli-vada-upma',149],['Idli Vada Sambar','idli-vada-upma',159],['Molapodi Idli','idli-vada-upma',163],['Vada Sambar','idli-vada-upma',166],['Veggie Rawa Upma','idli-vada-upma',199],['Rasam Idli','idli-vada-upma',162],
  ['Curd Rice','rice',249],['Lemon Rice','rice',229],['Rasam Rice','rice',229],['Sambar Rice','rice',229],['Tamarind Rice','rice',229],['Tomato Rice','rice',229],
  ['Cheese Uttapam','uttapam',289],['Onion Uttapam','uttapam',221],['Paneer Uttapam','uttapam',279],['Regular Uttapam','uttapam',225],['Tomato Uttapam','uttapam',225],['Mixed Vegetable Uttapam','uttapam',230],
  ['Idiyappam','exclusives',211],['Idiyappam With Coconut Milk','exclusives',254],
  ['Paysam','desserts',134],['Dadi Ka Halwa','desserts',162],['Kesari Halwa','desserts',119],['Pinapple Sheera','desserts',128],
  ['Butterscotch Shake','beverages',229],['Monin Chocolate Shake','beverages',264],['Davidoff Cold Coffee','beverages',190],['Oreo Shake','beverages',209],['Swadeshi Buttermilk','beverages',99],['Hazelnut Cold Coffee','beverages',219],['Vanilla Shake','beverages',199],['Sangam Lassi','beverages',149],
  ['Lemon Iced Tea','mocktails',149],
]
export const menu: MenuItem[] = rows.map(([name, category, price], index) => ({ id: `${category}-${index}`, name, category, price, available: true, vegetarian: true, image: categories.find(c => c.id === category)?.image || 'dosa.jpg' }))

export const locations = [
  {
    id: 'location-minal',
    name: "Meenu's Dosa — Minal Residency Outlet",
    address: 'Shop No. 21 & 22, Ground Floor, Raj Capital, Minaal Residency, J.K. Road, Ayodhya Bypass, Bhopal, MP – 462023',
    phone: '+91 6262 9555 05',
    hours: '8:00 AM – 10:30 PM (All Days)',
    mapsUrl: 'https://www.google.com/maps/place/Meenu%27s+Dosa+-+Minal+Residency',
    zomatoUrl: 'https://www.zomato.com/bhopal/meenus-dosa-ayodhya-bypass/',
    swiggyUrl: 'https://www.swiggy.com/city/bhopal/meenus-dosa-minal-minaal-residency-piplani-rest995939',
  },
  {
    id: 'location-mpnagar',
    name: "Meenu's Dosa — MP Nagar Outlet",
    address: 'Shop No. 1, Plot No. 130, Zone 2, Maharana Pratap Nagar, Bhopal, MP – 462011',
    phone: '+91 6262 9555 06',
    hours: '8:00 AM – 10:30 PM (All Days)',
    mapsUrl: 'https://www.google.com/maps/place/Meenu%27s+Dosa+-+MP+Nagar',
    zomatoUrl: 'https://www.zomato.com/bhopal/meenus-dosa-maharana-pratap-nagar/',
    swiggyUrl: 'https://www.swiggy.com/restaurants/bhopal/maharana-pratap-nagar/meenu-s-dosa-812869/dineout',
  },
]

export const menuService = {
  list: async () => {
    try {
      const res = await fetch(`${siteConfig.baseUrl}/menu`)
      const data = await res.json()
      if (data.ok && Array.isArray(data.items)) return data.items
    } catch {}
    return menu
  },
  categories: async () => categories,
}

export const bookingService = {
  create: async (payload: Record<string, unknown>) => {
    try {
      const res = await fetch(`${siteConfig.baseUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && (data.success || data.ok)) return { ok: true, booking: data.data || data.booking }
      return { ok: false, error: data.message || data.error || 'Booking failed' }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Network error. Please try again.' }
    }
  },
}

export const adminService = {
  listMenu: async () => {
    try {
      const res = await fetch(`${siteConfig.baseUrl}/menu`)
      const data = await res.json()
      if (data.ok && Array.isArray(data.items)) return data.items
    } catch {}
    return menu
  },
  createMenu: (payload: Partial<MenuItem>) =>
    fetch(`${siteConfig.baseUrl}/menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  updateMenu: (id: string, payload: Partial<MenuItem>) =>
    fetch(`${siteConfig.baseUrl}/menu`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...payload }) }),
  deleteMenu: (id: string) => fetch(`${siteConfig.baseUrl}/menu?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  listOrders: async () => {
    try {
      const res = await fetch(`${siteConfig.baseUrl}/orders`)
      const data = await res.json()
      if (data.ok && Array.isArray(data.orders)) return data.orders
    } catch {}
    return []
  },
  updateOrder: (id: string, updates: Record<string, unknown>) =>
    fetch(`${siteConfig.baseUrl}/orders`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) }),
  deleteOrder: (id: string) => fetch(`${siteConfig.baseUrl}/orders?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createOrder: (payload: Record<string, unknown>) =>
    fetch(`${siteConfig.baseUrl}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  listBookings: async () => {
    try {
      const res = await fetch(`${siteConfig.baseUrl}/bookings`)
      const data = await res.json()
      if (data.ok && Array.isArray(data.bookings)) return data.bookings
    } catch {}
    return []
  },
  updateBooking: (id: string, status: string) =>
    fetch(`${siteConfig.baseUrl}/bookings`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) }),
  deleteBooking: (id: string) => fetch(`${siteConfig.baseUrl}/bookings?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  listLocations: async () => {
    try {
      const res = await fetch(`${siteConfig.baseUrl}/locations`)
      const data = await res.json()
      if (data.ok && Array.isArray(data.locations)) return data.locations
    } catch {}
    return locations
  },
  createLocation: (payload: Record<string, unknown>) =>
    fetch(`${siteConfig.baseUrl}/locations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  deleteLocation: (id: string) => fetch(`${siteConfig.baseUrl}/locations?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  saveContent: (payload: Record<string, unknown>) =>
    fetch(`${siteConfig.baseUrl}/content`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  getContent: async () => {
    try {
      const res = await fetch(`${siteConfig.baseUrl}/content`)
      const data = await res.json()
      if (data.ok && data.content) return data.content
    } catch {}
    return null
  },
}

export const categoryImage = (image: string) => `/images/categories/${image}`
export const formatPrice = (price?: number) => price === undefined ? 'Price on request' : `₹${price}`
export const getIntegrationHref = (value: string, fallback: string) => value || fallback
