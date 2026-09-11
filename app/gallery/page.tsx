import { categories } from '@/lib/data'
import { CategoryImage, Shell } from '@/components/site-shell'
import { Image as LucideImage } from 'lucide-react'

export default function Gallery() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Gallery</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">A taste of the table.</h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          A snapshot of our kitchen, our plates, and the moments that fill our dining rooms.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="group relative overflow-hidden rounded-3xl border bg-card">
              <div className="aspect-[4/3] overflow-hidden">
                <CategoryImage src={c.image} alt={c.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-black">{c.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>
                </div>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <LucideImage size={18} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}