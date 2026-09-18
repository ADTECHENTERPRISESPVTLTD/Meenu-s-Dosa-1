'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, Phone, Sparkles, Star, ShieldCheck, Flame, Clock, Leaf, UtensilsCrossed, Coffee, Check, MessageCircle, ShoppingBag, Trash2, QrCode, Banknote, X } from 'lucide-react'
import { categories, siteConfig, formatPrice, menu, type MenuItem } from '@/lib/data'
import { CategoryImage, Shell } from '@/components/site-shell'
import { DosaBuilder } from '@/components/dosa-builder'

const CART_STORAGE_KEY = 'meenu-dosa-cart'

type PaymentMethod = 'qr' | 'cash' | 'zomato' | 'swiggy'
type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [description, setDescription] = useState(siteConfig.description)
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
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })
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
    fetch('/api/content')
      .then((response) => response.json())
      .then((data) => {
        if (data.ok && data.content?.description) setDescription(data.content.description)
      })
      .catch(() => {})
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

  const updateCart = (item: MenuItem, delta: number) => setCart((current) => {
    const count = Math.max(0, (current[item.id] ?? 0) + delta)
    const next = { ...current }
    if (count > 0) next[item.id] = count
    else delete next[item.id]
    return next
  })

  const addComboToCart = (comboItems: Array<{id: string, name: string, price: number}>) => setCart((current) => {
    const next = { ...current }
    comboItems.forEach(item => {
      next[item.id] = (next[item.id] ?? 0) + 1
    })
    return next
  })

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const cartTotal = useMemo(() => menu.reduce((sum, item) => sum + (item.price || 0) * (cart[item.id] ?? 0), 0), [cart])
  const cartItems = useMemo(() => menu.filter((item) => (cart[item.id] ?? 0) > 0).map((item) => ({ ...item, quantity: cart[item.id] ?? 0 })), [cart])
  return (
    <Shell>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 kolam-pattern">
        {/* Background ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 size-[320px] rounded-full bg-amber-500/10 blur-[120px] sm:size-[500px] sm:blur-[140px] lg:size-[650px]" />
        <div className="pointer-events-none absolute bottom-4 right-0 -z-10 size-[220px] rounded-full bg-emerald-500/10 blur-[90px] sm:bottom-10 sm:right-10 sm:size-[320px] sm:blur-[110px] lg:size-[450px] lg:blur-[130px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1.1fr_.9fr]">
          <div>
            {/* South Indian Heritage Pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 shadow-sm">
              <Sparkles size={14} className="animate-pulse text-amber-500" />
              <span>🛕 40-Year South Indian Culinary Heritage</span>
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Authentic South Indian,{' '}
              <span className="south-indian-gradient-text">Served with Soul.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description} Handcrafted with 24-hour stone-ground natural fermentation, pure ghee, and soda-free batter.
            </p>

            {/* Visual South Indian Taste Highlights */}
            <div className="mt-6 grid grid-cols-2 gap-2.5 max-w-md text-xs font-bold text-foreground">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-800 dark:text-emerald-300">
                <Leaf size={16} className="text-emerald-600 shrink-0" />
                <span>🍃 Banana Leaf Freshness</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-800 dark:text-amber-300">
                <Coffee size={16} className="text-amber-600 shrink-0" />
                <span>☕ Degree Filter Coffee</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-800 dark:text-amber-300">
                <UtensilsCrossed size={16} className="text-amber-600 shrink-0" />
                <span>🥥 3 Fresh Chutneys</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-800 dark:text-emerald-300">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>✨ 100% Soda-Free Batter</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/order"
                className="inline-flex items-center gap-2.5 rounded-full gold-gradient-bg px-7 py-4 text-base font-bold text-white shadow-xl shadow-amber-500/25 transition hover:scale-105 active:scale-95"
              >
                Order Online <ArrowRight size={18} />
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-600/40 bg-card px-6 py-3.5 text-base font-bold text-foreground transition hover:border-emerald-600 hover:bg-emerald-500/5"
              >
                Book a Table
              </Link>
              <Link
                href="/locations"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3.5 text-sm font-bold hover:bg-muted"
              >
                <MapPin size={16} className="text-amber-500" /> Outlets
              </Link>
            </div>

            {/* Proof badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-amber-500/20 pt-6 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <strong className="text-foreground">4.9 / 5</strong> (2,500+ Reviews on Zomato & Swiggy)
              </span>
              <span className="inline-flex items-center gap-2">
                <Leaf size={16} className="text-emerald-500" />
                100% Pure Vegetarian Kitchen
              </span>
            </div>
          </div>

          {/* Hero Image Spotlight */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border-8 border-background shadow-2xl shadow-amber-500/15">
              <CategoryImage src="dosa.jpg" alt="Golden masala dosa served with chutney and sambar" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            </div>

            {/* Floating Glass Badges */}
            <div className="absolute -bottom-6 -left-4 sm:-bottom-6 sm:-left-4 rounded-2xl border border-amber-500/40 bg-card/95 p-3 sm:p-4 shadow-2xl backdrop-blur-md sm:max-w-[200px] max-w-[160px]">
              <div className="flex items-center gap-3">
                <div className="grid size-10 sm:size-11 place-items-center rounded-2xl gold-gradient-bg text-white shadow-md">
                  <Flame size={20} className="sm:size-22" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Handcrafted Every Order</p>
                  <p className="font-black text-sm">Crisp. Golden. Pure Ghee.</p>
                </div>
                <div className="sm:hidden">
                  <p className="text-[9px] font-bold text-amber-600 dark:text-amber-400">Handcrafted Every Order</p>
                  <p className="font-black text-xs">Crisp. Golden. Pure Ghee.</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 -top-4 rounded-2xl border border-emerald-500/40 bg-card/95 p-3.5 shadow-2xl backdrop-blur-md hidden sm:block">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Leaf size={18} /> Served Fresh on Banana Leaf Style
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner Strip */}
      <section className="border-y border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-amber-500/10 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black south-indian-gradient-text">40+</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Years Heritage</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black south-indian-gradient-text">100%</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Pure Vegetarian</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black south-indian-gradient-text">2</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Outlets in Bhopal</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black south-indian-gradient-text">30+</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Authentic Recipes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Dosa Meal Builder Widget */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <DosaBuilder />
      </section>

      {/* 4 Pillars of South Indian Taste Section */}
      <section className="bg-muted/40 py-16 sm:py-20 border-y border-amber-500/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Leaf size={14} /> Culinary Pillars
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              The Secret of Authentic Flavour
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              What makes Meenu&apos;s Dosa a beloved dining destination in Bhopal for four decades.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: '🍃',
                title: 'Banana Leaf Tradition',
                desc: 'Plates served with fresh leaf aroma, giving authentic South Indian dining vibes.',
              },
              {
                icon: '☕',
                title: 'Degree Filter Coffee',
                desc: 'Brewed fresh with dark roast chicory beans & served in brass dabara cups.',
              },
              {
                icon: '🥥',
                title: 'Fresh Chutney Trio',
                desc: 'Coconut, Tomato-Garlic & Mint-Coriander chutneys churned 4 times daily.',
              },
              {
                icon: '🫓',
                title: 'Seasoned Tawa Crunch',
                desc: 'Batter spread thin on seasoned cast iron tawas with pure golden ghee.',
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="rounded-3xl border border-amber-500/20 bg-card p-6 shadow-md transition hover:border-amber-500/50 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <span className="text-4xl block mb-4">{pillar.icon}</span>
                  <h3 className="font-extrabold text-lg">{pillar.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Check size={14} /> 100% Authentic Guarantee
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Categories at a glance */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Explore Our Offerings
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
              A Dish for Every Craving.
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Explore Full Menu <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              href={`/menu#${category.id}`}
              key={category.id}
              className={`group relative overflow-hidden rounded-2xl border border-amber-500/20 ${
                index === 0 ? 'col-span-2 row-span-2 aspect-square sm:aspect-auto' : ''
              } aspect-[1.15] shadow-md`}
            >
              <CategoryImage
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-4 text-white">
                <span className="inline-block rounded-full bg-amber-500/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  {category.name}
                </span>
                <p className="mt-1 font-extrabold text-base sm:text-lg">{category.name}</p>
                <p className="mt-0.5 text-xs text-white/80 line-clamp-2">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Chef's Special Spotlight */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <div className="overflow-hidden rounded-[2.5rem] border border-amber-500/30 bg-card shadow-2xl">
          <div className="grid md:grid-cols-[1fr_1.1fr]">
            <div className="relative aspect-[4/3] md:aspect-auto">
              <CategoryImage src="dosa.jpg" alt="Butter Masala Dosa" className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 rounded-full gold-gradient-bg px-3.5 py-1.5 text-xs font-black text-white shadow-lg flex items-center gap-1.5">
                <Flame size={14} /> Chef&apos;s Signature Pick
              </div>
            </div>
            <div className="p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Star size={14} className="fill-amber-500 text-amber-500" /> Bestseller Dish
                </span>
                <h3 className="mt-4 text-3xl font-black sm:text-4xl">Butter Masala Dosa</h3>
                <p className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">₹209</p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Crisp golden dosa stuffed with spiced potato masala, roasted with pure desi butter on seasoned cast iron tawas. Served hot with fresh coconut chutney & lentil sambhar.
                </p>

                <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-muted-foreground">
                  <span className="inline-flex items-center gap-1 bg-muted px-3 py-1.5 rounded-lg">🌶️ Mildly Spiced</span>
                  <span className="inline-flex items-center gap-1 bg-muted px-3 py-1.5 rounded-lg">⏱️ 12 Mins Preparation</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg">🍃 100% Pure Veg</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/menu"
                  className="rounded-full gold-gradient-bg px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-amber-500/20 hover:scale-105 transition"
                >
                  Order Dish Now <ArrowRight className="inline ml-1" size={16} />
                </Link>
                <a
                  href={siteConfig.integrations.zomato}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border border-red-500/40 bg-red-500/10 px-5 py-3.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20"
                >
                  Order via Zomato
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Testimonials */}
      <section className="bg-amber-500/5 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Customer Love
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Why Bhopal Loves Meenu&apos;s Dosa
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Rahul Sharma',
                role: 'Food Blogger, Bhopal',
                review: 'The crispiness of the Ghee Roast Dosa is unmatched in Bhopal! Authentic South Indian spices and zero soda batter makes it super light.',
                rating: 5,
              },
              {
                name: 'Ananya Verma',
                role: 'Regular Diner',
                review: 'My family has been coming to Meenu’s Dosa at Minal Residency for 8 years. Their Button Idli Fry and Davidoff Cold Coffee are an absolute addiction!',
                rating: 5,
              },
              {
                name: 'Vikramaditya S.',
                role: 'MP Nagar Resident',
                review: 'Generous portions, pristine hygiene, and authentic filter coffee taste! Best place to hang out with friends and family.',
                rating: 5,
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-amber-500/20 bg-card p-6 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm italic text-muted-foreground leading-relaxed">&ldquo;{item.review}&rdquo;</p>
                </div>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-extrabold text-sm text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Online Delivery Partners Banner */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-[2.5rem] gold-gradient-bg p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -bottom-10 size-64 rounded-full bg-white/10 blur-2xl" />
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center relative z-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                Fast Doorstep Delivery
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Craving Hot Dosas at Home?
              </h2>
              <p className="mt-2 text-white/90 text-base max-w-xl">
                Get your favourite South Indian delicacies delivered piping hot to your doorstep via Zomato, Swiggy, or direct WhatsApp ordering.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={siteConfig.integrations.zomato}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-amber-900 shadow-md transition hover:scale-105"
              >
                Zomato Order
              </a>
              <a
                href={siteConfig.integrations.swiggy}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full bg-orange-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:scale-105"
              >
                Swiggy Order
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Cart & Checkout Drawer */}
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
                              <X size={12} />
                            </button>
                            <span className="min-w-5 text-center text-xs font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCart(item, 1)}
                              className="grid size-7 place-items-center rounded-full bg-amber-500 text-white"
                            >
                              <X size={12} className="rotate-45" />
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
    </Shell>
  )
}