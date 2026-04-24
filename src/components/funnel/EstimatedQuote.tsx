"use client";
import React, { useEffect, useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { MockApi } from '@/services/MockApi';

export default function EstimatedQuote({ onNext }: { onNext: () => void }) {
  const { lead, updateLead } = useLead();
  const { trackEvent } = useTracking();
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      const res = await MockApi.generateQuoteRange(lead.vehicleDetails, lead.policyDetails);
      setQuote(res);
      updateLead({ quoteRange: res });
      trackEvent('quote_range_generated', res);
      setLoading(false);
    };
    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="loader mb-6"></span>
        <h2>Calculating your estimate...</h2>
        <p className="text-muted">Comparing 15+ insurers</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-4 text-center">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">Estimate Ready</p>
        <h2 className="mt-1">Your estimated quote range</h2>
        <div className="quote-range">₹{quote.min.toLocaleString()} – ₹{quote.max.toLocaleString()}</div>
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          {quote.confidence} Confidence
        </div>
      </div>

      <div className="card bg-primary-light border-primary/20 mt-6">
        <h3 className="text-sm uppercase text-primary mb-3">Based on:</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-muted">Vehicle</span>
          <span className="font-medium text-right">{quote.basis.vehicle}</span>
          <span className="text-muted">City</span>
          <span className="font-medium text-right">{quote.basis.city}</span>
          <span className="text-muted">NCB</span>
          <span className="font-medium text-right">{quote.basis.ncb}</span>
          <span className="text-muted">Claims</span>
          <span className="font-medium text-right">{quote.basis.claims}</span>
        </div>
      </div>

      <div className="space-y-3 mt-8">
        {quote.plans.map((plan: any) => (
          <div key={plan.name} className="card flex justify-between items-center py-4">
            <div>
              <h4 className="font-semibold">{plan.name}</h4>
              <p className="text-xs text-muted">Estimated from</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">₹{plan.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky-bottom mt-8">
        <button className="btn btn-primary" onClick={() => { trackEvent('unlock_exact_quotes_clicked'); onNext(); }}>
          Unlock exact quotes
        </button>
      </div>
    </div>
  );
}
