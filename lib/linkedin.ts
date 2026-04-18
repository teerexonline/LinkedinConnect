export function extractLinkedInSlug(url: string): string | null {
  return url.match(/linkedin\.com\/company\/([^/?#]+)/)?.[1] ?? null
}

export async function fetchLinkedInCompany(slug: string) {
  const res = await fetch(`https://www.linkedin.com/company/${slug}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`LinkedIn fetch failed: ${res.status}`)

  const html = await res.text()

  const get = (patterns: RegExp[]) => {
    for (const p of patterns) {
      const m = html.match(p)
      if (m?.[1]) return decodeHtmlEntities(m[1].trim())
    }
    return ''
  }

  const name = get([
    /property="og:title"\s+content="([^"]+)"/,
    /content="([^"]+)"\s+property="og:title"/,
  ]).replace(/\s*\|\s*LinkedIn\s*$/, '').trim()

  const description = get([
    /property="og:description"\s+content="([^"]+)"/,
    /content="([^"]+)"\s+property="og:description"/,
  ])

  const image = get([
    /property="og:image"\s+content="([^"]+)"/,
    /content="([^"]+)"\s+property="og:image"/,
  ])

  const companyId = html.match(/"organizationUrn":"urn:li:fs_normalized_company:(\d+)"/)?.[1]
    ?? html.match(/"entityUrn":"urn:li:fs_normalized_company:(\d+)"/)?.[1]
    ?? html.match(/\/company\/(\d+)\//)?.[1]
    ?? ''

  const followerMatch = html.match(/([\d,]+)\s+followers?/i)
  const followerCount = followerMatch ? parseInt(followerMatch[1].replace(/,/g, ''), 10) : 0

  const industryMatch = html.match(/"industry":"([^"]+)"/)
  const industry = industryMatch ? decodeHtmlEntities(industryMatch[1]) : ''

  const sizeMatch = html.match(/"staffCountRange":\{"start":(\d+),"end":(\d+)\}/)
  const companySize = sizeMatch ? `${sizeMatch[1]}–${sizeMatch[2]} employees` : ''

  const hqMatch = html.match(/"headquarter":\{[^}]*"city":"([^"]+)"[^}]*"country":"([^"]+)"/)
  const headquarters = hqMatch ? `${hqMatch[1]}, ${hqMatch[2]}` : ''

  // Try Clearbit for logo using the LinkedIn company slug as domain hint
  // Fall back to OG image if available
  let logoUrl = image || ''

  return {
    name,
    description,
    logo_url: logoUrl,
    linkedin_company_id: companyId,
    linkedin_url: `https://www.linkedin.com/company/${slug}`,
    follower_count: followerCount,
    industry,
    company_size: companySize,
    headquarters,
    website: '',
  }
}

export async function followOnLinkedIn(accessToken: string, memberUrn: string, orgId: string) {
  const res = await fetch('https://api.linkedin.com/v2/organizationFollows', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      follower: { member: `urn:li:person:${memberUrn}` },
      followee: { organization: `urn:li:organization:${orgId}` },
    }),
  })
  return res.ok
}

export function extractPostUrn(postUrl: string): { activity: string; ugcPost: string } | null {
  // Strip query params before parsing
  const cleanUrl = postUrl.split('?')[0]

  // Already contains a URN in the URL path
  const urnMatch = cleanUrl.match(/urn:li:(activity|ugcPost):(\d+)/)
  if (urnMatch) {
    const id = urnMatch[2]
    return { activity: `urn:li:activity:${id}`, ugcPost: `urn:li:ugcPost:${id}` }
  }

  // /posts/slug-activity-{id}-{shortcode} format
  const activityMatch = cleanUrl.match(/activity-(\d{10,})-/)
  if (activityMatch) {
    const id = activityMatch[1]
    return { activity: `urn:li:activity:${id}`, ugcPost: `urn:li:ugcPost:${id}` }
  }

  // Generic: last long number in the path
  const slugMatch = cleanUrl.match(/-(\d{15,})/)
  if (slugMatch) {
    const id = slugMatch[1]
    return { activity: `urn:li:activity:${id}`, ugcPost: `urn:li:ugcPost:${id}` }
  }

  return null
}

export async function getLinkedInNumericId(accessToken: string): Promise<string | null> {
  const res = await fetch('https://api.linkedin.com/v2/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
    },
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.id ?? null
}

export async function likePostAsUser(accessToken: string, memberId: string, postUrl: string): Promise<{ success: boolean; error?: string; debug?: object }> {
  const urns = extractPostUrn(postUrl)
  if (!urns) return { success: false, error: 'Could not parse post URL' }

  // Resolve numeric person ID — OIDC sub differs from v2 API person ID
  const numericId = await getLinkedInNumericId(accessToken)
  const personId = numericId ?? memberId
  const actor = `urn:li:person:${personId}`

  const id = urns.activity.split(':').pop()!
  const urnsToTry = [
    urns.activity,
    urns.ugcPost,
    `urn:li:share:${id}`,
  ]

  const attempts: object[] = []

  for (const urn of urnsToTry) {
    const encodedUrn = encodeURIComponent(urn)
    const res = await fetch(`https://api.linkedin.com/v2/socialActions/${encodedUrn}/likes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202304',
      },
      body: JSON.stringify({ actor }),
    })

    const body = await res.json().catch(() => ({}))
    attempts.push({ urn, status: res.status, body })

    // 201 = liked, 200 = ok, 409/422 = already liked — all count as success
    if (res.ok || res.status === 201 || res.status === 409 || res.status === 422) {
      return { success: true, debug: { actor, urn, status: res.status, attempts } }
    }
    if (res.status === 403) {
      return { success: false, error: '403 — w_member_social scope not granted. Add "Share on LinkedIn" product to your LinkedIn app.', debug: { actor, attempts } }
    }
    // 404 = wrong URN, try next
  }

  return { success: false, error: 'Post not found with any URN format', debug: { actor, resolvedNumericId: numericId, attempts } }
}

export async function unfollowOnLinkedIn(accessToken: string, memberUrn: string, orgId: string) {
  const params = new URLSearchParams({
    follower: `urn:li:person:${memberUrn}`,
    followee: `urn:li:organization:${orgId}`,
  })
  const res = await fetch(`https://api.linkedin.com/v2/organizationFollows?${params}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
    },
  })
  return res.ok
}

function decodeHtmlEntities(str: string) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}
