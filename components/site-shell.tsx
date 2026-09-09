'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Moon, Sun, ArrowUpRight, MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from './theme-provider'
import { siteConfig } from '@/lib/data'

const navigation = [['Home','/'],['Menu','/menu'],['Our story','/about'],['Locations','/locations'],['Gallery','/gallery'],['Order online','/order'],['Contact','/contact'],['Admin','/admin/login']] as const

export function Header(){
  const [open,setOpen]=useState(false)
  const {dark,toggle}=useTheme()
  return <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
    <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <Link href="/" onClick={()=>setOpen(false)} className="flex shrink-0 items-center gap-2 font-black tracking-tight">
        <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">M</span>
        <span>{siteConfig.name}</span>
      </Link>
      <nav aria-label="Primary navigation" className="hidden items-center gap-5 lg:flex">
        {navigation.map(([label,href])=><Link key={href} href={href} className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{label}</Link>)}
        <Link href="/book" className="whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Book a table</Link>
        <button aria-label="Toggle theme" onClick={toggle} className="rounded-full border p-2">{dark?<Sun size={16}/>:<Moon size={16}/>}</button>
      </nav>
      <div className="flex items-center gap-2 lg:hidden">
        <button aria-label="Toggle theme" onClick={toggle} className="rounded-full border p-2">{dark?<Sun size={16}/>:<Moon size={16}/>}</button>
        <button aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={()=>setOpen(!open)} className="rounded-full border p-2">{open?<X size={18}/>:<Menu size={18}/>}</button>
      </div>
    </div>
    {open && <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setOpen(false)} />
      <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute right-0 top-0 h-full w-[82%] max-w-sm border-l bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-black">{siteConfig.name}</span>
          <button aria-label="Close navigation" onClick={()=>setOpen(false)} className="rounded-full border p-2"><X size={18}/></button>
        </div>
        <div className="flex flex-col gap-1 px-3 py-4">
          {navigation.map(([label,href])=><Link onClick={()=>setOpen(false)} key={href} href={href} className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted">{label}</Link>)}
          <Link onClick={()=>setOpen(false)} href="/book" className="mt-2 rounded-lg bg-primary px-3 py-3 text-center text-sm font-bold text-primary-foreground">Book a table</Link>
        </div>
      </nav>
    </div>}
  </header>
}
export function Footer(){return <footer className="border-t border-border"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]"><div><div className="mb-3 flex items-center gap-2 font-black"><span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">M</span>{siteConfig.name}</div><p className="max-w-xs text-sm text-muted-foreground">{siteConfig.tagline} Verified restaurant details will be connected from the approved configuration.</p></div><div><p className="mb-3 text-sm font-bold">Explore</p><div className="flex flex-col gap-2 text-sm text-muted-foreground"><Link href="/">Home</Link><Link href="/menu">Menu</Link><Link href="/about">Our story</Link><Link href="/locations">Locations</Link><Link href="/gallery">Gallery</Link></div></div><div><p className="mb-3 text-sm font-bold">Connect</p><div className="flex flex-col gap-2 text-sm text-muted-foreground"><Link href="/order">Order online <ArrowUpRight className="inline" size={14}/></Link><Link href="/book">Book a table</Link><Link href="/contact">Contact</Link><span className="inline-flex items-center gap-2"><MessageCircle size={14}/> WhatsApp pending approval</span></div></div></div><div className="border-t px-4 py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {siteConfig.name}. Built for backend connection.</div></footer>}
export function Shell({children}:{children:React.ReactNode}){return <><Header/><div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,oklch(0.92_0.13_90/.65),transparent_35%)]"/><main>{children}</main><Footer/></>}
export function CategoryImage({src,alt,className}:{src:string;alt:string;className?:string}){return <Image src={`/images/categories/${src}`} alt={alt} width={900} height={650} className={className||'h-full w-full object-cover'} />}
