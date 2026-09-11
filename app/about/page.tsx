import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, Users, Clock, MapPin, Utensils } from 'lucide-react'
import { Shell, CategoryImage } from '@/components/site-shell'

const features = [
  { icon: CheckCircle, text: 'Vegetarian' },
  { icon: Users, text: 'Indoor seating' },
  { icon: Clock, text: 'Home delivery' },
  { icon: CheckCircle, text: 'Takeaway' },
  { icon: Star, text: 'Lunch & Dinner' },
  { icon: CheckCircle, text: 'Digital payments' },
]

const philosophy = [
  { icon: Utensils, title: 'The Tradition', desc: 'Rooted in South Indian roots. Centred around traditional stone-grinding, slow natural fermentation, and generational spice blends. The culinary philosophy remains untouched — authentic, comforting, and honest.' },
  { icon: Clock, title: 'The Batter', desc: 'Patience & daily fermentation. A truly great dosa begins 24 hours prior. We soak premium rice and whole urad dal, stone-grind with precision, and allow natural aeration to develop signature crispness and light digestibility.' },
  { icon: Star, title: 'The Tawa', desc: 'Cast-iron roasting & pure desi ghee. Spreading the batter in a steady spiral across seasoned flat tawas, roasting with aromatic ghee until deeply golden, and folding with freshly spiced potato bhaji.' },
  { icon: Users, title: 'The Hospitality', desc: "Bhopal's cherished South Indian dining. From our Minal Residency outlet to MP Nagar, serving families, working professionals, and food lovers with warm, unhurried Indian hospitality." },
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
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Our story</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">Four decades of crisp, one family at a time.</h1>
            <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
              For 40 years, Meenu&apos;s Dosa has been crafting crispy dosas and soda-free fluffy idlis in Bhopal.
              Every plate is built on simple ingredients, generous portions, and a table that feels like home.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {features.map((f) => (
                <span key={f.text} className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-bold">
                  <f.icon size={16} className="text-primary"/> {f.text}
                </span>
              ))}
            </div>
            <Link href="/menu" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">
              See the menu <ArrowRight size={16}/>
            </Link>
          </div>
          <div className="aspect-square overflow-hidden rounded-[2rem]">
            <CategoryImage src="idli.jpg" alt="Soft idli and vada served with chutneys"/>
          </div>
        </div>

        {/* Stats */}
        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border bg-card p-6 text-center">
              <p className="text-4xl font-black text-primary">{s.value}</p>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Culinary philosophy */}
        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Our Culinary Philosophy</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Crafting Flavour Through Honest Ingredients</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Meenu&apos;s Dosa was built on a simple, timeless premise: that authentic South Indian food should be prepared without compromise.
              That means honoring traditional recipes passed down through decades, where slow natural fermentation cannot be hurried, and pure ghee cannot be replaced.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {philosophy.map((p) => (
              <div key={p.title} className="rounded-3xl border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                    <p.icon size={22} />
                  </div>
                  <h3 className="text-xl font-black">{p.title}</h3>
                </div>
                <p className="mt-4 leading-7 text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Signature paragraph */}
        <section className="mt-16 rounded-3xl border bg-card p-8 sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">The Journey of Flavour</p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Every dosa that leaves our kitchen is stretched thin and roasted on seasoned cast iron until it achieves that coveted, paper-crisp golden crunch.
              Paired with our trio of freshly churned coconut chutneys and vegetable-packed lentil sambar simmered in small batches throughout the day.
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Whether you are starting your morning with piping hot Idli Vada Sambar or winding down in the evening over a Ghee Roast Masala Dosa,
              we invite you to taste the care, consistency, and warmth that make Meenu&apos;s Dosa a beloved dining destination.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Taste The Authentic Difference</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Visit our dining rooms in Minal Residency and MP Nagar, or order directly to your doorstep today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/locations" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
              <MapPin size={16} /> Visit our outlets
            </Link>
            <Link href="/menu" className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold">
              Order online <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  )
}