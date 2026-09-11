'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/site-shell'
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

export function LocationsContent() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await locationApi.list()
        if (res.success) {
          setLocations(res.data.map((location: any) => ({
            ...location,
            id: location._id || location.id,
          })))
        } else {
          setError('Failed to load locations')
        }
      } catch (err) {
        setError('Failed to load locations. Please try again later.')
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
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </Shell>
    )
  }

  if (error) {
    return (
      <Shell>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
          <div className="text-center text-destructive">{error}</div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Find us</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">Come hungry.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Two outlets serving authentic South Indian food in Bhopal.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {locations.map((l) => (
            <article key={l.id} className="flex flex-col rounded-3xl border bg-card p-6 sm:p-8">
              <h2 className="text-2xl font-black">{l.name}</h2>
              <div className="mt-5 flex flex-col gap-3 text-sm text-muted-foreground">
                <span className="flex gap-3"><svg className="text-primary" width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{l.address}</span>
                <span className="flex gap-3"><svg className="text-primary" width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>{l.phone}</span>
                <span className="flex gap-3"><svg className="text-primary" width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{l.hours}</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {l.mapsUrl && (
                  <a href={l.mapsUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold">
                    <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> Google Maps
                  </a>
                )}
                {l.zomatoUrl && (
                  <a href={l.zomatoUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
                    <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v18a2 2 0 002 2h14a2 2 0 002-2v-4" /></svg> Zomato
                  </a>
                )}
                {l.swiggyUrl && (
                  <a href={l.swiggyUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white">
                    <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v18a2 2 0 002 2h14a2 2 0 002-2v-4" /></svg> Swiggy
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Shell>
  )
}