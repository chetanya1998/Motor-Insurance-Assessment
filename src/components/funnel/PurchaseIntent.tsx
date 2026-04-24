"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';

export default function PurchaseIntent({ onNext }: { onNext: () => void }) {
  const { updateLead, submitLead } = useLead();
  const { trackEvent } = useTracking();
  
  const [formData, setFormData] = useState({
    dob: '',
    prevInsurer: '',
    nomineeName: '',
    nomineeRelation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLead({ purchaseDetails: formData });
    trackEvent('purchase_details_completed', formData);
    submitLead();
    onNext();
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-6">
        <h2 className="mb-1">Final policy details</h2>
        <p className="text-sm text-muted">Required for policy issuance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="input-group">
          <label className="label">Owner's Date of Birth</label>
          <input 
            type="date" 
            className="input" 
            required
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
          />
        </div>

        <div className="input-group">
          <label className="label">Previous Insurer Name</label>
          <select 
            className="input" 
            required
            value={formData.prevInsurer}
            onChange={(e) => setFormData({...formData, prevInsurer: e.target.value})}
          >
            <option value="">Select Insurer</option>
            <option value="HDFC Ergo">HDFC Ergo</option>
            <option value="ICICI Lombard">ICICI Lombard</option>
            <option value="Tata AIG">Tata AIG</option>
            <option value="Digit">Digit</option>
            <option value="Others">Others / Not Sure</option>
          </select>
        </div>

        <div className="input-group">
          <label className="label">Nominee Name</label>
          <input 
            type="text" 
            className="input" 
            placeholder="Name of nominee"
            required
            value={formData.nomineeName}
            onChange={(e) => setFormData({...formData, nomineeName: e.target.value})}
          />
        </div>

        <div className="input-group">
          <label className="label">Nominee Relationship</label>
          <select 
            className="input" 
            required
            value={formData.nomineeRelation}
            onChange={(e) => setFormData({...formData, nomineeRelation: e.target.value})}
          >
            <option value="">Select Relation</option>
            <option value="Spouse">Spouse</option>
            <option value="Parent">Parent</option>
            <option value="Child">Child</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="sticky-bottom mt-8">
          <button type="submit" className="btn btn-primary">
            Complete Application
          </button>
        </div>
      </form>
    </div>
  );
}
