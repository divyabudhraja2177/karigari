import React from 'react';
import { Artisan } from '../../../types';
import { ShieldCheck, TrendingUp, Users, HeartHandshake } from 'lucide-react';

interface Props {
  artisans: Artisan[];
}

export const EmpowermentDistributionChart: React.FC<Props> = ({ artisans }) => {
  const total = artisans.length;
  if (total === 0) return null;

  const bankOwners = artisans.filter((a) => a.bankAccountActive).length;
  const independentDecisions = artisans.filter((a) => a.householdDecisionMaking === 'independent').length;
  const jointDecisions = artisans.filter((a) => a.householdDecisionMaking === 'joint').length;
  const avgConfidence = (
    artisans.reduce((sum, a) => sum + a.financialConfidenceScore, 0) / total
  ).toFixed(1);

  // Baseline comparison percentages
  const baselineBankPct = 25; // 25% at baseline
  const currentBankPct = Math.round((bankOwners / total) * 100);

  const baselineAgencyPct = 22; // 22% independent/joint at baseline
  const currentAgencyPct = Math.round(((independentDecisions + jointDecisions) / total) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Metric 1: Bank Account Ownership */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ fontWeight: 600, color: 'var(--deep-brown)' }}>
            Direct Bank / UPI Account Ownership
          </span>
          <span style={{ fontWeight: 700, color: 'var(--sage-green-dark)' }}>
            {currentBankPct}% (vs {baselineBankPct}% baseline)
          </span>
        </div>
        <div style={{ width: '100%', height: '10px', backgroundColor: '#E9E1D9', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
          {/* Baseline benchmark marker */}
          <div
            title="Baseline (25%)"
            style={{
              position: 'absolute',
              left: `${baselineBankPct}%`,
              top: 0,
              bottom: 0,
              width: '2px',
              backgroundColor: 'var(--deep-brown)',
              zIndex: 2
            }}
          />
          {/* Current fill */}
          <div
            style={{
              height: '100%',
              width: `${currentBankPct}%`,
              backgroundColor: 'var(--sage-green)',
              borderRadius: '5px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted-grey)' }}>
          <span>Baseline: {baselineBankPct}%</span>
          <span style={{ color: 'var(--sage-green-dark)', fontWeight: 600 }}>+{(currentBankPct - baselineBankPct)}% Absolute Shift</span>
        </div>
      </div>

      {/* Metric 2: Household Decision-Making Agency */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ fontWeight: 600, color: 'var(--deep-brown)' }}>
            Household Financial Decision Agency (Independent / Joint)
          </span>
          <span style={{ fontWeight: 700, color: 'var(--dusty-pink-dark)' }}>
            {currentAgencyPct}% (vs {baselineAgencyPct}% baseline)
          </span>
        </div>
        <div style={{ width: '100%', height: '10px', backgroundColor: '#E9E1D9', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
          {/* Baseline marker */}
          <div
            title="Baseline (22%)"
            style={{
              position: 'absolute',
              left: `${baselineAgencyPct}%`,
              top: 0,
              bottom: 0,
              width: '2px',
              backgroundColor: 'var(--deep-brown)',
              zIndex: 2
            }}
          />
          <div
            style={{
              height: '100%',
              width: `${currentAgencyPct}%`,
              backgroundColor: 'var(--dusty-pink)',
              borderRadius: '5px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted-grey)' }}>
          <span>Baseline: {baselineAgencyPct}%</span>
          <span style={{ color: 'var(--dusty-pink-dark)', fontWeight: 600 }}>+{(currentAgencyPct - baselineAgencyPct)}% Growth in Agency</span>
        </div>
      </div>

      {/* Metric 3: Self-Reported Financial Confidence */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ fontWeight: 600, color: 'var(--deep-brown)' }}>
            Self-Reported Financial Independence Score
          </span>
          <span style={{ fontWeight: 700, color: 'var(--deep-brown)' }}>
            {avgConfidence} / 5.0 (vs 1.8 Baseline)
          </span>
        </div>
        <div style={{ width: '100%', height: '10px', backgroundColor: '#E9E1D9', borderRadius: '5px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${(Number(avgConfidence) / 5) * 100}%`,
              backgroundColor: 'var(--soft-yellow)',
              borderRadius: '5px',
              boxShadow: '0 1px 4px rgba(233, 217, 154, 0.6)'
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted-grey)' }}>
          <span>Pre-Karigari Score: 1.8</span>
          <span style={{ color: 'var(--deep-brown)', fontWeight: 600 }}>+155% Confidence Index</span>
        </div>
      </div>
    </div>
  );
};
