"use client";
import React from 'react';
import { useLead } from '@/context/LeadContext';

export default function SuccessScreen() {
  const { lead, resetLead } = useLead();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center h-full animate-fade-in">
      <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 text-4xl">
        ✓
      </div>
      
      <h1 className="mb-4">Your application is ready</h1>
      <p className="text-muted mb-8 px-6">
        An insurance advisor will contact you shortly with the final policy confirmation and payment link.
      </p>

      <div className="card w-full mb-8 text-left">
        <h3 className="text-sm uppercase text-muted mb-3">Application Summary</h3>
        <div className="space-y-2">
            <div className="flex justify-between">
                <span className="text-sm text-muted">Lead ID</span>
                <span className="text-sm font-bold">{lead.id}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-sm text-muted">Vehicle</span>
                <span className="text-sm font-medium">{lead.vehicleDetails?.make} {lead.vehicleDetails?.model}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-sm text-muted">Selected Insurer</span>
                <span className="text-sm font-medium">{lead.selectedPlan?.insurer}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-sm text-muted">Policy Premium</span>
                <span className="text-sm font-bold text-primary">₹{lead.selectedPlan?.price.toLocaleString()}</span>
            </div>
        </div>
      </div>

      <button className="btn btn-outline" onClick={() => { resetLead(); window.location.reload(); }}>
        Back to Home
      </button>
    </div>
  );
}
