"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LeadData, calculateLeadScore } from '../services/ScoringService';
import { useTracking } from './TrackingContext';

interface LeadContextType {
  lead: LeadData;
  updateLead: (updates: Partial<LeadData>) => void;
  submitLead: () => void;
  resetLead: () => void;
}

const initialLead: LeadData = {
  id: '',
  validationErrorCount: 0,
  isCompleted: false,
};

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [lead, setLead] = useState<LeadData>(initialLead);
  const { getTotalTimeMs, trackEvent } = useTracking();

  useEffect(() => {
    setLead(prev => ({ ...prev, id: `L-${Math.floor(Math.random() * 1000000)}` }));
  }, []);

  const updateLead = (updates: Partial<LeadData>) => {
    setLead(prev => ({ ...prev, ...updates }));
    if (updates.validationErrorCount && updates.validationErrorCount > lead.validationErrorCount) {
        trackEvent('validation_error', { count: updates.validationErrorCount });
    }
  };

  const submitLead = () => {
    const finalLead = { ...lead, isCompleted: true };
    const totalTime = getTotalTimeMs();
    const scoringResult = calculateLeadScore(finalLead, totalTime);
    
    const leadToStore = {
      ...finalLead,
      score: scoringResult.score,
      riskLevel: scoringResult.riskLevel,
      reasons: scoringResult.reasons,
      totalTimeMs: totalTime,
      submittedAt: new Date().toISOString()
    };

    // Store in localStorage for Admin Dashboard
    try {
      const storedLeads = JSON.parse(localStorage.getItem('insurance_leads') || '[]');
      storedLeads.push(leadToStore);
      localStorage.setItem('insurance_leads', JSON.stringify(storedLeads));
      trackEvent('application_completed', { leadId: lead.id });
    } catch (e) {
      console.error("Failed to save lead", e);
    }
    
    setLead(finalLead);
  };

  const resetLead = () => {
    setLead({ ...initialLead, id: `L-${Math.floor(Math.random() * 1000000)}` });
  };

  return (
    <LeadContext.Provider value={{ lead, updateLead, submitLead, resetLead }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLead() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLead must be used within a LeadProvider');
  }
  return context;
}
