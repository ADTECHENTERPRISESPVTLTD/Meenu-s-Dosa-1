import { Metadata } from 'next'
import { Suspense } from 'react'
import { LocationsContent } from './locations-content'

export const metadata: Metadata = {
  title: "Locations | Meenu's Dosa",
  description: "Find Meenu's Dosa outlets in Bhopal - addresses, phone numbers, hours, and directions.",
}

export default function LocationsPage() {
  return <LocationsContent />
}