"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { MockApi } from '@/services/MockApi';

export default function VehicleRegistration({ onNext }: { onNext: () => void }) {
  const [regNumber, setRegNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateLead, lead } = useLead();
  const { trackEvent } = useTracking();

  const validateVehicleNumber = (num: string) => {
    // Basic Indian vehicle number format: DL01CA1234
    const regex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/i;
    return regex.test(num);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regNumber) {
      setError('Please enter your vehicle number');
      return;
    }

    // if (!validateVehicleNumber(regNumber)) {
    //   updateLead({ validationErrorCount: lead.validationErrorCount + 1 });
    //   trackEvent('validation_error', { field: 'vehicle_number', value: regNumber });
    //   // Note: We'll still allow them to try or show error based on user requirement
    //   // But we'll track the error for scoring.
    // }

    setLoading(true);
    trackEvent('registration_entered', { regNumber });

    try {
      const details = await MockApi.lookupVehicle(regNumber);
      updateLead({ registrationNumber: regNumber.toUpperCase(), vehicleDetails: details });
      trackEvent('vehicle_lookup_success', details);
      onNext();
    } catch (err: any) {
      setError(err.message || 'Could not fetch vehicle details. Please check the number.');
      updateLead({ validationErrorCount: lead.validationErrorCount + 1 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="mb-2">What is your vehicle registration number?</h2>
        <p className="text-muted">We'll fetch your vehicle details automatically.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label">Registration Number</label>
            <input 
              type="text" 
              className="input text-center text-xl font-bold uppercase tracking-widest" 
              placeholder="DL09CA1234"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
              disabled={loading}
              autoFocus
            />
            {error && <p className="text-error text-sm mt-2">{error}</p>}
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-4">
              <span className="loader mb-4"></span>
              <p className="text-muted animate-pulse">Fetching vehicle details...</p>
            </div>
          ) : (
            <div className="sticky-bottom-inline mt-4">
               <button type="submit" className="btn btn-primary" disabled={!regNumber}>
                  Continue
                </button>
            </div>
          )}
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted">Don't have your number handy? <button className="text-primary font-medium" type="button" onClick={() => onNext()}>Enter details manually</button></p>
      </div>
    </div>
  );
}
