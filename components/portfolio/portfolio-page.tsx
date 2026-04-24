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
  featured_post_url: string | null
}

function CompanyLogo({ name, logoUrl, size = 48 }: { name: string; logoUrl: string; size?: number }) {
  const [err, setErr] = useState(false)
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const show = logoUrl && !err
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.25,
      background: show ? 'transparent' : 'linear-gradient(135deg, #1a3a6e, #0d1829)',
      border: '1px solid rgba(74,127,255,0.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', flexShrink: 0,
    }}>
      {show
        ? <img src={logoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setErr(true)} />
        : <span style={{ fontFamily: 'var(--font-syne)', fontSize: size * 0.33, fontWeight: 800, color: '#4a7fff' }}>{initials}</span>
      }
    </div>
  )
}

function AddPostModal({ portfolio, onClose, onSaved }: {
  portfolio: Startup[]
  onClose: () => void
  onSaved: (startupId: string, postUrl: string) => void
}) {
  const [selectedId, setSelectedId] = useState(portfolio[0]?.id ?? '')
  const [postUrl, setPostUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1px solid rgba(74,127,255,0.18)', background: 'rgba(255,255,255,0.03)',
    color: '#e8edf5', fontSize: '14px', fontFamily: 'var(--font-jakarta)',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }

  const handleSave = async () => {
    if (!selectedId || !postUrl.trim()) return
    setSaving(true)
    setError(null)
    const res = await fetch('/api/startups/update-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startupId: selectedId, featuredPostUrl: postUrl.trim() }),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Failed to save post')
      setSaving(false)
    } else {
      onSaved(selectedId, postUrl.trim())
      onClose()
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,13,26,0.85)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ width: '100%', maxWidth: '480px', background: '#0d1829', borderRadius: '20px', border: '1px solid rgba(74,127,255,0.15)', padding: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>Add Featured Post</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7d99', cursor: 'pointer', padding: '4px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7d99', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Select Company
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {portfolio.map(s => (
              <button key={s.id} onClick={() => setSelectedId(s.id)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px',
                  border: selectedId === s.id ? '1px solid #4a7fff' : '1px solid rgba(74,127,255,0.1)',
                  background: selectedId === s.id ? 'rgba(74,127,255,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px',
                  transition: 'all 0.15s',
                }}>
                <CompanyLogo name={s.name} logoUrl={s.logo_url} size={32} />
                <div>
                  <div style={{ fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700, color: selectedId === s.id ? '#e8edf5' : '#8899b4' }}>{s.name}</div>
                  {s.featured_post_url && <div style={{ fontSize: '11px', color: '#34d399', marginTop: '1px' }}>Post already set</div>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7d99', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            LinkedIn Post URL
          </label>
          <input
            type="url"
            value={postUrl}
            onChange={e => setPostUrl(e.target.value)}
            placeholder="https://www.linkedin.com/posts/your-company_..."
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.5)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.18)' }}
          />
          <p style={{ fontSize: '12px', color: '#6b7d99', marginTop: '8px', lineHeight: 1.6 }}>
            Go to your company&apos;s LinkedIn page → open any post → copy the URL from your browser.
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)', color: '#fb7185', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !postUrl.trim() || !selectedId}
          style={{
            width: '100%', padding: '13px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #4a7fff, #2563eb)',
            color: 'white', fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 700,
            border: 'none', cursor: saving || !postUrl.trim() ? 'not-allowed' : 'pointer',
            opacity: saving || !postUrl.trim() ? 0.6 : 1,
            boxShadow: '0 0 28px rgba(74,127,255,0.35)',
            transition: 'opacity 0.2s', letterSpacing: '-0.01em',
          }}
        >
          {saving ? 'Saving…' : 'Save Featured Post'}
        </button>
      </div>
    </div>
  )
}

