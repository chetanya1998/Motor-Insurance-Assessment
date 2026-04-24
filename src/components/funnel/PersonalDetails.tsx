"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';

export default function PersonalDetails({ onNext }: { onNext: () => void }) {
  const { updateLead, lead } = useLead();
  const { trackEvent } = useTracking();
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: ''
  });
  
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    
    // Name validation
    if (!formData.name) newErrors.name = 'Full name is required';
    else if (/\d/.test(formData.name)) newErrors.name = 'Name should not contain numbers';
    
    // Mobile validation
    if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = 'Enter a valid 10-digit mobile number';
    
    // Email validation
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      updateLead({ personalDetails: formData });
      trackEvent('personal_details_submitted', formData);
      onNext();
    } else {
      updateLead({ validationErrorCount: lead.validationErrorCount + 1 });
      trackEvent('validation_error', { form: 'personal_details', errors });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="mb-2">One last step to exact quotes</h2>
        <p className="text-muted">Share your details to see exact insurer prices and available discounts.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="input-group">
          <label className="label">Full Name</label>
          <input 
            type="text" 
            className={`input ${errors.name ? 'border-error' : ''}`}
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="input-group">
          <label className="label">Mobile Number</label>
          <input 
            type="tel" 
            className={`input ${errors.mobile ? 'border-error' : ''}`}
            placeholder="9876543210"
            maxLength={10}
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
          />
          {errors.mobile && <p className="text-error text-xs mt-1">{errors.mobile}</p>}
        </div>

        <div className="input-group">
          <label className="label">Email Address</label>
          <input 
            type="email" 
            className={`input ${errors.email ? 'border-error' : ''}`}
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="sticky-bottom mt-8">
          <button type="submit" className="btn btn-primary">
            Show exact quotes
          </button>
        </div>
      </form>
    </div>
  );
}
