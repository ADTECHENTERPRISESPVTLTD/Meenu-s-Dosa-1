import Link from 'next/link'
import { ArrowUpRight, Camera, MessageCircle, Phone, Share2, Clock, Utensils } from 'lucide-react'
import { Shell } from '@/components/site-shell'
import { siteConfig, locations } from '@/lib/data'
import { ContactMessageForm } from '@/components/contact-message-form'

const channels = [
  { label: 'WhatsApp', icon: MessageCircle, href: siteConfig.integrations.whatsapp, text: 'Chat via Linktree' },
  { label: 'Instagram', icon: Camera, href: siteConfig.integrations.instagram, text: '@meenusdosa' },
  { label: 'Zomato', icon: Share2, href: siteConfig.integrations.zomato, text: 'Order on Zomato' },
  { label: 'Swiggy', icon: Share2, href: siteConfig.integrations.swiggy, text: 'Order on Swiggy' },
]

export default function Contact() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Contact</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">We&apos;re here to help.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Have questions about dining, party orders, menu selections, or feedback? Reach out to our Bhopal team directly.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left: channels + outlets */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
                <Phone size={20} className="text-primary" /> Direct Outlet Reach
              </h2>
              <div className="space-y-4">
                {locations.map((loc) => (
                  <div key={loc.id} className="rounded-3xl border bg-card p-6">
                    <div className="flex items-start gap-3">
                      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Utensils size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black">{loc.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{loc.address}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
                            <Phone size={14} /> {loc.phone}
                          </a>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={12} /> {loc.hours}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
                <MessageCircle size={20} className="text-primary" /> Online &amp; Social Channels
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {channels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center gap-3 rounded-2xl border bg-card p-4 transition hover:border-primary"
                  >
                    <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                      <channel.icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold">{channel.label}</p>
                      <p className="truncate text-xs text-muted-foreground group-hover:text-foreground">{channel.text}</p>
                    </div>
                    <ArrowUpRight size={14} className="ml-auto shrink-0 text-muted-foreground transition group-hover:translate-x-1" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: message form */}
          <div className="rounded-3xl border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-black">Send Us a Message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Have catering questions, feedback, or special requests? Drop us a note.
            </p>
            <ContactMessageForm />
          </div>
        </div>
      </div>
    </Shell>
  )
}