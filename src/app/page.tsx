"use client";
import React, { useState } from 'react';
import { useTracking } from '@/context/TrackingContext';
import LandingScreen from '@/components/funnel/LandingScreen';
import VehicleRegistration from '@/components/funnel/VehicleRegistration';
import VehicleConfirmation from '@/components/funnel/VehicleConfirmation';
import PolicyDetails from '@/components/funnel/PolicyDetails';
import EstimatedQuote from '@/components/funnel/EstimatedQuote';
import PersonalDetails from '@/components/funnel/PersonalDetails';
import ExactQuotes from '@/components/funnel/ExactQuotes';
import AddOns from '@/components/funnel/AddOns';
import PurchaseIntent from '@/components/funnel/PurchaseIntent';
import SuccessScreen from '@/components/funnel/SuccessScreen';
import Link from 'next/link';
import { Shield, ChevronLeft, Settings } from 'lucide-react';

const STEPS = [
  { id: 0, label: 'Welcome' },
  { id: 1, label: 'Vehicle Info' },
  { id: 2, label: 'Confirm Vehicle' },
  { id: 3, label: 'Policy Details' },
  { id: 4, label: 'Estimated Quote' },
  { id: 5, label: 'Your Details' },
  { id: 6, label: 'Exact Quotes' },
  { id: 7, label: 'Add-ons' },
  { id: 8, label: 'Purchase' },
  { id: 9, label: 'Complete' },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const { trackEvent } = useTracking();

  const next = () => { setStep(s => s + 1); window.scrollTo(0, 0); };
  const prev = () => { setStep(s => Math.max(0, s - 1)); window.scrollTo(0, 0); };
  const goTo = (s: number) => { setStep(s); window.scrollTo(0, 0); };

  const progress = step === 0 || step === 9 ? 0 : Math.round((step / 8) * 100);

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="app-logo">
          <Shield size={22} />
          SecureDrive
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {step === 0 && (
            <button className="btn btn-primary btn-sm" onClick={() => { trackEvent('header_cta_clicked'); next(); }} style={{ width: 'auto', padding: '8px 16px' }}>
              Start Quote
            </button>
          )}
          <Link href="/admin" className="admin-link">
            <Settings size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
            Admin
          </Link>
        </div>
      </header>

      {/* Step Progress Bar */}
      {step > 0 && step < 9 && (
        <div className="step-progress">
          <div className="step-progress-inner">
            <button className="step-back-btn" onClick={prev} aria-label="Go back">
              <ChevronLeft size={20} />
            </button>
            <div className="step-info">
              <div className="step-number">{step}</div>
              <div>
                <div className="step-label">{STEPS[step].label}</div>
                <div className="step-sublabel">Step {step} of 8</div>
              </div>
            </div>
            <div className="step-bar-track">
              <div className="step-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="app-content">
        <div className="animate-in" key={step}>
          {step === 0 && <LandingScreen onStart={() => { trackEvent('quote_started'); next(); }} />}
          {step === 1 && <VehicleRegistration onNext={next} onManual={() => goTo(2)} />}
          {step === 2 && <VehicleConfirmation onNext={next} onEdit={() => goTo(1)} />}
          {step === 3 && <PolicyDetails onNext={next} />}
          {step === 4 && <EstimatedQuote onNext={next} />}
          {step === 5 && <PersonalDetails onNext={next} />}
          {step === 6 && <ExactQuotes onNext={next} />}
          {step === 7 && <AddOns onNext={next} />}
          {step === 8 && <PurchaseIntent onNext={next} />}
          {step === 9 && <SuccessScreen />}
        </div>
      </div>
    </div>
  );
}
