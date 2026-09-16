import Link from 'next/link'
import { MapPin, Phone, Clock, ExternalLink, ShoppingBag, Calendar, ArrowRight, Sparkles } from 'lucide-react'
import { locations } from '@/lib/data'
import { Shell } from '@/components/site-shell'

export default function Locations() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
          <Sparkles size={14} /> Bhopal Restaurant Outlets
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
          Come Hungry, <span className="gold-gradient-text">Leave Happy.</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground text-sm sm:text-base">
          Two outlets serving authentic South Indian food in Bhopal. Visit for warm indoor dining, or order online to your doorstep.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {locations.map((l) => (
            <article
              key={l.id}
              className="flex flex-col justify-between rounded-[2.5rem] border border-amber-500/30 bg-card p-6 sm:p-10 shadow-xl shadow-amber-500/5 transition hover:border-amber-500/50"
            >
              <div>
                <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <h2 className="text-2xl font-black">{l.name}</h2>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">Open 7 Days a Week • {l.hours}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Dine-in & Delivery
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-4 text-sm text-muted-foreground">
                  <span className="flex gap-3 leading-relaxed">
                    <MapPin className="mt-1 shrink-0 text-amber-500" size={20} />
                    {l.address}
                  </span>
                  <span className="flex gap-3 font-semibold text-foreground">
                    <Phone className="mt-1 shrink-0 text-amber-500" size={18} />
                    {l.phone}
                  </span>
                  <span className="flex gap-3">
                    <Clock className="mt-1 shrink-0 text-amber-500" size={18} />
                    Operating Hours: {l.hours}
                  </span>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href={`tel:${l.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full gold-gradient-bg px-5 py-3 text-sm font-bold text-white shadow-md hover:scale-105 transition"
                  >
                    <Phone size={16} /> Call Outlet Now
                  </a>
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/30 bg-card px-5 py-3 text-sm font-bold text-foreground hover:bg-amber-500/10 transition"
                  >
                    <Calendar size={16} /> Book a Table
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {l.mapsUrl && (
                    <a
                      href={l.mapsUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-muted"
                    >
                      <ExternalLink size={14} /> Get Directions
                    </a>
                  )}
                  {l.zomatoUrl && (
                    <a
                      href={l.zomatoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-xs font-bold text-white shadow-sm"
                    >
                      <ShoppingBag size={14} /> Zomato Order
                    </a>
                  )}
                  {l.swiggyUrl && (
                    <a
                      href={l.swiggyUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm"
                    >
                      <ShoppingBag size={14} /> Swiggy Order
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-16 rounded-[2.5rem] border border-amber-500/30 bg-card p-8 sm:p-12 text-center shadow-xl">
          <h2 className="text-2xl font-black sm:text-3xl">Prefer to order before you arrive?</h2>
          <p className="mt-2 max-w-xl mx-auto text-muted-foreground text-sm">
            Skip the wait line. Order online via Zomato or Swiggy, or reserve your table in advance for a seamless dining experience.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-full gold-gradient-bg px-6 py-3.5 text-sm font-bold text-white shadow-md hover:scale-105 transition"
            >
              Order Online <ArrowRight size={16} />
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full border-2 border-foreground px-6 py-3.5 text-sm font-bold hover:bg-muted"
            >
              Book Table Advance <Calendar size={16} />
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  )
}