"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';

const NCB_OPTIONS = ['0%', '20%', '25%', '35%', '45%', '50%', 'Not sure'];
const CLAIM_OPTIONS = ['0', '1', '2', '3+'];
const IDV_OPTIONS = [
  { label: 'Lowest price', value: 'lowest' },
  { label: 'Balanced cover', value: 'balanced' },
  { label: 'Higher cover', value: 'higher' }
];

export default function PolicyDetails({ onNext }: { onNext: () => void }) {
  const { updateLead } = useLead();
  const { trackEvent } = useTracking();
  
  const [ncb, setNcb] = useState('20%');
  const [claims, setClaims] = useState('0');
  const [valuePref, setValuePref] = useState('balanced');
  const [expiry, setExpiry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const policyDetails = {
      ncb,
      claims,
      valuePreference: valuePref,
      expiryDate: expiry
    };
    updateLead({ policyDetails });
    trackEvent('policy_details_completed', policyDetails);
    onNext();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="mb-2">A few more details</h2>
        <p className="text-muted">These help us calculate the best possible quote.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Current policy expiry date</label>
          <input 
            type="date" 
            className="input" 
            required 
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </div>

        <div>
          <label className="label">No Claim Bonus (NCB) percentage</label>
          <p className="text-xs text-muted mb-3">No Claim Bonus is the discount you get if you did not make a claim.</p>
          <div className="chip-group">
            {NCB_OPTIONS.map(opt => (
              <div 
                key={opt} 
                className={`chip ${ncb === opt ? 'active' : ''}`}
                onClick={() => setNcb(opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Claims in last 3 years</label>
          <div className="chip-group">
            {CLAIM_OPTIONS.map(opt => (
              <div 
                key={opt} 
                className={`chip ${claims === opt ? 'active' : ''}`}
                onClick={() => setClaims(opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Vehicle value (IDV) preference</label>
          <p className="text-xs text-muted mb-3">Vehicle value affects your premium and claim amount.</p>
          <div className="grid grid-cols-3 gap-2">
            {IDV_OPTIONS.map(opt => (
              <div 
                key={opt.value} 
                className={`chip text-center flex items-center justify-center ${valuePref === opt.value ? 'active' : ''}`}
                onClick={() => setValuePref(opt.value)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" className="btn btn-primary">
            Show my estimate
          </button>
        </div>
      </form>
    </div>
  );
}
