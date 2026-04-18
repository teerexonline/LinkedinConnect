import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { likePostAsUser } from '@/lib/linkedin'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const startupId = searchParams.get('startupId')
  if (!startupId) return NextResponse.json({ error: 'startupId required' }, { status: 400 })

  const [startupRes, profileRes] = await Promise.all([
    supabase.from('startups').select('featured_post_url').eq('id', startupId).single(),
    supabase.from('user_profiles').select('linkedin_access_token, linkedin_id').eq('user_id', user.id).maybeSingle(),
  ])

  const featuredPostUrl = startupRes.data?.featured_post_url
  const token = profileRes.data?.linkedin_access_token
  const memberId = profileRes.data?.linkedin_id

  if (!featuredPostUrl) {
    return NextResponse.json({ verified: false, reason: 'no_post', message: 'No featured post set for this startup.' })
  }

  if (!token || !memberId) {
    return NextResponse.json({ verified: false, reason: 'no_token', message: 'LinkedIn token missing — please sign out and sign back in with LinkedIn.' })
  }

  const { success, error, debug } = await likePostAsUser(token, memberId, featuredPostUrl)

  return NextResponse.json({
    verified: success,
    reason: success ? 'liked' : (error ?? 'failed'),
    message: success
      ? '✅ Post liked on your behalf — point awarded!'
      : error?.includes('403')
        ? '🔒 LinkedIn scope insufficient. Make sure you signed in with LinkedIn and the app has w_member_social access.'
        : `❌ Could not like post: ${error}`,
    debug,
  })
}
