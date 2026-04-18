import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Dashboard from '@/components/dashboard/dashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [portfolioRes, followsRes, pointsRes] = await Promise.all([
    supabase
      .from('startups')
      .select('id, name, description, logo_url, industry, company_size, headquarters, follower_count, linkedin_url, website, featured_post_url')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('user_follows')
      .select('startup_id, followed_at, startups(id, name, logo_url, industry, follower_count, linkedin_url)')
      .eq('user_id', user.id)
      .order('followed_at', { ascending: false }),
    supabase
      .from('user_points')
      .select('total_points')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const portfolio = portfolioRes.data ?? []
  const follows = (followsRes.data ?? []).map(f => ({
    followedAt: f.followed_at,
    startup: Array.isArray(f.startups) ? f.startups[0] : f.startups,
  })).filter(f => f.startup != null) as Array<{
    followedAt: string
    startup: { id: string; name: string; logo_url: string; industry: string; follower_count: number; linkedin_url: string }
  }>

  return (
    <Dashboard
      portfolio={portfolio}
      follows={follows}
      points={pointsRes.data?.total_points ?? 0}
      userEmail={user.email ?? ''}
    />
  )
}
