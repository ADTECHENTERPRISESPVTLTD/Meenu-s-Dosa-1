'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { CategoryImage, Shell } from '@/components/site-shell'
import { categoryApi } from '@/lib/api'

interface Category {
  id: string
  name: string
  image: string
  description: string
  slug?: string
  sortOrder?: number
  isActive?: boolean
}

export default function Gallery() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.list()
        if (res.success) {
          setCategories(res.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <Shell>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Gallery</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">A taste of the table.</h1>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.slice(0, 6).map((c) => (
            <div key={c.id} className="overflow-hidden rounded-3xl">
              <CategoryImage src={c.image} alt={c.name} />
              <p className="bg-card p-4 font-bold">{c.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}