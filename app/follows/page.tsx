import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FollowsList from '@/components/follows/follows-list'

export default async function FollowsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [followsRes, pointsRes] = await Promise.all([
    supabase
      .from('user_follows')
      .select('startup_id, followed_at, startups(id, name, description, logo_url, industry, company_size, headquarters, follower_count, linkedin_url, website)')
      .eq('user_id', user.id)
      .order('followed_at', { ascending: false }),
    supabase
      .from('user_points')
      .select('total_points')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const follows = (followsRes.data ?? []).map(f => ({
    followedAt: f.followed_at,
    startup: Array.isArray(f.startups) ? f.startups[0] : f.startups,
  })).filter(f => f.startup != null) as Array<{
    followedAt: string
    startup: {
      id: string
      name: string
      description: string
      logo_url: string
      industry: string
      company_size: string
      headquarters: string
      follower_count: number
      linkedin_url: string
      website: string
    }
  }>

  return (
    <FollowsList
      initialFollows={follows}
      initialPoints={pointsRes.data?.total_points ?? 0}
    />
  )
}
