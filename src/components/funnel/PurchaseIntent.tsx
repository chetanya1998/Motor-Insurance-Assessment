"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';

export default function PurchaseIntent({ onNext }: { onNext: () => void }) {
  const { updateLead, submitLead } = useLead();
  const { trackEvent } = useTracking();
  const [form, setForm] = useState({ dob: '', prevInsurer: '', nomineeName: '', nomineeRelation: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLead({ purchaseDetails: form });
    trackEvent('purchase_details_completed', form);
    submitLead();
    onNext();
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Final details</h1>
        <p className="page-subtitle">Required for policy issuance. Almost done!</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card card-elevated space-y-lg">
          <div className="form-group">
            <label className="form-label">Owner&apos;s Date of Birth</label>
            <input type="date" className="form-input" required value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Previous Insurer</label>
            <select className="form-input form-select" required value={form.prevInsurer} onChange={e => setForm({...form, prevInsurer: e.target.value})}>
              <option value="">Select insurer</option>
              <option value="HDFC Ergo">HDFC Ergo</option>
              <option value="ICICI Lombard">ICICI Lombard</option>
              <option value="Tata AIG">Tata AIG</option>
              <option value="Digit">Digit</option>
              <option value="Others">Others / Not Sure</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nominee Name</label>
            <input type="text" className="form-input" placeholder="Name of nominee" required value={form.nomineeName} onChange={e => setForm({...form, nomineeName: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Nominee Relationship</label>
            <select className="form-input form-select" required value={form.nomineeRelation} onChange={e => setForm({...form, nomineeRelation: e.target.value})}>
              <option value="">Select relation</option>
              <option value="Spouse">Spouse</option>
              <option value="Parent">Parent</option>
              <option value="Child">Child</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="sticky-cta">
          <div className="sticky-cta-inner">
            <button type="submit" className="btn btn-primary">Complete Application ✓</button>
          </div>
        </div>
      </form>
    </div>
  );
}
