"use client";
import React, { useEffect, useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { MockApi } from '@/services/MockApi';

export default function ExactQuotes({ onNext }: { onNext: () => void }) {
  const { lead, updateLead } = useLead();
  const { trackEvent } = useTracking();
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await MockApi.getExactQuotes(lead.personalDetails, lead.policyDetails) as any[];
      setQuotes(res);
      updateLead({ exactQuotes: res });
      trackEvent('exact_quotes_viewed', res);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="loading-state" style={{ minHeight: 300 }}>
        <span className="loader" />
        <div className="loading-text">Fetching exact quotes…</div>
        <div className="loading-subtext">Negotiating best prices from insurers</div>
      </div>
    );
  }

  const handleSelect = (q: any) => {
    updateLead({ selectedPlan: q });
    trackEvent('plan_selected', q);
    onNext();
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Your exact quotes</h1>
        <p className="page-subtitle">Prices are inclusive of GST. Select a plan to continue.</p>
      </div>

      <div className="space-y-lg">
        {quotes.map((q, i) => (
          <div key={q.id} className="card card-elevated plan-card">
            {i === 0 && <div className="plan-card-badge plan-card-badge-green">Best Value</div>}
            <div className="plan-card-header">
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.0625rem' }}>{q.insurer}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginTop: 2 }}>{q.coverType}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="plan-card-price">₹{q.price.toLocaleString()}</div>
                <div className="plan-card-price-label">per year</div>
              </div>
            </div>
            <div className="detail-row" style={{ paddingTop: 0 }}>
              <span className="detail-key">IDV</span>
              <span className="detail-value">₹{q.idv.toLocaleString()}</span>
            </div>
            <div className="plan-card-tags">
              {q.addons.map((a: string) => <span key={a} className="plan-tag">{a}</span>)}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => handleSelect(q)}>Select Plan →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
