'use client'

import { useMemo, useState, useEffect } from 'react'
import { ArrowUpRight, ShoppingBag, Trash2, Star, Clock, Bike, MapPin } from 'lucide-react'
import { Shell } from '@/components/site-shell'
import { formatPrice, menu, type MenuItem, locations, siteConfig } from '@/lib/data'

const CART_STORAGE_KEY = 'meenu-dosa-cart'

export default function Order() {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [branch, setBranch] = useState(locations[0].id)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) setCart(JSON.parse(stored))
    } catch {}
  }, [])

  const clearCart = () => setCart({})

  const cartItems = useMemo(() => {
    return menu
      .filter((item) => (cart[item.id] ?? 0) > 0)
      .map((item) => ({ ...item, quantity: cart[item.id] ?? 0 }))
  }, [cart])

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0), [cartItems])

  const selected = locations.find((l) => l.id === branch) ?? locations[0]

  const platforms = [
    {
      key: 'zomato',
      label: 'Zomato',
      color: 'red',
      href: selected.zomatoUrl,
      rating: '4.2',
      time: '25-30 mins',
      delivery: 'Free delivery',
    },
    {
      key: 'swiggy',
      label: 'Swiggy',
      color: 'orange',
      href: selected.swiggyUrl,
      rating: '4.3',
      time: '20-28 mins',
      delivery: '₹0 delivery',
    },
  ]

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Order online</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">Your favourites, your way.</h1>

        {/* Branch selector */}
        <div className="mt-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-muted-foreground">Choose your outlet</p>
          <div className="flex flex-wrap gap-3">
            {locations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setBranch(loc.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                  branch === loc.id
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-card text-foreground hover:border-primary/60'
                }`}
              >
                <MapPin size={16} />
                {loc.name.replace("Meenu's Dosa — ", '')}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Ordering from <span className="font-bold text-foreground">{selected.name}</span>. Delivery links below update automatically.
          </p>
        </div>

        {cartCount > 0 ? (
          <>
            <p className="mt-5 max-w-xl text-muted-foreground">
              Review your order below, then choose a delivery partner to complete your order on their platform.
            </p>
            <section className="mt-8 rounded-3xl border bg-card p-5 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Your order</h2>
                <button type="button" onClick={clearCart} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-destructive">
                  <Trash2 size={16} /> Clear
                </button>
              </div>
              <ul className="mt-6 divide-y">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each · Qty {item.quantity}</p>
                    </div>
                    <p className="font-black text-primary">{formatPrice((item.price || 0) * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <p className="text-sm font-semibold text-muted-foreground">Total items</p>
                <p className="text-sm font-bold">{cartCount}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-lg font-black">Order total</p>
                <p className="text-lg font-black text-primary">{formatPrice(cartTotal)}</p>
              </div>
            </section>
          </>
        ) : (
          <p className="mt-5 max-w-xl text-muted-foreground">
            Your cart is empty. Browse the menu and add items, then come back here to order via your preferred delivery partner.
          </p>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {platforms.map((p) => (
            <a
              key={p.key}
              href={p.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative overflow-hidden rounded-3xl border bg-card transition hover:border-red-500"
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.2em] text-red-500">Order on</p>
                    <h2 className="mt-1 text-3xl font-black">{p.label}</h2>
                  </div>
                  <div className="grid size-12 place-items-center rounded-full border bg-white text-red-500">
                    <span className="text-lg font-black">{p.label[0]}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{selected.name} · South Indian</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Star size={14} className="fill-yellow-500 text-yellow-500" /> {p.rating}</span>
                  <span className="inline-flex items-center gap-1"><Clock size={14} /> {p.time}</span>
                  <span className="inline-flex items-center gap-1"><Bike size={14} /> {p.delivery}</span>
                </div>
                <button type="button" className="mt-5 w-full rounded-full bg-red-500 px-4 py-3 text-sm font-bold text-white transition group-hover:bg-red-600">
                  Order on {p.label} <ArrowUpRight className="ml-1 inline transition group-hover:translate-x-1" size={16} />
                </button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Shell>
  )
}