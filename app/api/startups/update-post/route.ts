import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { startupId, featuredPostUrl } = await request.json()
  if (!startupId || !featuredPostUrl) {
    return NextResponse.json({ error: 'startupId and featuredPostUrl required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('startups')
    .update({ featured_post_url: featuredPostUrl })
    .eq('id', startupId)
    .eq('created_by', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
