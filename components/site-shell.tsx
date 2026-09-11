'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Moon, Sun, ArrowUpRight, MessageCircle, X, Shield } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from './theme-provider'
import { siteConfig } from '@/lib/data'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Our story', href: '/about' },
  { label: 'Locations', href: '/locations' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Order online', href: '/order' },
  { label: 'Contact', href: '/contact' },
]

export function Header(){
  const [open,setOpen]=useState(false)
  const {dark,toggle}=useTheme()
  return <header className="sticky top-0 z-40 border-b-2 border-border bg-background shadow-sm">
    <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <Link href="/" onClick={()=>setOpen(false)} className="flex shrink-0 items-center gap-2 font-black tracking-tight">
        <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">M</span>
        <span>{siteConfig.name}</span>
      </Link>
      <nav aria-label="Primary navigation" className="hidden items-center gap-3 lg:flex">
        {navLinks.map((l)=><Link key={l.href} href={l.href} className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{l.label}</Link>)}
        <Link href="/book" className="whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Book a table</Link>
        <Link href="/admin/login" className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-amber-500/70 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-600 transition hover:bg-amber-500/20 dark:text-amber-400">
          <Shield size={14} /> Admin
        </Link>
        <button aria-label="Toggle theme" onClick={toggle} className="rounded-full border p-2">{dark?<Sun size={16}/>:<Moon size={16}/>}</button>
      </nav>
      <div className="flex items-center gap-2 lg:hidden">
        <Link href="/admin/login" className="inline-flex items-center gap-1.5 rounded-full border-2 border-amber-500/70 bg-amber-500/10 px-3 py-1.5 text-sm font-bold text-amber-600 dark:text-amber-400">
          <Shield size={14} /> Admin
        </Link>
        <button aria-label="Toggle theme" onClick={toggle} className="rounded-full border p-2">{dark?<Sun size={16}/>:<Moon size={16}/>}</button>
        <button aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={()=>setOpen(!open)} className="grid size-10 place-items-center rounded-full border-2 border-foreground bg-foreground text-background shadow-sm">{open?<X size={20}/>:<Menu size={20}/>}</button>
      </div>
    </div>
    {open && <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={()=>setOpen(false)} />
      <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute right-0 top-0 h-full w-[85%] max-w-sm border-l-2 border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <span className="text-lg font-black">{siteConfig.name}</span>
          <button aria-label="Close navigation" onClick={()=>setOpen(false)} className="grid size-10 place-items-center rounded-full border-2 border-foreground bg-foreground text-background"><X size={20}/></button>
        </div>
        <div className="flex flex-col gap-1 px-3 py-4">
          {navLinks.map((l)=><Link onClick={()=>setOpen(false)} key={l.href} href={l.href} className="rounded-xl px-4 py-4 text-base font-bold hover:bg-muted">{l.label}</Link>)}
          <Link onClick={()=>setOpen(false)} href="/book" className="mt-2 rounded-xl bg-primary px-4 py-4 text-center text-base font-bold text-primary-foreground">Book a table</Link>
          <Link onClick={()=>setOpen(false)} href="/admin/login" className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-amber-500/70 bg-amber-500/10 px-4 py-4 text-base font-bold text-amber-600 dark:text-amber-400">
            <Shield size={16} /> Admin Portal
          </Link>
        </div>
      </nav>
    </div>}
  </header>
}
export function Footer(){return <footer className="border-t border-border"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]"><div><div className="mb-3 flex items-center gap-2 font-black"><span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">M</span>{siteConfig.name}</div><p className="max-w-xs text-sm text-muted-foreground">{siteConfig.tagline} Authentic South Indian cuisine in Bhopal.</p></div><div><p className="mb-3 text-sm font-bold">Explore</p><div className="flex flex-col gap-2 text-sm text-muted-foreground"><Link href="/">Home</Link><Link href="/menu">Menu</Link><Link href="/about">Our story</Link><Link href="/locations">Locations</Link><Link href="/gallery">Gallery</Link></div></div><div><p className="mb-3 text-sm font-bold">Connect</p><div className="flex flex-col gap-2 text-sm text-muted-foreground"><Link href="/order">Order online <ArrowUpRight className="inline" size={14}/></Link><Link href="/book">Book a table</Link><Link href="/contact">Contact</Link><a href={siteConfig.integrations.whatsapp} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 hover:text-foreground"><MessageCircle size={14}/> WhatsApp</a><a href={siteConfig.integrations.instagram} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 hover:text-foreground"><ArrowUpRight size={14}/> Instagram</a></div></div><div><p className="mb-3 text-sm font-bold">Admin</p><div className="flex flex-col gap-2 text-sm text-muted-foreground"><Link href="/admin/login" className="inline-flex items-center gap-2 hover:text-foreground"><Shield size={14}/> Admin Portal</Link></div></div></div><div className="border-t px-4 py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {siteConfig.name}. Built for backend connection.</div></footer>}
export function Shell({children}:{children:React.ReactNode}){return <><Header/><div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,oklch(0.92_0.13_90/.65),transparent_35%)]"/><main>{children}</main><Footer/></>}
export function CategoryImage({src,alt,className}:{src:string;alt:string;className?:string}){return <Image src={`/images/categories/${src}`} alt={alt} width={900} height={650} className={className||'h-full w-full object-cover'} />}