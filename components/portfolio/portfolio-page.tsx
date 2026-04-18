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

export default function PortfolioPage({ portfolio, points }: { portfolio: Startup[]; points: number }) {
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', borderRadius: '100px', background: 'rgba(245,183,49,0.08)', border: '1px solid rgba(245,183,49,0.2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5b731"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span style={{ fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 800, color: '#f5b731' }}>{points}</span>
              <span style={{ fontSize: '12px', color: '#6b7d99' }}>pts</span>
            </div>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
