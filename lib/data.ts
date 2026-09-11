export type MenuItem = {
  id: string
  name: string
  price?: number
  description?: string
  category: string
  available: boolean
  vegetarian: boolean
  image: string
  isFeatured?: boolean
  sortOrder?: number
}

export type Category = {
  id: string
  name: string
  image: string
  description: string
  slug?: string
  sortOrder?: number
  isActive?: boolean
}

export type Location = {
  id: string
  name: string
  address: string
  phone: string
  hours: string
  mapsUrl?: string
  zomatoUrl?: string
  swiggyUrl?: string
  isActive?: boolean
}

export type Booking = {
  id: string
  customerName: string
  phone: string
  date: string
  time: string
  guestCount: number
  message?: string
  location: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export const siteConfig = {
  name: "Meenu's Dosa",
  tagline: '40-year heritage of crafting crispy dosas and soda-free fluffy idlis.',
  description: 'Authentic South Indian cuisine. Vegetarian. Indoor seating. Home delivery. Takeaway. Lunch & Dinner. Digital payments.',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  integrations: {
    whatsapp: 'https://linktr.ee/meenusdosa',
    zomato: 'https://www.zomato.com/bhopal/meenus-dosa-ayodhya-bypass/',
    swiggy: 'https://www.swiggy.com/city/bhopal/meenus-dosa-minal-minaal-residency-piplani-rest995939',
    trilio: '',
    instagram: 'https://instagram.com/meenusdosa',
  },
}

export const categoryImage = (image: string) => `/images/categories/${image}`
export const formatPrice = (price?: number) => price === undefined ? 'Price on request' : `₹${price}`
export const getIntegrationHref = (value: string, fallback: string) => value || fallback