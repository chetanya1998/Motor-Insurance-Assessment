"use client";
import React from 'react';

export default function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col h-full py-8">
      <div className="mb-12">
        <h1 className="mb-4">Get your motor insurance estimate in 60 seconds</h1>
        <p className="text-muted text-lg">
          Enter your vehicle number and see your estimated quote before sharing personal details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-12">
        <div className="card flex items-start gap-4">
          <div className="bg-primary-light p-3 rounded-full text-primary">🛡️</div>
          <div>
            <h3 className="text-base">Free estimate</h3>
            <p className="text-sm text-muted">Instant calculation based on vehicle data</p>
          </div>
        </div>
        <div className="card flex items-start gap-4">
          <div className="bg-primary-light p-3 rounded-full text-primary">📊</div>
          <div>
            <h3 className="text-base">Compare multiple insurers</h3>
            <p className="text-sm text-muted">Top 15+ insurance partners in India</p>
          </div>
        </div>
        <div className="card flex items-start gap-4">
          <div className="bg-primary-light p-3 rounded-full text-primary">🔒</div>
          <div>
            <h3 className="text-base">No spam</h3>
            <p className="text-sm text-muted">Personal details asked only after estimate</p>
          </div>
        </div>
      </div>

      <div className="sticky-bottom mt-auto">
        <button className="btn btn-primary" onClick={onStart}>
          Start Quote
        </button>
      </div>
    </div>
  );
}
