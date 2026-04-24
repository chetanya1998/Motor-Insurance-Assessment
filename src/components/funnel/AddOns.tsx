"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';

const ADDONS = [
  { id: 'zerodep', name: 'Zero Depreciation', price: 1200, desc: 'Get full claim amount without deduction for depreciation.' },
  { id: 'rsa', name: 'Roadside Assistance', price: 350, desc: '24x7 emergency roadside help for breakdowns.' },
  { id: 'engine', name: 'Engine Protection', price: 800, desc: 'Covers damage to engine due to water ingression/leakage.' },
  { id: 'consumables', name: 'Consumables Cover', price: 250, desc: 'Covers cost of bolts, engine oil, etc. during claims.' }
];

export default function AddOns({ onNext }: { onNext: () => void }) {
  const { lead, updateLead } = useLead();
  const { trackEvent } = useTracking();
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const toggleAddon = (id: string) => {
    const newSelected = selectedAddons.includes(id)
      ? selectedAddons.filter(a => a !== id)
      : [...selectedAddons, id];
    setSelectedAddons(newSelected);
    trackEvent('addon_selected', { addonId: id, selected: !selectedAddons.includes(id) });
  };

  const calculateTotal = () => {
    const basePrice = lead.selectedPlan?.price || 0;
    const addonsPrice = selectedAddons.reduce((sum, id) => {
      const addon = ADDONS.find(a => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);
    return basePrice + addonsPrice;
  };

  const handleContinue = () => {
    updateLead({ selectedAddons });
    onNext();
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-6">
        <h2 className="mb-1">Recommended add-ons</h2>
        <p className="text-sm text-muted">Customize your plan for better protection</p>
      </div>

      <div className="space-y-3 mb-24">
        {ADDONS.map(addon => (
          <div 
            key={addon.id} 
            className={`card flex gap-4 cursor-pointer transition-all ${selectedAddons.includes(addon.id) ? 'border-primary bg-primary-light/30' : ''}`}
            onClick={() => toggleAddon(addon.id)}
          >
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold">{addon.name}</h4>
                <span className="text-primary font-bold">+₹{addon.price}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{addon.desc}</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedAddons.includes(addon.id) ? 'bg-primary border-primary text-white' : 'border-border'}`}>
              {selectedAddons.includes(addon.id) && <span className="text-[10px]">✓</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky-bottom bg-white">
        <div className="flex justify-between items-center mb-4 px-1">
          <div>
            <p className="text-xs text-muted">Final Premium</p>
            <h3 className="text-xl font-bold">₹{calculateTotal().toLocaleString()}</h3>
          </div>
          <p className="text-[10px] text-muted text-right">Selected Plan: {lead.selectedPlan?.insurer}</p>
        </div>
        <button className="btn btn-primary" onClick={handleContinue}>
          Continue to Purchase
        </button>
      </div>
    </div>
  );
}
