import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get IDs the user has already followed
  const { data: followed } = await supabase
    .from('user_follows')
    .select('startup_id')
    .eq('user_id', user.id)

  const followedIds = (followed ?? []).map(f => f.startup_id)

  // Fetch startups not yet followed, randomised
  let query = supabase
    .from('startups')
    .select('id, name, description, logo_url, industry, company_size, headquarters, follower_count, linkedin_url, website, featured_post_url')
    .order('created_at', { ascending: false })

  if (followedIds.length > 0) {
    query = query.not('id', 'in', `(${followedIds.join(',')})`)
  }

  const { data: startups, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(startups ?? [])
}
