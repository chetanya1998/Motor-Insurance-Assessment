"use client";
import React from 'react';
import { useLead } from '@/context/LeadContext';
import { CheckCircle2, ArrowRight, PhoneCall, Mail, CalendarCheck } from 'lucide-react';

export default function SuccessScreen() {
  const { lead } = useLead();

  return (
    <div style={{ paddingTop: 20 }}>
      <div className="text-center">
        <div className="success-icon" style={{ background: 'var(--success-light)', color: 'var(--success)', margin: '0 auto 20px' }}>
          <CheckCircle2 size={48} />
        </div>
        <h1 className="page-title">Application Received!</h1>
        <p className="page-subtitle" style={{ marginTop: 8, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
          Namaste {lead.personalDetails?.name?.split(' ')[0] || 'User'}, your insurance application for {lead.vehicleDetails?.make} {lead.vehicleDetails?.model} has been successfully submitted.
        </p>
      </div>

      {/* Summary Card */}
      <div className="card card-elevated" style={{ marginTop: 32 }}>
        <div className="section-label">Policy Summary</div>
        <div className="detail-grid">
          <div className="detail-row"><span className="detail-key">Application ID</span><span className="detail-value">{lead.id.split('-')[0].toUpperCase()}</span></div>
          <div className="detail-row"><span className="detail-key">Insurer</span><span className="detail-value">{lead.selectedPlan?.insurer}</span></div>
          <div className="detail-row"><span className="detail-key">Final Premium</span><span className="detail-value" style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.125rem' }}>₹{lead.selectedPlan?.price?.toLocaleString()}</span></div>
        </div>
      </div>

      {/* What happens next */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>What happens next?</h3>
        <div className="space-y">
          <div className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}><PhoneCall size={20} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Expert Callback</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>An advisor will call you within 15 mins to verify details.</div>
            </div>
          </div>
          <div className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}><Mail size={20} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Digital Inspection</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>A link to upload vehicle photos will be sent to your email.</div>
            </div>
          </div>
          <div className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}><CalendarCheck size={20} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Policy Issuance</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Once verified, your digital policy will be issued instantly.</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32, paddingBottom: 40 }}>
        <button className="btn btn-secondary" onClick={() => window.location.href = '/'}>
          <ArrowRight size={14} /> Back to Home
        </button>
      </div>
    </div>
  );
}
