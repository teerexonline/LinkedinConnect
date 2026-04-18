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
  startup: { id: string; name: string; logo_url: string; industry: string; follower_count: number; linkedin_url: string }
}

interface Props {
  portfolio: Startup[]
  follows: Follow[]
  points: number
  userEmail: string
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

export default function Dashboard({ portfolio, follows, points, userEmail }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#070d1a', fontFamily: 'var(--font-jakarta)', color: '#e8edf5', position: 'relative' }}>
      {/* Ambient */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(74,127,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(10,102,194,0.04) 0%, transparent 50%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(rgba(74,127,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none', opacity: 0.4 }} />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '12px' }}>
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #4a7fff, #2563eb)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(74,127,255,0.35)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="5" cy="12" r="2.5" fill="white" opacity="0.6" />
                  <circle cx="19" cy="5" r="2.5" fill="white" />
                  <circle cx="19" cy="19" r="2.5" fill="white" opacity="0.8" />
                  <line x1="7.2" y1="11" x2="16.8" y2="6.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
                  <line x1="7.2" y1="13" x2="16.8" y2="17.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '14px', color: '#6b7d99' }}>LinkedinConnect</span>
            </Link>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '30px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Dashboard
            </h1>
            <p style={{ fontSize: '13px', color: '#6b7d99', marginTop: '4px' }}>{userEmail}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', borderRadius: '100px', background: 'rgba(245,183,49,0.08)', border: '1px solid rgba(245,183,49,0.2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5b731"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span style={{ fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 800, color: '#f5b731' }}>{points}</span>
              <span style={{ fontSize: '12px', color: '#6b7d99' }}>pts</span>
            </div>
            <Link href="/logout" style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(74,127,255,0.2)', color: '#6b7d99', fontSize: '13px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e8edf5'; e.currentTarget.style.borderColor = 'rgba(74,127,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6b7d99'; e.currentTarget.style.borderColor = 'rgba(74,127,255,0.2)' }}
            >Logout</Link>
          </div>
        </div>

        {/* Nav cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '48px' }}>
          {[
            { label: 'My Portfolio', count: portfolio.length, href: '#portfolio', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a7fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>, color: '#4a7fff' },
            { label: 'My Follows', count: follows.length, href: '#follows', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#f5b731"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, color: '#f5b731' },
            { label: 'Discover', count: null, href: '/discover', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>, color: '#34d399' },
          ].map(({ label, count, href, icon, color }) => (
            <Link key={label} href={href} style={{
              display: 'flex', flexDirection: 'column', gap: '8px',
              padding: '20px', borderRadius: '16px',
              background: '#0d1829', border: '1px solid rgba(74,127,255,0.08)',
              textDecoration: 'none', transition: 'border-color 0.2s, transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <span>{icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, color, lineHeight: 1 }}>
                  {count !== null ? count : '→'}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7d99', marginTop: '2px' }}>{label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* My Portfolio */}
        <section id="portfolio" style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>
              My Portfolio
            </h2>
            <Link href="/admin/add-startup" style={{
              padding: '7px 16px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #4a7fff, #2563eb)',
              color: 'white', fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 0 20px rgba(74,127,255,0.3)',
              transition: 'box-shadow 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 32px rgba(74,127,255,0.5)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(74,127,255,0.3)'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Company
            </Link>
          </div>

          {portfolio.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', background: '#0d1829', borderRadius: '16px', border: '1px dashed rgba(74,127,255,0.15)' }}>
              <p style={{ fontSize: '14px', color: '#6b7d99', marginBottom: '16px' }}>No companies added yet.</p>
              <Link href="/admin/add-startup" style={{ color: '#4a7fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                Add your first company →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
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
                        style={{ fontSize: '11px', color: '#4a7fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        LinkedIn ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Follows */}
        <section id="follows" style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>
              My Follows
            </h2>
            <Link href="/follows" style={{ fontSize: '13px', color: '#4a7fff', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#7aa3ff'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a7fff'}
            >
              Manage →
            </Link>
          </div>

          {follows.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', background: '#0d1829', borderRadius: '16px', border: '1px dashed rgba(74,127,255,0.15)' }}>
              <p style={{ fontSize: '14px', color: '#6b7d99', marginBottom: '16px' }}>You haven&apos;t followed any startups yet.</p>
              <Link href="/discover" style={{ color: '#4a7fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                Start discovering →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {follows.slice(0, 6).map(({ startup, followedAt }) => (
                <div key={startup.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: '#0d1829', borderRadius: '12px',
                  border: '1px solid rgba(74,127,255,0.08)',
                  padding: '14px 16px', transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(74,127,255,0.18)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(74,127,255,0.08)')}
                >
                  <CompanyLogo name={startup.name} logoUrl={startup.logo_url} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#e8edf5', fontFamily: 'var(--font-syne)' }}>{startup.name}</div>
                    {startup.industry && <div style={{ fontSize: '11px', color: '#6b7d99' }}>{startup.industry}</div>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '12px', color: '#6b7d99' }}>{(startup.follower_count || 0).toLocaleString()} followers</div>
                    <div style={{ fontSize: '11px', color: '#4a5568', marginTop: '2px' }}>
                      {new Date(followedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
              {follows.length > 6 && (
                <Link href="/follows" style={{ textAlign: 'center', padding: '12px', borderRadius: '10px', background: 'rgba(74,127,255,0.05)', border: '1px solid rgba(74,127,255,0.1)', color: '#4a7fff', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
                  View all {follows.length} follows →
                </Link>
              )}
            </div>
          )}
        </section>

        {/* Discover CTA */}
        <Link href="/discover" style={{
          display: 'block', textDecoration: 'none',
          background: 'linear-gradient(135deg, #0d1829 0%, #0f1e36 100%)',
          borderRadius: '20px', border: '1px solid rgba(74,127,255,0.15)',
          padding: '32px', position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.2s, transform 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <div style={{ position: 'absolute', top: -20, right: -20, width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(74,127,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: '#e8edf5', marginBottom: '6px' }}>
                Discover Startups
              </div>
              <div style={{ fontSize: '14px', color: '#6b7d99' }}>
                Follow companies, earn points, grow the ecosystem
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #4a7fff, #2563eb)', color: 'white', fontSize: '14px', fontWeight: 600, boxShadow: '0 0 24px rgba(74,127,255,0.4)', flexShrink: 0 }}>
              Start →
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
