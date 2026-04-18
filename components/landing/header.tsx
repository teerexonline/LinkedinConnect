'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [points, setPoints] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const isConfigured = supabaseUrl.startsWith('http')
    let unsubscribe: (() => void) | undefined

    if (isConfigured) {
      const supabase = createClient()
      const loadUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          const { data } = await supabase.from('user_points').select('total_points').eq('user_id', user.id).maybeSingle()
          setPoints(data?.total_points ?? 0)
        }
      }
      loadUser()
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (!session?.user) setPoints(null)
      })
      unsubscribe = () => subscription.unsubscribe()
    }

    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => { unsubscribe?.(); window.removeEventListener('scroll', onScroll) }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(7, 13, 26, 0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(74, 127, 255, 0.1)' : '1px solid transparent',
      }}>
        <div className="lc-header-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '72px', gap: '48px' }}>

            {/* Logo */}
            <Link href={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #4a7fff, #2563eb)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(74, 127, 255, 0.4)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="5" cy="12" r="2.5" fill="white" opacity="0.6" />
                  <circle cx="19" cy="5" r="2.5" fill="white" />
                  <circle cx="19" cy="19" r="2.5" fill="white" opacity="0.8" />
                  <line x1="7.2" y1="11" x2="16.8" y2="6.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
                  <line x1="7.2" y1="13" x2="16.8" y2="17.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '17px', color: '#e8edf5', letterSpacing: '-0.02em' }}>
                LinkedinConnect
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="lc-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1 }}>
              {!user && ['Features', 'Pricing', 'About'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`}
                  style={{ fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 500, color: '#6b7d99', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#e8edf5')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6b7d99')}
                >{item}</a>
              ))}
              {user && (
                <>
                  <Link href="/follows" style={{ fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 500, color: '#6b7d99', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#e8edf5')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7d99')}
                  >My Follows</Link>
                  <Link href="/admin/add-startup" style={{ fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 500, color: '#6b7d99', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#e8edf5')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7d99')}
                  >Add Company</Link>
                  <Link href="/discover" style={{ fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 500, color: '#4a7fff', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#7aa3ff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#4a7fff')}
                  >Discover</Link>
                </>
              )}
            </nav>

            {/* Auth controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
              {user ? (
                <>
                  {points !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(245,183,49,0.1)', border: '1px solid rgba(245,183,49,0.25)' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#f5b731"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <span style={{ fontFamily: 'var(--font-jakarta)', fontSize: '13px', fontWeight: 700, color: '#f5b731' }}>{points}</span>
                    </div>
                  )}
                  <Link href="/logout" className="lc-nav-auth-text"
                    style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid rgba(74,127,255,0.25)', color: '#e8edf5', fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,127,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(74,127,255,0.45)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(74,127,255,0.25)' }}
                  >Logout</Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="lc-nav-auth-text"
                    style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid rgba(74,127,255,0.2)', color: '#e8edf5', fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,127,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(74,127,255,0.4)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(74,127,255,0.2)' }}
                  >Login</Link>
                  <Link href="/signup"
                    style={{ padding: '8px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #4a7fff, #2563eb)', color: 'white', fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 0 20px rgba(74,127,255,0.3)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(74,127,255,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(74,127,255,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >Get Started</Link>
                </>
              )}

              {/* Hamburger */}
              <button className="lc-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
                {menuOpen ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="lc-mobile-nav">
          {!user && (
            <>
              <a href="#features" onClick={closeMenu}>Features</a>
              <a href="#pricing" onClick={closeMenu}>Pricing</a>
              <a href="#about" onClick={closeMenu}>About</a>
              <div className="lc-mobile-divider" />
              <Link href="/login" onClick={closeMenu}>Login</Link>
              <Link href="/signup" onClick={closeMenu} style={{ background: 'linear-gradient(135deg, #4a7fff, #2563eb)', color: 'white', fontWeight: 600 }}>Get Started</Link>
            </>
          )}
          {user && (
            <>
              <Link href="/dashboard" onClick={closeMenu}>My Portfolio</Link>
              <Link href="/follows" onClick={closeMenu}>My Follows</Link>
              <Link href="/admin/add-startup" onClick={closeMenu}>Add Company</Link>
              <Link href="/discover" onClick={closeMenu} style={{ color: '#4a7fff' }}>Discover</Link>
              <div className="lc-mobile-divider" />
              <Link href="/logout" onClick={closeMenu} style={{ color: '#6b7d99' }}>Logout</Link>
            </>
          )}
        </nav>
      )}
    </>
  )
}
