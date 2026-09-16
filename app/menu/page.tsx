'use client'

import { useMemo, useState, useEffect } from 'react'
import { Minus, Plus, Search, ShoppingBag, SlidersHorizontal, Leaf, Trash2, ArrowRight, QrCode, Banknote, Sparkles, Check, Flame } from 'lucide-react'
import { categories, formatPrice, menu, type MenuItem, adminService } from '@/lib/data'
import { CategoryImage, Shell } from '@/components/site-shell'

const CART_STORAGE_KEY = 'meenu-dosa-cart'

type PaymentMethod = 'qr' | 'cash' | 'zomato' | 'swiggy'
type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export default function MenuPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [open, setOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)

  const saveOrder = async (method: PaymentMethod) => {
    if (cartCount === 0) return
    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      date: Date.now(),
      items: cartItems.map((item) => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      total: cartTotal,
      paymentMethod: method,
      source: method === 'zomato' || method === 'swiggy' ? method : 'direct',
      status: 'pending' as OrderStatus,
    }
    try {
      const res = await adminService.createOrder(order)
      const data = await res.json()
      if (data.ok && data.order) order.id = data.order.id
    } catch {}
    setLastOrderId(order.id)
    setOrderPlaced(true)
  }

  const clearCart = () => {
    setCart({})
    setPaymentMethod(null)
    setOrderPlaced(false)
    setLastOrderId(null)
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) setCart(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)) } catch {}
  }, [cart])

  const updateCart = (item: MenuItem, delta: number) => setCart((current) => {
    const count = Math.max(0, (current[item.id] ?? 0) + delta)
    const next = { ...current }
    if (count > 0) next[item.id] = count
    else delete next[item.id]
    return next
  })

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const cartTotal = useMemo(() => menu.reduce((sum, item) => sum + (item.price || 0) * (cart[item.id] ?? 0), 0), [cart])
  const cartItems = useMemo(() => menu.filter((item) => (cart[item.id] ?? 0) > 0).map((item) => ({ ...item, quantity: cart[item.id] ?? 0 })), [cart])
  const filtered = useMemo(() => menu.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category
    return matchesCategory && `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  }), [category, query])

  return (
    <Shell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-amber-500/20 pb-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sparkles size={14} /> Full Culinary Menu
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Made Fresh, <span className="gold-gradient-text">Worth Sharing.</span>
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground text-sm sm:text-base">
              Explore our 30+ traditional South Indian recipes crafted with stone-ground natural fermentation and zero artificial soda.
            </p>
          </div>

          {cartCount > 0 && (
            <div className="flex items-center gap-4 rounded-2xl border border-amber-500/40 bg-card p-4 shadow-xl shadow-amber-500/10">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-amber-500 text-white">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold">{cartCount} Items Selected</p>
                  <p className="text-lg font-black text-amber-600 dark:text-amber-400">{formatPrice(cartTotal)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-xl gold-gradient-bg px-5 py-2.5 text-sm font-bold text-white shadow-md hover:scale-105 active:scale-95 transition"
              >
                Review Order
              </button>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row items-center">
          <label className="relative flex-1 w-full">
            <span className="sr-only">Search dishes</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dosa, idli, vada, cold coffee..."
              className="h-12 w-full rounded-2xl border border-amber-500/20 bg-background pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            />
          </label>
          <div className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-amber-500/20 bg-card px-4 text-xs font-bold text-muted-foreground">
            <Leaf size={14} className="text-emerald-500" /> Showing {filtered.length} Dishes
          </div>
        </div>

        {/* Sticky Categories Navigation */}
        <div className="sticky top-20 z-30 -mx-4 mt-6 overflow-x-auto border-y border-amber-500/20 bg-background/95 px-4 py-3.5 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border">
          <div className="flex min-w-max gap-2">
            <button
              type="button"
              onClick={() => setCategory('all')}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                category === 'all'
                  ? 'border-amber-500 gold-gradient-bg text-white shadow-md'
                  : 'border-border hover:bg-muted text-muted-foreground'
              }`}
            >
              All Items ({menu.length})
            </button>
            {categories.map((c) => {
              const count = menu.filter(i => i.category === c.id).length
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                    category === c.id
                      ? 'border-amber-500 gold-gradient-bg text-white shadow-md'
                      : 'border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {c.name} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Menu Items Section */}
        <div className="mt-10 flex flex-col gap-14">
          {categories
            .filter((c) => category === 'all' || c.id === category)
            .map((c) => {
              const items = filtered.filter((item) => item.category === c.id)
              if (!items.length && category !== 'all') return null

              return (
                <section id={c.id} key={c.id} className="scroll-mt-36">
                  <div className="mb-6 flex items-end justify-between border-b border-border pb-3">
                    <div>
                      <h2 className="text-2xl font-black sm:text-3xl flex items-center gap-2">
                        {c.name}
                        <Leaf size={18} className="text-emerald-500 inline" />
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{c.description}</p>
                    </div>
                    <div className="hidden size-14 overflow-hidden rounded-xl border border-amber-500/30 sm:block shadow-sm">
                      <CategoryImage src={c.image} alt={c.name} />
                    </div>
                  </div>

                  {items.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item) => {
                        const count = cart[item.id] ?? 0
                        return (
                          <article
                            key={item.id}
                            className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                              count > 0
                                ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/30'
                                : 'border-border bg-card hover:border-amber-500/40 hover:shadow-md'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-extrabold text-base flex items-center gap-1.5">
                                  {item.name}
                                  {item.vegetarian && (
                                    <Leaf className="size-4 shrink-0 text-emerald-500" aria-label="Vegetarian" />
                                  )}
                                </h3>
                                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                  Pure Veg
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {item.available ? 'Prepared fresh to order' : 'Currently unavailable'}
                              </p>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3">
                              <p className="text-lg font-black text-amber-600 dark:text-amber-400">
                                {formatPrice(item.price)}
                              </p>

                              {count === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => updateCart(item, 1)}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-extrabold text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition active:scale-95"
                                >
                                  <Plus size={14} /> Add
                                </button>
                              ) : (
                                <div className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-card p-1 shadow-sm">
                                  <button
                                    type="button"
                                    onClick={() => updateCart(item, -1)}
                                    aria-label={`Remove one ${item.name}`}
                                    className="grid size-7 place-items-center rounded-full hover:bg-muted text-foreground"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="min-w-6 text-center text-xs font-black">{count}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateCart(item, 1)}
                                    aria-label={`Add one ${item.name}`}
                                    className="grid size-7 place-items-center rounded-full bg-amber-500 text-white"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No items match your query.</p>
                  )}
                </section>
              )
            })}
        </div>

        {/* Slide-over Cart & Checkout Drawer */}
        {cartCount > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-40">
            <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
              <div className="rounded-3xl border border-amber-500/40 bg-card shadow-2xl backdrop-blur-lg">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen((current) => !current)
                      setPaymentMethod(null)
                    }}
                    className="flex items-center gap-3 text-left"
                  >
                    <span className="grid size-10 place-items-center rounded-2xl gold-gradient-bg text-white shadow-md">
                      <ShoppingBag className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-black">{cartCount} Items Selected</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">{formatPrice(cartTotal)} Total</p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={clearCart}
                      className="rounded-full border border-red-500/30 p-2.5 text-red-500 hover:bg-red-500/10 transition"
                      title="Clear Cart"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen((current) => !current)
                        setPaymentMethod(null)
                      }}
                      className="rounded-full gold-gradient-bg px-5 py-2.5 text-xs font-bold text-white shadow-md"
                    >
                      {open ? 'Close' : 'Checkout Order'}
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                    <ul className="divide-y border-b">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-4 py-3">
                          <div>
                            <p className="font-extrabold text-sm flex items-center gap-1">
                              {item.name} <Leaf size={12} className="text-emerald-500 inline" />
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(item.price)} x {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-black text-amber-600 dark:text-amber-400 text-sm">
                              {formatPrice((item.price || 0) * item.quantity)}
                            </p>
                            <div className="flex items-center gap-1 rounded-full border p-0.5">
                              <button
                                type="button"
                                onClick={() => updateCart(item, -1)}
                                className="grid size-7 place-items-center rounded-full hover:bg-muted"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="min-w-5 text-center text-xs font-bold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateCart(item, 1)}
                                className="grid size-7 place-items-center rounded-full bg-amber-500 text-white"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex items-center justify-between font-black text-lg">
                      <span>Order Total</span>
                      <span className="text-amber-600 dark:text-amber-400">{formatPrice(cartTotal)}</span>
                    </div>

                    {!paymentMethod ? (
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod('zomato')
                            saveOrder('zomato')
                          }}
                          className="flex flex-col items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/5 p-4 transition hover:bg-red-500/10"
                        >
                          <span className="text-base font-black text-red-600">Zomato</span>
                          <span className="text-[10px] text-muted-foreground">Order via Zomato</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod('swiggy')
                            saveOrder('swiggy')
                          }}
                          className="flex flex-col items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 transition hover:bg-orange-500/10"
                        >
                          <span className="text-base font-black text-orange-600">Swiggy</span>
                          <span className="text-[10px] text-muted-foreground">Order via Swiggy</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('qr')}
                          className="flex flex-col items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 transition hover:bg-amber-500/10"
                        >
                          <QrCode className="size-6 text-amber-500" />
                          <span className="text-xs font-bold">UPI / QR Code</span>
                          <span className="text-[10px] text-muted-foreground">Instant Pay</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cash')}
                          className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 transition hover:bg-emerald-500/10"
                        >
                          <Banknote className="size-6 text-emerald-500" />
                          <span className="text-xs font-bold">Pay at Counter</span>
                          <span className="text-[10px] text-muted-foreground">Cash Payment</span>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 rounded-2xl border border-amber-500/30 bg-background p-6">
                        {paymentMethod === 'qr' && (
                          <div className="flex flex-col items-center text-center gap-3">
                            <p className="font-extrabold text-base">Scan & Pay via UPI App</p>
                            <div className="relative aspect-square w-48 overflow-hidden rounded-2xl border border-amber-500/30 bg-white p-3 shadow-md">
                              <img src="/qr-code.png" alt="Payment QR code" className="h-full w-full object-contain" />
                            </div>
                            <p className="text-xs text-muted-foreground">Scan with Google Pay, PhonePe, Paytm or any UPI app</p>
                            <p className="text-xl font-black text-amber-600 dark:text-amber-400">{formatPrice(cartTotal)}</p>
                            <button
                              type="button"
                              onClick={() => saveOrder('qr')}
                              className="rounded-full gold-gradient-bg px-6 py-3 text-xs font-bold text-white shadow-md"
                            >
                              Confirm QR Payment
                            </button>
                          </div>
                        )}

                        {paymentMethod === 'cash' && (
                          <div className="flex flex-col items-center text-center gap-3">
                            <p className="font-extrabold text-base">Cash Payment at Outlet</p>
                            <p className="text-xs text-muted-foreground">Pay when your order is served at the dining table or counter.</p>
                            <p className="text-xl font-black text-amber-600 dark:text-amber-400">{formatPrice(cartTotal)}</p>
                            <button
                              type="button"
                              onClick={() => {
                                saveOrder('cash')
                                setOpen(false)
                              }}
                              className="rounded-full gold-gradient-bg px-6 py-3 text-xs font-bold text-white shadow-md"
                            >
                              Place Cash Order
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="h-20" />
      </main>
    </Shell>
  )
}
