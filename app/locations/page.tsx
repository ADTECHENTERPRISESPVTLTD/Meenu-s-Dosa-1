import { MapPin, Phone, Clock, ExternalLink, ShoppingBag } from 'lucide-react'
import { locations } from '@/lib/data'
import { Shell } from '@/components/site-shell'

export default function Locations() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Find us</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">Come hungry.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Two outlets serving authentic South Indian food in Bhopal.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {locations.map((l) => (
            <article key={l.id} className="flex flex-col rounded-3xl border bg-card p-6 sm:p-8">
              <h2 className="text-2xl font-black">{l.name}</h2>
              <div className="mt-5 flex flex-col gap-3 text-sm text-muted-foreground">
                <span className="flex gap-3"><MapPin className="text-primary" size={18}/>{l.address}</span>
                <span className="flex gap-3"><Phone className="text-primary" size={18}/>{l.phone}</span>
                <span className="flex gap-3"><Clock className="text-primary" size={18}/>{l.hours}</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
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
      </div>
    </Shell>
  )
}