import React from 'react';
import { Artisan } from '../../../types';

interface Props {
  artisans: Artisan[];
}

export const IncomeComparisonChart: React.FC<Props> = ({ artisans }) => {
  if (artisans.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted-grey)' }}>No artisan data available for this filter.</div>;
  }

  // Find max income to scale
  const maxIncome = Math.max(...artisans.map((a) => Math.max(a.baselineMonthlyIncome, a.currentMonthlyIncome)), 16000);
  const chartHeight = 220;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ minWidth: '540px', padding: '10px 0' }}>
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '14px', height: '14px', backgroundColor: '#E9E1D9', borderRadius: '3px' }} />
            <span style={{ color: 'var(--muted-grey)' }}>Baseline Income (Pre-Karigari)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '14px', height: '14px', backgroundColor: 'var(--sage-green)', borderRadius: '3px' }} />
            <span style={{ fontWeight: 600, color: 'var(--deep-brown)' }}>Current Verified Income (Karigari)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--dusty-pink-dark)', fontWeight: 700 }}>+Δ% Growth</span>
          </div>
        </div>

        {/* Grouped Bar Visualizer */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: `${chartHeight}px`, borderBottom: '1.5px solid var(--light-border)', paddingBottom: '6px' }}>
          {artisans.map((art) => {
            const baselineH = Math.round((art.baselineMonthlyIncome / maxIncome) * (chartHeight - 40));
            const currentH = Math.round((art.currentMonthlyIncome / maxIncome) * (chartHeight - 40));
            const absChange = art.currentMonthlyIncome - art.baselineMonthlyIncome;
            const pctChange = art.baselineMonthlyIncome > 0
              ? Math.round(((art.currentMonthlyIncome - art.baselineMonthlyIncome) / art.baselineMonthlyIncome) * 100)
              : 0;

            return (
              <div
                key={art.id}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  gap: '4px'
                }}
              >
                {/* Growth Tag */}
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--sage-green-dark)', marginBottom: '4px' }}>
                  +{pctChange}%
                </div>

                {/* Grouped Bars */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', justifyContent: 'center' }}>
                  {/* Baseline bar */}
                  <div
                    title={`Baseline: ₹${art.baselineMonthlyIncome.toLocaleString('en-IN')}`}
                    style={{
                      width: '18px',
                      height: `${baselineH}px`,
                      backgroundColor: '#E5DDD3',
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px',
                      transition: 'height 0.4s ease'
                    }}
                  />
                  {/* Current Karigari bar */}
                  <div
                    title={`Current: ₹${art.currentMonthlyIncome.toLocaleString('en-IN')} (+₹${absChange.toLocaleString('en-IN')})`}
                    style={{
                      width: '18px',
                      height: `${currentH}px`,
                      backgroundColor: 'var(--sage-green)',
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px',
                      boxShadow: '0 2px 6px rgba(168, 181, 160, 0.4)',
                      transition: 'height 0.4s ease'
                    }}
                  />
                </div>

                {/* Label */}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--deep-brown)',
                    marginTop: '8px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '65px'
                  }}
                  title={art.name}
                >
                  {art.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: '9px', color: 'var(--muted-grey)' }}>
                  {art.city}
                </div>
              </div>
            );
          })}
        </div>

        {/* Y-axis guidelines */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted-grey)', marginTop: '8px' }}>
          <span>₹0</span>
          <span>₹5,000</span>
          <span>₹10,000</span>
          <span>₹15,000+</span>
        </div>
      </div>
    </div>
  );
};
