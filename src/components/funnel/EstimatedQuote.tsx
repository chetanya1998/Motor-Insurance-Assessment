"use client";
import React, { useEffect, useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { MockApi } from '@/services/MockApi';
import { Unlock } from 'lucide-react';

export default function EstimatedQuote({ onNext }: { onNext: () => void }) {
  const { lead, updateLead } = useLead();
  const { trackEvent } = useTracking();
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await MockApi.generateQuoteRange(lead.vehicleDetails, lead.policyDetails);
      setQuote(res);
      updateLead({ quoteRange: res });
      trackEvent('quote_range_generated', res);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="loading-state" style={{ minHeight: 300 }}>
        <span className="loader" />
        <div className="loading-text">Calculating your estimate…</div>
        <div className="loading-subtext">Comparing 15+ insurers for best rates</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center" style={{ marginBottom: 24 }}>
        <div className="section-label" style={{ color: 'var(--primary)' }}>Estimate Ready</div>
        <h1 className="page-title">Your estimated quote</h1>
        <div className="quote-range-display">₹{quote.min.toLocaleString()} – ₹{quote.max.toLocaleString()}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>per year</div>
        <div className="confidence-badge confidence-high" style={{ marginTop: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          {quote.confidence} Confidence
        </div>
      </div>

      {/* Basis Card */}
      <div className="card" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary-50)', marginBottom: 20 }}>
        <div className="section-label" style={{ color: 'var(--primary)' }}>Based on</div>
        <div className="detail-grid">
          <div className="detail-row"><span className="detail-key">Vehicle</span><span className="detail-value">{quote.basis.vehicle}</span></div>
          <div className="detail-row"><span className="detail-key">Fuel</span><span className="detail-value">{quote.basis.fuelType}</span></div>
          <div className="detail-row"><span className="detail-key">City</span><span className="detail-value">{quote.basis.city}</span></div>
          <div className="detail-row"><span className="detail-key">NCB</span><span className="detail-value">{quote.basis.ncb}</span></div>
          <div className="detail-row"><span className="detail-key">Claims</span><span className="detail-value">{quote.basis.claims}</span></div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="space-y">
        {quote.plans.map((p: any, i: number) => (
          <div key={p.name} className={`card card-elevated ${i === 1 ? 'card-selected' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Starts from</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>₹{p.price.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky-cta">
        <div className="sticky-cta-inner">
          <button className="btn btn-primary" onClick={() => { trackEvent('unlock_exact_quotes_clicked'); onNext(); }}>
            <Unlock size={16} /> Unlock exact quotes
          </button>
        </div>
      </div>
    </div>
  );
}
