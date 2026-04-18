'use client'

const columns = [
  { title: 'Product',   links: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'API Docs'] },
  { title: 'Company',   links: ['About', 'Blog', 'Careers', 'Press', 'Partners'] },
  { title: 'Resources', links: ['Documentation', 'Support', 'Community', 'Webinars', 'Templates'] },
  { title: 'Legal',     links: ['Privacy', 'Terms', 'Cookie Policy', 'GDPR', 'Security'] },
]

const socials = [
  {
    label: 'X (Twitter)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.265 5.632 5.9-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(74,127,255,0.07)', background: '#050b14' }}>
      <div className="lc-footer-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="lc-footer-grid">
          {/* Brand */}
          <div className="lc-footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #4a7fff, #2563eb)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="5" cy="12" r="2.5" fill="white" opacity="0.6" />
                  <circle cx="19" cy="5" r="2.5" fill="white" />
                  <circle cx="19" cy="19" r="2.5" fill="white" opacity="0.8" />
                  <line x1="7.2" y1="11" x2="16.8" y2="6.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
                  <line x1="7.2" y1="13" x2="16.8" y2="17.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '15px', color: '#e8edf5' }}>LinkedinConnect</span>
            </div>
            <p style={{ fontFamily: 'var(--font-jakarta)', fontSize: '13px', lineHeight: 1.75, color: '#6b7d99', maxWidth: '190px', marginBottom: '20px' }}>
              The platform where startup founders discover, connect, and grow together on LinkedIn.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(74,127,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7d99', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.38)'; e.currentTarget.style.color = '#4a7fff'; e.currentTarget.style.background = 'rgba(74,127,255,0.07)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.14)'; e.currentTarget.style.color = '#6b7d99'; e.currentTarget.style.background = 'transparent' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: 'var(--font-syne)', fontSize: '12px', fontWeight: 700, color: '#e8edf5', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '18px' }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map(link => (
                  <li key={link} style={{ marginBottom: '10px' }}>
                    <a
                      href="#"
                      style={{ fontFamily: 'var(--font-jakarta)', fontSize: '14px', color: '#6b7d99', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#c0cde3')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6b7d99')}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(74,127,255,0.07)', paddingTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-jakarta)', fontSize: '13px', color: '#4a5568' }}>
            © 2026 LinkedinConnect, Inc. All rights reserved.
          </span>
          <span style={{ fontFamily: 'var(--font-jakarta)', fontSize: '13px', color: '#4a5568' }}>
            Made with care in San Francisco
          </span>
        </div>
      </div>
    </footer>
  )
}
