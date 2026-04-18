import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/landing/hero'
import Features from '@/components/landing/features'
import Pricing from '@/components/landing/pricing'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <>
      <Hero />
      <Features />
      <Pricing />
    </>
  )
}
