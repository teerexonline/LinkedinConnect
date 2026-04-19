'use client'

import Link from 'next/link'

const nodes = [
  { cx: 120, cy: 120, color: '#a78bfa', label: 'SaaS', size: 16, dur: '6s', dy: -8 },
  { cx: 362, cy: 118, color: '#34d399', label: 'FinTech', size: 14, dur: '8s', dy: -6 },
  { cx: 78,  cy: 282, color: '#f5b731', label: 'AI', size: 15, dur: '5s', dy: -9 },
  { cx: 402, cy: 300, color: '#4a7fff', label: 'Web3', size: 13, dur: '7s', dy: -7 },
  { cx: 200, cy: 382, color: '#fb7185', label: 'Dev', size: 14, dur: '9s', dy: -8 },
  { cx: 322, cy: 380, color: '#60a5fa', label: 'Health', size: 13, dur: '6.5s', dy: -6 },
]

const miniDots = [
  { cx: 162, cy: 202, r: 5, color: '#4a7fff', dur: '4s' },
  { cx: 312, cy: 197, r: 4, color: '#a78bfa', dur: '5s' },
  { cx: 172, cy: 312, r: 5, color: '#34d399', dur: '6s' },
  { cx: 352, cy: 222, r: 4, color: '#f5b731', dur: '3.5s' },
]

const floatingCards = [
  { text: 'Aria Labs', status: 'Following',   x: -40, y: 86,  color: '#a78bfa' },
  { text: 'Stackr AI', status: 'Discovered',  x: 330, y: 84,  color: '#34d399' },
  { text: 'NovaPay',   status: 'Following',   x: -80, y: 248, color: '#f5b731' },
]

export default function Hero() {
  return (
    <section className="lc-hero-section" style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(74,127,255,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="lc-hero-inner">
        {/* Left: Copy */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '100px', border: '1px solid rgba(74,127,255,0.3)', background: 'rgba(74,127,255,0.07)', marginBottom: '28px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4a7fff', display: 'inline-block', animation: 'lcPulse 2s infinite' }} />
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-jakarta)', fontWeight: 600, color: '#4a7fff', letterSpacing: '0.04em' }}>
              The LinkedIn Platform for Startup Founders
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#e8edf5', marginBottom: '22px' }}>
            Grow Your Startup<br />
            <span style={{ background: 'linear-gradient(130deg, #4a7fff 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              on LinkedIn
            </span>
          </h1>

          <p style={{ fontFamily: 'var(--font-jakarta)', fontSize: '18px', lineHeight: 1.75, color: '#6b7d99', maxWidth: '460px', marginBottom: '40px' }}>
            Discover other startups, connect with fellow founders, and grow your company page — built specifically for startup founders and small business owners.
          </p>

          <div style={{ display: 'flex', gap: '14px', marginBottom: '56px', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ padding: '14px 28px', borderRadius: '10px', background: 'linear-gradient(135deg, #4a7fff, #2563eb)', color: 'white', fontFamily: 'var(--font-jakarta)', fontSize: '16px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 0 40px rgba(74,127,255,0.4)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 56px rgba(74,127,255,0.55)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(74,127,255,0.4)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Start Growing Free →
            </Link>
            <a href="#features" style={{ padding: '14px 28px', borderRadius: '10px', border: '1px solid rgba(74,127,255,0.2)', background: 'rgba(74,127,255,0.04)', color: '#e8edf5', fontFamily: 'var(--font-jakarta)', fontSize: '16px', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.4)'; e.currentTarget.style.background = 'rgba(74,127,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.2)'; e.currentTarget.style.background = 'rgba(74,127,255,0.04)' }}
            >
              See Features
            </a>
          </div>

          <div className="lc-hero-stats">
            {[['12K+', 'Startups on Platform'], ['500K+', 'Founder Connections'], ['3×', 'Avg Page Growth']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.025em', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: '13px', color: '#6b7d99', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Network viz */}
        <div className="lc-hero-viz">
          <div style={{ position: 'relative', width: '360px', height: '360px' }}>
            {/* Outer ring */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(74,127,255,0.08)', background: 'radial-gradient(circle, rgba(74,127,255,0.04) 0%, transparent 70%)' }} />

            {/* Floating cards */}
            {floatingCards.map(card => (
              <div key={card.text} style={{ position: 'absolute', left: card.x, top: card.y, background: '#0d1829', border: `1px solid ${card.color}28`, borderRadius: '10px', padding: '9px 13px', minWidth: '148px', backdropFilter: 'blur(8px)', zIndex: 10 }}>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-jakarta)', fontWeight: 600, color: '#e8edf5' }}>{card.text}</div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-jakarta)', color: card.color, marginTop: '3px' }}>● {card.status}</div>
              </div>
            ))}

            {/* SVG */}
            <svg width="360" height="360" viewBox="0 0 480 480" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4a7fff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4a7fff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Glow under center */}
              <ellipse cx="240" cy="240" rx="60" ry="60" fill="url(#centerGlow)" />

              {/* Connection lines */}
              {nodes.map(n => (
                <line key={n.label} x1="240" y1="240" x2={n.cx} y2={n.cy} stroke={n.color} strokeWidth="1.5" strokeDasharray="4 5" opacity="0.35">
                  <animate attributeName="stroke-dashoffset" values="0;-18" dur={n.dur} repeatCount="indefinite" />
                </line>
              ))}
              {/* Secondary cross-links */}
              <line x1="120" y1="120" x2="362" y2="118" stroke="#4a7fff" strokeWidth="0.8" strokeDasharray="3 7" opacity="0.18">
                <animate attributeName="stroke-dashoffset" values="0;-20" dur="10s" repeatCount="indefinite" />
              </line>
              <line x1="78" y1="282" x2="200" y2="382" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="3 7" opacity="0.18">
                <animate attributeName="stroke-dashoffset" values="0;-20" dur="12s" repeatCount="indefinite" />
              </line>
              <line x1="402" y1="300" x2="322" y2="380" stroke="#4a7fff" strokeWidth="0.8" strokeDasharray="3 7" opacity="0.18">
                <animate attributeName="stroke-dashoffset" values="0;-20" dur="9s" repeatCount="indefinite" />
              </line>

              {/* Center hub */}
              <circle cx="240" cy="240" r="30" fill="rgba(74,127,255,0.12)" stroke="#4a7fff" strokeWidth="1.5">
                <animate attributeName="r" values="30;34;30" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="240" cy="240" r="19" fill="#4a7fff" />
              <text x="240" y="245" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="sans-serif">LC</text>

              {/* Outer nodes */}
              {nodes.map(n => (
                <g key={n.label}>
                  <circle cx={n.cx} cy={n.cy} r={n.size + 9} fill={`${n.color}10`} stroke={`${n.color}25`} strokeWidth="1">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur={n.dur} repeatCount="indefinite" />
                  </circle>
                  <circle cx={n.cx} cy={n.cy} r={n.size} fill={n.color}>
                    <animate attributeName="cy" values={`${n.cy};${n.cy + n.dy};${n.cy}`} dur={n.dur} repeatCount="indefinite" />
                  </circle>
                  <text x={n.cx} y={n.cy + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="sans-serif">
                    {n.label}
                  </text>
                </g>
              ))}

              {/* Mini floating dots */}
              {miniDots.map((d, i) => (
                <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={d.color} opacity="0.5">
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur={d.dur} repeatCount="indefinite" />
                </circle>
              ))}
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lcPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </section>
  )
}
