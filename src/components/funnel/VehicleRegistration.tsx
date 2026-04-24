"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { MockApi } from '@/services/MockApi';
import { Search, PenLine, AlertCircle } from 'lucide-react';

const MAKES = ['Maruti', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia'];
const MODELS: Record<string, string[]> = {
  Maruti: ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Alto', 'WagonR'],
  Hyundai: ['i20', 'Creta', 'Venue', 'Verna', 'Tucson'],
  Tata: ['Nexon', 'Punch', 'Harrier', 'Altroz', 'Safari'],
  Mahindra: ['XUV700', 'Thar', 'Scorpio', 'XUV300', 'Bolero'],
  Honda: ['City', 'Amaze', 'Elevate', 'WR-V'],
  Toyota: ['Innova', 'Fortuner', 'Glanza', 'Urban Cruiser'],
  Kia: ['Seltos', 'Sonet', 'Carens', 'EV6'],
};
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric'];
const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

export default function VehicleRegistration({ onNext, onManual }: { onNext: () => void; onManual: () => void }) {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [regNumber, setRegNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateLead, lead } = useLead();
  const { trackEvent } = useTracking();

  // Manual fields
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [year, setYear] = useState('');
  const [city, setCity] = useState('');

  const handleAutoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regNumber.trim()) { setError('Please enter your vehicle number'); return; }
    setLoading(true);
    trackEvent('registration_entered', { regNumber });
    try {
      const details = await MockApi.lookupVehicle(regNumber);
      updateLead({ registrationNumber: regNumber.toUpperCase(), vehicleDetails: details });
      trackEvent('vehicle_lookup_success', details);
      onNext();
    } catch (err: any) {
      setError('Vehicle not found. Try again or enter details manually.');
      updateLead({ validationErrorCount: lead.validationErrorCount + 1 });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !fuelType || !year) { setError('Please fill all vehicle details'); return; }
    const details = { registration: '', make, model, variant: 'Standard', fuelType, manufactureYear: year, city: city || 'N/A', rto: '' };
    updateLead({ registrationNumber: 'MANUAL', vehicleDetails: details });
    trackEvent('vehicle_manual_entry', details);
    onNext();
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Enter your vehicle details</h1>
        <p className="page-subtitle">We'll fetch everything automatically, or you can enter manually.</p>
      </div>

      {/* Tab Toggle */}
      <div className="tab-toggle" style={{ marginBottom: 24 }}>
        <button className={`tab-toggle-btn ${mode === 'auto' ? 'tab-toggle-btn-active' : ''}`} onClick={() => { setMode('auto'); setError(''); }}>
          <Search size={14} /> Registration Number
        </button>
        <button className={`tab-toggle-btn ${mode === 'manual' ? 'tab-toggle-btn-active' : ''}`} onClick={() => { setMode('manual'); setError(''); }}>
          <PenLine size={14} /> Enter Manually
        </button>
      </div>

      {mode === 'auto' ? (
        <form onSubmit={handleAutoSubmit}>
          <div className="card card-elevated" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Vehicle Registration Number</label>
              <input
                type="text"
                className={`form-input form-input-lg ${error ? 'form-input-error' : ''}`}
                placeholder="DL 09 CA 1234"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                disabled={loading}
                autoFocus
              />
              {error && <div className="form-error"><AlertCircle size={12} /> {error}</div>}
              <p className="form-hint" style={{ marginTop: 8 }}>Enter the number printed on your vehicle plate</p>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <span className="loader" />
              <div className="loading-text">Fetching vehicle details…</div>
              <div className="loading-subtext">Looking up RTO records for {regNumber}</div>
            </div>
          ) : (
            <div className="sticky-cta">
              <div className="sticky-cta-inner">
                <button type="submit" className="btn btn-primary" disabled={!regNumber.trim()}>
                  Fetch Vehicle Details →
                </button>
              </div>
            </div>
          )}
        </form>
      ) : (
        <form onSubmit={handleManualSubmit}>
          <div className="card card-elevated space-y-lg">
            <div className="form-group">
              <label className="form-label">Vehicle Make</label>
              <select className="form-input form-select" value={make} onChange={e => { setMake(e.target.value); setModel(''); }}>
                <option value="">Select make</option>
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle Model</label>
              <select className="form-input form-select" value={model} onChange={e => setModel(e.target.value)} disabled={!make}>
                <option value="">Select model</option>
                {(MODELS[make] || []).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fuel Type</label>
              <div className="chip-group">
                {FUEL_TYPES.map(f => (
                  <div key={f} className={`chip ${fuelType === f ? 'chip-active' : ''}`} onClick={() => setFuelType(f)}>{f}</div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Manufacture Year</label>
              <select className="form-input form-select" value={year} onChange={e => setYear(e.target.value)}>
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City of Registration</label>
              <input type="text" className="form-input" placeholder="e.g. Delhi, Mumbai" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            {error && <div className="form-error"><AlertCircle size={12} /> {error}</div>}
          </div>

          <div className="sticky-cta">
            <div className="sticky-cta-inner">
              <button type="submit" className="btn btn-primary" disabled={!make || !model || !fuelType || !year}>
                Continue →
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
