'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shell } from '@/components/site-shell'
import { useAdminAuth } from '@/lib/auth-context'

export default function AdminLogin() {
  const router = useRouter()
  const { login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.replace('/admin')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    try {
      localStorage.setItem('meenu-dosa-admin-session', JSON.stringify({ email: 'guest@meenusdosa.com', loggedInAt: Date.now() }))
    } catch {}
    router.replace('/admin')
  }

  return (
    <Shell>
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-md">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Admin access</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">Sign in</h1>
          <p className="mt-4 text-sm text-muted-foreground">Enter your admin credentials to access the dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@meenusdosa.com"
                className="h-12 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-12 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-primary"
                required
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

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="w-fit rounded-full border-2 border-foreground bg-background px-6 py-3 text-sm font-bold text-foreground"
            >
              Skip - enter dashboard
            </button>
          </div>

          <Link href="/" className="mt-4 block text-sm font-bold underline underline-offset-4">Back to website</Link>
        </div>
      </main>
    </Shell>
  )
}