'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Moon, Sun, ArrowUpRight, MessageCircle, X, Shield, Sparkles, MapPin, Phone, Heart, UtensilsCrossed, Leaf, Coffee } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTheme } from './theme-provider'
import { siteConfig } from '@/lib/data'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Namma Menu', href: '/menu' },
  { label: 'Namma Story', href: '/about' },
  { label: 'Outlets', href: '/locations' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Order Online', href: '/order' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState({ name: siteConfig.name, tagline: siteConfig.tagline })
  const { dark, toggle } = useTheme()

  useEffect(() => {
    fetch('/api/content')
      .then((response) => response.json())
      .then((data) => {
        if (data.ok && data.content) {
          setContent({ name: data.content.name || siteConfig.name, tagline: data.content.tagline || siteConfig.tagline })
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
    <header className="sticky top-0 z-[100] isolate border-b border-amber-500/25 bg-background/95 backdrop-blur-md shadow-sm transition-colors">
      {/* South Indian Top Announcement Bar */}
      <div className="banana-leaf-bg py-1.5 px-4 text-center text-xs font-bold text-white tracking-wide shadow-inner flex items-center justify-center gap-2">
        <Sparkles size={13} className="animate-spin text-amber-300 shrink-0 hidden sm:inline-flex" />
        <span className="truncate max-w-[90vw] sm:max-w-none">🙏 <strong>Vanakkam!</strong> {content.tagline}</span>
      </div>

      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" onClick={() => setOpen(false)} className="flex shrink-0 items-center gap-3 group">
          <div className="relative grid size-11 place-items-center rounded-2xl gold-gradient-bg text-white font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed size={22} />
            <span className="absolute -bottom-1 -right-1 flex size-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-3.5 bg-emerald-600 border-2 border-white"></span>
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-black tracking-tight block south-indian-gradient-text">
              {content.name}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1 -mt-0.5">
              <Leaf size={10} /> 40 Years of Traditional Tawa
            </span>
          </div>
          <div className="sm:hidden">
            <span className="text-lg font-black tracking-tight block south-indian-gradient-text">
              {content.name}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-1.5 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-extrabold text-muted-foreground transition-all hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
            >
              {l.label}
            </Link>
          ))}

          <Link
            href="/book"
            className="whitespace-nowrap rounded-full gold-gradient-bg px-5 py-2.5 text-xs font-black text-white shadow-md shadow-amber-500/20 transition hover:opacity-95 hover:scale-105 active:scale-95"
          >
            Book a Table
          </Link>

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-600 transition hover:bg-amber-500/20 dark:text-amber-400"
          >
            <Shield size={13} /> Admin
          </Link>

          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="rounded-full border border-border p-2.5 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 transition"
          >
            {dark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-700" />}
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400"
          >
            <Shield size={12} /> Admin
          </Link>
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="rounded-full border p-2 text-muted-foreground"
          >
            {dark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
          </button>
          <button
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-2xl gold-gradient-bg text-white shadow-md shadow-amber-500/20"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
    {open && (
      <>
        <div
          className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="fixed inset-y-0 right-0 z-[120] flex w-[min(92vw,26rem)] flex-col border-l border-amber-500/20 bg-background shadow-2xl lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <span className="text-lg font-black south-indian-gradient-text">{content.name}</span>
              <p className="text-[10px] font-bold text-emerald-600">🙏 Vanakkam & Welcome!</p>
            </div>
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="grid size-8 place-items-center rounded-full bg-amber-500 text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between px-3 py-3 overflow-hidden">
            <div className="flex flex-col gap-0.5">
              {navLinks.map((l) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm font-bold transition hover:bg-amber-500/10 hover:text-amber-600"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex flex-col gap-1.5">
              <Link
                onClick={() => setOpen(false)}
                href="/book"
                className="rounded-xl gold-gradient-bg px-3 py-2.5 text-center text-sm font-bold text-white shadow-md shadow-amber-500/20"
              >
                Book a Table
              </Link>
              <Link
                onClick={() => setOpen(false)}
                href="/admin/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm font-bold text-amber-600 dark:text-amber-400"
              >
                <Shield size={14} /> Admin Portal
              </Link>
            </div>
          </div>
        </nav>
      </>
    )}
    </>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-amber-500/20 bg-card/80 backdrop-blur-sm kolam-pattern">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl gold-gradient-bg text-white font-black shadow-md shadow-amber-500/20">
              <UtensilsCrossed size={22} />
            </div>
            <div>
              <span className="text-xl font-black south-indian-gradient-text">{siteConfig.name}</span>
              <p className="text-[10px] font-bold text-emerald-600">🙏 Traditional South Indian Tawa</p>
            </div>
          </div>
          <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">
            {siteConfig.tagline} Authentic South Indian delicacies, 100% pure vegetarian, 24-hr stone ground & soda-free.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Sparkles size={14} /> 40-Year Namma Heritage in Bhopal
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Explore Menu
          </p>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-muted-foreground">
            <Link href="/" className="hover:text-amber-600 transition">Home</Link>
            <Link href="/menu" className="hover:text-amber-600 transition">Namma Menu</Link>
            <Link href="/about" className="hover:text-amber-600 transition">Namma Story</Link>
            <Link href="/locations" className="hover:text-amber-600 transition">Outlets</Link>
            <Link href="/gallery" className="hover:text-amber-600 transition">Photo Gallery</Link>
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Quick Connect
          </p>
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-muted-foreground">
            <Link href="/order" className="hover:text-amber-600 transition inline-flex items-center gap-1">
              Order Online <ArrowUpRight size={14} />
            </Link>
            <Link href="/book" className="hover:text-amber-600 transition">Book Table</Link>
            <Link href="/contact" className="hover:text-amber-600 transition">Contact Us</Link>
            <a
              href={siteConfig.integrations.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <MessageCircle size={15} /> WhatsApp Delivery
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Bhopal Outlets
          </p>
          <div className="flex flex-col gap-3 text-xs text-muted-foreground">
            <div className="rounded-xl border border-amber-500/20 bg-background/60 p-3">
              <p className="font-bold text-foreground flex items-center gap-1">
                <MapPin size={12} className="text-amber-500" /> Minal Residency Outlet
              </p>
              <p className="mt-1 text-[11px]">Raj Capital, J.K. Road, Ayodhya Bypass</p>
              <p className="mt-1 font-semibold text-amber-600 dark:text-amber-400">
                <Phone size={10} className="inline mr-1" /> +91 6262 9555 05
              </p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-background/60 p-3">
              <p className="font-bold text-foreground flex items-center gap-1">
                <MapPin size={12} className="text-amber-500" /> MP Nagar Outlet
              </p>
              <p className="mt-1 text-[11px]">Zone 2, MP Nagar, Bhopal</p>
              <p className="mt-1 font-semibold text-amber-600 dark:text-amber-400">
                <Phone size={10} className="inline mr-1" /> +91 6262 9555 06
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-3">
        <p>© {new Date().getFullYear()} {siteConfig.name}. Authentic South Indian Delicacies.</p>
        <p className="inline-flex items-center gap-1 font-semibold">
          Crafted with <Heart size={14} className="text-red-500 fill-red-500 inline" /> for food lovers in Bhopal
        </p>
      </div>
    </footer>
  )
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_80%_0%,oklch(0.92_0.14_80/.25),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_0%,oklch(0.35_0.12_65/.2),transparent_40%)]" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export function CategoryImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <Image
      src={`/images/categories/${src}`}
      alt={alt}
      width={900}
      height={650}
      className={className || 'h-full w-full object-cover'}
    />
  )
}