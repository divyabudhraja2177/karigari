import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Send, AlertTriangle, CheckCircle2, Clock, Plus, Package } from 'lucide-react';

export const ArtisanMaterials: React.FC = () => {
  const { currentUser, materials, materialRequests, createMaterialRequest, t, language } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const myRequests = materialRequests.filter((r) => r.artisanId === artisanId);

  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[0]?.id || '');
  const [requestedQty, setRequestedQty] = useState<number>(10);
  const [reason, setReason] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialId || requestedQty <= 0) return;

    createMaterialRequest(selectedMaterialId, Number(requestedQty), reason);
    setReason('');
    setRequestedQty(10);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--deep-brown)' }}>
          {t.materialsTitle}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '2px' }}>
          {t.materialsSubtitle}
        </p>
      </div>

      {/* Available Raw Materials Grid */}
      <div>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '10px' }}>
          {t.assignedMaterials}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="artisan-card"
              style={{
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <div>
                <span className="tag-textile" style={{ fontSize: '10px' }}>
                  {mat.category}
                </span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)', marginTop: '4px' }}>
                  {language === 'hi' ? mat.hindiName : mat.name}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>{t.inStock}:</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--sage-green-dark)' }}>
                  {mat.inStock} {mat.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supply Request Form */}
      <div
        className="artisan-card border-stitched"
        style={{
          padding: '20px 18px',
          backgroundColor: 'var(--white)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--dusty-pink-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Layers size={18} color="var(--dusty-pink-dark)" />
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
            {t.requestSuppliesBtn}
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--deep-brown)', display: 'block', marginBottom: '4px' }}>
              {t.materialName}
            </label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--light-border)',
                backgroundColor: 'var(--white)'
              }}
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {language === 'hi' ? m.hindiName : m.name} ({m.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--deep-brown)', display: 'block', marginBottom: '4px' }}>
              {t.requestedQuantity}
            </label>
            <input
              type="number"
              min="1"
              required
              value={requestedQty}
              onChange={(e) => setRequestedQty(Math.max(1, Number(e.target.value)))}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--light-border)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-brown)', display: 'block', marginBottom: '4px' }}>
              {t.reasonForRequest}
            </label>
            <input
              type="text"
              placeholder={t.reasonPlaceholder}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--light-border)'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '12px', fontSize: '14px', marginTop: '4px' }}
          >
            <Send size={15} />
            <span>{t.submitRequestBtn}</span>
          </button>
        </form>
      </div>

      {/* Request History */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '12px' }}>
          {t.requestHistory}
        </h2>

        {myRequests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myRequests.map((req) => {
              const isFulfilled = req.status === 'fulfilled';
              const isApproved = req.status === 'approved';
              const isPending = req.status === 'pending';

              return (
                <div
                  key={req.id}
                  className="artisan-card"
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                      {req.requestedQty} {req.unit} • {req.materialName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>
                      {req.requestDate} {req.reason ? `• "${req.reason}"` : ''}
                    </div>
                  </div>

                  <span
                    className={`badge-status ${
                      isFulfilled ? 'badge-completed' : isApproved ? 'badge-in-progress' : 'badge-not-started'
                    }`}
                    style={{ fontSize: '11px' }}
                  >
                    {isFulfilled ? t.statusFulfilled : isApproved ? t.statusApproved : t.statusPending}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted-grey)', fontSize: '13px' }}>
            {language === 'hi' ? 'कोई पूर्व अनुरोध नहीं है।' : 'No supply requests recorded.'}
          </div>
        )}
      </div>
    </div>
  );
};
