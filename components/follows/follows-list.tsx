'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Startup {
  id: string
  name: string
  description: string
  logo_url: string
  industry: string
  company_size: string
  headquarters: string
  follower_count: number
  linkedin_url: string
  website: string
}

interface Follow {
  followedAt: string
  startup: Startup
}

interface Props {
  initialFollows: Follow[]
  initialPoints: number
}

export default function FollowsList({ initialFollows, initialPoints }: Props) {
  const [follows, setFollows] = useState<Follow[]>(initialFollows)
  const [points, setPoints] = useState(initialPoints)
  const [unfollowing, setUnfollowing] = useState<Record<string, boolean>>({})
  const [imgError, setImgError] = useState<Record<string, boolean>>({})

  const handleUnfollow = async (startupId: string) => {
    setUnfollowing(u => ({ ...u, [startupId]: true }))

    const res = await fetch('/api/follow', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startupId }),
    })

    if (res.ok) {
      setFollows(f => f.filter(x => x.startup.id !== startupId))
      setPoints(p => Math.max(0, p - 1))
    }

    setUnfollowing(u => ({ ...u, [startupId]: false }))
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070d1a',
      fontFamily: 'var(--font-jakarta)',
      color: '#e8edf5',
      padding: '40px 24px',
      position: 'relative',
    }}>
      {/* Ambient */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(74,127,255,0.05) 0%, transparent 55%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(rgba(74,127,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none', opacity: 0.4 }} />

      <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link href="/" style={{ fontSize: '13px', color: '#6b7d99', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '12px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#e8edf5'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7d99'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              Home
            </Link>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '32px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              My Follows
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7d99', marginTop: '6px' }}>
              {follows.length} startup{follows.length !== 1 ? 's' : ''} followed
            </p>
          </div>

          {/* Points */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '100px',
            background: 'rgba(245,183,49,0.08)', border: '1px solid rgba(245,183,49,0.2)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#f5b731">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 800, color: '#f5b731' }}>{points}</span>
            <span style={{ fontSize: '13px', color: '#6b7d99' }}>points</span>
          </div>
        </div>

        {/* Empty state */}
        {follows.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            background: '#0d1829', borderRadius: '20px',
            border: '1px solid rgba(74,127,255,0.08)',
          }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a7fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 700, color: '#e8edf5', marginBottom: '8px' }}>No follows yet</h3>
            <p style={{ fontSize: '14px', color: '#6b7d99', marginBottom: '24px' }}>Discover startups and follow them to earn points.</p>
            <Link href="/discover" style={{
              display: 'inline-block', padding: '10px 24px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #4a7fff, #2563eb)',
              color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 0 24px rgba(74,127,255,0.35)',
            }}>
              Go to Discover
            </Link>
          </div>
        )}

        {/* Follow list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {follows.map(({ startup, followedAt }) => {
            const showLogo = startup.logo_url && !imgError[startup.id]
            const initials = startup.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
            const date = new Date(followedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            const isUnfollowing = unfollowing[startup.id]

            return (
              <div
                key={startup.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  background: '#0d1829', borderRadius: '16px',
                  border: '1px solid rgba(74,127,255,0.08)',
                  padding: '20px',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(74,127,255,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(74,127,255,0.08)')}
              >
                {/* Logo */}
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
                  background: showLogo ? 'transparent' : 'linear-gradient(135deg, #1a3a6e, #0d1829)',
                  border: '1px solid rgba(74,127,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {showLogo ? (
                    <img src={startup.logo_url} alt={startup.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => setImgError(p => ({ ...p, [startup.id]: true }))} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 800, color: '#4a7fff' }}>{initials}</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700, color: '#e8edf5' }}>
                      {startup.name}
                    </span>
                    {startup.industry && (
                      <span style={{ padding: '2px 8px', borderRadius: '5px', background: 'rgba(74,127,255,0.1)', border: '1px solid rgba(74,127,255,0.18)', color: '#4a7fff', fontSize: '11px', fontWeight: 600 }}>
                        {startup.industry}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4a5568' }}>
                    Followed {date}
                  </div>
                  {startup.linkedin_url && (
                    <a href={startup.linkedin_url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: '12px', color: '#4a7fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '4px', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#7aa3ff'}
                      onMouseLeave={e => e.currentTarget.style.color = '#4a7fff'}
                    >
                      View on LinkedIn
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    </a>
                  )}
                </div>

                {/* Unfollow button */}
                <button
                  onClick={() => handleUnfollow(startup.id)}
                  disabled={isUnfollowing}
                  style={{
                    padding: '8px 16px', borderRadius: '9px', flexShrink: 0,
                    border: '1px solid rgba(251,113,133,0.2)',
                    background: 'rgba(251,113,133,0.05)',
                    color: '#fb7185', fontSize: '13px', fontWeight: 600,
                    fontFamily: 'var(--font-jakarta)', cursor: isUnfollowing ? 'wait' : 'pointer',
                    opacity: isUnfollowing ? 0.5 : 1,
                    transition: 'background 0.2s, border-color 0.2s, opacity 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!isUnfollowing) { e.currentTarget.style.background = 'rgba(251,113,133,0.12)'; e.currentTarget.style.borderColor = 'rgba(251,113,133,0.4)' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251,113,133,0.05)'; e.currentTarget.style.borderColor = 'rgba(251,113,133,0.2)' }}
                >
                  {isUnfollowing ? 'Removing…' : '− Unfollow'}
                </button>
              </div>
            )
          })}
        </div>

        {follows.length > 0 && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link href="/discover" style={{ fontSize: '14px', color: '#4a7fff', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#7aa3ff'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a7fff'}
            >
              Discover more startups →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
