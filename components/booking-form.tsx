'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { bookingApi, locationApi } from '@/lib/api'

type BookingState = 'idle' | 'loading' | 'success' | 'error'

export function BookingForm() {
  const [state, setState] = useState<BookingState>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: '',
    location: '',
  })
  const [locations, setLocations] = useState<Array<{ id: string; name: string }>>([])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.time) newErrors.time = 'Time is required'
    if (!formData.guests || Number(formData.guests) < 1) newErrors.guests = 'At least 1 guest is required'
    if (!formData.location) newErrors.location = 'Please select a location'
    return newErrors
  }

  const fetchLocations = async () => {
    try {
      const response = await locationApi.list()
      if (response.success) {
        setLocations(response.data.filter((location: any) => location.isActive).map((location: any) => ({
          id: location._id || location.id,
          name: location.name,
        })))
      }
    } catch {
      setLocations([])
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setState('error')
      return
    }

    setState('loading')
    try {
      const result = await bookingApi.create({
        customerName: formData.name,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guestCount: Number(formData.guests),
        message: formData.message,
        location: formData.location,
      })
      if (result.success) {
        setState('success')
        setFormData({ name: '', phone: '', date: '', time: '', guests: '2', message: '', location: '' })
      } else {
        setErrors({ form: result.message || 'Booking failed.' })
        setState('error')
      }
    } catch (err: any) {
      setErrors({ form: err.message || 'Something went wrong. Please try again.' })
      setState('error')
    }
  }

  const inputClassName = (field: string) =>
    `h-12 rounded-xl border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-primary ${
      errors[field] ? 'border-destructive' : ''
    }`

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border bg-card p-5 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Name <span className="text-destructive">*</span>
          <input
            required
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
            className={inputClassName('name')}
          />
          {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Phone <span className="text-destructive">*</span>
          <input
            required
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
            className={inputClassName('phone')}
          />
          {errors.phone && <span className="text-xs text-destructive">{errors.phone}</span>}
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Date <span className="text-destructive">*</span>
          <input
            required
            name="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
            className={inputClassName('date')}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.date && <span className="text-xs text-destructive">{errors.date}</span>}
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Time <span className="text-destructive">*</span>
          <input
            required
            name="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData((f) => ({ ...f, time: e.target.value }))}
            className={inputClassName('time')}
          />
          {errors.time && <span className="text-xs text-destructive">{errors.time}</span>}
        </label>

        <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
          Number of guests <span className="text-destructive">*</span>
          <input
            required
            name="guests"
            type="number"
            min="1"
            value={formData.guests}
            onChange={(e) => setFormData((f) => ({ ...f, guests: e.target.value }))}
            className={inputClassName('guests')}
          />
          {errors.guests && <span className="text-xs text-destructive">{errors.guests}</span>}
        </label>

        <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
          Location <span className="text-destructive">*</span>
          <select
            required
            name="location"
            value={formData.location}
            onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
            className={inputClassName('location')}
          >
            <option value="">Select outlet</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
          {errors.location && <span className="text-xs text-destructive">{errors.location}</span>}
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold">
        Optional message
        <textarea
          name="message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
          className="rounded-xl border bg-background p-3 font-normal outline-none focus:ring-2 focus:ring-primary"
        />
      </label>

      {errors.form && (
        <p role="alert" className="text-sm text-destructive">
          {errors.form}
        </p>
      )}

      {state === 'success' && (
        <p role="status" className="text-sm font-semibold text-primary">
          Booking request submitted successfully. The restaurant will confirm your booking.
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="h-12 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        {state === 'loading' ? 'Submitting...' : 'Request a table'}
      </button>
    </form>
  )
}