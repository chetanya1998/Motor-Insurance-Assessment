"use client";
import React from 'react';
import { Shield, BarChart3, Lock, Zap, ArrowRight } from 'lucide-react';

export default function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="landing-content">
      {/* Hero */}
      <div className="landing-hero" style={{ paddingBottom: 60 }}>
        <h1 className="landing-hero-title">
          Get your motor insurance estimate in 60 seconds
        </h1>
        <p className="landing-hero-sub">
          Enter your vehicle number — see your estimated premium instantly. No personal details needed upfront.
        </p>
        
        {/* Primary Hero CTA - Moved up for "Proper" Landing Page feel */}
        <div style={{ marginTop: 32, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            Start Free Quote <ArrowRight size={18} style={{ marginLeft: 8 }} />
          </button>
          <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Takes less than 60 seconds · No login required
          </div>
        </div>

        <div className="landing-stats" style={{ marginTop: 40 }}>
          <div><div className="landing-stat-num">15+</div><div className="landing-stat-label">Insurance Partners</div></div>
          <div><div className="landing-stat-num">2L+</div><div className="landing-stat-label">Quotes Generated</div></div>
          <div><div className="landing-stat-num">4.8★</div><div className="landing-stat-label">Customer Rating</div></div>
        </div>
      </div>

      <div className="landing-body" style={{ paddingTop: 40 }}>
        {/* Trust Grid */}
        <div className="trust-grid">
          <div className="trust-item">
            <div className="trust-icon trust-icon-blue"><Zap size={20} /></div>
            <div>
              <div className="trust-title">Free estimate — no charges</div>
              <div className="trust-desc">Get instant premium calculation based on your vehicle registration data from RTO</div>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon trust-icon-green"><BarChart3 size={20} /></div>
            <div>
              <div className="trust-title">Compare 15+ insurers</div>
              <div className="trust-desc">HDFC Ergo, ICICI Lombard, Tata AIG, Digit, Bajaj Allianz and more</div>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon trust-icon-blue"><Lock size={20} /></div>
            <div>
              <div className="trust-title">No spam calls or SMS</div>
              <div className="trust-desc">Your personal details are asked only after you see the estimated quote</div>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon trust-icon-green"><Shield size={20} /></div>
            <div>
              <div className="trust-title">IRDAI compliant quotes</div>
              <div className="trust-desc">All quotes follow Insurance Regulatory and Development Authority guidelines</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="hiw-section">
          <div className="section-label" style={{ textAlign: 'center' }}>How it works</div>
          <div className="hiw-grid">
            <div className="hiw-step">
              <div className="hiw-num">1</div>
              <div className="hiw-title">Enter Vehicle Number</div>
              <div className="hiw-desc">We auto-fetch make, model, RTO details from your registration number</div>
            </div>
            <div className="hiw-step">
              <div className="hiw-num">2</div>
              <div className="hiw-title">See Estimated Quote</div>
              <div className="hiw-desc">Get premium range before sharing any personal information</div>
            </div>
            <div className="hiw-step">
              <div className="hiw-num">3</div>
              <div className="hiw-title">Compare & Purchase</div>
              <div className="hiw-desc">Select the best plan, add covers, and apply in under 5 minutes</div>
            </div>
          </div>
        </div>

        {/* Insurer Strip */}
        <div className="insurer-strip" style={{ marginBottom: 60 }}>
          <span className="insurer-name">HDFC Ergo</span>
          <span className="insurer-name">ICICI Lombard</span>
          <span className="insurer-name">Tata AIG</span>
          <span className="insurer-name">Bajaj Allianz</span>
          <span className="insurer-name">Digit</span>
          <span className="insurer-name">Acko</span>
        </div>
      </div>
    </div>
  );
}
