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
    const fetchExactQuotes = async () => {
      const res = await MockApi.getExactQuotes(lead.personalDetails, lead.policyDetails) as any[];
      setQuotes(res);
      updateLead({ exactQuotes: res });
      trackEvent('exact_quotes_viewed', res);
      setLoading(false);
    };
    fetchExactQuotes();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="loader mb-6"></span>
        <h2>Fetching exact quotes...</h2>
        <p className="text-muted">Negotiating best prices for you</p>
      </div>
    );
  }

  const handleSelect = (quote: any) => {
    updateLead({ selectedPlan: quote });
    trackEvent('plan_selected', quote);
    onNext();
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-6">
        <h2 className="mb-1">Exact quotes for you</h2>
        <p className="text-sm text-muted">Prices are inclusive of GST</p>
      </div>

      <div className="space-y-4">
        {quotes.map((q) => (
          <div key={q.id} className="card relative overflow-hidden">
            {q.coverType === 'Lowest price' && (
                <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">Best Value</div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg">{q.insurer}</h3>
                <p className="text-xs text-accent font-semibold uppercase">{q.coverType}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">₹{q.price.toLocaleString()}</p>
                <p className="text-[10px] text-muted">IDV: ₹{q.idv.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {q.addons.map((addon: string) => (
                <span key={addon} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">{addon}</span>
              ))}
            </div>

            <button className="btn btn-primary btn-sm" onClick={() => handleSelect(q)}>
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
