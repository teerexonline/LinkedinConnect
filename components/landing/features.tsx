'use client'

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: 'Startup Discovery',
    description: 'Find relevant startups in your industry filtered by stage, sector, location, and team size. Never miss a potential partner or collaborator.',
    color: '#4a7fff',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Founder Network',
    description: 'Connect directly with other founders building in your space. Turn cold introductions into warm relationships that move your startup forward.',
    color: '#a78bfa',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" /><polyline points="1 20 23 20" />
      </svg>
    ),
    title: 'Page Growth Analytics',
    description: 'Track follower growth, post reach, and engagement on your company page. Know exactly what content drives your startup\'s LinkedIn presence.',
    color: '#34d399',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Company Page Tools',
    description: 'Schedule posts, manage your company page content, and keep your startup\'s LinkedIn presence active — even when you\'re heads-down building.',
    color: '#f5b731',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: 'Partnership Pipeline',
    description: 'Build a curated pipeline of potential startup partners, investors, and co-founders. Track conversations and never let a warm lead go cold.',
    color: '#fb7185',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    title: 'Ecosystem Insights',
    description: 'Stay on top of what\'s happening in your startup ecosystem. Discover trending topics, fast-growing startups, and opportunities in your sector.',
    color: '#60a5fa',
  },
]

export default function Features() {
  return (
    <section id="features" style={{ padding: '120px 32px', position: 'relative' }}>
      {/* Divider line */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,127,255,0.2), transparent)', marginBottom: '80px' }} />

        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '100px', border: '1px solid rgba(74,127,255,0.3)', background: 'rgba(74,127,255,0.06)', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-jakarta)', fontWeight: 700, color: '#4a7fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Features</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#e8edf5', marginBottom: '16px', lineHeight: 1.1 }}>
            Built for founders who<br />want to be found
          </h2>
          <p style={{ fontFamily: 'var(--font-jakarta)', fontSize: '17px', color: '#6b7d99', lineHeight: 1.75, maxWidth: '500px', margin: '0 auto' }}>
            Everything your startup needs to build a strong LinkedIn presence and connect with the right people in your ecosystem.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {features.map(f => (
            <div
              key={f.title}
              style={{ padding: '32px', borderRadius: '16px', background: '#0d1829', border: '1px solid rgba(74,127,255,0.07)', transition: 'all 0.3s ease', cursor: 'default' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.border = `1px solid ${f.color}28`
                e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.3), 0 0 0 1px ${f.color}10`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.border = '1px solid rgba(74,127,255,0.07)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${f.color}15`, border: `1px solid ${f.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: '20px' }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '17px', fontWeight: 700, color: '#e8edf5', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-jakarta)', fontSize: '14px', lineHeight: 1.75, color: '#6b7d99' }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
