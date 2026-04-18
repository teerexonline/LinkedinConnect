import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { followOnLinkedIn, unfollowOnLinkedIn } from '@/lib/linkedin'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { startupId } = await request.json()
  if (!startupId) return NextResponse.json({ error: 'startupId required' }, { status: 400 })

  const { data: existing } = await supabase
    .from('user_follows')
    .select('id')
    .eq('user_id', user.id)
    .eq('startup_id', startupId)
    .maybeSingle()

  if (existing) return NextResponse.json({ error: 'Already followed' }, { status: 409 })

  const [startupRes, profileRes] = await Promise.all([
    supabase.from('startups').select('linkedin_company_id').eq('id', startupId).single(),
    supabase.from('user_profiles').select('linkedin_access_token, linkedin_id').eq('user_id', user.id).maybeSingle(),
  ])

  let linkedinFollowed = false
  const startup = startupRes.data
  const profile = profileRes.data

  if (startup?.linkedin_company_id && profile?.linkedin_access_token && profile?.linkedin_id) {
    linkedinFollowed = await followOnLinkedIn(
      profile.linkedin_access_token,
      profile.linkedin_id,
      startup.linkedin_company_id
    )
  }

  const { error } = await supabase
    .from('user_follows')
    .insert({ user_id: user.id, startup_id: startupId })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.rpc('award_points', { p_user_id: user.id, p_points: 1 })

  return NextResponse.json({ success: true, linkedinFollowed })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { startupId } = await request.json()
  if (!startupId) return NextResponse.json({ error: 'startupId required' }, { status: 400 })

  const [startupRes, profileRes] = await Promise.all([
    supabase.from('startups').select('linkedin_company_id').eq('id', startupId).single(),
    supabase.from('user_profiles').select('linkedin_access_token, linkedin_id').eq('user_id', user.id).maybeSingle(),
  ])

  const startup = startupRes.data
  const profile = profileRes.data

  if (startup?.linkedin_company_id && profile?.linkedin_access_token && profile?.linkedin_id) {
    await unfollowOnLinkedIn(
      profile.linkedin_access_token,
      profile.linkedin_id,
      startup.linkedin_company_id
    )
  }

  const { error } = await supabase
    .from('user_follows')
    .delete()
    .eq('user_id', user.id)
    .eq('startup_id', startupId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Deduct 1 point (floor at 0)
  await supabase.rpc('award_points', { p_user_id: user.id, p_points: -1 })

  return NextResponse.json({ success: true })
}
