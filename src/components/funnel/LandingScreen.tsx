"use client";
import React from 'react';
import { Shield, BarChart3, Lock, Zap } from 'lucide-react';

export default function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Get your motor insurance estimate in 60 seconds</h1>
        <p className="page-subtitle" style={{ marginTop: 8 }}>
          Enter your vehicle number and see your estimated quote — no personal details needed upfront.
        </p>
      </div>

      <div className="trust-grid" style={{ marginBottom: 32 }}>
        <div className="trust-item">
          <div className="trust-icon trust-icon-blue"><Zap size={18} /></div>
          <div>
            <div className="trust-title">Free estimate</div>
            <div className="trust-desc">Instant calculation based on vehicle data</div>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon trust-icon-green"><BarChart3 size={18} /></div>
          <div>
            <div className="trust-title">Compare insurers</div>
            <div className="trust-desc">15+ insurance partners</div>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon trust-icon-blue"><Lock size={18} /></div>
          <div>
            <div className="trust-title">No spam</div>
            <div className="trust-desc">We respect your privacy</div>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon trust-icon-green"><Shield size={18} /></div>
          <div>
            <div className="trust-title">Quote first</div>
            <div className="trust-desc">Personal details after estimate</div>
          </div>
        </div>
      </div>

      <div className="sticky-cta">
        <div className="sticky-cta-inner">
          <button className="btn btn-primary" onClick={onStart}>
            Start Quote →
          </button>
        </div>
      </div>
    </div>
  );
}
