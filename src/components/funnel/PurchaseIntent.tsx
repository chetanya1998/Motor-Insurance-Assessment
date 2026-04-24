"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import Tooltip from '@/components/Tooltip';
import { Calendar, UserCircle, Users } from 'lucide-react';

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
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Final details</h1>
        <p className="page-subtitle">Just a few more legal details required for your policy issuance.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card card-elevated">
          <div className="form-group">
            <label className="form-label">
              <Calendar size={13} /> Owner&apos;s Date of Birth
              <Tooltip text="The birth date of the vehicle owner as mentioned on the RC book and Aadhaar. User must be 18+ to own a vehicle insurance policy." />
            </label>
            <input type="date" className="form-input" required value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
            <p className="form-hint">Must match your Aadhaar card</p>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Previous Insurer
              <Tooltip text="The insurance company that issued your last/current policy. If this is a new vehicle, select 'New Vehicle'." />
            </label>
            <select className="form-input form-select" required value={form.prevInsurer} onChange={e => setForm({...form, prevInsurer: e.target.value})}>
              <option value="">Select previous company</option>
              <option value="New Vehicle">New Vehicle (First Time Insurance)</option>
              <option value="HDFC Ergo">HDFC Ergo</option>
              <option value="ICICI Lombard">ICICI Lombard</option>
              <option value="Tata AIG">Tata AIG</option>
              <option value="Digit">Digit General Insurance</option>
              <option value="Bajaj Allianz">Bajaj Allianz</option>
              <option value="United India">United India Insurance</option>
              <option value="Others">Others / Not Sure</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <UserCircle size={13} /> Nominee Full Name
              <Tooltip text="In case of an unfortunate event, the insurance claim will be paid to this person. Enter their full legal name. Example: Sunita Sharma" />
            </label>
            <input type="text" className="form-input" placeholder="e.g. Sunita Sharma" required value={form.nomineeName} onChange={e => setForm({...form, nomineeName: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Users size={13} /> Nominee Relationship
              <Tooltip text="Select how the nominee is related to the vehicle owner." />
            </label>
            <select className="form-input form-select" required value={form.nomineeRelation} onChange={e => setForm({...form, nomineeRelation: e.target.value})}>
              <option value="">Select relationship</option>
              <option value="Spouse">Spouse (Husband/Wife)</option>
              <option value="Parent">Parent (Father/Mother)</option>
              <option value="Child">Child (Son/Daughter)</option>
              <option value="Sibling">Sibling (Brother/Sister)</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="sticky-cta">
          <div className="sticky-cta-inner">
            <button type="submit" className="btn btn-primary">Complete Application ✓</button>
            <p style={{ textAlign: 'center', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 8 }}>
              Secure 256-bit encrypted checkout
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
