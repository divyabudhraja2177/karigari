import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle2, XCircle, AlertCircle, Calendar, Filter } from 'lucide-react';

export const AdminTimesheets: React.FC = () => {
  const { workingHours, approveWorkingHours, rejectWorkingHours, t, language } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'approved' | 'rejected'>('all');

  const filteredHours = workingHours.filter((h) => {
    if (filterStatus === 'all') return true;
    return h.status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--deep-brown)' }}>
          Timesheets & Work-Hour Reviews
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '2px' }}>
          Inspect submitted artisan working hours, verify breaks, and approve records for hourly compensation
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--light-border)', paddingBottom: '10px' }}>
        {[
          { key: 'all', label: `All Entries (${workingHours.length})` },
          { key: 'submitted', label: `Pending Review (${workingHours.filter((h) => h.status === 'submitted').length})` },
          { key: 'approved', label: `Approved (${workingHours.filter((h) => h.status === 'approved').length})` },
          { key: 'rejected', label: `Rejected (${workingHours.filter((h) => h.status === 'rejected').length})` }
        ].map((tab) => {
          const isSelected = filterStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key as any)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected ? 'var(--deep-brown)' : 'var(--white)',
                color: isSelected ? '#FFFFFF' : 'var(--muted-grey)',
                border: isSelected ? 'none' : '1px solid var(--light-border)',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Timesheets Table */}
      <div className="artisan-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--light-border)', color: 'var(--muted-grey)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Date</th>
              <th style={{ padding: '12px 16px' }}>Artisan</th>
              <th style={{ padding: '12px 16px' }}>Time Range</th>
              <th style={{ padding: '12px 16px' }}>Break</th>
              <th style={{ padding: '12px 16px' }}>Net Hours</th>
              <th style={{ padding: '12px 16px' }}>Order Ref / Notes</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHours.map((entry) => {
              const isPending = entry.status === 'submitted';
              const isApproved = entry.status === 'approved';

              return (
                <tr key={entry.id} style={{ borderBottom: '1px solid var(--light-border)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{entry.date}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                    {entry.artisanName}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px' }}>
                    {entry.startTime} – {entry.endTime}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted-grey)' }}>
                    {entry.breakMinutes} min
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--deep-brown)' }}>
                    {entry.durationHours} hrs
                  </td>
                  <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>
                      {entry.orderNumber ? `Order: ${entry.orderNumber}` : 'General Workshop'}
                    </div>
                    {entry.notes && (
                      <div style={{ fontSize: '11px', color: 'var(--muted-grey)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        "{entry.notes}"
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      className={`badge-status ${
                        isApproved ? 'badge-completed' : entry.status === 'rejected' ? 'badge-urgent' : 'badge-in-progress'
                      }`}
                      style={{ fontSize: '10px' }}
                    >
                      {entry.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {isPending ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => approveWorkingHours(entry.id)}
                          className="btn-sage"
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                        >
                          <CheckCircle2 size={13} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => rejectWorkingHours(entry.id)}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '11px', color: '#B43828' }}
                        >
                          <XCircle size={13} />
                          <span>Flag</span>
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>Reviewed</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
