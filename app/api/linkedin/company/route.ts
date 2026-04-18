import { NextResponse } from 'next/server'
import { extractLinkedInSlug, fetchLinkedInCompany } from '@/lib/linkedin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url') ?? ''

  const slug = extractLinkedInSlug(url)
  if (!slug) {
    return NextResponse.json({ error: 'Invalid LinkedIn company URL' }, { status: 400 })
  }

  try {
    const data = await fetchLinkedInCompany(slug)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch company data'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
