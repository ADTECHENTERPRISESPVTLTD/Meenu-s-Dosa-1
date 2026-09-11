'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Pencil, Plus, Trash2, X, Calendar, MapPin, Globe, LayoutDashboard, ShoppingBag, BookUser, Map, FileText, Settings, ShieldCheck, TrendingUp, DollarSign, Package, Clock, ChevronRight, Image } from 'lucide-react'
import { menu as initialMenu, categories, formatPrice, siteConfig, type MenuItem, categoryImage, adminService } from '@/lib/data'
import { Shell } from '@/components/site-shell'

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
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu)
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
    let cancelled = false
    const load = async () => {
      try {
        const [menuRes, ordersRes, bookingsRes, locRes, contentRes] = await Promise.all([
          adminService.listMenu(),
          adminService.listOrders(),
          adminService.listBookings(),
          adminService.listLocations(),
          adminService.getContent(),
        ])
        if (cancelled) return
        if (Array.isArray(menuRes)) setMenuItems(menuRes)
        if (Array.isArray(ordersRes)) setOrders(ordersRes)
        if (Array.isArray(bookingsRes)) setBookings(bookingsRes)
        if (Array.isArray(locRes)) setLocations(locRes)
        if (contentRes) setContent((c) => ({ ...c, ...contentRes }))
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  const persist = {
    orders: (list: Order[]) => setOrders(list),
    bookings: (list: any[]) => setBookings(list),
    locations: (list: any[]) => setLocations(list),
  }

  const logout = () => {}

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order))
    adminService.updateOrder(orderId, { status })
  }

  const togglePaymentStatus = (orderId: string) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, paid: !order.paid } : order))
    adminService.updateOrder(orderId, { paid: undefined } as any)
  }

  const deleteOrder = (orderId: string) => {
    if (window.confirm('Delete this order?')) {
      setOrders((current) => current.filter((order) => order.id !== orderId))
      adminService.deleteOrder(orderId)
    }
  }

  const saveItem = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = form.name.trim()
    const price = Number(form.price)
    if (!name || !Number.isFinite(price) || price <= 0) return
    try {
      if (editing) {
        const res = await adminService.updateMenu(editing.id, { name, category: form.category, price })
        const data = await res.json()
        if (data.ok) setMenuItems((current) => current.map((item) => item.id === editing.id ? { ...item, ...data.item } : item))
      } else {
        const res = await adminService.createMenu({ name, category: form.category, price, vegetarian: true, available: true, image: categories.find((c) => c.id === form.category)?.image ?? '' })
        const data = await res.json()
        if (data.ok) setMenuItems((current) => [data.item, ...current])
      }
      setShowForm(false)
    } catch {}
  }

  const deleteItem = async (item: MenuItem) => {
    if (window.confirm(`Delete ${item.name}?`)) {
      setMenuItems((current) => current.filter((entry) => entry.id !== item.id))
      adminService.deleteMenu(item.id)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, status } : booking))
    await adminService.updateBooking(bookingId, status)
  }

  const deleteBooking = (bookingId: string) => {
    if (window.confirm('Delete this booking?')) {
      setBookings((current) => current.filter((booking) => booking.id !== bookingId))
      adminService.deleteBooking(bookingId)
    }
  }

  const saveLocation = async (event: React.FormEvent) => {
    event.preventDefault()
    const target = event.target as HTMLFormElement
    const name = (target.name as HTMLInputElement).value.trim()
    const address = (target.address as HTMLInputElement).value.trim()
    const phone = (target.phone as HTMLInputElement).value.trim()
    const hours = (target.hours as HTMLInputElement).value.trim()
    const mapsUrl = (target.mapsUrl as HTMLInputElement).value.trim()
    if (!name || !address) return
    const res = await adminService.createLocation({ name, address, phone, hours, mapsUrl })
    const data = await res.json()
    if (data.ok) setLocations((current) => [...current, data.location])
    target.reset()
  }

  const deleteLocation = (locationId: string) => {
    if (window.confirm('Delete this location?')) {
      setLocations((current) => current.filter((loc) => loc.id !== locationId))
      adminService.deleteLocation(locationId)
    }
  }

  const saveContent = async (event: React.FormEvent) => {
    event.preventDefault()
    setContentSaving(true)
    try {
      const formData = new FormData(event.target as HTMLFormElement)
      const updated = {
        name: formData.get('name') as string,
        tagline: formData.get('tagline') as string,
        description: formData.get('description') as string,
        phone: formData.get('phone') as string,
        whatsapp: formData.get('whatsapp') as string,
        instagram: formData.get('instagram') as string,
        zomato: formData.get('zomato') as string,
        swiggy: formData.get('swiggy') as string,
      }
      const res = await adminService.saveContent(updated)
      const data = await res.json()
      if (data.ok) setContent(data.content)
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
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-3xl border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-orange-500 text-xl font-black text-white shadow-lg">M</div>
                  <div className="min-w-0">
                    <p className="truncate font-black">{siteConfig.name}</p>
                    <p className="text-xs text-muted-foreground">Admin control panel</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-primary/10 p-3 text-center">
                    <p className="text-lg font-black text-primary">{revenueStats.totalOrders}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Orders</p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-center">
                    <p className="text-lg font-black text-primary">{formatPrice(revenueStats.collectedRevenue)}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Collected</p>
                  </div>
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                {([
                  ['dashboard', LayoutDashboard, 'Dashboard'],
                  ['orders', ShoppingBag, 'Orders'],
                  ['bookings', BookUser, 'Bookings'],
                  ['menu', Image, 'Menu'],
                  ['locations', Map, 'Locations'],
                  ['content', FileText, 'Content'],
                  ['settings', Settings, 'Settings'],
                ] as const).map(([key, Icon, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                      tab === key
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon size={18} className={tab === key ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'} />
                    <span className="flex-1">{label}</span>
                    {key === 'orders' && revenueStats.unpaidOrders > 0 && (
                      <span className="grid size-6 place-items-center rounded-full bg-amber-500 text-[10px] font-black text-white">
                        {revenueStats.unpaidOrders}
                      </span>
                    )}
                    <ChevronRight size={16} className={tab === key ? 'text-primary-foreground/70' : 'text-muted-foreground'} />
                  </button>
                ))}
              </nav>

              <div className="rounded-3xl border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-muted-foreground">Quick actions</p>
                <div className="mt-3 flex flex-col gap-2">
                  <Link href="/" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold hover:bg-muted">
                    <Globe size={14} /> View website
                  </Link>
                  <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold text-destructive hover:bg-destructive/10">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="min-w-0">
              <div className="mb-6">
                <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Admin dashboard</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  {tab === 'dashboard' && 'Dashboard'}
                  {tab === 'orders' && 'Order management'}
                  {tab === 'bookings' && 'Booking management'}
                  {tab === 'menu' && 'Menu management'}
                  {tab === 'locations' && 'Location management'}
                  {tab === 'content' && 'Content management'}
                  {tab === 'settings' && 'Settings'}
                </h1>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  {tab === 'dashboard' && 'Track revenue, orders, and menu performance at a glance.'}
                  {tab === 'orders' && 'Track, update status, and manage all orders.'}
                  {tab === 'bookings' && 'View and manage table reservations.'}
                  {tab === 'menu' && 'Add, edit, delete and toggle availability.'}
                  {tab === 'locations' && 'Add and manage restaurant locations.'}
                  {tab === 'content' && 'Update website content and social links.'}
                  {tab === 'settings' && 'Restaurant configuration and admin access.'}
                </p>
              </div>

              {tab === 'dashboard' && (
                <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {stats.map((stat, idx) => {
                    const gradients = [
                      'from-primary to-orange-500',
                      'from-emerald-500 to-teal-500',
                      'from-blue-500 to-indigo-500',
                      'from-amber-500 to-yellow-500',
                      'from-rose-500 to-pink-500',
                      'from-violet-500 to-purple-500',
                      'from-cyan-500 to-sky-500',
                      'from-fuchsia-500 to-pink-500',
                    ]
                    return (
                      <div key={stat.label} className="group relative overflow-hidden rounded-3xl border bg-card p-5">
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[idx % gradients.length]} opacity-[0.08]`} />
                        <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                        <p className="mt-2 text-3xl font-black">{stat.value}</p>
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          <TrendingUp size={12} /> {stat.change}
                        </div>
                      </div>
                    )
                  })}
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
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.filter((item) => menuCategoryFilter === 'all' || item.category === menuCategoryFilter).slice(0, 12).map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-2xl border bg-card">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img src={categoryImage(item.image)} alt={item.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute left-3 top-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.available ? 'bg-primary/90 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-black">{item.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.category}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-lg font-black text-primary">₹{item.price}</p>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditing(item); setForm({ name: item.name, category: item.category, price: String(item.price) }); setShowForm(true) }} className="rounded-lg border p-2 hover:bg-muted"><Pencil size={15}/></button>
                          <button onClick={() => deleteItem(item)} className="rounded-lg border p-2 text-destructive hover:bg-destructive/10"><Trash2 size={15}/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
      </div>
    </div>
  </main>
  </Shell>
  )
}
