import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AddStartupForm from './form'

export default async function AddStartupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <AddStartupForm />
}
