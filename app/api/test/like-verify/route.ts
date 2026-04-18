import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { likePostAsUser, extractPostUrn } from '@/lib/linkedin'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not logged in — visit /login first' }, { status: 401 })

  const rawUrl = request.url
  const postUrl = decodeURIComponent(rawUrl.split('?postUrl=')[1] ?? '')

  if (!postUrl) return NextResponse.json({ error: 'Pass ?postUrl=https://linkedin.com/posts/...' })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('linkedin_access_token, linkedin_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!profile?.linkedin_access_token) {
    return NextResponse.json({ error: 'No LinkedIn token — sign out and sign back in with LinkedIn' })
  }

  if (!profile?.linkedin_id) {
    return NextResponse.json({ error: 'No LinkedIn member ID stored — sign out and sign back in with LinkedIn' })
  }

  const urns = extractPostUrn(postUrl)
  const { success, error, debug } = await likePostAsUser(
    profile.linkedin_access_token,
    profile.linkedin_id,
    postUrl
  )

  return NextResponse.json({
    result: success ? '✅ POST LIKED via API — verification works!' : `❌ FAILED — ${error}`,
    success,
    error: error ?? null,
    memberId: profile.linkedin_id,
    parsedUrns: urns,
    cleanedUrl: postUrl.split('?')[0],
    debug,
  })
}
