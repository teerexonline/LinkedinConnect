'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const pending = sessionStorage.getItem('lc_pending_company')
    if (pending) {
      try {
        const parsed = JSON.parse(pending) as Partial<CompanyData>
        setData({
          name: parsed.name ?? '',
          description: parsed.description ?? '',
          logo_url: parsed.logo_url ?? '',
          industry: parsed.industry ?? '',
          company_size: parsed.company_size ?? '',
          headquarters: parsed.headquarters ?? '',
          website: parsed.website ?? '',
          follower_count: parsed.follower_count ?? 0,
          linkedin_url: parsed.linkedin_url ?? '',
          linkedin_company_id: parsed.linkedin_company_id ?? '',
        })
        if (parsed.linkedin_url) setUrl(parsed.linkedin_url)
        sessionStorage.removeItem('lc_pending_company')
      } catch {
        sessionStorage.removeItem('lc_pending_company')
      }
    }
  }, [])

  const fetchCompany = async () => {
    setFetching(true)
    setError(null)
    setData(null)

    const res = await fetch(`/api/linkedin/company?url=${encodeURIComponent(url)}`)
    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Failed to fetch company data')
    } else {
      setData(json)
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
      setError(json.error ?? 'Failed to save company')
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
          <Link href="/portfolio" style={{ color: '#6b7d99', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>
            Add Company
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
              placeholder="https://www.linkedin.com/company/yourcompany"
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
          <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: '14px', marginBottom: '20px' }}>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>✓ Company added!</div>
            <div style={{ fontSize: '13px', color: '#6b7d99' }}>Now add a featured post so others can discover and like it. Go to <Link href="/portfolio" style={{ color: '#4a7fff', textDecoration: 'none' }}>My Portfolio</Link> and click &ldquo;Add Post&rdquo;.</div>
          </div>
        )}

        {data && (
          <div style={{ background: '#0d1829', borderRadius: '16px', border: '1px solid rgba(74,127,255,0.1)', padding: '28px' }}>
            <p style={{ fontSize: '13px', color: '#6b7d99', marginBottom: '24px' }}>
              Review and edit the fetched data before saving.
            </p>

            {data.logo_url && (
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={data.logo_url} alt="Logo" style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(74,127,255,0.2)' }} />
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
              {saving ? 'Saving…' : 'Add Company'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
