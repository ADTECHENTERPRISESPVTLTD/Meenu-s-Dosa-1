import { Metadata } from 'next'
import { Suspense } from 'react'
import { MenuContent } from './menu-content'

export const metadata: Metadata = {
  title: "Menu | Meenu's Dosa",
  description: "Browse the full menu of Meenu's Dosa - crispy dosas, fluffy idlis, and authentic South Indian dishes.",
}

export default function MenuPage() {
  return <MenuContent />
}