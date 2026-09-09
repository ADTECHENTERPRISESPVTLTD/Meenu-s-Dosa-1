'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Pencil, Plus, Trash2, X } from 'lucide-react'
import { menu as initialMenu, categories, formatPrice, type MenuItem } from '@/lib/data'
import { Shell } from '@/components/site-shell'

const ADMIN_EMAIL = 'admin@meenusdosa.com'
const ADMIN_PASSWORD = 'admin123'
const SESSION_KEY = 'meenu-dosa-admin-session'
const ORDER_HISTORY_KEY = 'meenu-dosa-orders'

type Tab = 'dashboard' | 'orders' | 'menu' | 'settings'
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
  const [session, setSession] = useState<{ email: string } | null>(null)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [menuItems, setMenuItems] = useState(initialMenu)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState({ name: '', category: categories[0]?.id ?? '', price: '' })
  const [orders, setOrders] = useState<Order[]>([])
  const [initializing, setInitializing] = useState(true)
  const [orderFilter, setOrderFilter] = useState<'all' | 'direct' | 'zomato' | 'swiggy'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all')
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      if (stored) setSession(JSON.parse(stored))
      else router.replace('/admin/login')
    } catch {}
    setInitializing(false)
  }, [router])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ORDER_HISTORY_KEY)
      if (stored) setOrders(JSON.parse(stored))
    } catch {}
  }, [])

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
    router.replace('/admin/login')
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

  if (!session && !initializing) {
    return <div className="min-h-screen bg-muted/40" />
  }

  if (initializing) {
    return <div className="min-h-screen bg-muted/40 flex items-center justify-center">
      <div className="text-sm font-bold text-muted-foreground">Loading admin dashboard...</div>
    </div>
  }

  return (
    <Shell>
      <main className="min-h-screen bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Admin dashboard</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight">Welcome, {session?.email}</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">Manage orders, track revenue, and update your menu.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm font-bold underline underline-offset-4">View website</Link>
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold">
                <LogOut size={16}/> Logout
              </button>
            </div>
          </div>

          <nav className="mt-8 flex flex-wrap gap-2 border-b pb-3">
            {([
              ['dashboard', 'Dashboard'],
              ['orders', 'Orders'],
              ['menu', 'Menu'],
              ['settings', 'Settings'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${tab === key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                {label}
              </button>
            ))}
          </nav>

          {tab === 'dashboard' && (
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <div className="mt-4 flex flex-wrap gap-2">
                <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value as any)} className="h-10 rounded-full border bg-background px-3 text-sm font-semibold">
                  <option value="all">All sources</option>
                  <option value="direct">Direct</option>
                  <option value="zomato">Zomato</option>
                  <option value="swiggy">Swiggy</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="h-10 rounded-full border bg-background px-3 text-sm font-semibold">
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value as any)} className="h-10 rounded-full border bg-background px-3 text-sm font-semibold">
                  <option value="all">All payments</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              {filteredOrders.length === 0 ? (
                <p className="mt-6 text-sm text-muted-foreground">No orders match the current filters.</p>
              ) : (
                <div className="mt-6 overflow-x-auto">
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
                <button onClick={() => { setEditing(null); setForm({ name: '', category: categories[0]?.id ?? '', price: '' }); setShowForm(true) }} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
                  <Plus size={16}/> Add dish
                </button>
              </div>
              {showForm && (
                <form onSubmit={saveItem} className="mt-6 grid gap-3 rounded-2xl border bg-muted/30 p-4 sm:grid-cols-[1.4fr_1fr_.7fr_auto_auto]">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dish name" className="h-11 rounded-xl border bg-background px-3"/>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-11 rounded-xl border bg-background px-3">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input required min="1" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" className="h-11 rounded-xl border bg-background px-3"/>
                  <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">{editing ? 'Save' : 'Add'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border p-2"><X size={18}/></button>
                </form>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <select value={menuCategoryFilter} onChange={(e) => setMenuCategoryFilter(e.target.value)} className="h-10 rounded-full border bg-background px-3 text-sm font-semibold">
                  <option value="all">All categories</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="mt-6 overflow-x-auto">
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
              <p className="mt-1 text-sm text-muted-foreground">Manage restaurant details and admin access.</p>
              <div className="mt-6 flex flex-col gap-4">
                <div className="rounded-2xl border bg-background p-4">
                  <p className="text-sm font-bold">Admin credentials</p>
                  <p className="text-xs text-muted-foreground">Email: {ADMIN_EMAIL}</p>
                  <p className="text-xs text-muted-foreground">Password: {ADMIN_PASSWORD}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Update these values in the code to change admin access.</p>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <p className="text-sm font-bold">Restaurant info</p>
                  <p className="text-xs text-muted-foreground">Name: Meenu&apos;s Dosa</p>
                  <p className="text-xs text-muted-foreground">Type: South Indian restaurant</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </Shell>
  )
}
