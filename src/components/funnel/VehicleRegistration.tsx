"use client";
import React, { useState } from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';
import { MockApi } from '@/services/MockApi';
import { Search, PenLine, AlertCircle } from 'lucide-react';
import Tooltip from '@/components/Tooltip';

const MAKES = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'MG', 'Skoda', 'Volkswagen'];
const MODELS: Record<string, string[]> = {
  'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Alto', 'WagonR', 'Dzire', 'Celerio', 'S-Presso', 'XL6'],
  Hyundai: ['i20', 'Creta', 'Venue', 'Verna', 'Tucson', 'Aura', 'Grand i10 Nios', 'Alcazar'],
  Tata: ['Nexon', 'Punch', 'Harrier', 'Altroz', 'Safari', 'Tiago', 'Tigor'],
  Mahindra: ['XUV700', 'Thar', 'Scorpio N', 'XUV300', 'Bolero', 'XUV400'],
  Honda: ['City', 'Amaze', 'Elevate', 'WR-V'],
  Toyota: ['Innova Crysta', 'Fortuner', 'Glanza', 'Urban Cruiser Hyryder', 'Hilux'],
  Kia: ['Seltos', 'Sonet', 'Carens', 'EV6'],
  MG: ['Hector', 'Astor', 'ZS EV', 'Gloster'],
  Skoda: ['Kushaq', 'Slavia', 'Superb', 'Kodiaq'],
  Volkswagen: ['Taigun', 'Virtus', 'Tiguan'],
};
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric'];
const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];
const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Bhopal', 'Patna', 'Nagpur', 'Coimbatore', 'Kochi', 'Surat', 'Vadodara', 'Visakhapatnam'];

export default function VehicleRegistration({ onNext, onManual }: { onNext: () => void; onManual: () => void }) {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [regNumber, setRegNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateLead, lead } = useLead();
  const { trackEvent } = useTracking();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [year, setYear] = useState('');
  const [city, setCity] = useState('');

  const handleAutoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regNumber.trim()) { setError('Please enter your vehicle registration number'); return; }
    setLoading(true);
    trackEvent('registration_entered', { regNumber });
    try {
      const details = await MockApi.lookupVehicle(regNumber);
      updateLead({ registrationNumber: regNumber.toUpperCase(), vehicleDetails: details });
      trackEvent('vehicle_lookup_success', details);
      onNext();
    } catch (err: any) {
      setError('Vehicle not found. Please check the number or enter details manually.');
      updateLead({ validationErrorCount: lead.validationErrorCount + 1 });
    } finally { setLoading(false); }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !fuelType || !year || !city) { setError('Please fill all fields to continue'); return; }
    const details = { registration: '', make, model, variant: 'Standard', fuelType, manufactureYear: year, city, rto: '' };
    updateLead({ registrationNumber: 'MANUAL', vehicleDetails: details });
    trackEvent('vehicle_manual_entry', details);
    onNext();
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Enter your vehicle details</h1>
        <p className="page-subtitle">We auto-fetch from RTO, or you can enter manually.</p>
      </div>

      <div className="tab-toggle" style={{ marginBottom: 20 }}>
        <button className={`tab-toggle-btn ${mode === 'auto' ? 'tab-toggle-btn-active' : ''}`} onClick={() => { setMode('auto'); setError(''); }}>
          <Search size={14} /> Registration No.
        </button>
        <button className={`tab-toggle-btn ${mode === 'manual' ? 'tab-toggle-btn-active' : ''}`} onClick={() => { setMode('manual'); setError(''); }}>
          <PenLine size={14} /> Enter Manually
        </button>
      </div>

      {mode === 'auto' ? (
        <form onSubmit={handleAutoSubmit}>
          <div className="card card-elevated">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Vehicle Registration Number
                <Tooltip text="This is the number printed on your vehicle's number plate. Example: DL09CA1234, MH02AB5678, KA01CD9012. You can find it on your RC book too." />
              </label>
              <input type="text" className={`form-input form-input-lg ${error ? 'form-input-error' : ''}`} placeholder="DL 09 CA 1234" value={regNumber} onChange={(e) => setRegNumber(e.target.value.toUpperCase())} disabled={loading} autoFocus />
              {error && <div className="form-error"><AlertCircle size={12} /> {error}</div>}
              <p className="form-hint">Format: State code (DL) + RTO code (09) + Series (CA) + Number (1234)</p>
            </div>
          </div>

          {loading ? (
            <div className="loading-state"><span className="loader" /><div className="loading-text">Fetching vehicle details…</div><div className="loading-subtext">Looking up RTO records for {regNumber}</div></div>
          ) : (
            <div className="sticky-cta"><div className="sticky-cta-inner"><button type="submit" className="btn btn-primary" disabled={!regNumber.trim()}>Fetch Vehicle Details →</button></div></div>
          )}
        </form>
      ) : (
        <form onSubmit={handleManualSubmit}>
          <div className="card card-elevated">
            <div className="form-group">
              <label className="form-label">Vehicle Make <Tooltip text="The company that manufactured your vehicle. Example: Maruti Suzuki, Hyundai, Tata Motors, etc." /></label>
              <select className="form-input form-select" value={make} onChange={e => { setMake(e.target.value); setModel(''); }}>
                <option value="">Select vehicle make</option>
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle Model <Tooltip text="The specific model name. Example: Swift, Creta, Nexon, City, etc." /></label>
              <select className="form-input form-select" value={model} onChange={e => setModel(e.target.value)} disabled={!make}>
                <option value="">{make ? 'Select model' : 'Select make first'}</option>
                {(MODELS[make] || []).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fuel Type <Tooltip text="Select the fuel type of your vehicle. CNG vehicles may have different premium rates. Check your RC book if unsure." /></label>
              <div className="chip-group">
                {FUEL_TYPES.map(f => (<div key={f} className={`chip ${fuelType === f ? 'chip-active' : ''}`} onClick={() => setFuelType(f)}>{f}</div>))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Year of Manufacture <Tooltip text="The year your vehicle was first registered. You can find this on your RC book. Older vehicles may have higher premiums." /></label>
              <select className="form-input form-select" value={year} onChange={e => setYear(e.target.value)}>
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City of Registration <Tooltip text="The city where your vehicle is registered (RTO location). This affects your premium based on zone classification." /></label>
              <select className="form-input form-select" value={city} onChange={e => setCity(e.target.value)}>
                <option value="">Select city</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {error && <div className="form-error" style={{ marginTop: 12 }}><AlertCircle size={12} /> {error}</div>}
          </div>
          <div className="sticky-cta"><div className="sticky-cta-inner"><button type="submit" className="btn btn-primary" disabled={!make || !model || !fuelType || !year || !city}>Continue →</button></div></div>
        </form>
      )}
    </div>
  );
}
