'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STAGES = [
  { id: 'idea', label: 'Just an Idea', sub: 'Still validating' },
  { id: 'pre-seed', label: 'Pre-Seed', sub: 'Building MVP' },
  { id: 'seed', label: 'Seed Stage', sub: 'First traction' },
  { id: 'series-a', label: 'Series A+', sub: 'Scaling' },
  { id: 'bootstrapped', label: 'Bootstrapped', sub: 'Self-funded' },
]

const INDUSTRIES = [
  { id: 'saas', label: 'SaaS' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'fintech', label: 'FinTech' },
  { id: 'health', label: 'HealthTech' },
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'edtech', label: 'EdTech' },
  { id: 'devtools', label: 'Dev Tools' },
  { id: 'web3', label: 'Web3' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'other', label: 'Other' },
]

const TEAM_SIZES = [
  { id: 'solo', label: 'Just me', sub: 'Solo founder' },
  { id: '2-5', label: '2 – 5', sub: 'Small team' },
  { id: '6-20', label: '6 – 20', sub: 'Growing' },
  { id: '21-50', label: '21 – 50', sub: 'Scaling' },
  { id: '50+', label: '50+', sub: 'Established' },
]

const GOALS = [
  { id: 'followers', label: 'Grow LinkedIn followers' },
  { id: 'investors', label: 'Attract investors' },
  { id: 'partners', label: 'Find co-founders & partners' },
  { id: 'brand', label: 'Build brand awareness' },
  { id: 'customers', label: 'Get more customers' },
  { id: 'talent', label: 'Hire top talent' },
]

