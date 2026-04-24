"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';
import { Info, AlertTriangle, CheckCircle, Clock, Shield, Users, Activity, BarChart3, HelpCircle } from 'lucide-react';
import Tooltip from '@/components/Tooltip';

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  useEffect(() => {
    const storedLeads = JSON.parse(localStorage.getItem('insurance_leads') || '[]');
    const storedEvents = JSON.parse(localStorage.getItem('tracking_events') || '[]');
    setLeads(storedLeads.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
    setEvents(storedEvents);
  }, []);

  const stats = {
    totalSessions: Math.max(1, new Set(events.map(e => e.data?.leadId || 'anonymous')).size),
    quotesGenerated: leads.length,
    avgScore: leads.length ? Math.round(leads.reduce((sum: number, l: any) => sum + (l.score || 0), 0) / leads.length) : 0,
    applications: leads.filter(l => l.isCompleted).length,
    riskDistribution: {
      low: leads.filter(l => l.riskLevel === 'Low Risk').length,
      medium: leads.filter(l => l.riskLevel === 'Medium Risk').length,
      high: leads.filter(l => l.riskLevel === 'High Risk').length,
    }
  };

  const formatTime = (ms: number) => {
    if (!ms) return 'N/A';
    const sec = Math.floor(ms / 1000);
    return sec > 60 ? `${Math.floor(sec / 60)}m ${sec % 60}s` : `${sec}s`;
  };

  const getRiskClass = (riskLevel: string) => {
    if (riskLevel === 'Low Risk') return styles.badgeLow;
    if (riskLevel === 'Medium Risk') return styles.badgeMedium;
    return styles.badgeHigh;
  };

  const getScoreClass = (score: number) => {
    if (score > 80) return styles.scoreGood;
    if (score > 50) return styles.scoreMedium;
    return styles.scoreBad;
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Admin Lead Center</h1>
            <p className={styles.subtitle}>Monitor conversion funnel performance and lead quality scoring</p>
          </div>
          <Link href="/" className="btn btn-secondary btn-sm">
            ← Back to Funnel
          </Link>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              Total Visitors
              <div className={styles.tooltipWrap}>
                <Tooltip text="Unique user sessions started on the landing page." />
              </div>
            </div>
            <h2 className={styles.statValue}><Users size={20} /> {stats.totalSessions}</h2>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              Quotes Shown
              <div className={styles.tooltipWrap}>
                <Tooltip text="Users who successfully reached the estimate screen." />
              </div>
            </div>
            <h2 className={styles.statValue}><BarChart3 size={20} /> {stats.quotesGenerated}</h2>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              Lead Quality
              <div className={styles.tooltipWrap}>
                <Tooltip text="Average score out of 100 based on user behavior and data validity." />
              </div>
            </div>
            <h2 className={`${styles.statValue} ${styles.scorePrimary}`}><Activity size={20} /> {stats.avgScore}</h2>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              Low Risk
              <div className={styles.tooltipWrap}>
                <Tooltip text="Leads with score > 80. High intent, valid data." />
              </div>
            </div>
            <h2 className={`${styles.statValue} ${styles.scoreGood}`}><CheckCircle size={20} /> {stats.riskDistribution.low}</h2>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              High Risk
              <div className={styles.tooltipWrap}>
                <Tooltip text="Leads with score < 50. Potential bots or low-intent users." />
              </div>
            </div>
            <h2 className={`${styles.statValue} ${styles.scoreBad}`}><AlertTriangle size={20} /> {stats.riskDistribution.high}</h2>
          </div>
        </div>

        {/* Leads Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Conversion Activity</h3>
            <span className={styles.badge}>{leads.length} Active Leads</span>
          </div>

          {/* Desktop Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer Profile</th>
                  <th>Vehicle Info</th>
                  <th>Intent</th>
                  <th>Time Taken</th>
                  <th>Quality Score</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className={styles.tableRow}>
                    <td>
                      <p className={styles.leadName}>{lead.personalDetails?.name || 'In-Progress User'}</p>
                      <p className={styles.leadId}>{lead.id}</p>
                    </td>
                    <td>
                      <p className={styles.vehicle}>{lead.vehicleDetails?.make} {lead.vehicleDetails?.model}</p>
                      <p className={styles.leadId}>{lead.registrationNumber}</p>
                    </td>
                    <td>
                      <p className={styles.vehicle}>{lead.selectedPlan?.insurer || 'Estimated Only'}</p>
                      <p className={styles.leadId}>{lead.selectedPlan ? `₹${lead.selectedPlan.price?.toLocaleString()}` : ''}</p>
                    </td>
                    <td><span className={styles.vehicle}><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />{formatTime(lead.totalTimeMs)}</span></td>
                    <td><span className={`${styles.scoreVal} ${getScoreClass(lead.score)}`}>{lead.score}</span></td>
                    <td><span className={`${styles.riskBadge} ${getRiskClass(lead.riskLevel)}`}>{lead.riskLevel}</span></td>
                    <td><button className={styles.detailsBtn}>Inspect →</button></td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>No user activity detected yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scoring Guide Section */}
        <div className={styles.guideSection}>
          <div className={styles.guideHeader}>
            <h3 className={styles.guideTitle}><Shield size={20} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 8, color: 'var(--primary)' }} /> Invisible Lead Scoring Logic</h3>
            <p className={styles.guideSubtitle}>How we evaluate lead quality without bothering the user.</p>
          </div>
          
          <table className={styles.guideTable}>
            <thead>
              <tr>
                <th>Factor</th>
                <th>Rule Description</th>
                <th>Deduction</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Validation Errors</strong></td>
                <td>User makes multiple mistakes while typing or enters invalid formats.</td>
                <td className={styles.deduction}>-5 per error</td>
              </tr>
              <tr>
                <td><strong>Completion Speed</strong></td>
                <td>Funnel completed in under 25 seconds (indicates potential bot/automated filling).</td>
                <td className={styles.deduction}>-25 points</td>
              </tr>
              <tr>
                <td><strong>Disposable Email</strong></td>
                <td>Using temporary email domains like tempmail.com or mailinator.com.</td>
                <td className={styles.deduction}>-15 points</td>
              </tr>
              <tr>
                <td><strong>Duplicate Data</strong></td>
                <td>The same mobile number or vehicle number used across multiple sessions.</td>
                <td className={styles.deduction}>-20 points</td>
              </tr>
              <tr>
                <td><strong>Uncertainty</strong></td>
                <td>Selecting "Not sure" for critical policy details like NCB.</td>
                <td className={styles.deduction}>-10 points</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.guideInfo}>
            <Info size={16} />
            <div>
              <strong>Pro Tip:</strong> Focus on "Low Risk" leads (Score &gt; 80). These users spent enough time reading details and provided valid verified data, representing the highest conversion probability.
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) setSelectedLead(null); }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Lead Detail: {selectedLead.personalDetails?.name || selectedLead.id}</h2>
                <span className={`${styles.riskBadge} ${getRiskClass(selectedLead.riskLevel)}`}>{selectedLead.riskLevel}</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedLead(null)}>✕</button>
            </div>

            <div className={styles.modalGrid}>
              <div>
                <div className={styles.infoSection}>
                  <h4 className={styles.infoLabel}>User Identity</h4>
                  <div className={styles.infoRow}><span>Name</span><strong>{selectedLead.personalDetails?.name || '—'}</strong></div>
                  <div className={styles.infoRow}><span>Mobile</span><strong>{selectedLead.personalDetails?.mobile || '—'}</strong></div>
                  <div className={styles.infoRow}><span>Email</span><strong className={styles.emailBreak}>{selectedLead.personalDetails?.email || '—'}</strong></div>
                </div>

                <div className={styles.infoSection}>
                  <h4 className={styles.infoLabel}>Vehicle History</h4>
                  <div className={styles.infoRow}><span>Make/Model</span><strong>{selectedLead.vehicleDetails?.make} {selectedLead.vehicleDetails?.model}</strong></div>
                  <div className={styles.infoRow}><span>Registration</span><strong>{selectedLead.registrationNumber}</strong></div>
                  <div className={styles.infoRow}><span>RTO Location</span><strong>{selectedLead.vehicleDetails?.city}</strong></div>
                </div>
              </div>

              <div>
                <div className={`${styles.scoreBox} ${selectedLead.score > 80 ? styles.scoreBoxGood : selectedLead.score > 50 ? styles.scoreBoxMed : styles.scoreBoxBad}`}>
                  <h4 className={styles.infoLabel}>Lead Health Score</h4>
                  <div className={styles.scoreBig}>
                    <span className={getScoreClass(selectedLead.score)}>{selectedLead.score}</span>
                    <span className={styles.scoreRisk}>/ 100</span>
                  </div>
                  <ul className={styles.reasonsList}>
                    {selectedLead.reasons?.map((r: string, i: number) => (
                      <li key={i}><span>⚠</span> {r}</li>
                    ))}
                    {(!selectedLead.reasons || selectedLead.reasons.length === 0) && (
                      <li className={styles.cleanProfile}><span>✓</span> Validated behavior — high intent user.</li>
                    )}
                  </ul>
                </div>

                <div className={styles.infoSection}>
                  <h4 className={styles.infoLabel}>Session Analytics</h4>
                  <div className={styles.infoRow}><span>Funnel Time</span><strong>{formatTime(selectedLead.totalTimeMs)}</strong></div>
                  <div className={styles.infoRow}><span>Field Errors</span><strong>{selectedLead.validationErrorCount || 0}</strong></div>
                  <div className={styles.infoRow}><span>System IP/ID</span><strong>{selectedLead.id.split('-')[1]}</strong></div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.closeModalBtn} onClick={() => setSelectedLead(null)}>Close Inspector</button>
              <button
                className={`btn ${selectedLead.riskLevel === 'High Risk' ? styles.investigateBtn : 'btn-primary'}`}
                onClick={() => alert('Lead data exported to CRM')}
              >
                {selectedLead.riskLevel === 'High Risk' ? 'Flag for Investigation' : 'Push to CRM'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
