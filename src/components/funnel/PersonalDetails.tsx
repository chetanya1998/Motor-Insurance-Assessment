"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { AlertCircle, User, Phone, Mail } from 'lucide-react';
import Tooltip from '@/components/Tooltip';

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
    else if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Must be 10 digits starting with 6, 7, 8 or 9';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) { updateLead({ personalDetails: form }); trackEvent('personal_details_submitted', form); onNext(); }
    else { updateLead({ validationErrorCount: lead.validationErrorCount + 1 }); }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Almost there!</h1>
        <p className="page-subtitle">Share your details to unlock exact insurer prices and exclusive discounts.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card card-elevated">
          <div className="form-group">
            <label className="form-label"><User size={13} /> Full Name <Tooltip text="Enter your full name as it appears on your Aadhaar card or PAN card. This will be used on your insurance policy document. Example: Rajesh Kumar Sharma" /></label>
            <input type="text" className={`form-input ${errors.name ? 'form-input-error' : ''}`} placeholder="e.g. Rajesh Kumar Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            {errors.name && <div className="form-error"><AlertCircle size={12} /> {errors.name}</div>}
            <p className="form-hint">As per your Aadhaar/PAN card</p>
          </div>
          <div className="form-group">
            <label className="form-label"><Phone size={13} /> Mobile Number <Tooltip text="Your 10-digit Indian mobile number. We'll send you quote details and policy documents via WhatsApp/SMS. Example: 9876543210. No international numbers." /></label>
            <input type="tel" className={`form-input ${errors.mobile ? 'form-input-error' : ''}`} placeholder="e.g. 9876543210" maxLength={10} value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value.replace(/\D/g, '')})} />
            {errors.mobile && <div className="form-error"><AlertCircle size={12} /> {errors.mobile}</div>}
            <p className="form-hint">10-digit number starting with 6, 7, 8, or 9</p>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label"><Mail size={13} /> Email Address <Tooltip text="We'll send your policy document and quote comparison to this email. Use your personal email for easy access. Example: rajesh.sharma@gmail.com" /></label>
            <input type="email" className={`form-input ${errors.email ? 'form-input-error' : ''}`} placeholder="e.g. rajesh.sharma@gmail.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            {errors.email && <div className="form-error"><AlertCircle size={12} /> {errors.email}</div>}
            <p className="form-hint">Policy documents will be sent here</p>
          </div>
        </div>
        <div className="sticky-cta"><div className="sticky-cta-inner"><button type="submit" className="btn btn-primary">Show Exact Quotes →</button></div></div>
      </form>
    </div>
  );
}
