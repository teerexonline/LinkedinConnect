'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const STAGES = [
  { id: 'idea', label: 'Just an Idea' },
  { id: 'pre-seed', label: 'Pre-Seed' },
  { id: 'seed', label: 'Seed' },
  { id: 'series-a', label: 'Series A+' },
  { id: 'bootstrapped', label: 'Bootstrapped' },
]

const GOALS = [
  { id: 'followers', label: 'Grow LinkedIn followers' },
  { id: 'investors', label: 'Attract investors' },
  { id: 'partners', label: 'Find partners & co-founders' },
  { id: 'brand', label: 'Build brand awareness' },
  { id: 'customers', label: 'Get more customers' },
]

interface CompanyPreview {
  name: string
  description: string
  logo_url: string
  industry: string
  follower_count: number
  linkedin_url: string
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: '12px',
  border: '1px solid rgba(74,127,255,0.2)', background: 'rgba(255,255,255,0.03)',
  color: '#e8edf5', fontSize: '15px', fontFamily: 'var(--font-jakarta)',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
}

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [url, setUrl] = useState('')
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [company, setCompany] = useState<CompanyPreview | null>(null)
  const [stage, setStage] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const toggleGoal = (id: string) =>
    setGoals(g => g.includes(id) ? g.filter(x => x !== id) : [...g, id])

  const fetchCompany = async () => {
    if (!url.trim()) return
    setFetching(true)
    setFetchError(null)
    const res = await fetch(`/api/linkedin/company?url=${encodeURIComponent(url)}`)
    const json = await res.json()
    if (!res.ok) {
      setFetchError(json.error ?? 'Could not fetch company. Check the URL and try again.')
    } else {
      setCompany(json)
    }
    setFetching(false)
  }

  const handleSignUp = async () => {
    setAuthLoading(true)
    setAuthError(null)
    if (company) sessionStorage.setItem('lc_pending_company', JSON.stringify(company))
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin/add-startup`,
        scopes: 'openid profile email w_member_social',
      },
    })
    if (error) {
      setAuthError(error.message)
      setAuthLoading(false)
      return
    }
    if (data?.url) {
      window.location.href = data.url
    }
  }

  const TOTAL = 3
  const progress = (step / TOTAL) * 100

  return (
    <div style={{
      minHeight: '100vh', background: '#070d1a',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '80px 20px 40px',
      fontFamily: 'var(--font-jakarta)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse, rgba(74,127,255,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(74,127,255,0.1)', zIndex: 20 }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #4a7fff, #a78bfa)', width: `${progress}%`, transition: 'width 0.4s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
      </div>

      {/* Logo */}
      <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10 }}>
        <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #4a7fff, #2563eb)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(74,127,255,0.4)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="2.5" fill="white" opacity="0.6" />
            <circle cx="19" cy="5" r="2.5" fill="white" />
            <circle cx="19" cy="19" r="2.5" fill="white" opacity="0.8" />
            <line x1="7.2" y1="11" x2="16.8" y2="6.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <line x1="7.2" y1="13" x2="16.8" y2="17.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '16px', color: '#e8edf5', letterSpacing: '-0.02em' }}>LinkedinConnect</span>
      </div>

      <div style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 5 }}>

        {/* Step counter */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7d99', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Step {step + 1} of {TOTAL}
          </span>
        </div>

        {/* ── Step 0: Fetch Company ── */}
        {step === 0 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(24px,5vw,36px)', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '8px', lineHeight: 1.15 }}>
              Find your company<br />on LinkedIn
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7d99', textAlign: 'center', marginBottom: '28px', lineHeight: 1.6 }}>
              Paste your LinkedIn company page URL to get started.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                type="url"
                value={url}
                onChange={e => { setUrl(e.target.value); setFetchError(null); setCompany(null) }}
                placeholder="https://www.linkedin.com/company/yourcompany"
                style={{ ...inputStyle, flex: 1 }}
                onKeyDown={e => e.key === 'Enter' && fetchCompany()}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.5)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.2)' }}
              />
              <button onClick={fetchCompany} disabled={fetching || !url.trim()}
                style={{
                  padding: '12px 20px', borderRadius: '12px', whiteSpace: 'nowrap',
                  background: fetching || !url.trim() ? 'rgba(74,127,255,0.2)' : 'linear-gradient(135deg, #4a7fff, #2563eb)',
                  color: 'white', fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 600,
                  border: 'none', cursor: fetching || !url.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                }}>
                {fetching ? 'Fetching…' : 'Fetch'}
              </button>
            </div>

            {fetchError && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)', color: '#fb7185', fontSize: '13px', marginBottom: '16px' }}>
                {fetchError}
              </div>
            )}

            {/* Company preview */}
            {company && (
              <div style={{ padding: '18px', borderRadius: '14px', background: '#0d1829', border: '1px solid rgba(52,211,153,0.25)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name} style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(74,127,255,0.15)', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, #1a3a6e, #0d1829)', border: '1px solid rgba(74,127,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 800, color: '#4a7fff' }}>{company.name?.[0]}</span>
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 800, color: '#e8edf5', marginBottom: '3px' }}>{company.name}</div>
                    {company.industry && <div style={{ fontSize: '12px', color: '#4a7fff', fontWeight: 600, marginBottom: '4px' }}>{company.industry}</div>}
                    {company.follower_count > 0 && <div style={{ fontSize: '12px', color: '#6b7d99' }}>{company.follower_count.toLocaleString()} followers</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#34d399', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Found
                  </div>
                </div>
                {company.description && (
                  <p style={{ fontSize: '13px', color: '#8899b4', lineHeight: 1.6, marginTop: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {company.description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Stage + Goal ── */}
        {step === 1 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(24px,5vw,36px)', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '8px', lineHeight: 1.15 }}>
              Tell us about<br />your startup
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7d99', textAlign: 'center', marginBottom: '28px', lineHeight: 1.6 }}>
              Two quick questions to personalise your experience.
            </p>

            {/* Stage */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7d99', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>Company Stage</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '8px' }}>
                {STAGES.map(s => (
                  <button key={s.id} onClick={() => setStage(s.id)}
                    style={{
                      padding: '12px 6px', borderRadius: '12px', textAlign: 'center',
                      border: stage === s.id ? '1px solid #4a7fff' : '1px solid rgba(74,127,255,0.12)',
                      background: stage === s.id ? 'rgba(74,127,255,0.12)' : 'rgba(13,24,41,0.8)',
                      cursor: 'pointer', transition: 'all 0.15s',
                      fontFamily: 'var(--font-syne)', fontSize: '12px', fontWeight: 700,
                      color: stage === s.id ? '#e8edf5' : '#6b7d99',
                      boxShadow: stage === s.id ? '0 0 16px rgba(74,127,255,0.15)' : 'none',
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7d99', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>Main Goals <span style={{ color: '#4a5568', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(pick any)</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {GOALS.map(g => {
                  const sel = goals.includes(g.id)
                  return (
                    <button key={g.id} onClick={() => toggleGoal(g.id)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '12px',
                        border: sel ? '1px solid #4a7fff' : '1px solid rgba(74,127,255,0.1)',
                        background: sel ? 'rgba(74,127,255,0.1)' : 'rgba(13,24,41,0.8)',
                        cursor: 'pointer', textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: '12px',
                        transition: 'all 0.15s',
                      }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '5px', border: sel ? '2px solid #4a7fff' : '2px solid rgba(74,127,255,0.2)', background: sel ? '#4a7fff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                        {sel && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <span style={{ fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 500, color: sel ? '#e8edf5' : '#8899b4' }}>{g.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Sign Up ── */}
        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            {/* Company summary */}
            {company && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderRadius: '14px', background: '#0d1829', border: '1px solid rgba(74,127,255,0.12)', marginBottom: '32px', textAlign: 'left' }}>
                {company.logo_url
                  ? <img src={company.logo_url} alt={company.name} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(74,127,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 800, color: '#4a7fff' }}>{company.name?.[0]}</span>
                    </div>
                }
                <div>
                  <div style={{ fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 700, color: '#e8edf5' }}>{company.name}</div>
                  {company.industry && <div style={{ fontSize: '12px', color: '#6b7d99' }}>{company.industry}</div>}
                </div>
              </div>
            )}

            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(24px,5vw,36px)', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.03em', marginBottom: '10px', lineHeight: 1.15 }}>
              You&apos;re all set.<br />Create your account.
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7d99', lineHeight: 1.7, marginBottom: '32px' }}>
              Sign in with LinkedIn to add <strong style={{ color: '#e8edf5' }}>{company?.name ?? 'your company'}</strong> and start growing your page.
            </p>

            {authError && (
              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)', color: '#fb7185', fontSize: '13px', marginBottom: '16px', textAlign: 'left' }}>
                {authError}
              </div>
            )}

            <button onClick={handleSignUp} disabled={authLoading}
              style={{
                width: '100%', padding: '16px', borderRadius: '14px',
                background: authLoading ? 'rgba(10,102,194,0.6)' : '#0a66c2',
                color: 'white', fontSize: '16px', fontWeight: 700,
                fontFamily: 'var(--font-syne)', border: 'none',
                cursor: authLoading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 0 36px rgba(10,102,194,0.35)',
                transition: 'box-shadow 0.2s, transform 0.15s', letterSpacing: '-0.01em',
              }}
              onMouseEnter={e => { if (!authLoading) { e.currentTarget.style.boxShadow = '0 0 52px rgba(10,102,194,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 36px rgba(10,102,194,0.35)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {authLoading ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
                </svg>
              )}
              {authLoading ? 'Connecting…' : 'Continue with LinkedIn'}
            </button>

            <p style={{ fontSize: '12px', color: '#4a5568', marginTop: '16px', lineHeight: 1.6 }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: '#4a7fff', textDecoration: 'none' }}>Sign in</a>
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '28px' }}>
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)}
              style={{ padding: '11px 20px', borderRadius: '10px', border: '1px solid rgba(74,127,255,0.15)', background: 'transparent', color: '#6b7d99', fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#e8edf5'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7d99'}
            >
              ← Back
            </button>
          ) : (
            <a href="/login" style={{ fontSize: '13px', color: '#6b7d99', textDecoration: 'none' }}>
              Have an account? <span style={{ color: '#4a7fff' }}>Sign in</span>
            </a>
          )}

          {step < TOTAL - 1 && (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && !company}
              style={{
                padding: '11px 28px', borderRadius: '10px',
                background: (step === 0 && !company) ? 'rgba(74,127,255,0.15)' : 'linear-gradient(135deg, #4a7fff, #2563eb)',
                color: (step === 0 && !company) ? '#6b7d99' : 'white',
                fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700,
                border: 'none', cursor: (step === 0 && !company) ? 'not-allowed' : 'pointer',
                boxShadow: (step === 0 && !company) ? 'none' : '0 0 20px rgba(74,127,255,0.3)',
                transition: 'all 0.15s', letterSpacing: '-0.01em',
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
