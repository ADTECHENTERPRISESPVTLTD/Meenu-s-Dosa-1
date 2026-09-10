import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, Users, Clock } from 'lucide-react'
import { CategoryImage, Shell } from '@/components/site-shell'

const features = [
  { icon: CheckCircle, text: 'Vegetarian' },
  { icon: Users, text: 'Indoor seating' },
  { icon: Clock, text: 'Home delivery' },
  { icon: CheckCircle, text: 'Takeaway' },
  { icon: Star, text: 'Lunch & Dinner' },
  { icon: CheckCircle, text: 'Digital payments' },
]

export default function About() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Our story</p>
            <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">Four decades of crisp, one family at a time.</h1>
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
      </div>
    </Shell>
  )
}