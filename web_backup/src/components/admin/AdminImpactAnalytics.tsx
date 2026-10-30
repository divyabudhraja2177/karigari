import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  IndianRupee,
  ShieldCheck,
  Users,
  CheckCircle2,
  FileText,
  Filter,
  BarChart2,
  Info,
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';
import { IncomeComparisonChart } from './charts/IncomeComparisonChart';
import { EmpowermentDistributionChart } from './charts/EmpowermentDistributionChart';

export const AdminImpactAnalytics: React.FC = () => {
  const {
    artisans,
    surveyResponses,
    ngoFilter,
    setNgoFilter,
    cityFilter,
    setCityFilter,
    t,
    language,
    showToast
  } = useApp();

  // Selected cohort filters
  const [selectedCohortTime, setSelectedCohortTime] = useState<'6m' | '12m' | 'all'>('6m');

  // Filter artisans based on selected cohort parameters
  const filteredArtisans = artisans.filter((a) => {
    if (ngoFilter !== 'all' && a.ngoPartner !== ngoFilter) return false;
    if (cityFilter !== 'all' && a.city !== cityFilter) return false;
    return true;
  });

  const cohortSizeN = filteredArtisans.length;

  // Economic calculations
  const totalBaselineIncome = filteredArtisans.reduce((sum, a) => sum + a.baselineMonthlyIncome, 0);
  const avgBaselineIncome = cohortSizeN > 0 ? Math.round(totalBaselineIncome / cohortSizeN) : 0;

  const totalCurrentIncome = filteredArtisans.reduce((sum, a) => sum + a.currentMonthlyIncome, 0);
  const avgCurrentIncome = cohortSizeN > 0 ? Math.round(totalCurrentIncome / cohortSizeN) : 0;

  // Absolute change = Follow-up income - Baseline income
  const absoluteIncomeGain = avgCurrentIncome - avgBaselineIncome;

  // Percentage change = ((Follow-up income - Baseline income) / Baseline income) * 100
  // Safe zero-handling
  const percentageIncomeGain = avgBaselineIncome > 0
    ? Math.round(((avgCurrentIncome - avgBaselineIncome) / avgBaselineIncome) * 100)
    : 0;

  // Productivity calculations
  const totalHours = filteredArtisans.reduce((sum, a) => sum + a.recordedHours, 0);
  const avgHoursPerArtisan = cohortSizeN > 0 ? Math.round(totalHours / cohortSizeN) : 0;
  const totalBatches = filteredArtisans.reduce((sum, a) => sum + a.totalCompletedOrders, 0);

  // Self-reported well-being calculations from verified survey responses
  const filteredIds = new Set(filteredArtisans.map((a) => a.id));
  const validResponses = surveyResponses.filter((r) => filteredIds.has(r.artisanId));
  const validN = validResponses.length;

  const bankOwnersCount = filteredArtisans.filter((a) => a.bankAccountActive).length;
  const currentBankRate = cohortSizeN > 0 ? Math.round((bankOwnersCount / cohortSizeN) * 100) : 0;
  const baselineBankRate = 25; // Pre-joining rate across cohort

  const independentCount = filteredArtisans.filter(
    (a) => a.householdDecisionMaking === 'independent' || a.householdDecisionMaking === 'joint'
  ).length;
  const currentAutonomyRate = cohortSizeN > 0 ? Math.round((independentCount / cohortSizeN) * 100) : 0;
  const baselineAutonomyRate = 22; // Pre-joining rate across cohort

  const handleExportImpactCsv = () => {
    const headers = 'Artisan Code,Name,City,Partner NGO,Baseline Income (INR),Current Karigari Income (INR),Absolute Gain (INR),Growth (%),Bank Account Active,Decision Autonomy,Craft Skills';
    const rows = filteredArtisans.map((a) => {
      const abs = a.currentMonthlyIncome - a.baselineMonthlyIncome;
      const pct = a.baselineMonthlyIncome > 0 ? Math.round((abs / a.baselineMonthlyIncome) * 100) : 0;
      return `"${a.artisanCode}","${a.name}","${a.city}","${a.ngoPartner}",${a.baselineMonthlyIncome},${a.currentMonthlyIncome},${abs},${pct}%,"${a.bankAccountActive ? 'Yes' : 'No'}","${a.householdDecisionMaking}","${a.skills.join('; ')}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Karigari_SocioEconomic_Impact_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Impact evaluation report exported to CSV', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header and Filter Control Bar */}
      <div
        className="artisan-card"
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F6F0E7 100%)',
          borderLeft: '5px solid var(--sage-green)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="tag-textile" style={{ backgroundColor: 'var(--sage-green-light)', borderColor: 'var(--sage-green)' }}>
                <ShieldCheck size={13} color="var(--sage-green-dark)" />
                Verified Baseline vs Follow-Up Cohort Analysis
              </span>
              <span style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
                Sample Size N = {cohortSizeN} artisans (Valid Survey Responses = {validN})
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--deep-brown)' }}>
              {t.impactTitle}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '4px', maxWidth: '800px' }}>
              {t.impactSubtitle}
            </p>
          </div>

          <button
            onClick={handleExportImpactCsv}
            className="btn-primary"
            style={{ padding: '10px 16px', fontSize: '13px' }}
          >
            <Download size={15} />
            <span>Export Impact CSV</span>
          </button>
        </div>

        {/* Cohort Segmentation Filters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--light-border)',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--deep-brown)' }}>
            <Filter size={14} />
            <span>Cohort Filters:</span>
          </div>

          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--light-border)',
              backgroundColor: 'var(--white)',
              fontSize: '12px'
            }}
          >
            <option value="all">All Cities (Mumbai & Delhi)</option>
            <option value="Mumbai">Mumbai Only</option>
            <option value="Delhi">Delhi Only</option>
          </select>

          {/* NGO Filter */}
          <select
            value={ngoFilter}
            onChange={(e) => setNgoFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--light-border)',
              backgroundColor: 'var(--white)',
              fontSize: '12px'
            }}
          >
            <option value="all">All Partner NGOs</option>
            <option value="Shakti Foundation Mumbai">Shakti Foundation (Mumbai)</option>
            <option value="SEWA Delhi">SEWA (Delhi)</option>
          </select>

          {/* Timeframe */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setSelectedCohortTime('6m')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: selectedCohortTime === '6m' ? '1.5px solid var(--dusty-pink)' : '1px solid var(--light-border)',
                backgroundColor: selectedCohortTime === '6m' ? 'var(--dusty-pink-light)' : 'var(--white)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--deep-brown)'
              }}
            >
              6-Month Assessment
            </button>
            <button
              onClick={() => setSelectedCohortTime('12m')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: selectedCohortTime === '12m' ? '1.5px solid var(--dusty-pink)' : '1px solid var(--light-border)',
                backgroundColor: selectedCohortTime === '12m' ? 'var(--dusty-pink-light)' : 'var(--white)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--deep-brown)'
              }}
            >
              12-Month Assessment
            </button>
          </div>
        </div>
      </div>

      {/* BEFORE-AND-AFTER CORE ECONOMIC COMPARISON METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Baseline Income */}
        <div className="artisan-card" style={{ padding: '20px', borderLeft: '4px solid #B5AFA9' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
            {t.baselineIncomeLabel}
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: '#735D53', marginTop: '6px' }}>
            ₹{avgBaselineIncome.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '4px' }}>
            Pre-programme informal earnings (verified)
          </div>
        </div>

        {/* Current Verified Income */}
        <div className="artisan-card" style={{ padding: '20px', borderLeft: '4px solid var(--sage-green)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--sage-green-dark)', textTransform: 'uppercase' }}>
            {t.currentIncomeLabel}
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--sage-green-dark)', marginTop: '6px' }}>
            ₹{avgCurrentIncome.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--sage-green-dark)', marginTop: '4px', fontWeight: 600 }}>
            Piece-rate crafting + skill stipends
          </div>
        </div>

        {/* Absolute Income Change */}
        <div className="artisan-card" style={{ padding: '20px', borderLeft: '4px solid var(--dusty-pink)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--dusty-pink-dark)', textTransform: 'uppercase' }}>
            {t.absoluteChangeLabel}
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--deep-brown)', marginTop: '6px' }}>
            +₹{absoluteIncomeGain.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '4px' }}>
            Net monthly purchasing power added
          </div>
        </div>

        {/* Percentage Relative Gain */}
        <div className="artisan-card" style={{ padding: '20px', borderLeft: '4px solid var(--soft-yellow)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--soft-yellow-dark)', textTransform: 'uppercase' }}>
            {t.percentageChangeLabel}
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--sage-green-dark)', marginTop: '6px' }}>
            +{percentageIncomeGain}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '4px' }}>
            Calculated as ((Current - Baseline) / Baseline) × 100
          </div>
        </div>
      </div>

      {/* Visual Comparison Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
        {/* Chart 1: Detailed Artisan-Level Before-and-After Comparison */}
        <div className="artisan-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                Individual Artisan Baseline vs Follow-Up Comparison
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--muted-grey)', marginTop: '2px' }}>
                Verified monthly income delta across Mumbai & Delhi clusters
              </p>
            </div>
            <span className="tag-textile" style={{ fontSize: '10px' }}>
              N = {filteredArtisans.length}
            </span>
          </div>

          <IncomeComparisonChart artisans={filteredArtisans} />
        </div>

        {/* Chart 2: Empowerment, Bank Control & Agency Shifts */}
        <div className="artisan-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                Social Agency & Financial Empowerment Distribution
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--muted-grey)', marginTop: '2px' }}>
                Self-reported survey outcomes at baseline vs 6-month follow-up
              </p>
            </div>
            <span className="tag-textile" style={{ backgroundColor: 'var(--sage-green-light)', borderColor: 'var(--sage-green)', fontSize: '10px' }}>
              Valid Responses: {validN}
            </span>
          </div>

          <EmpowermentDistributionChart artisans={filteredArtisans} />
        </div>
      </div>

      {/* Cohort Comparison Breakdown Table */}
      <div className="artisan-card" style={{ padding: '22px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '4px' }}>
          Cohort Disaggregation by Location & Partner NGO
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--muted-grey)', marginBottom: '16px' }}>
          Rigorous disaggregated view to isolate geographic and organizational variance
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--light-border)', color: 'var(--muted-grey)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 8px' }}>Cohort Cluster</th>
              <th style={{ padding: '10px 8px' }}>Partner NGO</th>
              <th style={{ padding: '10px 8px' }}>Artisans (N)</th>
              <th style={{ padding: '10px 8px' }}>Avg Baseline</th>
              <th style={{ padding: '10px 8px' }}>Avg Current</th>
              <th style={{ padding: '10px 8px' }}>Absolute Gain</th>
              <th style={{ padding: '10px 8px' }}>Growth (%)</th>
              <th style={{ padding: '10px 8px' }}>Banking Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--light-border)' }}>
              <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--deep-brown)' }}>Mumbai Clusters (Dharavi, Chembur, Kurla)</td>
              <td style={{ padding: '12px 8px' }}>Shakti Foundation Mumbai</td>
              <td style={{ padding: '12px 8px', fontWeight: 600 }}>4</td>
              <td style={{ padding: '12px 8px', color: 'var(--muted-grey)' }}>₹3,375</td>
              <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--sage-green-dark)' }}>₹11,887</td>
              <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--deep-brown)' }}>+₹8,512</td>
              <td style={{ padding: '12px 8px', fontWeight: 800, color: 'var(--sage-green-dark)' }}>+252%</td>
              <td style={{ padding: '12px 8px' }}>100% (4/4)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--light-border)' }}>
              <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--deep-brown)' }}>Delhi Clusters (Nizamuddin, Sundar Nagari, Okhla)</td>
              <td style={{ padding: '12px 8px' }}>SEWA Delhi</td>
              <td style={{ padding: '12px 8px', fontWeight: 600 }}>4</td>
              <td style={{ padding: '12px 8px', color: 'var(--muted-grey)' }}>₹2,975</td>
              <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--sage-green-dark)' }}>₹10,300</td>
              <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--deep-brown)' }}>+₹7,325</td>
              <td style={{ padding: '12px 8px', fontWeight: 800, color: 'var(--sage-green-dark)' }}>+246%</td>
              <td style={{ padding: '12px 8px' }}>100% (4/4)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Rigorous Methodology & Data Limitations Box (Phase 4.C/4.D requirement) */}
      <div
        className="artisan-card border-stitched"
        style={{
          padding: '22px',
          backgroundColor: 'var(--warm-cream)',
          borderLeft: '4px solid var(--deep-brown)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Info size={18} color="var(--deep-brown)" />
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-brown)' }}>
            {t.methodologyNoteTitle}
          </h4>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--deep-brown)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p>
            <strong>Definition & Source Data:</strong> Baseline income represents verified self-reported average monthly informal earnings earned prior to enrollment in Karigari. Current income reflects bank/UPI-disbursed piece-rate craft earnings and verified hourly training stipends over the most recent 90-day active cycle.
          </p>
          <p>
            <strong>Mathematical Formulae:</strong> Absolute Change = (Current Income − Baseline Income). Relative Percentage Change = [((Current Income − Baseline Income) / Baseline Income) × 100]. Any zero baseline records are handled by reporting absolute currency gain directly to prevent division-by-zero artifacts.
          </p>
          <p>
            <strong>Cohort Size & Coverage:</strong> Longitudinal cohort consists of $N = {cohortSizeN}$ women artisans working in partnership with SEWA Delhi and Shakti Foundation Mumbai. Survey responses are collected with full voluntary consent under strict participant privacy guarantees.
          </p>
          <p style={{ color: 'var(--muted-grey)', fontSize: '11px', fontStyle: 'italic' }}>
            <strong>Causality Disclaimer:</strong> Observed income and well-being gains represent correlated longitudinal changes observed during cooperative participation. Programme evaluation is conducted in partnership with local community monitors.
          </p>
        </div>
      </div>
    </div>
  );
};
