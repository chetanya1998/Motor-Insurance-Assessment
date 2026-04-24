"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { AlertCircle, User, Phone, Mail } from 'lucide-react';

export default function PersonalDetails({ onNext }: { onNext: () => void }) {
  const { updateLead, lead } = useLead();
  const { trackEvent } = useTracking();
  const [form, setForm] = useState({ name: '', mobile: '', email: '' });
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const e: any = {};
    if (!form.name) e.name = 'Full name is required';
    else if (/\d/.test(form.name)) e.name = 'Name should not contain numbers';
    if (!form.mobile) e.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      updateLead({ personalDetails: form });
      trackEvent('personal_details_submitted', form);
      onNext();
    } else {
      updateLead({ validationErrorCount: lead.validationErrorCount + 1 });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Almost there!</h1>
        <p className="page-subtitle">Share your details to unlock exact insurer prices and exclusive discounts.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card card-elevated space-y-lg">
          <div className="form-group">
            <label className="form-label"><User size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />Full Name</label>
            <input type="text" className={`form-input ${errors.name ? 'form-input-error' : ''}`} placeholder="Enter your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            {errors.name && <div className="form-error"><AlertCircle size={12} /> {errors.name}</div>}
          </div>
          <div className="form-group">
            <label className="form-label"><Phone size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />Mobile Number</label>
            <input type="tel" className={`form-input ${errors.mobile ? 'form-input-error' : ''}`} placeholder="9876543210" maxLength={10} value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value.replace(/\D/g, '')})} />
            {errors.mobile && <div className="form-error"><AlertCircle size={12} /> {errors.mobile}</div>}
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label"><Mail size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />Email Address</label>
            <input type="email" className={`form-input ${errors.email ? 'form-input-error' : ''}`} placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            {errors.email && <div className="form-error"><AlertCircle size={12} /> {errors.email}</div>}
          </div>
        </div>

        <div className="sticky-cta">
          <div className="sticky-cta-inner">
            <button type="submit" className="btn btn-primary">Show exact quotes →</button>
          </div>
        </div>
      </form>
    </div>
  );
}
