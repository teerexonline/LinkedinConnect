'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  const cardStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#070d1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: 'var(--font-jakarta)',
  }

  return (
    <div style={cardStyle}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0d1829',
        border: '1px solid rgba(74, 127, 255, 0.12)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #4a7fff, #2563eb)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="12" r="2.5" fill="white" opacity="0.6" />
              <circle cx="19" cy="5" r="2.5" fill="white" />
              <circle cx="19" cy="19" r="2.5" fill="white" opacity="0.8" />
              <line x1="7.2" y1="11" x2="16.8" y2="6.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
              <line x1="7.2" y1="13" x2="16.8" y2="17.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '16px', color: '#e8edf5' }}>LinkedinConnect</span>
        </Link>

        <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '26px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Reset your password
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7d99', lineHeight: 1.6, marginBottom: '32px' }}>
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {sent ? (
          <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.2)', color: '#34d399', fontSize: '14px', lineHeight: 1.6, textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>✉️</div>
            <strong>Email sent!</strong>
            <p style={{ marginTop: '8px', marginBottom: 0 }}>Check your inbox for the password reset link.</p>
          </div>
        ) : (
          <form onSubmit={handleReset}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a0b0c8', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(74, 127, 255, 0.15)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#e8edf5',
                  fontSize: '14px',
                  fontFamily: 'var(--font-jakarta)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74,127,255,0.08)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.15)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)', color: '#fb7185', fontSize: '14px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4a7fff, #2563eb)',
                color: 'white',
                fontFamily: 'var(--font-jakarta)',
                fontSize: '15px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(74, 127, 255, 0.35)',
                marginTop: '8px',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7d99', marginTop: '24px' }}>
          <Link href="/login" style={{ color: '#4a7fff', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
