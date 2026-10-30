import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndianRupee, CheckCircle2, ShieldCheck, Clock, Download, X } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { earnings, approveEarning, markEarningPaid, t, language } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activePayingId, setActivePayingId] = useState<string | null>(null);
  const [paymentRefInput, setPaymentRefInput] = useState<string>('UPI/HDFC/' + Math.floor(100000000000 + Math.random() * 900000000000));

  const filteredEarnings = earnings.filter((e) => {
    if (filterStatus === 'all') return true;
    return e.status === filterStatus;
  });

  const totalCalculated = earnings.filter((e) => e.status === 'calculated').reduce((sum, e) => sum + e.amount, 0);
  const totalApproved = earnings.filter((e) => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = earnings.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);

  const handleConfirmPaid = (id: string) => {
    markEarningPaid(id, paymentRefInput);
    setActivePayingId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--deep-brown)' }}>
          Artisan Earnings & Payment Disbursals
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '2px' }}>
          Verify calculated piece-rate earnings, approve payouts, and log bank/UPI disbursement references
        </p>
      </div>

      {/* Payout Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="artisan-card" style={{ padding: '18px 16px', borderColor: 'var(--soft-yellow-border)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
            Awaiting Approval (Calculated)
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--soft-yellow-dark)', marginTop: '4px' }}>
            ₹{totalCalculated.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>
            {earnings.filter((e) => e.status === 'calculated').length} batches
          </div>
        </div>

        <div className="artisan-card" style={{ padding: '18px 16px', borderColor: 'var(--dusty-pink)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
            Approved for Payout
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--dusty-pink-dark)', marginTop: '4px' }}>
            ₹{totalApproved.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>
            Ready for UPI / Bank Transfer
          </div>
        </div>

        <div className="artisan-card" style={{ padding: '18px 16px', borderColor: 'var(--sage-green-border)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
            Disbursed & Paid to Date
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--sage-green-dark)', marginTop: '4px' }}>
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--sage-green-dark)', marginTop: '2px', fontWeight: 600 }}>
            UTR references recorded
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--light-border)', paddingBottom: '10px' }}>
        {['all', 'calculated', 'approved', 'paid'].map((key) => {
          const isSelected = filterStatus === key;
          const label =
            key === 'all'
              ? `All Records (${earnings.length})`
              : key === 'calculated'
              ? `Pending Approval (${earnings.filter((e) => e.status === 'calculated').length})`
              : key === 'approved'
              ? `Approved for Payout (${earnings.filter((e) => e.status === 'approved').length})`
              : `Disbursed & Paid (${earnings.filter((e) => e.status === 'paid').length})`;

          return (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
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
              {label}
            </button>
          );
        })}
      </div>

      {/* Payments Table */}
      <div className="artisan-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--light-border)', color: 'var(--muted-grey)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Date</th>
              <th style={{ padding: '12px 16px' }}>Artisan</th>
              <th style={{ padding: '12px 16px' }}>Description / Batch</th>
              <th style={{ padding: '12px 16px' }}>Type</th>
              <th style={{ padding: '12px 16px' }}>Amount</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Reference</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEarnings.map((record) => {
              const isPaid = record.status === 'paid';
              const isApproved = record.status === 'approved';
              const isCalculated = record.status === 'calculated';

              return (
                <tr key={record.id} style={{ borderBottom: '1px solid var(--light-border)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{record.date}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                    {record.artisanName}
                  </td>
                  <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                    <div style={{ fontWeight: 600 }}>{record.description}</div>
                    {record.orderNumber && (
                      <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>Order: {record.orderNumber}</div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px' }}>
                    <span className="tag-textile" style={{ fontSize: '10px' }}>
                      {record.type === 'piece_rate' ? 'Piece-Rate' : 'Hourly Stipend'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--deep-brown)', fontSize: '15px' }}>
                    ₹{record.amount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      className={`badge-status ${
                        isPaid ? 'badge-completed' : isApproved ? 'badge-in-progress' : 'badge-not-started'
                      }`}
                      style={{ fontSize: '10px' }}
                    >
                      {record.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '11px' }}>
                    {record.paymentRef ? (
                      <code style={{ backgroundColor: 'var(--warm-cream)', padding: '2px 6px', borderRadius: '4px' }}>
                        {record.paymentRef}
                      </code>
                    ) : (
                      <span style={{ color: 'var(--muted-grey)' }}>Pending payment</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {isCalculated && (
                      <button
                        onClick={() => approveEarning(record.id)}
                        className="btn-sage"
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        Approve
                      </button>
                    )}
                    {isApproved && (
                      <button
                        onClick={() => {
                          setActivePayingId(record.id);
                          setPaymentRefInput('UPI/HDFC/' + Math.floor(100000000000 + Math.random() * 900000000000));
                        }}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        Mark as Paid
                      </button>
                    )}
                    {isPaid && (
                      <span style={{ fontSize: '11px', color: 'var(--sage-green-dark)', fontWeight: 600 }}>
                        ✓ Paid ({record.paidDate})
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mark As Paid Modal */}
      {activePayingId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 37, 35, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 100
          }}
          onClick={() => setActivePayingId(null)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--deep-brown)' }}>
                Confirm Payment Disbursement
              </h3>
              <button onClick={() => setActivePayingId(null)} style={{ color: 'var(--muted-grey)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Bank UTR / UPI Transaction Reference Number
                </label>
                <input
                  type="text"
                  required
                  value={paymentRefInput}
                  onChange={(e) => setPaymentRefInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--light-border)',
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
                This record will be permanently associated with the artisan's earnings ledger and visible on their downloadable earnings slip.
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setActivePayingId(null)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmPaid(activePayingId)}
                  className="btn-sage"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Confirm Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