type Answers = {
  stage: string
  industry: string
  teamSize: string
  goals: string[]
}

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({ stage: '', industry: '', teamSize: '', goals: [] })
  const router = useRouter()

  const total = 4
  const progress = ((step) / total) * 100

  const setStage = (v: string) => setAnswers(a => ({ ...a, stage: v }))
  const setIndustry = (v: string) => setAnswers(a => ({ ...a, industry: v }))
  const setTeamSize = (v: string) => setAnswers(a => ({ ...a, teamSize: v }))
  const toggleGoal = (v: string) => setAnswers(a => ({
    ...a,
    goals: a.goals.includes(v) ? a.goals.filter(g => g !== v) : [...a.goals, v],
  }))

  const canNext = [
    answers.stage !== '',
    answers.industry !== '',
    answers.teamSize !== '',
    answers.goals.length > 0,
  ][step] ?? true

  const selectedStage = STAGES.find(s => s.id === answers.stage)
  const selectedIndustry = INDUSTRIES.find(i => i.id === answers.industry)

  return (
    <div style={{
      minHeight: '100vh', background: '#070d1a',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px 20px',
      fontFamily: 'var(--font-jakarta)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse, rgba(74,127,255,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,183,49,0.03) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10 }}>
        <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #4a7fff, #2563eb)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(74,127,255,0.4)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="2.5" fill="white" opacity="0.6" />
            <circle cx="19" cy="5" r="2.5" fill="white" />
            <circle cx="19" cy="19" r="2.5" fill="white" opacity="0.8" />
            <line x1="7.2" y1="11" x2="16.8" y2="6.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <line x1="7.2" y1="13" x2="16.8" y2="17.5" stroke="white" strokeWidth="1.5" opacity="0.7" />
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '16px', color: '#e8edf5', letterSpacing: '-0.02em' }}>LinkedinConnect</span>
      </div>

      {/* Progress bar */}
      {step < total && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(74,127,255,0.1)', zIndex: 20 }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #4a7fff, #a78bfa)', width: `${progress}%`, transition: 'width 0.4s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 5 }}>

        {/* Step counter */}
        {step < total && (
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7d99', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Step {step + 1} of {total}
            </span>
          </div>
        )}

        {/* ── Step 0: Stage ── */}
        {step === 0 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '8px', lineHeight: 1.1 }}>
              What stage is your<br />company at?
            </h1>
            <p style={{ fontSize: '15px', color: '#6b7d99', textAlign: 'center', marginBottom: '32px', lineHeight: 1.6 }}>
              We&apos;ll tailor your LinkedIn growth strategy to your stage.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {STAGES.map(s => (
                <button key={s.id} onClick={() => setStage(s.id)}
                  style={{
                    width: '100%', padding: '16px 20px', borderRadius: '14px',
                    border: answers.stage === s.id ? '1px solid #4a7fff' : '1px solid rgba(74,127,255,0.12)',
                    background: answers.stage === s.id ? 'rgba(74,127,255,0.1)' : 'rgba(13,24,41,0.8)',
                    cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all 0.15s',
                    boxShadow: answers.stage === s.id ? '0 0 20px rgba(74,127,255,0.15)' : 'none',
                  }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700, color: answers.stage === s.id ? '#e8edf5' : '#8899b4' }}>{s.label}</div>
                    <div style={{ fontSize: '13px', color: '#6b7d99', marginTop: '2px' }}>{s.sub}</div>
                  </div>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: answers.stage === s.id ? '2px solid #4a7fff' : '2px solid rgba(74,127,255,0.25)', background: answers.stage === s.id ? '#4a7fff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                    {answers.stage === s.id && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Industry ── */}
        {step === 1 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '8px', lineHeight: 1.1 }}>
              What&apos;s your industry?
            </h1>
            <p style={{ fontSize: '15px', color: '#6b7d99', textAlign: 'center', marginBottom: '32px', lineHeight: 1.6 }}>
              We&apos;ll connect you with relevant founders and companies.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {INDUSTRIES.map(ind => (
                <button key={ind.id} onClick={() => setIndustry(ind.id)}
                  style={{
                    padding: '16px', borderRadius: '14px',
                    border: answers.industry === ind.id ? '1px solid #4a7fff' : '1px solid rgba(74,127,255,0.12)',
                    background: answers.industry === ind.id ? 'rgba(74,127,255,0.1)' : 'rgba(13,24,41,0.8)',
                    cursor: 'pointer', textAlign: 'center',
                    fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700,
                    color: answers.industry === ind.id ? '#e8edf5' : '#8899b4',
                    transition: 'all 0.15s',
                    boxShadow: answers.industry === ind.id ? '0 0 20px rgba(74,127,255,0.15)' : 'none',
                  }}>
                  {ind.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Team Size ── */}
        {step === 2 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '8px', lineHeight: 1.1 }}>
              How big is your team?
            </h1>
            <p style={{ fontSize: '15px', color: '#6b7d99', textAlign: 'center', marginBottom: '32px', lineHeight: 1.6 }}>
              Helps us match you with the right community.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px' }}>
              {TEAM_SIZES.map(t => (
                <button key={t.id} onClick={() => setTeamSize(t.id)}
                  style={{
                    padding: '20px 8px', borderRadius: '14px',
                    border: answers.teamSize === t.id ? '1px solid #4a7fff' : '1px solid rgba(74,127,255,0.12)',
                    background: answers.teamSize === t.id ? 'rgba(74,127,255,0.1)' : 'rgba(13,24,41,0.8)',
                    cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.15s',
                    boxShadow: answers.teamSize === t.id ? '0 0 20px rgba(74,127,255,0.15)' : 'none',
                  }}>
                  <div style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 800, color: answers.teamSize === t.id ? '#e8edf5' : '#8899b4' }}>{t.label}</div>
                  <div style={{ fontSize: '11px', color: '#6b7d99', marginTop: '4px' }}>{t.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Goals ── */}
        {step === 3 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '8px', lineHeight: 1.1 }}>
              What are your goals?
            </h1>
            <p style={{ fontSize: '15px', color: '#6b7d99', textAlign: 'center', marginBottom: '32px', lineHeight: 1.6 }}>
              Select all that apply — we&apos;ll prioritise your feed accordingly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {GOALS.map(g => {
                const selected = answers.goals.includes(g.id)
                return (
                  <button key={g.id} onClick={() => toggleGoal(g.id)}
                    style={{
                      width: '100%', padding: '15px 20px', borderRadius: '14px',
                      border: selected ? '1px solid #4a7fff' : '1px solid rgba(74,127,255,0.12)',
                      background: selected ? 'rgba(74,127,255,0.1)' : 'rgba(13,24,41,0.8)',
                      cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: '14px',
                      transition: 'all 0.15s',
                      boxShadow: selected ? '0 0 20px rgba(74,127,255,0.12)' : 'none',
                    }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: selected ? '2px solid #4a7fff' : '2px solid rgba(74,127,255,0.25)', background: selected ? '#4a7fff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                      {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                    <span style={{ fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 600, color: selected ? '#e8edf5' : '#8899b4' }}>{g.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Step 4: Results ── */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #4a7fff, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(74,127,255,0.4)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.03em', marginBottom: '12px', lineHeight: 1.1 }}>
              Your growth plan<br />is ready.
            </h1>
            <p style={{ fontSize: '15px', color: '#6b7d99', lineHeight: 1.7, marginBottom: '32px', maxWidth: '380px', margin: '0 auto 32px' }}>
              Based on your answers, we&apos;ve built a personalised LinkedIn strategy for your{' '}
              <span style={{ color: '#4a7fff', fontWeight: 600 }}>{selectedStage?.label ?? 'startup'}</span>{' '}
              in{' '}
              <span style={{ color: '#f5b731', fontWeight: 600 }}>{selectedIndustry?.label ?? 'your industry'}</span>.
            </p>

            {/* Summary pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '40px' }}>
              {selectedStage && (
                <span style={{ padding: '6px 14px', borderRadius: '100px', background: 'rgba(74,127,255,0.1)', border: '1px solid rgba(74,127,255,0.25)', fontSize: '13px', fontWeight: 600, color: '#4a7fff' }}>
                  {selectedStage.label}
                </span>
              )}
              {selectedIndustry && (
                <span style={{ padding: '6px 14px', borderRadius: '100px', background: 'rgba(245,183,49,0.1)', border: '1px solid rgba(245,183,49,0.25)', fontSize: '13px', fontWeight: 600, color: '#f5b731' }}>
                  {selectedIndustry.label}
                </span>
              )}
              {answers.goals.slice(0, 2).map(gid => {
                const g = GOALS.find(g => g.id === gid)
                return g ? (
                  <span key={gid} style={{ padding: '6px 14px', borderRadius: '100px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', fontSize: '13px', fontWeight: 600, color: '#34d399' }}>
                    {g.label}
                  </span>
                ) : null
              })}
            </div>

            <a href="/login"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '16px 36px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #4a7fff, #2563eb)',
                color: 'white', fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 700,
                textDecoration: 'none', boxShadow: '0 0 40px rgba(74,127,255,0.4)',
                letterSpacing: '-0.01em',
              }}
            >
              Add Your Company →
            </a>

            <div style={{ marginTop: '16px' }}>
              <a href="/login" style={{ fontSize: '13px', color: '#6b7d99', textDecoration: 'none' }}>
                Already have an account? <span style={{ color: '#4a7fff' }}>Sign in</span>
              </a>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step < total && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px' }}>
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)}
                style={{ padding: '12px 20px', borderRadius: '10px', border: '1px solid rgba(74,127,255,0.15)', background: 'transparent', color: '#6b7d99', fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8edf5'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7d99'}
              >
                ← Back
              </button>
            ) : (
              <a href="/login" style={{ fontSize: '13px', color: '#6b7d99', textDecoration: 'none' }}>
                Already have an account? <span style={{ color: '#4a7fff' }}>Sign in</span>
              </a>
            )}
            <button onClick={() => canNext && setStep(s => s + 1)} disabled={!canNext}
              style={{
                padding: '12px 28px', borderRadius: '10px',
                background: canNext ? 'linear-gradient(135deg, #4a7fff, #2563eb)' : 'rgba(74,127,255,0.2)',
                color: canNext ? 'white' : '#6b7d99',
                fontFamily: 'var(--font-syne)', fontSize: '14px', fontWeight: 700,
                border: 'none', cursor: canNext ? 'pointer' : 'not-allowed',
                boxShadow: canNext ? '0 0 24px rgba(74,127,255,0.35)' : 'none',
                transition: 'all 0.15s',
                letterSpacing: '-0.01em',
              }}
            >
              {step === total - 1 ? 'See My Plan →' : 'Continue →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
