import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EarningRecord } from '../../types';
import { IndianRupee, Download, CheckCircle2, Clock, Calendar, FileText, Printer, X, ShieldCheck } from 'lucide-react';

export const ArtisanEarnings: React.FC = () => {
  const { currentUser, earnings, products, t, language, showToast } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const myEarnings = earnings.filter((e) => e.artisanId === artisanId);

  const [showSlipModal, setShowSlipModal] = useState(false);

  // Totals
  const totalMonthEarnings = myEarnings.reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = myEarnings.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const totalPending = myEarnings.filter((e) => e.status !== 'paid').reduce((sum, e) => sum + e.amount, 0);

  const handlePrintSlip = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Date,Description,Type,Amount (INR),Status,Payment Reference']
        .concat(
          myEarnings.map(
            (e) => `"${e.date}","${e.description}","${e.type}","${e.amount}","${e.status}","${e.paymentRef || 'N/A'}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Karigari_Earnings_${currentUser.name}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(language === 'hi' ? 'कमाई रसीद डाउनलोड हो गई' : 'Earnings statement downloaded', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '24px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--deep-brown)' }}>
          {t.earningsTitle}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '2px' }}>
          {t.earningsSubtitle}
        </p>
      </div>

      {/* Main Earnings KPI Cards */}
      <div
        className="artisan-card border-stitched"
        style={{
          padding: '24px 20px',
          backgroundColor: '#FFFCFA',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
            {t.monthlyEarnings}
          </span>
          <span className="tag-textile" style={{ backgroundColor: 'var(--sage-green-light)', borderColor: 'var(--sage-green)' }}>
            <CheckCircle2 size={12} color="var(--sage-green-dark)" />
            {language === 'hi' ? 'पारदर्शी भुगतान' : 'Fair Trade Verified'}
          </span>
        </div>

        <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--deep-brown)', lineHeight: 1.1 }}>
          ₹{totalMonthEarnings.toLocaleString('en-IN')}
        </div>

        {/* Breakdown bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--light-border)' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
              {t.paidToDate}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--sage-green-dark)', marginTop: '2px' }}>
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
              {t.pendingApproval}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--dusty-pink-dark)', marginTop: '2px' }}>
              ₹{totalPending.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Action Button: Download Earnings Slip */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button
            onClick={() => setShowSlipModal(true)}
            className="btn-primary"
            style={{ flex: 1, padding: '12px 14px', fontSize: '13px' }}
          >
            <FileText size={16} />
            <span>{t.downloadSlipBtn}</span>
          </button>
        </div>
      </div>

      {/* Transparent Compensation Rates Reference */}
      <div className="artisan-card" style={{ padding: '18px 20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '12px' }}>
          {t.ratesBreakdown}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {products.map((prod) => (
            <div
              key={prod.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--warm-cream)',
                fontSize: '13px'
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--deep-brown)' }}>
                {language === 'hi' ? prod.hindiName : prod.name}
              </span>
              <span style={{ fontWeight: 800, color: 'var(--sage-green-dark)' }}>
                ₹{prod.pieceRate} / {language === 'hi' ? 'वस्तु' : 'unit'}
              </span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--dusty-pink-light)',
              fontSize: '13px'
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--deep-brown)' }}>
              {language === 'hi' ? 'प्रशिक्षण एवं कार्यशाला मानदेय (Hourly)' : 'Workshop Training Stipend (Hourly)'}
            </span>
            <span style={{ fontWeight: 800, color: 'var(--dusty-pink-dark)' }}>
              ₹175 / {language === 'hi' ? 'घंटा' : 'hr'}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Ledger / History */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '12px' }}>
          {t.earningsHistory}
        </h2>

        {myEarnings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myEarnings.map((record) => {
              const isPaid = record.status === 'paid';
              const isApproved = record.status === 'approved';

              return (
                <div
                  key={record.id}
                  className="artisan-card"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                        {language === 'hi' ? record.hindiDescription : record.description}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '3px' }}>
                        {t.paymentDate}: {record.paidDate || record.date}
                        {record.orderNumber ? ` • ${record.orderNumber}` : ''}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--deep-brown)' }}>
                        ₹{record.amount.toLocaleString('en-IN')}
                      </div>
                      <span
                        className={`badge-status ${
                          isPaid ? 'badge-paid' : isApproved ? 'badge-in-progress' : 'badge-not-started'
                        }`}
                        style={{ fontSize: '10px', marginTop: '4px' }}
                      >
                        {isPaid ? t.statusPaid : isApproved ? t.statusApproved : t.statusCalculated}
                      </span>
                    </div>
                  </div>

                  {record.paymentRef && (
                    <div
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--warm-cream)',
                        fontSize: '11px',
                        color: 'var(--deep-brown)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ color: 'var(--muted-grey)' }}>{t.paymentRef}:</span>
                      <code style={{ fontWeight: 600 }}>{record.paymentRef}</code>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted-grey)', fontSize: '13px' }}>
            {t.noEarningsYet}
          </div>
        )}
      </div>

      {/* Official Printable / Shareable Earnings Slip Modal */}
      {showSlipModal && (
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
          onClick={() => setShowSlipModal(false)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '480px',
              width: '100%',
              padding: '28px 24px',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--warm-cream)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <span className="brand-heading" style={{ fontSize: '24px', color: 'var(--deep-brown)' }}>
                  Karigari कारीगरी
                </span>
                <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                  Empowering Hands. Preserving Heritage.
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--dusty-pink-dark)', marginTop: '4px' }}>
                  {language === 'hi' ? 'मासिक पारिश्रमिक विवरण' : 'Artisan Compensation Slip'}
                </div>
              </div>
              <button onClick={() => setShowSlipModal(false)} style={{ color: 'var(--muted-grey)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Artisan Metadata */}
            <div style={{ backgroundColor: 'var(--warm-cream)', borderRadius: 'var(--radius-sm)', padding: '12px', fontSize: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div><strong>{language === 'hi' ? 'कारीगर:' : 'Artisan:'}</strong> {currentUser.name}</div>
                <div><strong>{language === 'hi' ? 'आईडी:' : 'Code:'}</strong> {currentUser.artisanId || 'KRG-MUM-01'}</div>
                <div><strong>{language === 'hi' ? 'माह / वर्ष:' : 'Period:'}</strong> October 2026</div>
                <div><strong>{language === 'hi' ? 'भुगतान विधि:' : 'Method:'}</strong> Direct UPI / Bank</div>
              </div>
            </div>

            {/* Line Items Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {myEarnings.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    padding: '8px 0',
                    borderBottom: '1px dashed var(--light-border)'
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '10px' }}>
                    <div style={{ fontWeight: 600 }}>{item.description}</div>
                    <div style={{ fontSize: '10px', color: 'var(--muted-grey)' }}>Status: {item.status.toUpperCase()}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--deep-brown)' }}>
                    ₹{item.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--sage-green-light)', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--sage-green-dark)' }}>
                {language === 'hi' ? 'कुल देय राशि:' : 'Total Payable:'}
              </span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--deep-brown)' }}>
                ₹{totalMonthEarnings.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Verification Seal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--muted-grey)', marginBottom: '20px' }}>
              <ShieldCheck size={16} color="var(--sage-green-dark)" />
              <span>
                {language === 'hi'
                  ? 'यह विवरण शक्ति फाउंडेशन एवं सेवा (SEWA) द्वारा सत्यापित है।'
                  : 'Digitally verified under Karigari Fair Artisan Wage Protocol.'}
              </span>
            </div>

            {/* Print & Download Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handlePrintSlip}
                className="btn-secondary"
                style={{ flex: 1, padding: '12px' }}
              >
                <Printer size={15} />
                <span>{t.printSlipBtn}</span>
              </button>
              <button
                onClick={handleDownloadCsv}
                className="btn-primary"
                style={{ flex: 1, padding: '12px' }}
              >
                <Download size={15} />
                <span>{language === 'hi' ? 'CSV डाउनलोड' : 'Download CSV'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
