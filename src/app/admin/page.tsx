"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

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
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p className={styles.subtitle}>Track funnel conversion and lead quality</p>
          </div>
          <Link href="/" className={`btn btn-primary ${styles.headerBtn}`}>
            ← Customer App
          </Link>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Sessions</p>
            <h2 className={styles.statValue}>{stats.totalSessions}</h2>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Quotes Generated</p>
            <h2 className={styles.statValue}>{stats.quotesGenerated}</h2>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Applications</p>
            <h2 className={styles.statValue}>{stats.applications}</h2>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Avg Lead Score</p>
            <h2 className={`${styles.statValue} ${styles.scorePrimary}`}>{stats.avgScore}</h2>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Low Risk</p>
            <h2 className={`${styles.statValue} ${styles.scoreGood}`}>{stats.riskDistribution.low}</h2>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Medium Risk</p>
            <h2 className={`${styles.statValue} ${styles.scoreMedium}`}>{stats.riskDistribution.medium}</h2>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>High Risk</p>
            <h2 className={`${styles.statValue} ${styles.scoreBad}`}>{stats.riskDistribution.high}</h2>
          </div>
        </div>

        {/* Leads Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Leads</h3>
            <span className={styles.badge}>{leads.length} total</span>
          </div>

          {/* Desktop Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name / ID</th>
                  <th>Vehicle</th>
                  <th>Plan Selected</th>
                  <th>Time</th>
                  <th>Score</th>
                  <th>Risk</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className={styles.tableRow}>
                    <td>
                      <p className={styles.leadName}>{lead.personalDetails?.name || 'Anonymous'}</p>
                      <p className={styles.leadId}>{lead.id}</p>
                    </td>
                    <td>
                      <p className={styles.vehicle}>{lead.vehicleDetails?.make} {lead.vehicleDetails?.model}</p>
                      <p className={styles.leadId}>{lead.registrationNumber}</p>
                    </td>
                    <td>
                      <p className={styles.vehicle}>{lead.selectedPlan?.insurer || '—'}</p>
                      <p className={styles.leadId}>{lead.selectedPlan ? `₹${lead.selectedPlan.price?.toLocaleString()}` : ''}</p>
                    </td>
                    <td><span className={styles.vehicle}>{formatTime(lead.totalTimeMs)}</span></td>
                    <td><span className={`${styles.scoreVal} ${getScoreClass(lead.score)}`}>{lead.score}</span></td>
                    <td><span className={`${styles.riskBadge} ${getRiskClass(lead.riskLevel)}`}>{lead.riskLevel}</span></td>
                    <td><button className={styles.detailsBtn}>Details →</button></td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>No leads yet. Complete the customer funnel first.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className={styles.mobileCards}>
            {leads.map((lead) => (
              <div key={lead.id} className={styles.leadCard} onClick={() => setSelectedLead(lead)}>
                <div className={styles.leadCardTop}>
                  <div>
                    <p className={styles.leadName}>{lead.personalDetails?.name || 'Anonymous'}</p>
                    <p className={styles.leadId}>{lead.id}</p>
                  </div>
                  <span className={`${styles.riskBadge} ${getRiskClass(lead.riskLevel)}`}>{lead.riskLevel}</span>
                </div>
                <div className={styles.leadCardMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Vehicle</span>
                    <span className={styles.metaValue}>{lead.vehicleDetails?.make} {lead.vehicleDetails?.model}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Plan</span>
                    <span className={styles.metaValue}>{lead.selectedPlan?.insurer || '—'}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Score</span>
                    <span className={`${styles.metaValue} ${getScoreClass(lead.score)}`}><strong>{lead.score}</strong></span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Time</span>
                    <span className={styles.metaValue}>{formatTime(lead.totalTimeMs)}</span>
                  </div>
                </div>
                <button className={styles.viewDetailsBtn}>View Details →</button>
              </div>
            ))}
            {leads.length === 0 && (
              <div className={styles.emptyMobile}>No leads yet. Complete the customer funnel first.</div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) setSelectedLead(null); }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Lead: {selectedLead.id}</h2>
                <span className={`${styles.riskBadge} ${getRiskClass(selectedLead.riskLevel)}`}>{selectedLead.riskLevel}</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedLead(null)}>✕</button>
            </div>

            <div className={styles.modalGrid}>
              {/* Left Column */}
              <div>
                <div className={styles.infoSection}>
                  <h4 className={styles.infoLabel}>Customer Info</h4>
                  <div className={styles.infoRow}><span>Name</span><strong>{selectedLead.personalDetails?.name || '—'}</strong></div>
                  <div className={styles.infoRow}><span>Mobile</span><strong>{selectedLead.personalDetails?.mobile || '—'}</strong></div>
                  <div className={styles.infoRow}><span>Email</span><strong className={styles.emailBreak}>{selectedLead.personalDetails?.email || '—'}</strong></div>
                </div>

                <div className={styles.infoSection}>
                  <h4 className={styles.infoLabel}>Vehicle</h4>
                  <div className={styles.infoRow}><span>Vehicle</span><strong>{selectedLead.vehicleDetails?.make} {selectedLead.vehicleDetails?.model}</strong></div>
                  <div className={styles.infoRow}><span>Reg. No</span><strong>{selectedLead.registrationNumber}</strong></div>
                  <div className={styles.infoRow}><span>Year</span><strong>{selectedLead.vehicleDetails?.manufactureYear}</strong></div>
                  <div className={styles.infoRow}><span>City</span><strong>{selectedLead.vehicleDetails?.city}</strong></div>
                </div>

                <div className={styles.infoSection}>
                  <h4 className={styles.infoLabel}>Policy Intent</h4>
                  <div className={styles.infoRow}><span>Insurer</span><strong>{selectedLead.selectedPlan?.insurer || '—'}</strong></div>
                  <div className={styles.infoRow}><span>Premium</span><strong>{selectedLead.selectedPlan ? `₹${selectedLead.selectedPlan.price?.toLocaleString()}` : '—'}</strong></div>
                  <div className={styles.infoRow}><span>Add-ons</span><strong>{selectedLead.selectedAddons?.join(', ') || 'None'}</strong></div>
                  <div className={styles.infoRow}><span>NCB</span><strong>{selectedLead.policyDetails?.ncb || '—'}</strong></div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className={`${styles.scoreBox} ${selectedLead.score > 80 ? styles.scoreBoxGood : selectedLead.score > 50 ? styles.scoreBoxMed : styles.scoreBoxBad}`}>
                  <h4 className={styles.infoLabel}>Lead Quality Score</h4>
                  <div className={styles.scoreBig}>
                    <span className={getScoreClass(selectedLead.score)}>{selectedLead.score}</span>
                    <span className={styles.scoreRisk}>/ 100 · {selectedLead.riskLevel}</span>
                  </div>
                  <ul className={styles.reasonsList}>
                    {selectedLead.reasons?.map((r: string, i: number) => (
                      <li key={i}><span>⚠</span> {r}</li>
                    ))}
                    {(!selectedLead.reasons || selectedLead.reasons.length === 0) && (
                      <li className={styles.cleanProfile}><span>✓</span> Clean profile — no flags raised.</li>
                    )}
                  </ul>
                </div>

                <div className={styles.infoSection}>
                  <h4 className={styles.infoLabel}>Tracking</h4>
                  <div className={styles.infoRow}><span>Completion Time</span><strong>{formatTime(selectedLead.totalTimeMs)}</strong></div>
                  <div className={styles.infoRow}><span>Validation Errors</span><strong>{selectedLead.validationErrorCount || 0}</strong></div>
                  <div className={styles.infoRow}><span>Submitted At</span><strong>{selectedLead.submittedAt ? new Date(selectedLead.submittedAt).toLocaleString() : '—'}</strong></div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.closeModalBtn} onClick={() => setSelectedLead(null)}>Close</button>
              <button
                className={`btn ${selectedLead.riskLevel === 'High Risk' ? styles.investigateBtn : 'btn-primary'}`}
                onClick={() => alert(selectedLead.riskLevel === 'High Risk' ? 'Lead flagged for investigation' : 'Lead assigned to agent')}
              >
                {selectedLead.riskLevel === 'High Risk' ? '⚠ Investigate Lead' : 'Assign to Agent'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
