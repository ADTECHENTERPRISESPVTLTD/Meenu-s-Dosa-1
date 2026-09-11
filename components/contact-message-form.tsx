'use client'

import { Send } from 'lucide-react'

export function ContactMessageForm() {
  return (
    <form className="mt-6 grid gap-4" onSubmit={(e) => e.preventDefault()}>
      <label className="grid gap-2 text-sm font-semibold">
        Your Name <span className="text-destructive">*</span>
        <input required type="text" className="h-12 rounded-xl border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-primary" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Phone Number <span className="text-destructive">*</span>
        <input required type="tel" className="h-12 rounded-xl border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-primary" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Email Address (Optional)
        <input type="email" className="h-12 rounded-xl border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-primary" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Inquiring About
        <select className="h-12 rounded-xl border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-primary">
          <option>General Inquiry</option>
          <option>Dine In &amp; Table Booking</option>
          <option>Takeaway Orders</option>
          <option>Home Delivery</option>
          <option>Party / Catering</option>
          <option>Feedback</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Message <span className="text-destructive">*</span>
        <textarea required rows={4} className="rounded-xl border bg-background p-3 font-normal outline-none focus:ring-2 focus:ring-primary" placeholder="How can our restaurant team help you today?" />
      </label>
      <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">
        Send Message <Send size={16} />
      </button>
    </form>
  )
}