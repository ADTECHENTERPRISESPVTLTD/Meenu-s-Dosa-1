import { AdminAuthProvider } from '@/lib/auth-context'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}