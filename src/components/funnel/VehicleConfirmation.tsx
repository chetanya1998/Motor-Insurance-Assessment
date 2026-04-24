"use client";
import React from 'react';
import { useLead } from '@/context/LeadContext';
import { useTracking } from '@/context/TrackingContext';

export default function VehicleConfirmation({ onNext, onEdit }: { onNext: () => void, onEdit: () => void }) {
  const { lead, updateLead } = useLead();
  const { trackEvent } = useTracking();
  const details = lead.vehicleDetails || {
    make: 'Maruti',
    model: 'Swift',
    variant: 'VXi',
    fuelType: 'Petrol',
    manufactureYear: '2020',
    city: 'Delhi'
  };

  const handleConfirm = () => {
    trackEvent('vehicle_details_confirmed');
    onNext();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="mb-2">Confirm your vehicle details</h2>
        <p className="text-muted">Is this the correct vehicle?</p>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
                <span className="text-xs font-bold text-primary bg-primary-light px-2 py-1 rounded">{lead.registrationNumber || 'NEW VEHICLE'}</span>
                <h3 className="mt-1">{details.make} {details.model}</h3>
                <p className="text-sm text-muted">{details.variant} • {details.fuelType}</p>
            </div>
            <div className="text-right">
                 <p className="text-sm font-semibold">{details.manufactureYear}</p>
                 <p className="text-xs text-muted">{details.city}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex justify-between py-1">
            <span className="text-sm text-muted">Make</span>
            <span className="text-sm font-medium">{details.make}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-muted">Model</span>
            <span className="text-sm font-medium">{details.model}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-muted">Variant</span>
            <span className="text-sm font-medium">{details.variant}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-muted">Fuel type</span>
            <span className="text-sm font-medium">{details.fuelType}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-muted">Year</span>
            <span className="text-sm font-medium">{details.manufactureYear}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-muted">Registration City</span>
            <span className="text-sm font-medium">{details.city}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-3 pt-6">
        <button className="btn btn-primary" onClick={handleConfirm}>
          Looks correct
        </button>
        <button className="btn btn-outline" onClick={onEdit}>
          Edit details
        </button>
      </div>
    </div>
  );
}
