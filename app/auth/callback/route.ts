import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = await Promise.resolve(url.searchParams)
  const origin = url.origin
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      const { session } = data
      const providerToken = session.provider_token

      if (providerToken) {
        const meta = session.user.user_metadata ?? {}
        const linkedinId = meta.sub ?? meta.provider_id ?? meta.id ?? null

        await supabase.from('user_profiles').upsert({
          user_id: session.user.id,
          linkedin_access_token: providerToken,
          linkedin_id: linkedinId ? String(linkedinId) : null,
          display_name: meta.full_name ?? meta.name ?? null,
          avatar_url: meta.avatar_url ?? meta.picture ?? null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`)
}
