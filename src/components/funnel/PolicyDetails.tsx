"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { TrendingDown, Scale, TrendingUp } from 'lucide-react';
import Tooltip from '@/components/Tooltip';

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
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Policy details</h1>
        <p className="page-subtitle">Help us calculate the most accurate quote for your vehicle.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card card-elevated" style={{ marginBottom: 14 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Policy Expiry Date
              <Tooltip text="When does your current insurance policy expire? Check your existing policy document. If buying for a new vehicle, select today's date." />
            </label>
            <input type="date" className="form-input" required value={expiry} onChange={e => setExpiry(e.target.value)} />
            <p className="form-hint">You can find this on your current policy document or renewal notice</p>
          </div>
        </div>

        <div className="card card-elevated" style={{ marginBottom: 14 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              No Claim Bonus (NCB)
              <Tooltip text="NCB is a discount on your premium for every claim-free year. Example: If you had no claims last year, you get 20% off. After 5 claim-free years, you get 50% off. Select 'Not sure' if you don't know." />
            </label>
            <p className="form-hint" style={{ marginBottom: 12 }}>Discount for not making claims in previous years. Higher NCB = lower premium.</p>
            <div className="chip-group">
              {NCB_OPTIONS.map(o => (<div key={o} className={`chip ${ncb === o ? 'chip-active' : ''}`} onClick={() => setNcb(o)}>{o}</div>))}
            </div>
          </div>
        </div>

        <div className="card card-elevated" style={{ marginBottom: 14 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Claims in Last 3 Years
              <Tooltip text="How many insurance claims have you made in the past 3 years? This includes accident claims, theft claims, or any other claims you filed with your insurer. More claims = higher premium." />
            </label>
            <div className="chip-group">
              {CLAIM_OPTIONS.map(o => (<div key={o} className={`chip ${claims === o ? 'chip-active' : ''}`} onClick={() => setClaims(o)}>{o}</div>))}
            </div>
          </div>
        </div>

        <div className="card card-elevated" style={{ marginBottom: 14 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Cover Preference (IDV)
              <Tooltip text="IDV (Insured Declared Value) is the maximum amount your insurer will pay if your vehicle is stolen or totally damaged. Higher IDV = higher premium but better payout. Lowest price gives minimum IDV, Higher cover gives maximum IDV." />
            </label>
            <p className="form-hint" style={{ marginBottom: 12 }}>IDV affects how much you pay AND how much you get if you claim.</p>
            <div className="idv-grid">
              <div className={`idv-card ${valuePref === 'lowest' ? 'idv-card-active' : ''}`} onClick={() => setValuePref('lowest')}>
                <div className="idv-card-icon"><TrendingDown size={22} color={valuePref === 'lowest' ? '#2563eb' : '#94a3b8'} /></div>
                <div className="idv-card-label">Lowest Price</div>
                <div className="idv-card-hint">Save on premium</div>
              </div>
              <div className={`idv-card ${valuePref === 'balanced' ? 'idv-card-active' : ''}`} onClick={() => setValuePref('balanced')}>
                <div className="idv-card-icon"><Scale size={22} color={valuePref === 'balanced' ? '#2563eb' : '#94a3b8'} /></div>
                <div className="idv-card-label">Balanced</div>
                <div className="idv-card-hint">Recommended ✓</div>
              </div>
              <div className={`idv-card ${valuePref === 'higher' ? 'idv-card-active' : ''}`} onClick={() => setValuePref('higher')}>
                <div className="idv-card-icon"><TrendingUp size={22} color={valuePref === 'higher' ? '#2563eb' : '#94a3b8'} /></div>
                <div className="idv-card-label">Higher Cover</div>
                <div className="idv-card-hint">Max protection</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky-cta"><div className="sticky-cta-inner"><button type="submit" className="btn btn-primary">Show My Estimate →</button></div></div>
      </form>
    </div>
  );
}
