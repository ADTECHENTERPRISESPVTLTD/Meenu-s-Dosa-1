export type MenuItem = { id: string; name: string; price?: number; description?: string; category: string; available: boolean; vegetarian: boolean; image: string }
export type Category = { id: string; name: string; image: string; description: string }

export const siteConfig = {
  name: "Meenu's Dosa",
  tagline: 'South Indian comfort, made with care.',
  description: 'A warm, modern South Indian restaurant experience.',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  integrations: { whatsapp: '', zomato: '', swiggy: '', trilio: '', instagram: '' },
}

export const categories: Category[] = [
  ['dosas','Dosas','dosa.jpg','Crisp, golden and made to order.'], ['idli-vada-upma','Idli / Vada / Upma','idli.jpg','Steamed, soft and deeply comforting.'], ['rice','South Indian Rice','rice.jpg','Bright, homestyle rice bowls.'], ['uttapam','Uttapam','uttapam.jpg','Thick, savoury and loaded with vegetables.'], ['exclusives','Exclusives','exclusives.jpg','Specialities worth slowing down for.'], ['desserts','Desserts','desserts.jpg','A sweet finish to your meal.'], ['beverages','Cold Beverages','beverages.jpg','Chilled companions for every plate.'], ['mocktails','Mocktails / Sodas','mocktails.jpg','Refreshingly simple and bright.'],
].map(([id,name,image,description]) => ({ id, name, image, description }))

const rows: [string, string, number][] = [
['Butter Masala Dosa','dosas',209],['Butter Plain Dosa','dosas',189],['Cheese Masala Dosa','dosas',293],['Cheese Plain Dosa','dosas',278],['Masala Dosa','dosas',195],['Plain Dosa','dosas',172],['Garlic Roast Plain Dosa','dosas',285],['Ghee Roast Masala Dosa','dosas',293],['Ghee Roast Plain Dosa','dosas',274],['Mysore Masala Dosa','dosas',213],['Mysore Plain Dosa','dosas',196],['Onion Dosa','dosas',196],['Paneer Masala Dosa','dosas',253],['Paneer Plain Dosa','dosas',228],['Plain Set Dosa','dosas',204],['Podi Seeragam Set Dosa','dosas',221],['Rawa Masala Dosa','dosas',264],['Plain Rawa Dosa','dosas',238],
['Button Idli Fry','idli-vada-upma',163],['Ghee Podi Thaat Idli','idli-vada-upma',199],['Ghee Veggie Rawa Upma','idli-vada-upma',221],['Idli Sambar','idli-vada-upma',149],['Idli Vada Sambar','idli-vada-upma',159],['Molapodi Idli','idli-vada-upma',163],['Vada Sambar','idli-vada-upma',166],['Veggie Rawa Upma','idli-vada-upma',199],['Rasam Idli','idli-vada-upma',162],
['Curd Rice','rice',249],['Lemon Rice','rice',229],['Rasam Rice','rice',229],['Sambar Rice','rice',229],['Tamarind Rice','rice',229],['Tomato Rice','rice',229],
['Cheese Uttapam','uttapam',289],['Onion Uttapam','uttapam',221],['Paneer Uttapam','uttapam',279],['Regular Uttapam','uttapam',225],['Tomato Uttapam','uttapam',225],['Mixed Vegetable Uttapam','uttapam',230],
['Idiyappam','exclusives',211],['Idiyappam With Coconut Milk','exclusives',254],['Paysam','desserts',134],['Dadi Ka Halwa','desserts',162],['Kesari Halwa','desserts',119],['Pinapple Sheera','desserts',128],['Butterscotch Shake','beverages',229],['Monin Chocolate Shake','beverages',264],['Davidoff Cold Coffee','beverages',190],['Oreo Shake','beverages',209],['Swadeshi Buttermilk','beverages',99],['Hazelnut Cold Coffee','beverages',219],['Vanilla Shake','beverages',199],['Sangam Lassi','beverages',149],['Lemon Iced Tea','mocktails',149],
]
export const menu: MenuItem[] = rows.map(([name, category, price], index) => ({ id: `${category}-${index}`, name, category, price, available: true, vegetarian: true, image: categories.find(c => c.id === category)?.image || 'dosa.jpg' }))

export const locations = [{ id: 'location-1', name: "Meenu's Dosa location", address: 'Verified address to be added', phone: 'Verified phone to be added', hours: 'Opening hours to be added', mapsUrl: '' }]

export const menuService = { list: async () => menu, categories: async () => categories }
export const bookingService = { create: async (payload: Record<string, unknown>) => { if (!siteConfig.apiUrl) return { ok: false, error: 'Booking API is not connected yet.' }; const response = await fetch(`${siteConfig.apiUrl}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); return response.json() } }
export const adminService = { listMenu: () => menuService.list(), createMenu: (payload: Partial<MenuItem>) => fetch(`${siteConfig.apiUrl}/menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }), updateMenu: (id: string, payload: Partial<MenuItem>) => fetch(`${siteConfig.apiUrl}/menu/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }), deleteMenu: (id: string) => fetch(`${siteConfig.apiUrl}/menu/${id}`, { method: 'DELETE' }) }
export const categoryImage = (image: string) => `/images/categories/${image}`
export const formatPrice = (price?: number) => price === undefined ? 'Price on request' : `₹${price}`
export const getIntegrationHref = (value: string, fallback: string) => value || fallback
