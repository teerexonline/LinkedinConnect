import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DiscoverFeed from '@/components/discover/discover-feed'

export default async function DiscoverPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch startups user hasn't followed yet
  const { data: followed } = await supabase
    .from('user_follows')
    .select('startup_id')
    .eq('user_id', user.id)

  const followedIds = (followed ?? []).map(f => f.startup_id)

  let query = supabase
    .from('startups')
    .select('id, name, description, logo_url, industry, company_size, headquarters, follower_count, linkedin_url, website, featured_post_url')
    .order('created_at', { ascending: false })

  if (followedIds.length > 0) {
    query = query.not('id', 'in', `(${followedIds.join(',')})`)
  }

  const { data: startups } = await query

  // Fetch user's current points
  const { data: pointsRow } = await supabase
    .from('user_points')
    .select('total_points')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <DiscoverFeed
      initialStartups={startups ?? []}
      initialPoints={pointsRow?.total_points ?? 0}
    />
  )
}
