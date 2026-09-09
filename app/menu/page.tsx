'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { categories, formatPrice, menu } from '@/lib/data'
import { CategoryImage, Shell } from '@/components/site-shell'

export default function MenuPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const filtered = useMemo(() => menu.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category
    return matchesCategory && item.name.toLowerCase().includes(query.toLowerCase())
  }), [category, query])

  return <Shell><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
    <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">The menu</p>
    <h1 className="mt-3 max-w-2xl text-5xl font-black tracking-tight sm:text-7xl">Made fresh, <span className="text-primary">worth sharing.</span></h1>
    <p className="mt-5 max-w-xl text-muted-foreground">Our approved menu is organized through a centralized service-ready data layer.</p>
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <label className="relative flex-1"><span className="sr-only">Search dishes</span><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dishes" className="h-12 w-full rounded-full border bg-background pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary" /></label>
      <label><span className="sr-only">Filter by category</span><select value={category} onChange={(e) => setCategory(e.target.value)} className="h-12 w-full rounded-full border bg-background px-4 sm:w-auto"><option value="all">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    </div>
    <div className="sticky top-16 z-20 -mx-4 mt-8 overflow-x-auto border-y bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-full sm:border"><div className="flex min-w-max gap-2"><a href="#all" onClick={() => setCategory('all')} className="rounded-full border px-4 py-2 text-sm font-semibold">All</a>{categories.map(c => <a key={c.id} href={`#${c.id}`} onClick={() => setCategory(c.id)} className="rounded-full border px-4 py-2 text-sm font-semibold">{c.name}</a>)}</div></div>
    <div className="mt-12 flex flex-col gap-16">{categories.filter((c) => category === 'all' || c.id === category).map(c => { const items = filtered.filter(item => item.category === c.id); return <section id={c.id} key={c.id} className="scroll-mt-32"><div className="mb-6 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-black sm:text-3xl">{c.name}</h2><p className="mt-1 text-sm text-muted-foreground">{c.description}</p></div><div className="hidden h-14 w-20 overflow-hidden rounded-lg sm:block"><CategoryImage src={c.image} alt=""/></div></div>{items.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map(item => <article key={item.id} className="flex items-start justify-between gap-4 rounded-2xl border bg-card p-4"><div><h3 className="font-bold">{item.name}</h3><p className="mt-1 text-xs text-muted-foreground">{item.vegetarian ? 'Vegetarian · ' : ''}{item.available ? 'Available' : 'Currently unavailable'}</p></div><p className="shrink-0 font-black text-primary">{formatPrice(item.price)}</p></article>)}</div> : <p className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">No dishes match your search in this category.</p>}</section> })}</div>
  </div></Shell>
}
