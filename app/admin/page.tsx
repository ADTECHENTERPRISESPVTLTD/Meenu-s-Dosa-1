'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Pencil, Plus, Trash2, X, Calendar, MapPin, Globe } from 'lucide-react'
import { menu as initialMenu, categories, formatPrice, siteConfig, type MenuItem } from '@/lib/data'
import { Shell } from '@/components/site-shell'

const ADMIN_EMAIL = ''
const ADMIN_PASSWORD = ''
const SESSION_KEY = ''
const ORDER_HISTORY_KEY = 'meenu-dosa-orders'
const BOOKINGS_KEY = 'meenu-dosa-bookings'
const LOCATIONS_KEY = 'meenu-dosa-locations'
const CONTENT_KEY = 'meenu-dosa-content'

type Tab = 'dashboard' | 'orders' | 'bookings' | 'menu' | 'locations' | 'content' | 'settings'
type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
type PaymentMethod = 'qr' | 'cash' | 'zomato' | 'swiggy'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  date: number
  items: OrderItem[]
  total: number
  paymentMethod: PaymentMethod
  source: 'direct' | 'zomato' | 'swiggy'
  status: OrderStatus
  paid: boolean
}

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/15 text-yellow-700',
  confirmed: 'bg-blue-500/15 text-blue-700',
  preparing: 'bg-orange-500/15 text-orange-700',
  ready: 'bg-green-500/15 text-green-700',
  delivered: 'bg-primary/15 text-primary',
  cancelled: 'bg-destructive/15 text-destructive',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [menuItems, setMenuItems] = useState(initialMenu)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState({ name: '', category: categories[0]?.id ?? '', price: '' })
  const [orders, setOrders] = useState<Order[]>([])
  const [orderFilter, setOrderFilter] = useState<'all' | 'direct' | 'zomato' | 'swiggy'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all')
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all')
  const [bookings, setBookings] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [content, setContent] = useState({ name: siteConfig.name, tagline: siteConfig.tagline, description: siteConfig.description, phone: '', whatsapp: '', instagram: '', zomato: siteConfig.integrations.zomato, swiggy: siteConfig.integrations.swiggy })
  const [contentSaving, setContentSaving] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ORDER_HISTORY_KEY)
      if (stored) setOrders(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BOOKINGS_KEY)
      if (stored) setBookings(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCATIONS_KEY)
      if (stored) setLocations(JSON.parse(stored))
    } catch {}
  }, [])

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order))
    try {
      localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders.map((order) => order.id === orderId ? { ...order, status } : order)))
    } catch {}
  }

  const togglePaymentStatus = (orderId: string) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, paid: !order.paid } : order))
    try {
      localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders.map((order) => order.id === orderId ? { ...order, paid: !order.paid } : order)))
    } catch {}
  }

  const deleteOrder = (orderId: string) => {
    if (window.confirm('Delete this order?')) {
      setOrders((current) => current.filter((order) => order.id !== orderId))
      try {
        localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders.filter((order) => order.id !== orderId)))
      } catch {}
    }
  }

  const saveItem = (event: React.FormEvent) => {
    event.preventDefault()
    const name = form.name.trim()
    const price = Number(form.price)
    if (!name || !Number.isFinite(price) || price <= 0) return
    if (editing) {
      setMenuItems((current) => current.map((item) => item.id === editing.id ? { ...item, name, category: form.category, price } : item))
    } else {
      setMenuItems((current) => [{ id: `draft-${Date.now()}`, name, category: form.category, price, vegetarian: true, available: true, image: categories.find((c) => c.id === form.category)?.image ?? '/images/categories/dosa.jpg' }, ...current])
    }
    setShowForm(false)
  }

  const deleteItem = (item: MenuItem) => {
    if (window.confirm(`Delete ${item.name}?`)) setMenuItems((current) => current.filter((entry) => entry.id !== item.id))
  }

  const updateBookingStatus = (bookingId: string, status: string) => {
    setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, status } : booking))
    try { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings.map((booking) => booking.id === bookingId ? { ...booking, status } : booking))) } catch {}
  }

  const deleteBooking = (bookingId: string) => {
    if (window.confirm('Delete this booking?')) {
      setBookings((current) => current.filter((booking) => booking.id !== bookingId))
      try { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings.filter((booking) => booking.id !== bookingId))) } catch {}
    }
  }

  const saveLocation = (event: React.FormEvent) => {
    event.preventDefault()
    const name = (event.target as any).name.value.trim()
    const address = (event.target as any).address.value.trim()
    const phone = (event.target as any).phone.value.trim()
    const hours = (event.target as any).hours.value.trim()
    const mapsUrl = (event.target as any).mapsUrl.value.trim()
    if (!name || !address) return
    const entry = { id: `loc-${Date.now()}`, name, address, phone, hours, mapsUrl }
    setLocations((current) => [...current, entry])
    try { localStorage.setItem(LOCATIONS_KEY, JSON.stringify([...locations, entry])) } catch {}
    ;(event.target as HTMLFormElement).reset()
  }

  const deleteLocation = (locationId: string) => {
    if (window.confirm('Delete this location?')) {
      setLocations((current) => current.filter((loc) => loc.id !== locationId))
      try { localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations.filter((loc) => loc.id !== locationId))) } catch {}
    }
  }

  const saveContent = async (event: React.FormEvent) => {
    event.preventDefault()
    setContentSaving(true)
    try {
      const formData = new FormData(event.target as HTMLFormElement)
      const updated = {
        ...content,
        name: formData.get('name') as string,
        tagline: formData.get('tagline') as string,
        description: formData.get('description') as string,
        phone: formData.get('phone') as string,
        whatsapp: formData.get('whatsapp') as string,
        instagram: formData.get('instagram') as string,
        zomato: formData.get('zomato') as string,
        swiggy: formData.get('swiggy') as string,
      }
      setContent(updated)
      try { localStorage.setItem(CONTENT_KEY, JSON.stringify(updated)) } catch {}
      alert('Content saved successfully')
    } catch {
      alert('Failed to save content')
    } finally {
      setContentSaving(false)
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (orderFilter !== 'all' && order.source !== orderFilter) return false
      if (statusFilter !== 'all' && order.status !== statusFilter) return false
      if (paymentFilter === 'paid' && !order.paid) return false
      if (paymentFilter === 'unpaid' && order.paid) return false
      return true
    })
  }, [orders, orderFilter, statusFilter, paymentFilter])

  const revenueStats = useMemo(() => {
    const paidOrders = orders.filter((order) => order.paid)
    const pendingRevenue = orders.filter((order) => !order.paid).reduce((sum, order) => sum + order.total, 0)
    const collectedRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0)
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const zomatoOrders = orders.filter((order) => order.source === 'zomato').length
    const swiggyOrders = orders.filter((order) => order.source === 'swiggy').length
    const directOrders = orders.filter((order) => order.source === 'direct').length
    return {
      totalRevenue,
      collectedRevenue,
      pendingRevenue,
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      unpaidOrders: orders.length - paidOrders.length,
      zomatoOrders,
      swiggyOrders,
      directOrders,
    }
  }, [orders])

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const totalRevenue = revenueStats.totalRevenue
    const totalItems = menuItems.length
    const availableItems = menuItems.filter((item) => item.available).length
    return [
      { label: 'Total orders', value: String(totalOrders), change: 'Lifetime' },
      { label: 'Revenue', value: formatPrice(totalRevenue), change: 'All time' },
      { label: 'Collected', value: formatPrice(revenueStats.collectedRevenue), change: 'Paid orders' },
      { label: 'Pending payment', value: formatPrice(revenueStats.pendingRevenue), change: 'Unpaid orders' },
      { label: 'Menu items', value: `${availableItems}/${totalItems}`, change: 'Active/total' },
      { label: 'Zomato orders', value: String(revenueStats.zomatoOrders), change: 'Via Zomato' },
      { label: 'Swiggy orders', value: String(revenueStats.swiggyOrders), change: 'Via Swiggy' },
      { label: 'Direct orders', value: String(revenueStats.directOrders), change: 'In-restaurant' },
    ]
  }, [orders, menuItems, revenueStats])

  return (
    <Shell>
      <main className="min-h-screen bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Admin dashboard</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Admin panel</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">Manage orders, track revenue, and update your menu.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link href="/" className="text-sm font-bold underline underline-offset-4">View website</Link>
              <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-bold">
                <LogOut size={16}/> Logout
              </button>
            </div>
          </div>

          <nav className="mt-8 flex gap-2 overflow-x-auto border-b pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            {([
              ['dashboard', 'Dashboard'],
              ['orders', 'Orders'],
              ['bookings', 'Bookings'],
              ['menu', 'Menu'],
              ['locations', 'Locations'],
              ['content', 'Content'],
              ['settings', 'Settings'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${tab === key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                {label}
              </button>
            ))}
          </nav>

          {tab === 'dashboard' && (
            <section className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border bg-card p-5">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl font-black">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                </div>
              ))}
            </section>
          )}

          {tab === 'orders' && (
            <section className="mt-8 rounded-3xl border bg-card p-5 sm:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-black">Order management</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Track, update status, and manage all orders.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value as any)} className="h-10 rounded-full border bg-background px-3 text-sm font-semibold w-full sm:w-auto">
                  <option value="all">All sources</option>
                  <option value="direct">Direct</option>
                  <option value="zomato">Zomato</option>
                  <option value="swiggy">Swiggy</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="h-10 rounded-full border bg-background px-3 text-sm font-semibold w-full sm:w-auto">
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value as any)} className="h-10 rounded-full border bg-background px-3 text-sm font-semibold w-full sm:w-auto">
                  <option value="all">All payments</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              {filteredOrders.length === 0 ? (
                <p className="mt-6 text-sm text-muted-foreground">No orders match the current filters.</p>
              ) : (
                <div className="mt-6 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="border-b text-muted-foreground">
                      <tr>
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Source</th>
                        <th className="pb-3">Items</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b last:border-0">
                          <td className="py-4 font-semibold">#{order.id}</td>
                          <td className="py-4 text-muted-foreground">{new Date(order.date).toLocaleString()}</td>
                          <td className="py-4 capitalize">{order.source}</td>
                          <td className="py-4">{order.items?.length || 0} items</td>
                          <td className="py-4 font-black text-primary">{formatPrice(order.total || 0)}</td>
                          <td className="py-4">
                            <button type="button" onClick={() => togglePaymentStatus(order.id)} className={`rounded-full px-3 py-1 text-xs font-bold ${order.paid ? 'bg-green-500/15 text-green-700' : 'bg-red-500/15 text-red-700'}`}>
                              {order.paid ? 'Paid' : 'Unpaid'}
                            </button>
                          </td>
                          <td className="py-4">
                            <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)} className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                              {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                          </td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              <button onClick={() => deleteOrder(order.id)} className="rounded-lg border p-2 text-destructive"><Trash2 size={15}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {tab === 'menu' && (
            <section className="mt-8 rounded-3xl border bg-card p-5 sm:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-black">Menu management</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Add, edit, delete and toggle availability.</p>
                </div>
                <button onClick={() => { setEditing(null); setForm({ name: '', category: categories[0]?.id ?? '', price: '' }); setShowForm(true) }} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
                  <Plus size={16}/> Add dish
                </button>
              </div>
              {showForm && (
                <form onSubmit={saveItem} className="mt-6 flex flex-col gap-3 rounded-2xl border bg-muted/30 p-4">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dish name" className="h-11 rounded-xl border bg-background px-3"/>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-11 rounded-xl border bg-background px-3">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input required min="1" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" className="h-11 rounded-xl border bg-background px-3"/>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">{editing ? 'Save' : 'Add'}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border p-3"><X size={18}/></button>
                  </div>
                </form>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <select value={menuCategoryFilter} onChange={(e) => setMenuCategoryFilter(e.target.value)} className="h-10 rounded-full border bg-background px-3 text-sm font-semibold w-full sm:w-auto">
                  <option value="all">All categories</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="mt-6 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b text-muted-foreground">
                    <tr>
                      <th className="pb-3">Dish</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Availability</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.filter((item) => menuCategoryFilter === 'all' || item.category === menuCategoryFilter).slice(0, 12).map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-4 font-semibold">{item.name}</td>
                        <td className="py-4 text-muted-foreground">{item.category}</td>
                        <td className="py-4">₹{item.price}</td>
                        <td className="py-4">
                          <button type="button" onClick={() => setMenuItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, available: !entry.available } : entry))} className={`rounded-full px-3 py-1 text-xs font-bold ${item.available ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </button>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditing(item); setForm({ name: item.name, category: item.category, price: String(item.price) }); setShowForm(true) }} className="rounded-lg border p-2"><Pencil size={15}/></button>
                            <button onClick={() => deleteItem(item)} className="rounded-lg border p-2 text-destructive"><Trash2 size={15}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === 'settings' && (
            <section className="mt-8 rounded-3xl border bg-card p-5 sm:p-8">
              <h2 className="text-2xl font-black">Settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">Restaurant configuration and admin access.</p>
              <div className="mt-6 flex flex-col gap-4">
                <div className="rounded-2xl border bg-background p-4">
                  <p className="text-sm font-bold">Restaurant info</p>
                  <p className="text-xs text-muted-foreground">Name: Meenu&apos;s Dosa</p>
                  <p className="text-xs text-muted-foreground">Type: South Indian restaurant</p>
                  <p className="mt-2 text-xs text-muted-foreground">Admin access is managed by the backend authentication system.</p>
                </div>
              </div>
            </section>
          )}

          {tab === 'bookings' && (
            <section className="mt-8 rounded-3xl border bg-card p-5 sm:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-black">Booking management</h2>
                  <p className="mt-1 text-sm text-muted-foreground">View and manage table reservations.</p>
                </div>
              </div>
              {bookings.length === 0 ? (
                <p className="mt-6 text-sm text-muted-foreground">No bookings yet.</p>
              ) : (
                <div className="mt-6 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="border-b text-muted-foreground">
                      <tr>
                        <th className="pb-3">ID</th>
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Time</th>
                        <th className="pb-3">Guests</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b last:border-0">
                          <td className="py-4 font-semibold">#{booking.id}</td>
                          <td className="py-4">{booking.name}</td>
                          <td className="py-4 text-muted-foreground">{booking.phone}</td>
                          <td className="py-4">{booking.date}</td>
                          <td className="py-4">{booking.time}</td>
                          <td className="py-4">{booking.guests}</td>
                          <td className="py-4">
                            <select value={booking.status || 'pending'} onChange={(e) => updateBookingStatus(booking.id, e.target.value)} className={`rounded-full px-3 py-1 text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-500/15 text-green-700' : booking.status === 'cancelled' ? 'bg-destructive/15 text-destructive' : 'bg-yellow-500/15 text-yellow-700'}`}>
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4">
                            <button onClick={() => deleteBooking(booking.id)} className="rounded-lg border p-2 text-destructive"><Trash2 size={15}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {tab === 'locations' && (
            <section className="mt-8 rounded-3xl border bg-card p-5 sm:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-black">Location management</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Add and manage restaurant locations.</p>
                </div>
              </div>
              <form onSubmit={saveLocation} className="mt-6 flex flex-col gap-3 rounded-2xl border bg-muted/30 p-4">
                <input required name="name" placeholder="Location name" className="h-11 rounded-xl border bg-background px-3"/>
                <input required name="address" placeholder="Address" className="h-11 rounded-xl border bg-background px-3"/>
                <input name="phone" placeholder="Phone" className="h-11 rounded-xl border bg-background px-3"/>
                <input name="hours" placeholder="Opening hours" className="h-11 rounded-xl border bg-background px-3"/>
                <input name="mapsUrl" placeholder="Google Maps URL" className="h-11 rounded-xl border bg-background px-3"/>
                <button type="submit" className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">Add location</button>
              </form>
              <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {locations.map((loc) => (
                  <div key={loc.id} className="rounded-2xl border bg-background p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold">{loc.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{loc.address}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{loc.phone}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{loc.hours}</p>
                      </div>
                      <button onClick={() => deleteLocation(loc.id)} className="rounded-lg border p-2 text-destructive"><Trash2 size={15}/></button>
                    </div>
                    {loc.mapsUrl && <a href={loc.mapsUrl} target="_blank" rel="noreferrer noopener" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary">Open map <MapPin size={14}/></a>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'content' && (
            <section className="mt-8 rounded-3xl border bg-card p-5 sm:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-black">Content management</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Update website content and social links.</p>
                </div>
              </div>
              <form onSubmit={saveContent} className="mt-6 flex flex-col gap-4 rounded-2xl border bg-muted/30 p-4">
                <label className="grid gap-2 text-sm font-semibold">Restaurant name<input name="name" defaultValue={content.name} className="h-11 rounded-xl border bg-background px-3"/></label>
                <label className="grid gap-2 text-sm font-semibold">Tagline<input name="tagline" defaultValue={content.tagline} className="h-11 rounded-xl border bg-background px-3"/></label>
                <label className="grid gap-2 text-sm font-semibold">Description<textarea name="description" defaultValue={content.description} rows={3} className="rounded-xl border bg-background p-3"/></label>
                <label className="grid gap-2 text-sm font-semibold">Phone<input name="phone" defaultValue={content.phone} className="h-11 rounded-xl border bg-background px-3"/></label>
                <label className="grid gap-2 text-sm font-semibold">WhatsApp<input name="whatsapp" defaultValue={content.whatsapp} className="h-11 rounded-xl border bg-background px-3"/></label>
                <label className="grid gap-2 text-sm font-semibold">Instagram<input name="instagram" defaultValue={content.instagram} className="h-11 rounded-xl border bg-background px-3"/></label>
                <label className="grid gap-2 text-sm font-semibold">Zomato URL<input name="zomato" defaultValue={content.zomato} className="h-11 rounded-xl border bg-background px-3"/></label>
                <label className="grid gap-2 text-sm font-semibold">Swiggy URL<input name="swiggy" defaultValue={content.swiggy} className="h-11 rounded-xl border bg-background px-3"/></label>
                <button type="submit" disabled={contentSaving} className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">{contentSaving ? 'Saving...' : 'Save content'}</button>
              </form>
            </section>
          )}
        </div>
      </main>
    </Shell>
  )
}
