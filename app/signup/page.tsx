'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          Join LinkedinConnect
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7d99', lineHeight: 1.6, marginBottom: '16px' }}>
          Discover startups, grow your LinkedIn presence, and earn points for every company you support.
        </p>

        {/* Value props */}
        <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="#f5b731"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, text: 'Earn points for every startup you follow' },
            { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4a7fff" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>, text: 'Discover curated startups in your industry' },
            { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>, text: 'Connect your LinkedIn in one click' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{icon}</span>
              <span style={{ fontSize: '13px', color: '#8899b4' }}>{text}</span>
            </div>
          ))}
        </div>

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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
          {loading ? 'Connecting…' : 'Sign up with LinkedIn'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7d99', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#4a7fff', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
