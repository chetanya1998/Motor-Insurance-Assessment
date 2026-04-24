"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { Check, ShieldCheck, Wrench, Cog, Droplets } from 'lucide-react';

const ADDONS = [
  { id: 'zerodep', name: 'Zero Depreciation', price: 1200, desc: 'Full claim amount without deduction for depreciation.', icon: ShieldCheck },
  { id: 'rsa', name: 'Roadside Assistance', price: 350, desc: '24x7 emergency roadside help for breakdowns.', icon: Wrench },
  { id: 'engine', name: 'Engine Protection', price: 800, desc: 'Covers damage to engine from water ingression.', icon: Cog },
  { id: 'consumables', name: 'Consumables Cover', price: 250, desc: 'Covers engine oil, bolts, etc. during claims.', icon: Droplets },
];

export default function AddOns({ onNext }: { onNext: () => void }) {
  const { lead, updateLead } = useLead();
  const { trackEvent } = useTracking();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter(a => a !== id) : [...selected, id];
    setSelected(next);
    trackEvent('addon_selected', { addonId: id, selected: !selected.includes(id) });
  };

  const total = () => {
    const base = lead.selectedPlan?.price || 0;
    const add = selected.reduce((s, id) => s + (ADDONS.find(a => a.id === id)?.price || 0), 0);
    return base + add;
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Recommended add-ons</h1>
        <p className="page-subtitle">Enhance your coverage for better protection.</p>
      </div>

      <div className="space-y">
        {ADDONS.map(a => {
          const active = selected.includes(a.id);
          const Icon = a.icon;
          return (
            <div key={a.id} className={`card card-elevated card-interactive ${active ? 'card-selected' : ''}`} onClick={() => toggle(a.id)}>
              <div className="addon-card">
                <div className={`addon-check ${active ? 'addon-check-active' : ''}`}>
                  {active && <Check size={14} />}
                </div>
                <div className="addon-info">
                  <div className="addon-header">
                    <span className="addon-name"><Icon size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />{a.name}</span>
                    <span className="addon-price">+₹{a.price}</span>
                  </div>
                  <div className="addon-desc">{a.desc}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky-cta">
        <div className="sticky-cta-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Final Premium</div>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text)' }}>₹{total().toLocaleString()}</div>
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {lead.selectedPlan?.insurer}<br />{selected.length} add-on{selected.length !== 1 ? 's' : ''} selected
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => { updateLead({ selectedAddons: selected }); onNext(); }}>
            Continue to Purchase →
          </button>
        </div>
      </div>
    </div>
  );
}
