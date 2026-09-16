import { categories } from '@/lib/data'
import { CategoryImage, Shell } from '@/components/site-shell'
import { Image as LucideImage, Sparkles, Heart } from 'lucide-react'

export default function Gallery() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
          <Sparkles size={14} /> Food Showcase
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
          A Taste of the <span className="gold-gradient-text">Table.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground text-sm sm:text-base">
          A visual showcase of our handcrafted South Indian dishes, natural stone-ground ferments, and fresh chutneys.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="group relative overflow-hidden rounded-[2.5rem] border border-amber-500/20 bg-card shadow-lg transition-all hover:border-amber-500/50 hover:shadow-2xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <CategoryImage
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute top-4 right-4 rounded-full bg-amber-500/80 p-2 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={16} />
                </div>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="font-extrabold text-base">{c.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-500">
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