'use client'

import Link from 'next/link'

const tiers = [
  {
    name: 'Starter',
    price: 0,
    description: 'Perfect for founders just launching their startup LinkedIn presence.',
    features: ['1 company page', '50 startup discoveries/month', 'Basic founder connections', 'Page analytics overview', 'Community access', 'Email support'],
    cta: 'Get Started Free',
    href: '/signup',
    highlight: false,
    accentColor: '#6b7d99',
  },
  {
    name: 'Growth',
    price: 49,
    description: 'For founders ready to actively grow their startup\'s network and visibility.',
    features: ['3 company pages', '500 startup discoveries/month', 'Founder-to-founder outreach', 'Full page growth analytics', 'Partnership pipeline tools', 'Content scheduling', 'Priority support'],
    cta: 'Start Growth Trial',
    href: '/signup?plan=growth',
    highlight: true,
    accentColor: '#4a7fff',
  },
  {
    name: 'Scale',
    price: 199,
    description: 'For growing startups with a team that needs full ecosystem access.',
    features: ['Unlimited company pages', 'Unlimited discoveries', 'Full team access', 'Ecosystem insights & trends', 'API access', 'CRM integrations', 'Dedicated success manager', 'SLA guarantee'],
    cta: 'Contact Sales',
    href: '/signup?plan=scale',
    highlight: false,
    accentColor: '#a78bfa',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: '120px 32px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '900px', height: '600px', background: 'radial-gradient(ellipse, rgba(74,127,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '100px', border: '1px solid rgba(74,127,255,0.3)', background: 'rgba(74,127,255,0.06)', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-jakarta)', fontWeight: 700, color: '#4a7fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pricing</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#e8edf5', marginBottom: '16px', lineHeight: 1.1 }}>
            Grow at your own pace
          </h2>
          <p style={{ fontFamily: 'var(--font-jakarta)', fontSize: '17px', color: '#6b7d99', lineHeight: 1.75 }}>
            No hidden fees. Cancel anytime. 14-day free trial on all paid plans.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
          {tiers.map(tier => (
            <div
              key={tier.name}
              style={{
                padding: '36px',
                borderRadius: '20px',
                background: tier.highlight ? 'linear-gradient(160deg, #0e2040 0%, #111f35 100%)' : '#0d1829',
                border: tier.highlight ? '1px solid rgba(74,127,255,0.35)' : '1px solid rgba(74,127,255,0.07)',
                position: 'relative',
                boxShadow: tier.highlight ? '0 0 80px rgba(74,127,255,0.1), inset 0 1px 0 rgba(74,127,255,0.1)' : 'none',
                transform: tier.highlight ? 'scale(1.025)' : 'scale(1)',
              }}
            >
              {tier.highlight && (
                <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', borderRadius: '100px', background: 'linear-gradient(135deg, #4a7fff, #2563eb)', fontSize: '11px', fontFamily: 'var(--font-jakarta)', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 700, color: '#e8edf5', marginBottom: '8px' }}>{tier.name}</h3>
                <p style={{ fontFamily: 'var(--font-jakarta)', fontSize: '14px', color: '#6b7d99', lineHeight: 1.6 }}>{tier.description}</p>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-syne)', fontSize: '52px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.04em', lineHeight: 1 }}>${tier.price}</span>
                  <span style={{ fontFamily: 'var(--font-jakarta)', fontSize: '15px', color: '#6b7d99' }}>/month</span>
                </div>
              </div>

              <Link
                href={tier.href}
                style={{
                  display: 'block',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-jakarta)',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  marginBottom: '28px',
                  transition: 'all 0.2s',
                  background: tier.highlight ? 'linear-gradient(135deg, #4a7fff, #2563eb)' : 'transparent',
                  color: tier.highlight ? 'white' : '#e8edf5',
                  border: tier.highlight ? 'none' : `1px solid ${tier.accentColor}35`,
                  boxShadow: tier.highlight ? '0 0 32px rgba(74,127,255,0.4)' : 'none',
                }}
              >
                {tier.cta}
              </Link>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '11px' }}>
                    <div style={{ width: '17px', height: '17px', borderRadius: '50%', background: `${tier.accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke={tier.accentColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontFamily: 'var(--font-jakarta)', fontSize: '14px', color: '#8899b4', lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
