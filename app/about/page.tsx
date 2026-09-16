import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, Users, Clock, MapPin, Utensils, Sparkles, Heart } from 'lucide-react'
import { Shell, CategoryImage } from '@/components/site-shell'

const features = [
  { icon: CheckCircle, text: '100% Pure Vegetarian' },
  { icon: Users, text: 'Family Dining Indoor Seating' },
  { icon: Clock, text: 'Fast Doorstep Delivery' },
  { icon: CheckCircle, text: 'Soda-Free Batter' },
  { icon: Star, text: 'Lunch & Dinner Service' },
  { icon: CheckCircle, text: 'Digital UPI Payments' },
]

const philosophy = [
  {
    icon: Utensils,
    title: 'Generational Tradition',
    desc: 'Centred around traditional stone-grinding, slow natural fermentation, and authentic South Indian spice blends passed down for 40 years.',
  },
  {
    icon: Clock,
    title: 'Natural Fermentation',
    desc: 'Patience & zero artificial soda. A truly great dosa batter ferments naturally over 24 hours to achieve signature crispness and easy digestibility.',
  },
  {
    icon: Star,
    title: 'Pure Desi Ghee & Tawa',
    desc: 'Spread in a steady spiral across seasoned cast-iron tawas, roasted with aromatic ghee until deeply golden, and folded with spiced potato bhaji.',
  },
  {
    icon: Users,
    title: 'Bhopal Hospitality',
    desc: 'From our Minal Residency outlet to MP Nagar, serving families, working professionals, and food lovers with warm, unhurried Indian hospitality.',
  },
]

const stats = [
  { value: '100%', label: 'Pure Vegetarian Kitchen' },
  { value: '40+', label: 'Years of Authentic Heritage' },
  { value: '2', label: 'Bhopal Outlets' },
]

export default function About() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        {/* Hero */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sparkles size={14} /> Our Culinary Journey
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Four Decades of Crisp, <span className="gold-gradient-text">Served with Love.</span>
            </h1>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground text-base sm:text-lg">
              For 40 years, Meenu&apos;s Dosa has been crafting crispy dosas and soda-free fluffy idlis in Bhopal.
              Every plate is built on simple ingredients, generous portions, and a table that feels like home.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {features.map((f) => (
                <span
                  key={f.text}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-card px-4 py-2 text-xs font-bold text-foreground shadow-sm"
                >
                  <f.icon size={14} className="text-amber-500" /> {f.text}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full gold-gradient-bg px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:scale-105 transition"
              >
                Explore Menu <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border-8 border-background shadow-2xl shadow-amber-500/10">
            <CategoryImage src="idli.jpg" alt="Soft idli and vada served with chutneys" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/20 p-4 text-white backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">Signature Recipe</p>
              <p className="font-extrabold text-base">Soda-Free Fluffy Steamed Idlis</p>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <section className="mt-20 grid gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border border-amber-500/30 bg-card p-8 text-center shadow-lg">
              <p className="text-5xl font-black gold-gradient-text">{s.value}</p>
              <p className="mt-2 text-sm font-bold text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Culinary Philosophy */}
        <section className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Our Craft & Values
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              Honest Ingredients, Zero Short-Cuts
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Meenu&apos;s Dosa was built on a simple premise: authentic South Indian food should be prepared without compromise.
              That means honoring traditional recipes passed down through decades, where slow natural fermentation cannot be hurried.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {philosophy.map((p) => (
              <div key={p.title} className="rounded-3xl border border-amber-500/20 bg-card p-8 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-500">
                    <p.icon size={24} />
                  </div>
                  <h3 className="text-xl font-black">{p.title}</h3>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 rounded-[2.5rem] gold-gradient-bg p-10 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Taste The Authentic Difference</h2>
          <p className="mt-3 max-w-xl mx-auto text-white/90 text-sm">
            Visit our dining rooms in Minal Residency and MP Nagar, or order directly to your doorstep today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-amber-900 shadow-md transition hover:scale-105"
            >
              <MapPin size={16} /> Visit Outlets
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/10"
            >
              Order Online <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  )
}