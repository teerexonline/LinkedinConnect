'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
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
  featured_post_url: string | null
}

interface Props {
  initialStartups: Startup[]
  initialPoints: number
}

export default function DiscoverFeed({ initialStartups, initialPoints }: Props) {
  const [startups] = useState<Startup[]>(initialStartups)
  const [index, setIndex] = useState(0)
  const [points, setPoints] = useState(initialPoints)
  const [direction, setDirection] = useState<'follow' | 'skip' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [followed, setFollowed] = useState(0)
  const [justEarned, setJustEarned] = useState(false)
  const [imgError, setImgError] = useState<Record<string, boolean>>({})
  const [pendingConfirm, setPendingConfirm] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyAttempt, setVerifyAttempt] = useState(0)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  // Save LinkedIn token on mount
  useEffect(() => {
    const saveLinkedInToken = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.provider_token || !session?.user) return

      const linkedinId = session.user.user_metadata?.sub || session.user.user_metadata?.id
      if (!linkedinId) return

      await supabase.from('user_profiles').upsert({
        user_id: session.user.id,
        linkedin_id: String(linkedinId),
        linkedin_access_token: session.provider_token,
        display_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
        updated_at: new Date().toISOString(),
      })
    }
    saveLinkedInToken()
  }, [])

  const advance = useCallback((dir: 'follow' | 'skip') => {
    if (isAnimating) return
    setDirection(dir)
    setIsAnimating(true)
    setTimeout(() => {
      setIndex(i => i + 1)
      setDirection(null)
      setIsAnimating(false)
    }, 380)
  }, [isAnimating])

  const handleFollowClick = useCallback(() => {
    const startup = startups[index]
    if (!startup || isAnimating) return

    setVerifyAttempt(0)
    setVerifyError(null)
    if (startup.linkedin_url) {
      window.open(startup.linkedin_url, '_blank', 'noopener,noreferrer')
    }
    // If there's a featured post, open it in a second tab after a short delay
    if (startup.featured_post_url) {
      setTimeout(() => window.open(startup.featured_post_url!, '_blank', 'noopener,noreferrer'), 600)
    }
    setPendingConfirm(true)
  }, [startups, index, isAnimating])

  const awardFollow = useCallback(async (startupId: string) => {
    setPendingConfirm(false)
    advance('follow')
    const res = await fetch('/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startupId }),
    })
    if (res.ok) {
      setPoints(p => p + 1)
      setFollowed(f => f + 1)
      setJustEarned(true)
      setTimeout(() => setJustEarned(false), 1200)
    }
  }, [advance])

  const handleConfirmFollow = useCallback(async () => {
    const startup = startups[index]
    if (!startup || isAnimating || verifying) return

    setVerifying(true)
    setVerifyError(null)

    const attempt = async (attemptsLeft: number): Promise<void> => {
      setVerifyAttempt(3 - attemptsLeft + 1)
      try {
        const res = await fetch(`/api/follow/verify?startupId=${startup.id}`)
        const json = await res.json()

        if (json.verified) {
          setVerifying(false)
          await awardFollow(startup.id)
          return
        }

        if (attemptsLeft > 1) {
          await new Promise(r => setTimeout(r, 8000))
          return attempt(attemptsLeft - 1)
        }

        // Strict: all retries exhausted, not verified — deny the point
        setVerifying(false)
        setVerifyError("We couldn't detect a new follower. Please follow the page on LinkedIn first, then try again.")
      } catch {
        setVerifying(false)
        setVerifyError('Verification failed. Check your connection and try again.')
      }
    }

    await attempt(3)
  }, [startups, index, isAnimating, verifying, awardFollow])

  const handleSkipConfirm = useCallback(() => {
    setPendingConfirm(false)
    setVerifying(false)
    setVerifyAttempt(0)
    setVerifyError(null)
  }, [])

  const handleFollow = handleFollowClick

  const handleSkip = useCallback(() => {
    if (isAnimating) return
    advance('skip')
  }, [isAnimating, advance])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (pendingConfirm) {
        if (e.key === 'Enter') handleConfirmFollow()
        if (e.key === 'Escape') handleSkipConfirm()
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'f') handleFollow()
      if (e.key === 'ArrowLeft' || e.key === 's') handleSkip()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleFollow, handleSkip, handleConfirmFollow, handleSkipConfirm, pendingConfirm])

  const current = startups[index]
  const next = startups[index + 1]
  const done = index >= startups.length

  const cardTransform = direction === 'follow'
    ? 'translateX(160%) rotate(18deg)'
    : direction === 'skip'
    ? 'translateX(-160%) rotate(-18deg)'
    : 'translateX(0) rotate(0deg)'

  return (
    <div style={{ minHeight: '100vh', background: '#070d1a', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 40px', fontFamily: 'var(--font-jakarta)', position: 'relative' }}>

      {/* Ambient background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(74,127,255,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(rgba(74,127,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none', opacity: 0.5 }} />

      {/* Top bar */}
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
        <Link href="/" style={{ color: '#6b7d99', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e8edf5'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b7d99'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Home
        </Link>

        <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700, color: '#e8edf5', letterSpacing: '-0.01em' }}>
          Discover Startups
        </div>

        {/* Points badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 14px', borderRadius: '100px',
          background: justEarned ? 'rgba(52,211,153,0.15)' : 'rgba(74,127,255,0.1)',
          border: justEarned ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(74,127,255,0.25)',
          transition: 'all 0.3s ease',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={justEarned ? '#34d399' : '#f5b731'} style={{ transition: 'fill 0.3s' }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span style={{ fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 700, color: justEarned ? '#34d399' : '#e8edf5', transition: 'color 0.3s', minWidth: '20px', textAlign: 'center' }}>
            {points}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ width: '100%', maxWidth: '440px', marginBottom: '20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: '#6b7d99' }}>{followed} followed today</span>
          <span style={{ fontSize: '12px', color: '#6b7d99' }}>{Math.min(index, startups.length)}/{startups.length}</span>
        </div>
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
          <div style={{ height: '100%', borderRadius: '2px', background: 'linear-gradient(90deg, #4a7fff, #a78bfa)', width: `${(Math.min(index, startups.length) / Math.max(startups.length, 1)) * 100}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Card stack */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', height: '520px', zIndex: 10 }}>
        {done ? (
          <AllDoneCard followed={followed} points={points} />
        ) : (
          <>
            {/* Background card (next) */}
            {next && (
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '24px',
                background: '#0d1829',
                border: '1px solid rgba(74,127,255,0.08)',
                transform: 'scale(0.94) translateY(12px)',
                opacity: 0.6,
              }} />
            )}

            {/* Active card */}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '24px',
              background: 'linear-gradient(160deg, #0f1e36 0%, #0d1829 100%)',
              border: '1px solid rgba(74,127,255,0.14)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,127,255,0.05)',
              transform: cardTransform,
              opacity: direction ? 0 : 1,
              transition: 'transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.38s ease',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Glow accent */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(74,127,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

              {/* Card content */}
              <CardContent
                startup={current}
                imgError={imgError}
                onImgError={(id) => setImgError(prev => ({ ...prev, [id]: true }))}
                hintFollow={direction === 'follow'}
                hintSkip={direction === 'skip'}
              />
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      {!done && !pendingConfirm && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '28px', position: 'relative', zIndex: 10 }}>
          <button
            onClick={handleSkip}
            disabled={isAnimating}
            style={{
              width: '120px', height: '52px', borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: '#6b7d99', fontSize: '15px', fontWeight: 600,
              fontFamily: 'var(--font-jakarta)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'border-color 0.2s, color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#e8edf5' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#6b7d99' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Skip
          </button>

          <button
            onClick={handleFollow}
            disabled={isAnimating}
            style={{
              width: '200px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #0a66c2, #004182)',
              border: 'none', color: 'white', fontSize: '15px', fontWeight: 600,
              fontFamily: 'var(--font-jakarta)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 0 32px rgba(10,102,194,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 48px rgba(10,102,194,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(10,102,194,0.35)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
            </svg>
            Follow on LinkedIn
          </button>
        </div>
      )}

      {/* Step 2: Confirm follow */}
      {!done && pendingConfirm && (
        <div style={{ marginTop: '28px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          {verifying ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '12px', background: 'rgba(74,127,255,0.08)', border: '1px solid rgba(74,127,255,0.2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a7fff" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                <span style={{ fontSize: '14px', color: '#e8edf5', fontWeight: 500 }}>
                  Checking follower count… (attempt {verifyAttempt}/3)
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#4a5568' }}>LinkedIn updates can take a few seconds</p>
            </div>
          ) : (
            <>
              {verifyError && (
                <div style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)', color: '#fb7185', fontSize: '13px', textAlign: 'center', maxWidth: '340px', lineHeight: 1.5 }}>
                  {verifyError}
                </div>
              )}

              {startups[index]?.featured_post_url && !verifyError && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(74,127,255,0.06)', border: '1px solid rgba(74,127,255,0.15)', maxWidth: '340px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4a7fff" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span style={{ fontSize: '13px', color: '#8899b4', lineHeight: 1.5 }}>
                    Follow the company on LinkedIn, then confirm below — we&apos;ll like their featured post on your behalf to verify.
                  </span>
                </div>
              )}

              <p style={{ fontSize: '13px', color: '#6b7d99', textAlign: 'center' }}>
                {verifyError
                  ? 'Make sure you signed in with LinkedIn, then retry:'
                  : startups[index]?.featured_post_url
                    ? 'Followed the company? Confirm to earn your point:'
                    : 'Did you follow them on LinkedIn?'}
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleSkipConfirm}
                  style={{
                    height: '48px', padding: '0 20px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#6b7d99', fontSize: '14px', fontWeight: 600,
                    fontFamily: 'var(--font-jakarta)', cursor: 'pointer',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#e8edf5' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#6b7d99' }}
                >
                  Not yet
                </button>
                <button
                  onClick={handleConfirmFollow}
                  style={{
                    height: '48px', padding: '0 28px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #34d399, #059669)',
                    border: 'none', color: 'white', fontSize: '14px', fontWeight: 700,
                    fontFamily: 'var(--font-jakarta)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 0 28px rgba(52,211,153,0.35)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(52,211,153,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(52,211,153,0.35)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {startups[index]?.featured_post_url ? 'I followed them — Verify +1pt' : 'Yes, I followed it +1pt'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Keyboard hint */}
      {!done && !pendingConfirm && (
        <p style={{ marginTop: '16px', fontSize: '12px', color: '#4a5568', position: 'relative', zIndex: 10 }}>
          ← skip &nbsp;·&nbsp; follow →
        </p>
      )}
      {!done && pendingConfirm && (
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#4a5568', position: 'relative', zIndex: 10 }}>
          Enter to confirm &nbsp;·&nbsp; Esc to cancel
        </p>
      )}
    </div>
  )
}


function CardContent({ startup, imgError, onImgError, hintFollow, hintSkip }: {
  startup: Startup
  imgError: Record<string, boolean>
  onImgError: (id: string) => void
  hintFollow: boolean
  hintSkip: boolean
}) {
  const showLogo = startup.logo_url && !imgError[startup.id]
  const initials = startup.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 28px 28px' }}>
      {/* Follow/Skip hint overlay */}
      {(hintFollow || hintSkip) && (
        <div style={{
          position: 'absolute', top: 20, left: hintSkip ? 20 : undefined, right: hintFollow ? 20 : undefined,
          padding: '6px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '14px',
          background: hintFollow ? 'rgba(52,211,153,0.2)' : 'rgba(251,113,133,0.2)',
          border: `2px solid ${hintFollow ? '#34d399' : '#fb7185'}`,
          color: hintFollow ? '#34d399' : '#fb7185',
          transform: hintFollow ? 'rotate(8deg)' : 'rotate(-8deg)',
          zIndex: 20,
        }}>
          {hintFollow ? 'FOLLOW' : 'SKIP'}
        </div>
      )}

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '16px', flexShrink: 0,
          background: showLogo ? 'transparent' : 'linear-gradient(135deg, #1a3a6e, #0d1829)',
          border: '1px solid rgba(74,127,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}>
          {showLogo ? (
            <img
              src={startup.logo_url}
              alt={startup.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => onImgError(startup.id)}
            />
          ) : (
            <span style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: '#4a7fff' }}>
              {initials}
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em', marginBottom: '4px', lineHeight: 1.2 }}>
            {startup.name}
          </h2>
          {startup.headquarters && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7d99', fontSize: '13px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {startup.headquarters}
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {startup.industry && (
          <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(74,127,255,0.1)', border: '1px solid rgba(74,127,255,0.2)', color: '#4a7fff', fontSize: '12px', fontWeight: 600 }}>
            {startup.industry}
          </span>
        )}
        {startup.company_size && (
          <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', color: '#a78bfa', fontSize: '12px', fontWeight: 600 }}>
            {startup.company_size}
          </span>
        )}
      </div>

      {/* Description */}
      <p style={{ fontFamily: 'var(--font-jakarta)', fontSize: '14px', lineHeight: 1.75, color: '#8899b4', marginBottom: '20px', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
        {startup.description || 'No description available.'}
      </p>

      {/* Stats row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7d99', fontSize: '13px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#0a66c2">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
            <circle cx="4" cy="4" r="2" fill="#0a66c2" />
          </svg>
          <span style={{ color: '#e8edf5', fontWeight: 600 }}>{(startup.follower_count || 0).toLocaleString()}</span> followers
        </div>

        {startup.linkedin_url && (
          <a
            href={startup.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '12px', color: '#4a7fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}
            onClick={e => e.stopPropagation()}
            onMouseEnter={e => e.currentTarget.style.color = '#6fa0ff'}
            onMouseLeave={e => e.currentTarget.style.color = '#4a7fff'}
          >
            View on LinkedIn
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

function AllDoneCard({ followed, points }: { followed: number; points: number }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: '24px',
      background: 'linear-gradient(160deg, #0f1e36 0%, #0d1829 100%)',
      border: '1px solid rgba(74,127,255,0.14)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
      <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '24px', fontWeight: 800, color: '#e8edf5', marginBottom: '8px', textAlign: 'center' }}>
        You&apos;re all caught up!
      </h3>
      <p style={{ fontSize: '14px', color: '#6b7d99', textAlign: 'center', lineHeight: 1.7, marginBottom: '24px' }}>
        You followed {followed} startup{followed !== 1 ? 's' : ''} and earned {followed} point{followed !== 1 ? 's' : ''} today.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'rgba(74,127,255,0.1)', border: '1px solid rgba(74,127,255,0.2)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#f5b731">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, color: '#e8edf5' }}>
          {points} total points
        </span>
      </div>
      <Link href="/" style={{ marginTop: '20px', fontSize: '14px', color: '#4a7fff', textDecoration: 'none' }}>
        ← Back to home
      </Link>
    </div>
  )
}
