import Link from 'next/link'
import { MapPin, Phone, Clock, ExternalLink, ShoppingBag, Calendar, ArrowRight } from 'lucide-react'
import { locations } from '@/lib/data'
import { Shell } from '@/components/site-shell'

export default function Locations() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Find us</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">Come hungry.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Two outlets serving authentic South Indian food in Bhopal. Visit for dine-in, or order delivery to your doorstep.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {locations.map((l) => (
            <article key={l.id} className="flex flex-col rounded-3xl border bg-card p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-black">{l.name}</h2>
                <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Dine-in &amp; Delivery</span>
              </div>

              <div className="mt-5 flex flex-col gap-3 text-sm text-muted-foreground">
                <span className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-primary" size={18}/>{l.address}</span>
                <span className="flex gap-3"><Phone className="mt-0.5 shrink-0 text-primary" size={18}/>{l.phone}</span>
                <span className="flex gap-3"><Clock className="mt-0.5 shrink-0 text-primary" size={18}/>{l.hours}</span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a href={`tel:${l.phone.replace(/\s/g, '')}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
                  <Phone size={16} /> Call now
                </a>
                <a href="/book" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-foreground px-4 py-3 text-sm font-bold text-foreground">
                  <Calendar size={16} /> Book a table
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {l.mapsUrl && (
                  <a href={l.mapsUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold">
                    <ExternalLink size={14}/> Google Maps
                  </a>
                )}
                {l.zomatoUrl && (
                  <a href={l.zomatoUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
                    <ShoppingBag size={14}/> Zomato
                  </a>
                )}
                {l.swiggyUrl && (
                  <a href={l.swiggyUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white">
                    <ShoppingBag size={14}/> Swiggy
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border bg-card p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-black sm:text-3xl">Prefer to order or reserve before you arrive?</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Skip the wait. Order online via Zomato or Swiggy, or reserve your table in advance for a seamless dining experience.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/order" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
              Order online <ArrowRight size={16} />
            </Link>
            <Link href="/book" className="inline-flex items-center gap-2 rounded-full border-2 border-foreground px-6 py-3 text-sm font-bold text-foreground">
              Book a table <Calendar size={16} />
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  )
}