"use client";
import React from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { CheckCircle2, Pencil, Car, Fuel, Calendar, MapPin } from 'lucide-react';

export default function VehicleConfirmation({ onNext, onEdit }: { onNext: () => void; onEdit: () => void }) {
  const { lead } = useLead();
  const { trackEvent } = useTracking();
  const d = lead.vehicleDetails || { make: 'Maruti', model: 'Swift', variant: 'VXi', fuelType: 'Petrol', manufactureYear: '2020', city: 'Delhi' };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Confirm your vehicle</h1>
        <p className="page-subtitle">Make sure these details match your vehicle.</p>
      </div>

      {/* Hero Card */}
      <div className="vehicle-hero">
        {lead.registrationNumber && lead.registrationNumber !== 'MANUAL' && (
          <div className="vehicle-hero-reg">{lead.registrationNumber}</div>
        )}
        <div className="vehicle-hero-name">{d.make} {d.model}</div>
        <div className="vehicle-hero-meta">{d.variant} · {d.fuelType} · {d.manufactureYear}</div>
      </div>

      {/* Details Card */}
      <div className="card card-elevated">
        <div className="section-label">Vehicle Details</div>
        <div className="detail-grid">
          <div className="detail-row">
            <span className="detail-key"><Car size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />Make</span>
            <span className="detail-value">{d.make}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Model</span>
            <span className="detail-value">{d.model}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Variant</span>
            <span className="detail-value">{d.variant}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key"><Fuel size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />Fuel Type</span>
            <span className="detail-value">{d.fuelType}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key"><Calendar size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />Year</span>
            <span className="detail-value">{d.manufactureYear}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key"><MapPin size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />City</span>
            <span className="detail-value">{d.city}</span>
          </div>
        </div>
      </div>

      <div className="sticky-cta">
        <div className="sticky-cta-inner" style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={onEdit} style={{ flex: '0 0 auto', width: 'auto', padding: '14px 20px' }}>
            <Pencil size={14} /> Edit
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { trackEvent('vehicle_details_confirmed'); onNext(); }}>
            <CheckCircle2 size={16} /> Looks correct
          </button>
        </div>
      </div>
    </div>
  );
}
