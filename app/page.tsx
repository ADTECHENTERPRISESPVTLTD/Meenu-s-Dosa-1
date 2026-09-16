import Link from 'next/link'
import { ArrowRight, MapPin, Phone, Sparkles, Star, ShieldCheck, Flame, Clock, Leaf, UtensilsCrossed, Heart, MessageCircle } from 'lucide-react'
import { categories, siteConfig } from '@/lib/data'
import { CategoryImage, Shell } from '@/components/site-shell'
import { DosaBuilder } from '@/components/dosa-builder'

export default function Home() {
  return (
    <Shell>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        {/* Background glow graphics */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 size-[600px] rounded-full bg-amber-500/10 blur-[120px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sparkles size={14} className="animate-pulse" /> 40-Year South Indian Heritage
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Authentic South Indian,{' '}
              <span className="gold-gradient-text">Served with Soul.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {siteConfig.description} Handcrafted with natural stone-ground fermentation, pure ghee, and soda-free batter.
            </p>

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
                className="inline-flex items-center gap-2 rounded-full border-2 border-amber-500/30 bg-card px-6 py-3.5 text-base font-bold text-foreground transition hover:border-amber-500 hover:bg-amber-500/5"
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

            {/* Micro proof badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-amber-500/20 pt-6 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <strong className="text-foreground">4.9 / 5</strong> (2,500+ Reviews)
              </span>
              <span className="inline-flex items-center gap-2">
                <Leaf size={16} className="text-emerald-500" />
                100% Pure Vegetarian
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-500" />
                Soda-Free Fluffy Idlis
              </span>
            </div>
          </div>

          {/* Hero Image Spotlight */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border-8 border-background shadow-2xl shadow-amber-500/10">
              <CategoryImage src="dosa.jpg" alt="Golden masala dosa served with chutney and sambar" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Floating Glass Badges */}
            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-amber-500/30 bg-card/90 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-amber-500 text-white">
                  <Flame size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Made Fresh</p>
                  <p className="font-extrabold text-sm">Crisp. Golden. Comforting.</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 -top-4 rounded-2xl border border-emerald-500/30 bg-card/90 p-3 shadow-xl backdrop-blur-md hidden sm:block">
              <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Leaf size={16} /> 100% Natural Fermentation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner Strip */}
      <section className="border-y border-amber-500/20 bg-amber-500/5 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black gold-gradient-text">40+</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Years Heritage</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black gold-gradient-text">100%</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Pure Vegetarian</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black gold-gradient-text">2</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Outlets in Bhopal</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black gold-gradient-text">30+</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Authentic Dishes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Dosa Meal Builder Widget */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <DosaBuilder />
      </section>

      {/* Menu Categories at a glance */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
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
              <div className="absolute top-4 left-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-white shadow-lg">
                🔥 Chef&apos;s Signature Pick
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

                <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-muted-foreground">
                  <span className="inline-flex items-center gap-1 bg-muted px-3 py-1.5 rounded-lg">🌶️ Mildly Spiced</span>
                  <span className="inline-flex items-center gap-1 bg-muted px-3 py-1.5 rounded-lg">⏱️ 12 Mins Preparation</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg">🍃 100% Pure Veg</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/menu"
                  className="rounded-full gold-gradient-bg px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-amber-500/20"
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
    </Shell>
  )
}