"use client";
import React, { useState, useEffect } from 'react';
import { useLead } from '@/context/LeadContext';
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

export enum Step {
  Landing = 0,
  VehicleRegistration = 1,
  VehicleConfirmation = 2,
  PolicyDetails = 3,
  EstimatedQuote = 4,
  PersonalDetails = 5,
  ExactQuotes = 6,
  AddOns = 7,
  PurchaseIntent = 8,
  Success = 9
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Landing);
  const { trackEvent } = useTracking();

  const nextStep = () => {
    setCurrentStep(prev => {
      const next = (prev + 1) as Step;
      return next;
    });
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => (prev - 1) as Step);
    window.scrollTo(0, 0);
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const progress = ((currentStep) / (Object.keys(Step).length / 2 - 1)) * 100;

  return (
    <main className="flex flex-col min-h-screen">
      {currentStep !== Step.Landing && currentStep !== Step.Success && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className="container">
        <header className="flex justify-between items-center py-4 mb-4">
            <div className="font-bold text-xl text-primary">SecureDrive</div>
            <Link href="/admin" className="text-sm text-muted">Admin</Link>
        </header>

        <div className="flex-1 animate-fade-in">
          {currentStep === Step.Landing && <LandingScreen onStart={() => { trackEvent('quote_started'); nextStep(); }} />}
          {currentStep === Step.VehicleRegistration && <VehicleRegistration onNext={nextStep} />}
          {currentStep === Step.VehicleConfirmation && <VehicleConfirmation onNext={nextStep} onEdit={() => goToStep(Step.VehicleRegistration)} />}
          {currentStep === Step.PolicyDetails && <PolicyDetails onNext={nextStep} />}
          {currentStep === Step.EstimatedQuote && <EstimatedQuote onNext={nextStep} />}
          {currentStep === Step.PersonalDetails && <PersonalDetails onNext={nextStep} />}
          {currentStep === Step.ExactQuotes && <ExactQuotes onNext={nextStep} />}
          {currentStep === Step.AddOns && <AddOns onNext={nextStep} />}
          {currentStep === Step.PurchaseIntent && <PurchaseIntent onNext={nextStep} />}
          {currentStep === Step.Success && <SuccessScreen />}
        </div>
      </div>
    </main>
  );
}