export default function PortfolioPage({ portfolio: initialPortfolio, points }: { portfolio: Startup[]; points: number }) {
  const [portfolio, setPortfolio] = useState<Startup[]>(initialPortfolio)
  const [showAddPost, setShowAddPost] = useState(false)

  const handlePostSaved = (startupId: string, postUrl: string) => {
    setPortfolio(prev => prev.map(s => s.id === startupId ? { ...s, featured_post_url: postUrl } : s))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#070d1a', fontFamily: 'var(--font-jakarta)', color: '#e8edf5' }}>
      <div className="lc-dash-wrap">

        <div className="lc-dash-topbar" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '30px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              My Portfolio
            </h1>
            <p style={{ fontSize: '13px', color: '#6b7d99', marginTop: '4px' }}>
              {portfolio.length} {portfolio.length === 1 ? 'company' : 'companies'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', borderRadius: '100px', background: 'rgba(245,183,49,0.08)', border: '1px solid rgba(245,183,49,0.2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5b731"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span style={{ fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 800, color: '#f5b731' }}>{points}</span>
              <span style={{ fontSize: '12px', color: '#6b7d99' }}>pts</span>
            </div>
            {portfolio.length > 0 && (
              <button onClick={() => setShowAddPost(true)} style={{
                padding: '8px 18px', borderRadius: '8px',
                background: 'rgba(245,183,49,0.1)', border: '1px solid rgba(245,183,49,0.3)',
                color: '#f5b731', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-jakarta)',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,183,49,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,183,49,0.1)'}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                Add Post
              </button>
            )}
            <Link href="/admin/add-startup" style={{
              padding: '8px 18px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #4a7fff, #2563eb)',
              color: 'white', fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 0 20px rgba(74,127,255,0.3)',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Company
            </Link>
          </div>
        </div>

        {portfolio.length === 0 ? (
          <div style={{ padding: '80px 48px', textAlign: 'center', background: '#0d1829', borderRadius: '20px', border: '1px dashed rgba(74,127,255,0.15)' }}>
            <p style={{ fontSize: '15px', color: '#6b7d99', marginBottom: '20px' }}>No companies added yet.</p>
            <Link href="/admin/add-startup" style={{
              display: 'inline-block', padding: '10px 24px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #4a7fff, #2563eb)',
              color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            }}>
              Add your first company →
            </Link>
          </div>
        ) : (
          <div className="lc-portfolio-grid">
            {portfolio.map(s => (
              <div key={s.id} style={{
                background: '#0d1829', borderRadius: '16px',
                border: '1px solid rgba(74,127,255,0.08)',
                padding: '20px', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(74,127,255,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(74,127,255,0.08)')}
              >
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <CompanyLogo name={s.name} logoUrl={s.logo_url} size={44} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 700, color: '#e8edf5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                    {s.industry && <div style={{ fontSize: '11px', color: '#6b7d99', marginTop: '2px' }}>{s.industry}</div>}
                  </div>
                </div>
                {s.description && (
                  <p style={{ fontSize: '12px', color: '#8899b4', lineHeight: 1.6, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {s.description}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7d99' }}>
                    <span style={{ color: '#e8edf5', fontWeight: 600 }}>{(s.follower_count || 0).toLocaleString()}</span> followers
                  </span>
                  {s.linkedin_url && (
                    <a href={s.linkedin_url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: '11px', color: '#4a7fff', textDecoration: 'none' }}
                    >
                      LinkedIn ↗
                    </a>
                  )}
                </div>
                {/* Featured post indicator */}
                <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(74,127,255,0.06)' }}>
                  {s.featured_post_url ? (
                    <a href={s.featured_post_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#34d399', textDecoration: 'none' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Featured post set
                    </a>
                  ) : (
                    <button onClick={() => setShowAddPost(true)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '12px', color: '#6b7d99', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-jakarta)', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f5b731'}
                      onMouseLeave={e => e.currentTarget.style.color = '#6b7d99'}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                      Add featured post
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddPost && (
        <AddPostModal
          portfolio={portfolio}
          onClose={() => setShowAddPost(false)}
          onSaved={handlePostSaved}
        />
      )}
    </div>
  )
}
