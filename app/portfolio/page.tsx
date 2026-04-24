import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortfolioPage from '@/components/portfolio/portfolio-page'

export default async function Portfolio() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [portfolioRes, pointsRes] = await Promise.all([
    supabase
      .from('startups')
      .select('id, name, description, logo_url, industry, company_size, headquarters, follower_count, linkedin_url, website, featured_post_url')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('user_points')
      .select('total_points')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  return (
    <PortfolioPage
      portfolio={portfolioRes.data ?? []}
      points={pointsRes.data?.total_points ?? 0}
    />
  )
}
