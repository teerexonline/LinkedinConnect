'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('error')) {
      setError('Authentication failed. Please try again.')
    }
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/dashboard')
    })
  }, [router, searchParams])

  const handleLinkedIn = async () => {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/discover`,
        scopes: 'openid profile email w_member_social',
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070d1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-jakarta)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(10,102,194,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(74,127,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#0d1829',
        border: '1px solid rgba(74,127,255,0.12)',
        borderRadius: '24px',
        padding: '48px 40px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        position: 'relative',
        zIndex: 1,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '40px' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #4a7fff, #2563eb)',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(74,127,255,0.35)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="12" r="2.5" fill="white" opacity="0.6" />
              <circle cx="19" cy="5" r="2.5" fill="white" />
              <circle cx="19" cy="19" r="2.5" fill="white" opacity="0.8" />
              <line x1="7.2" y1="11" x2="16.8" y2="6.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
              <line x1="7.2" y1="13" x2="16.8" y2="17.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '16px', color: '#e8edf5' }}>
            LinkedinConnect
          </span>
        </Link>

        <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '26px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7d99', lineHeight: 1.6, marginBottom: '36px' }}>
          Sign in with LinkedIn to discover and follow startups.
        </p>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)', color: '#fb7185', fontSize: '14px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLinkedIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            background: loading ? 'rgba(10,102,194,0.6)' : '#0a66c2',
            color: 'white',
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: 'var(--font-jakarta)',
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 0 32px rgba(10,102,194,0.3)',
            transition: 'box-shadow 0.2s, transform 0.15s',
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 48px rgba(10,102,194,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(10,102,194,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {loading ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M12 2a10 10 0 0 1 10 10" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          )}
          {loading ? 'Connecting…' : 'Continue with LinkedIn'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#4a5568', marginTop: '24px', lineHeight: 1.6 }}>
          By signing in, you agree to our{' '}
          <span style={{ color: '#6b7d99' }}>Terms of Service</span>{' '}
          and{' '}
          <span style={{ color: '#6b7d99' }}>Privacy Policy</span>.
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
