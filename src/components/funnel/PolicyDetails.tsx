"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { HelpCircle, TrendingDown, Scale, TrendingUp } from 'lucide-react';

const NCB_OPTIONS = ['0%', '20%', '25%', '35%', '45%', '50%', 'Not sure'];
const CLAIM_OPTIONS = ['0', '1', '2', '3+'];

export default function PolicyDetails({ onNext }: { onNext: () => void }) {
  const { updateLead } = useLead();
  const { trackEvent } = useTracking();
  const [ncb, setNcb] = useState('20%');
  const [claims, setClaims] = useState('0');
  const [valuePref, setValuePref] = useState('balanced');
  const [expiry, setExpiry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = { ncb, claims, valuePreference: valuePref, expiryDate: expiry };
    updateLead({ policyDetails: p });
    trackEvent('policy_details_completed', p);
    onNext();
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Policy details</h1>
        <p className="page-subtitle">These help us calculate the most accurate quote for you.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Expiry */}
        <div className="card card-elevated" style={{ marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Current policy expiry date</label>
            <input type="date" className="form-input" required value={expiry} onChange={e => setExpiry(e.target.value)} />
          </div>
        </div>

        {/* NCB */}
        <div className="card card-elevated" style={{ marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">No Claim Bonus (NCB)</label>
            <p className="form-hint" style={{ marginBottom: 12 }}>
              <HelpCircle size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
              Discount you receive if you haven't made a claim in previous years.
            </p>
            <div className="chip-group">
              {NCB_OPTIONS.map(o => (
                <div key={o} className={`chip ${ncb === o ? 'chip-active' : ''}`} onClick={() => setNcb(o)}>{o}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Claims */}
        <div className="card card-elevated" style={{ marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Claims in last 3 years</label>
            <div className="chip-group">
              {CLAIM_OPTIONS.map(o => (
                <div key={o} className={`chip ${claims === o ? 'chip-active' : ''}`} onClick={() => setClaims(o)}>{o}</div>
              ))}
            </div>
          </div>
        </div>

        {/* IDV Preference — proper cards */}
        <div className="card card-elevated" style={{ marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Cover preference</label>
            <p className="form-hint" style={{ marginBottom: 12 }}>Vehicle value affects your premium and claim payout.</p>
            <div className="idv-grid">
              <div className={`idv-card ${valuePref === 'lowest' ? 'idv-card-active' : ''}`} onClick={() => setValuePref('lowest')}>
                <div className="idv-card-icon"><TrendingDown size={22} color={valuePref === 'lowest' ? '#2563eb' : '#94a3b8'} /></div>
                <div className="idv-card-label">Lowest price</div>
                <div className="idv-card-hint">Save more</div>
              </div>
              <div className={`idv-card ${valuePref === 'balanced' ? 'idv-card-active' : ''}`} onClick={() => setValuePref('balanced')}>
                <div className="idv-card-icon"><Scale size={22} color={valuePref === 'balanced' ? '#2563eb' : '#94a3b8'} /></div>
                <div className="idv-card-label">Balanced cover</div>
                <div className="idv-card-hint">Recommended</div>
              </div>
              <div className={`idv-card ${valuePref === 'higher' ? 'idv-card-active' : ''}`} onClick={() => setValuePref('higher')}>
                <div className="idv-card-icon"><TrendingUp size={22} color={valuePref === 'higher' ? '#2563eb' : '#94a3b8'} /></div>
                <div className="idv-card-label">Higher cover</div>
                <div className="idv-card-hint">Max protection</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky-cta">
          <div className="sticky-cta-inner">
            <button type="submit" className="btn btn-primary">Show my estimate →</button>
          </div>
        </div>
      </form>
    </div>
  );
}
