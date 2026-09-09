'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shell } from '@/components/site-shell'

const ADMIN_EMAIL = 'admin@meenusdosa.com'
const ADMIN_PASSWORD = 'admin123'
const SESSION_KEY = 'meenu-dosa-admin-session'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY)
      if (session) router.replace('/admin')
    } catch {}
  }, [router])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        try {
          localStorage.setItem(SESSION_KEY, JSON.stringify({ email, loggedInAt: Date.now() }))
        } catch {}
        router.replace('/admin')
      } else {
        setError('Invalid email or password')
        setLoading(false)
      }
    }, 300)
  }

  return (
    <Shell>
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-md">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Admin access</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">Sign in</h1>
          <p className="mt-4 text-sm text-muted-foreground">Use your admin credentials to manage orders, menu, and restaurant details.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@meenusdosa.com"
                className="h-12 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="h-12 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground">Demo credentials: admin@meenusdosa.com / admin123</p>
          <Link href="/" className="mt-4 block text-sm font-bold underline underline-offset-4">Back to website</Link>
        </div>
      </main>
    </Shell>
  )
}
