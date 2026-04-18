import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { linkedin_url, name, description, logo_url, industry, company_size, headquarters, website, follower_count, linkedin_company_id, featured_post_url } = body

  if (!linkedin_url || !name) {
    return NextResponse.json({ error: 'linkedin_url and name are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('startups')
    .insert({
      linkedin_url,
      linkedin_company_id,
      name,
      description,
      logo_url,
      industry,
      company_size,
      headquarters,
      website,
      follower_count,
      featured_post_url: featured_post_url || null,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
