"use client";
import React from 'react';
import { useLead } from '@/context/LeadContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function SuccessScreen() {
  const { lead } = useLead();

  return (
    <div style={{ paddingTop: 40 }}>
      <div className="text-center">
        <div className="success-icon"><CheckCircle2 size={36} /></div>
        <h1 className="page-title">Application submitted!</h1>
        <p className="page-subtitle" style={{ marginTop: 8, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
          An insurance advisor will contact you shortly with the final policy confirmation and payment link.
        </p>
      </div>

      <div className="card card-elevated" style={{ marginTop: 32 }}>
        <div className="section-label">Application Summary</div>
        <div className="detail-grid">
          <div className="detail-row"><span className="detail-key">Lead ID</span><span className="detail-value">{lead.id}</span></div>
          <div className="detail-row"><span className="detail-key">Vehicle</span><span className="detail-value">{lead.vehicleDetails?.make} {lead.vehicleDetails?.model}</span></div>
          <div className="detail-row"><span className="detail-key">Insurer</span><span className="detail-value">{lead.selectedPlan?.insurer}</span></div>
          <div className="detail-row"><span className="detail-key">Premium</span><span className="detail-value" style={{ color: 'var(--primary)', fontWeight: 800 }}>₹{lead.selectedPlan?.price?.toLocaleString()}</span></div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>
          <ArrowRight size={14} /> Start New Quote
        </button>
      </div>
    </div>
  );
}
