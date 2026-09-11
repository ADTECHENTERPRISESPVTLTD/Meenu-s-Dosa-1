'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Camera, MapPin, MessageCircle, Phone, Share2, Loader2 } from 'lucide-react'
import { Shell } from '@/components/site-shell'
import { siteConfig } from '@/lib/data'
import { locationApi } from '@/lib/api'

interface Location {
  id: string
  name: string
  address: string
  phone: string
  hours: string
  mapsUrl?: string
  zomatoUrl?: string
  swiggyUrl?: string
  isActive?: boolean
}

const channels = [
  { label: 'WhatsApp', icon: MessageCircle, href: siteConfig.integrations.whatsapp, text: 'Chat via Linktree' },
  { label: 'Instagram', icon: Camera, href: siteConfig.integrations.instagram, text: '@meenusdosa' },
  { label: 'Zomato', icon: Share2, href: siteConfig.integrations.zomato, text: 'Order on Zomato' },
  { label: 'Swiggy', icon: Share2, href: siteConfig.integrations.swiggy, text: 'Order on Swiggy' },
]

export default function Contact() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await locationApi.list()
        if (res.success) {
          setLocations(res.data.filter((l: Location) => l.isActive))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [])

  if (loading) {
    return (
      <Shell>
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-20">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </Shell>
    )
  }

  const firstLocation = locations[0]
  const callHref = firstLocation ? `tel:${firstLocation.phone.replace(/\s/g, '')}` : '#'
  const callText = firstLocation ? firstLocation.phone : 'Loading...'

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Contact</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">We&apos;re here to help.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Call, message, or visit us. Use the channels below to reach the restaurant directly.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={callHref}
            target="_blank"
            rel="noreferrer noopener"
            className="group rounded-3xl border bg-card p-6 transition hover:border-primary"
          >
            <Phone className="text-primary" />
            <h2 className="mt-5 font-bold">Call</h2>
            <p className="mt-2 text-sm text-muted-foreground group-hover:text-foreground">{callText}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
              Open <ArrowUpRight size={14} className="transition group-hover:translate-x-1" />
            </span>
          </a>
          {channels.map((channel) => (
            <a
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
            </a>
          ))}

          <div className="rounded-3xl border bg-card p-6">
            <MapPin className="text-primary" />
            <h2 className="mt-5 font-bold">Visit us</h2>
            <p className="mt-2 text-sm text-muted-foreground">Two outlets in Bhopal — Minal Residency & MP Nagar</p>
            <Link href="/locations" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
              View locations <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  )
}