import Link from 'next/link'
import { ArrowRight, MapPin, Phone, Sparkles } from 'lucide-react'
import { categories, locations, siteConfig } from '@/lib/data'
import { CategoryImage, Shell } from '@/components/site-shell'

export default function Home() {
  return (
    <Shell>
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.05fr_.95fr] md:pb-24 md:pt-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-semibold">
              <Sparkles size={14} className="text-primary"/> 40-year heritage
            </div>
            <h1 className="max-w-xl text-4xl font-black leading-[.95] tracking-[-.06em] sm:text-6xl">
              Authentic South Indian cuisine, <span className="text-primary">served with soul.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/order" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-sm">
                Order online <ArrowRight size={18}/>
              </Link>
              <Link href="/book" className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-background px-6 py-3.5 text-base font-bold text-foreground">
                Book a table
              </Link>
              <Link href="/locations" className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-base font-bold">
                <MapPin size={16} /> Find an outlet
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-primary"/> Two outlets in Bhopal</span>
              <span className="inline-flex items-center gap-2"><Phone size={16} className="text-primary"/> +91 6262 9555 05</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] border-8 border-background shadow-2xl">
              <CategoryImage src="dosa.jpg" alt="Golden masala dosa served with chutney and sambar"/>
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl bg-foreground px-4 py-3 text-background shadow-xl">
              <p className="text-xs uppercase tracking-widest opacity-70">Made to order</p>
              <p className="font-bold">Crisp. Golden. Comforting.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">The menu, at a glance</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">A little something for every craving.</h2>
          </div>
          <Link href="/menu" className="text-sm font-bold underline underline-offset-4">Explore full menu <ArrowRight className="inline" size={16}/></Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-5">
          {categories.map((category, index) => (
            <Link href={`/menu#${category.id}`} key={category.id} className={`group relative overflow-hidden rounded-2xl ${index === 0 ? 'col-span-2 row-span-2 aspect-square sm:aspect-auto' : ''} aspect-[1.15]`}>
              <CategoryImage src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"/>
              <div className="absolute bottom-0 p-4 text-white">
                <p className="font-bold">{category.name}</p>
                <p className="mt-1 text-xs text-white/75">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Our promise</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Simple ingredients. Generous plates. A table that feels like home.</h2>
          </div>
          <div className="flex flex-col justify-end gap-5">
            <p className="leading-7 text-muted-foreground">Four decades of dosas, idlis, and warm hospitality — all in Bhopal. Every plate is made fresh, never rushed, and always worth sharing.</p>
            <Link href="/about" className="w-fit rounded-full bg-foreground px-5 py-3 text-sm font-bold text-background">Read our story <ArrowRight className="inline" size={16}/></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="rounded-[2rem] bg-primary p-7 text-primary-foreground sm:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.2em] opacity-70">Your next meal starts here</p>
              <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">Bring your appetite. We&apos;ll bring the dosa.</h2>
            </div>
            <Link href="/locations" className="w-fit rounded-full bg-foreground px-5 py-3 text-sm font-bold text-background">Find a location <ArrowRight className="inline" size={16}/></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Chef&apos;s pick</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">Today&apos;s special</h2>
          </div>
        </div>
        <div className="mt-8 overflow-hidden rounded-[2rem] border bg-card">
          <div className="grid md:grid-cols-[1fr_1.1fr]">
            <div className="aspect-[4/3] md:aspect-auto">
              <CategoryImage src="dosa.jpg" alt="Butter Masala Dosa" className="h-full w-full object-cover"/>
            </div>
            <div className="p-6 sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">Featured</span>
              <h3 className="mt-4 text-3xl font-black">Butter Masala Dosa</h3>
              <p className="mt-2 text-lg font-bold text-primary">₹209</p>
              <p className="mt-3 max-w-md leading-7 text-muted-foreground">Crisp golden dosa stuffed with spiced potato masala, finished with a generous pat of butter. A Bhopal favourite for four decades.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/menu" className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Order now <ArrowRight className="inline" size={16}/></Link>
                <Link href="/order" className="rounded-full border px-5 py-3 text-sm font-bold">Order via Zomato/Swiggy</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  )
}