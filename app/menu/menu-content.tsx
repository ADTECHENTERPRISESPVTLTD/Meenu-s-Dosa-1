'use client'

import { useEffect, useState } from 'react'
import { formatPrice, type MenuItem, type Category } from '@/lib/data'
import { CategoryImage, Shell } from '@/components/site-shell'
import { menuApi, categoryApi, orderApi } from '@/lib/api'

const CART_STORAGE_KEY = 'meenu-dosa-cart'

export default function MenuContent() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [open, setOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cash' | 'zomato' | 'swiggy' | null>(null)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuCategories, setMenuCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, catRes] = await Promise.all([
          menuApi.list(),
          categoryApi.list(),
        ])
        if (catRes.success) {
          setMenuCategories(catRes.data.map((item) => ({
            id: item._id,
            name: item.name,
            image: item.image,
            description: '',
            slug: item.slug,
            sortOrder: item.sortOrder,
            isActive: item.isActive,
          })))
        }
        if (menuRes.success) {
          setMenuItems(menuRes.data.filter((item) => item.isAvailable !== false).map((item) => ({
            id: item._id,
            name: item.name,
            price: item.price,
            description: item.description,
            category: typeof item.category === 'string' ? item.category : item.category?._id,
            available: item.isAvailable,
            vegetarian: item.isVegetarian,
            image: item.image || '',
            isFeatured: item.isFeatured,
            sortOrder: item.sortOrder,
          })))
        }
      } catch (err) {
        setError('Failed to load menu. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) setCart(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)) } catch {}
  }, [cart])

  const saveOrder = async (method: 'qr' | 'cash' | 'zomato' | 'swiggy') => {
    if (cartCount === 0) return
    try {
      const response = await orderApi.create({
        items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
        paymentMethod: method,
        source: method === 'zomato' || method === 'swiggy' ? method : 'direct',
      })
      if (!response.success) throw new Error(response.message)
      setLastOrderId(response.data._id || response.data.id)
      setOrderPlaced(true)
    } catch {
      setError('Failed to place order. Please try again.')
    }
  }

  const clearCart = () => {
    setCart({})
    setPaymentMethod(null)
    setOrderPlaced(false)
    setLastOrderId(null)
  }

  const updateCart = (item: MenuItem, delta: number) => setCart((current) => {
    const count = Math.max(0, (current[item.id] ?? 0) + delta)
    const next = { ...current }
    if (count > 0) next[item.id] = count
    else delete next[item.id]
    return next
  })

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const cartTotal = menuItems.reduce((sum, item) => sum + (item.price || 0) * (cart[item.id] ?? 0), 0)
  const cartItems = menuItems.filter((item) => (cart[item.id] ?? 0) > 0).map((item) => ({ ...item, quantity: cart[item.id] ?? 0 }))
  const filtered = menuItems.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category
    return matchesCategory && `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  })

  if (loading) {
    return (
      <Shell>
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        </main>
      </Shell>
    )
  }

  if (error) {
    return (
      <Shell>
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
          <div className="text-center text-destructive">{error}</div>
        </main>
      </Shell>
    )
  }

  return <Shell>
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
      <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">The menu</p>
      <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <h1 className="max-w-2xl text-5xl font-black tracking-tight sm:text-7xl">Made fresh, <span className="text-primary">worth sharing.</span></h1>
          <p className="mt-5 max-w-xl text-muted-foreground">Browse the full menu and build your order list with simple add, remove and quantity controls.</p>
        </div>
        {cartCount > 0 && <div className="flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-sm">
          <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-3">
            <svg className="size-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v18a2 2 0 002 2h14a2 2 0 002-2v-4" /></svg>
            <span className="text-sm font-bold">{cartCount} items · {formatPrice(cartTotal)}</span>
          </button>
          <button type="button" onClick={() => setOpen(true)} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Review order</button>
        </div>}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search dishes</span>
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dosa, idli, coffee..." className="h-12 w-full rounded-full border bg-background pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary" />
        </label>
        <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold"><svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg> Dietary options</button>
      </div>
      <div className="sticky top-16 z-20 -mx-4 mt-8 overflow-x-auto border-y bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-full sm:border">
        <div className="flex min-w-max gap-2">
          <button type="button" onClick={() => setCategory('all')} className={`rounded-full border px-4 py-2 text-sm font-semibold ${category === 'all' ? 'border-primary bg-primary text-primary-foreground' : ''}`}>All</button>
          {menuCategories.map(c => <button type="button" key={c.id} onClick={() => setCategory(c.id)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${category === c.id ? 'border-primary bg-primary text-primary-foreground' : ''}`}>{c.name}</button>)}
        </div>
      </div>
      <div className="mt-12 flex flex-col gap-16">
        {menuCategories.filter((c) => category === 'all' || c.id === category).map(c => {
          const items = filtered.filter(item => item.category === c.id)
          return <section id={c.id} key={c.id} className="scroll-mt-32">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black sm:text-3xl">{c.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              </div>
              <div className="hidden h-14 w-20 overflow-hidden rounded-lg sm:block"><CategoryImage src={c.image} alt=""/></div>
            </div>
            {items.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map(item => {
              const count = cart[item.id] ?? 0
              return <article key={item.id} className="flex items-start gap-4 rounded-2xl border bg-card p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <h3 className="font-bold">{item.name}</h3>
                    {item.vegetarian && <svg className="mt-1 size-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Vegetarian"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.vegetarian ? 'Vegetarian · ' : ''}{item.available ? 'Available' : 'Currently unavailable'}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <p className="font-black text-primary">{formatPrice(item.price)}</p>
                    {count === 0 ? <button type="button" onClick={() => updateCart(item, 1)} className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold hover:border-primary"><svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add</button> : <div className="flex items-center gap-2 rounded-full border px-1 py-1">
                      <button type="button" onClick={() => updateCart(item, -1)} aria-label={`Remove one ${item.name}`} className="grid size-7 place-items-center rounded-full hover:bg-muted"><svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg></button>
                      <span className="min-w-5 text-center text-sm font-bold">{count}</span>
                      <button type="button" onClick={() => updateCart(item, 1)} aria-label={`Add one ${item.name}`} className="grid size-7 place-items-center rounded-full hover:bg-muted"><svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
                    </div>}
                  </div>
                </div>
              </article>
            })}</div> : <p className="text-sm text-muted-foreground">No items in this category match your search.</p>}
          </section>
        })}
      </div>

      {cartCount > 0 && <div className="fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
          <div className="rounded-3xl border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <button type="button" onClick={() => { setOpen((current) => !current); setPaymentMethod(null) }} className="flex items-center gap-3 text-left">
                <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary"><svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v18a2 2 0 002 2h14a2 2 0 002-2v-4" /></svg></span>
                <span className="text-sm font-bold">{cartCount} items · {formatPrice(cartTotal)}</span>
              </button>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { setCart({}); setOpen(false); setPaymentMethod(null) }} className="rounded-full border p-2 text-destructive"><svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <button type="button" onClick={() => { setOpen((current) => !current); setPaymentMethod(null) }} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">{open ? 'Close' : 'Checkout'}</button>
              </div>
            </div>
            {open && <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
              <ul className="divide-y">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each · Qty {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-black text-primary">{formatPrice((item.price || 0) * item.quantity)}</p>
                      <div className="flex items-center gap-1 rounded-full border">
                        <button type="button" onClick={() => updateCart(item, -1)} className="grid size-7 place-items-center rounded-full hover:bg-muted"><svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg></button>
                        <span className="min-w-5 text-center text-sm font-bold">{item.quantity}</span>
                        <button type="button" onClick={() => updateCart(item, 1)} className="grid size-7 place-items-center rounded-full hover:bg-muted"><svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground">Order total</p>
                <p className="text-lg font-black text-primary">{formatPrice(cartTotal)}</p>
              </div>
              {!paymentMethod ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => { setPaymentMethod('zomato'); saveOrder('zomato') }} className="flex flex-col items-center gap-2 rounded-2xl border bg-background p-4 transition hover:border-red-500">
                    <span className="text-lg font-black text-red-500">Zomato</span>
                    <span className="text-xs text-muted-foreground">Order via Zomato</span>
                  </button>
                  <button type="button" onClick={() => { setPaymentMethod('swiggy'); saveOrder('swiggy') }} className="flex flex-col items-center gap-2 rounded-2xl border bg-background p-4 transition hover:border-orange-500">
                    <span className="text-lg font-black text-orange-500">Swiggy</span>
                    <span className="text-xs text-muted-foreground">Order via Swiggy</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('qr')} className="flex flex-col items-center gap-2 rounded-2xl border bg-background p-4 transition hover:border-primary">
                    <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></span>
                    <span className="text-sm font-bold">Pay by QR</span>
                    <span className="text-xs text-muted-foreground">Scan and pay at restaurant</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('cash')} className="flex flex-col items-center gap-2 rounded-2xl border bg-background p-4 transition hover:border-primary">
                    <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
                    <span className="text-sm font-bold">Pay Cash</span>
                    <span className="text-xs text-muted-foreground">Pay at counter</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  {(paymentMethod === 'zomato' || paymentMethod === 'swiggy') && (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border bg-background p-5">
                      <p className="text-sm font-bold">Redirecting to {paymentMethod === 'zomato' ? 'Zomato' : 'Swiggy'}...</p>
                      <p className="text-xs text-muted-foreground">Complete your order on {paymentMethod === 'zomato' ? 'Zomato' : 'Swiggy'} platform.</p>
                      {lastOrderId && <p className="text-xs text-muted-foreground">Order ID: {lastOrderId}</p>}
                      <a href={paymentMethod === 'zomato' ? 'https://www.zomato.com/ncr/meenu-s-dosa' : 'https://www.swiggy.com/search?q=meenu%20dosa'} target="_blank" rel="noreferrer noopener" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Open {paymentMethod === 'zomato' ? 'Zomato' : 'Swiggy'}</a>
                      <button type="button" onClick={clearCart} className="rounded-full border px-4 py-2 text-xs font-semibold">Close</button>
                    </div>
                  )}
                  {paymentMethod === 'qr' && (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border bg-background p-5">
                      <p className="text-sm font-bold">Scan QR to pay</p>
                      <div className="relative aspect-square w-48 overflow-hidden rounded-xl border bg-white p-2">
                        <img src="/qr-code.png" alt="Payment QR code" className="h-full w-full object-contain" />
                      </div>
                      <p className="text-xs text-muted-foreground">Show this QR at the counter or scan with any UPI app.</p>
                      <p className="text-lg font-black text-primary">{formatPrice(cartTotal)}</p>
                      <button type="button" onClick={() => saveOrder('qr')} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Confirm QR payment</button>
                      <button type="button" onClick={() => { setPaymentMethod(null) }} className="rounded-full border px-4 py-2 text-xs font-semibold">Back</button>
                    </div>
                  )}
                  {paymentMethod === 'cash' && (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border bg-background p-5">
                      <p className="text-sm font-bold">Cash payment</p>
                      <p className="text-xs text-muted-foreground">Please pay at the counter when you receive your order.</p>
                      <p className="text-lg font-black text-primary">{formatPrice(cartTotal)}</p>
                      <button type="button" onClick={() => { saveOrder('cash'); setPaymentMethod(null); setOpen(false) }} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Confirm cash order</button>
                      <button type="button" onClick={() => { setPaymentMethod(null) }} className="rounded-full border px-4 py-2 text-xs font-semibold">Back</button>
                    </div>
                  )}
                </div>
              )}
            </div>}
          </div>
        </div>
      </div>}

      <div className="h-24"/>
    </main>
  </Shell>
}