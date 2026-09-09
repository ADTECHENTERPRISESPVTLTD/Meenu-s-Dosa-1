import Link from 'next/link'
import { ArrowUpRight, Camera, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react'
import { Shell } from '@/components/site-shell'
import { siteConfig } from '@/lib/data'

const channels = [
  { label: 'Call', icon: Phone, href: 'tel:+919876543210', text: '+91 98765 43210' },
  { label: 'WhatsApp', icon: MessageCircle, href: siteConfig.integrations.whatsapp || 'https://wa.me/919876543210', text: 'Chat with us' },
  { label: 'Instagram', icon: Camera, href: siteConfig.integrations.instagram || 'https://instagram.com/meenusdosa', text: '@meenusdosa' },
  { label: 'Zomato', icon: Share2, href: siteConfig.integrations.zomato, text: 'Order on Zomato' },
  { label: 'Swiggy', icon: Share2, href: siteConfig.integrations.swiggy, text: 'Order on Swiggy' },
]

export default function Contact() {
  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Contact</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">We&apos;re here to help.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Call, message, or visit us. Use the channels below to reach the restaurant directly.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <Link
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group rounded-3xl border bg-card p-6 transition hover:border-primary"
            >
              <channel.icon className="text-primary" />
              <h2 className="mt-5 font-bold">{channel.label}</h2>
              <p className="mt-2 text-sm text-muted-foreground group-hover:text-foreground">{channel.text}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                Open <ArrowUpRight size={14} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}

          <div className="rounded-3xl border bg-card p-6">
            <MapPin className="text-primary" />
            <h2 className="mt-5 font-bold">Visit us</h2>
            <p className="mt-2 text-sm text-muted-foreground">Verified locations coming soon</p>
            <Link href="/locations" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
              View locations <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  )
}
