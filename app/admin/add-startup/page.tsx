'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CompanyData {
  name: string
  description: string
  logo_url: string
  industry: string
  company_size: string
  headquarters: string
  website: string
  follower_count: number
  linkedin_url: string
  linkedin_company_id: string
  featured_post_url: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(74,127,255,0.15)',
  background: 'rgba(255,255,255,0.03)',
  color: '#e8edf5',
  fontSize: '14px',
  fontFamily: 'var(--font-jakarta)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

export default function AddStartupPage() {
  const [url, setUrl] = useState('')
  const [fetching, setFetching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<CompanyData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const fetchCompany = async () => {
    setFetching(true)
    setError(null)
    setData(null)

    const res = await fetch(`/api/linkedin/company?url=${encodeURIComponent(url)}`)
    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Failed to fetch company data')
    } else {
      setData({ ...json, featured_post_url: '' })
    }
    setFetching(false)
  }

  const saveStartup = async () => {
    if (!data) return
    setSaving(true)
    setError(null)

    const res = await fetch('/api/startups/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Failed to save startup')
    } else {
      setSuccess(true)
      setData(null)
      setUrl('')
    }
    setSaving(false)
  }

  const field = (label: string, key: keyof CompanyData, multiline = false) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7d99', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={String(data?.[key] ?? '')}
          onChange={e => setData(d => d ? { ...d, [key]: e.target.value } : d)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.5)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.15)' }}
        />
      ) : (
        <input
          type="text"
          value={String(data?.[key] ?? '')}
          onChange={e => setData(d => d ? { ...d, [key]: e.target.value } : d)}
          style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.5)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.15)' }}
        />
      )}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#070d1a', padding: '40px 24px', fontFamily: 'var(--font-jakarta)', color: '#e8edf5' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <Link href="/" style={{ color: '#6b7d99', textDecoration: 'none', fontSize: '14px' }}>← Home</Link>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>
            Add Startup
          </h1>
        </div>

        {/* URL fetch */}
        <div style={{ background: '#0d1829', borderRadius: '16px', border: '1px solid rgba(74,127,255,0.1)', padding: '28px', marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7d99', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            LinkedIn Company URL
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.linkedin.com/company/researchorg"
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && fetchCompany()}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.5)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(74,127,255,0.15)' }}
            />
            <button
              onClick={fetchCompany}
              disabled={fetching || !url}
              style={{
                padding: '10px 20px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #4a7fff, #2563eb)',
                color: 'white', fontFamily: 'var(--font-jakarta)', fontSize: '14px', fontWeight: 600,
                border: 'none', cursor: fetching ? 'wait' : 'pointer',
                opacity: fetching || !url ? 0.6 : 1, whiteSpace: 'nowrap',
                transition: 'opacity 0.2s',
              }}
            >
              {fetching ? 'Fetching…' : 'Fetch Data'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)', color: '#fb7185', fontSize: '14px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: '14px', marginBottom: '20px' }}>
            ✓ Startup added successfully! It will now appear in the Discover feed.
          </div>
        )}

        {/* Editable fields */}
        {data && (
          <div style={{ background: '#0d1829', borderRadius: '16px', border: '1px solid rgba(74,127,255,0.1)', padding: '28px' }}>
            <p style={{ fontSize: '13px', color: '#6b7d99', marginBottom: '24px' }}>
              Review and edit the fetched data before saving.
            </p>

            {/* Logo preview */}
            {data.logo_url && (
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={data.logo_url} alt="Logo preview" style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(74,127,255,0.2)' }} />
                <span style={{ fontSize: '13px', color: '#6b7d99' }}>Logo preview</span>
              </div>
            )}

            {field('Company Name', 'name')}
            {field('Description', 'description', true)}
            {field('Logo URL', 'logo_url')}
            {field('Industry', 'industry')}
            {field('Company Size', 'company_size')}
            {field('Headquarters', 'headquarters')}
            {field('Website', 'website')}

            <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'rgba(74,127,255,0.06)', border: '1px solid rgba(74,127,255,0.15)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#6b7d99', marginBottom: '10px', lineHeight: 1.6 }}>
                <strong style={{ color: '#4a7fff' }}>Featured Post URL</strong> — paste a URL to one of this company&apos;s LinkedIn posts. Users must <strong>like</strong> this post to earn their point. Go to the company page → click any post → copy the URL.
              </p>
              {field('Featured Post URL (for like verification)', 'featured_post_url')}
            </div>

            <button
              onClick={saveStartup}
              disabled={saving}
              style={{
                width: '100%', padding: '13px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4a7fff, #2563eb)',
                color: 'white', fontFamily: 'var(--font-jakarta)', fontSize: '15px', fontWeight: 600,
                border: 'none', cursor: saving ? 'wait' : 'pointer',
                boxShadow: '0 0 28px rgba(74,127,255,0.35)',
                opacity: saving ? 0.7 : 1, marginTop: '8px',
                transition: 'opacity 0.2s',
              }}
            >
              {saving ? 'Saving…' : 'Add to Discover Feed'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
