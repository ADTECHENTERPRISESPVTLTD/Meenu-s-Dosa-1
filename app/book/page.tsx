import { BookingForm } from '@/components/booking-form'
import { Shell } from '@/components/site-shell'
import { locations } from '@/lib/data'
import { Clock, Users, Utensils, Phone, ArrowRight, Shield } from 'lucide-react'

const features = [
  { icon: Clock, title: 'Punctual Seating', desc: 'Tables are reserved for up to 15 minutes past your chosen arrival time.' },
  { icon: Users, title: 'Family & Group Gatherings', desc: 'Comfortable group dining configurations available for family celebrations and business lunches.' },
  { icon: Utensils, title: 'Hygienic Pure Vegetarian', desc: 'Strictly vegetarian kitchen with fresh stone-ground batters prepared daily.' },
]

export default function Book() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Book a table</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">Make it a meal to remember.</h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Reserve your dining table in advance. Experience hot, crispy dosas and comforting South Indian specialties fresh from the tawa.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          {/* Left: info column */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
                <Utensils size={20} className="text-primary" /> What to expect
              </h2>
              <div className="space-y-4">
                {features.map((f) => (
                  <div key={f.title} className="flex gap-4 rounded-3xl border bg-card p-5">
                    <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <f.icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-black">{f.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/30">
              <div className="flex items-start gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                  <Phone size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black">Need an Immediate Table within 1 Hour?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    For walk-ins and last-minute requests, call the branch directly for immediate table status:
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {locations.map((loc) => (
                      <div key={loc.id} className="rounded-2xl border border-amber-200 bg-card p-4 dark:border-amber-900/50">
                        <p className="text-xs font-bold uppercase tracking-[.1em] text-muted-foreground">{loc.name.replace("Meenu's Dosa — ", '')}</p>
                        <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="mt-1 inline-flex items-center gap-2 text-lg font-black text-primary">
                          <Phone size={18} /> {loc.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right: form column */}
          <div>
            <BookingForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Our team will reach out promptly to confirm your booking. No pre-payment required.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  )
}