import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, AlertCircle, CheckCircle2, XCircle, Plus, Send, X } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { materials, materialRequests, updateMaterialRequestStatus, showToast } = useApp();

  const [filterReqStatus, setFilterReqStatus] = useState<string>('pending');
  const [showRestockModal, setShowRestockModal] = useState<boolean>(false);
  const [restockMaterialId, setRestockMaterialId] = useState<string>(materials[0]?.id || '');
  const [restockAmount, setRestockAmount] = useState<number>(50);

  const filteredRequests = materialRequests.filter((r) => {
    if (filterReqStatus === 'all') return true;
    return r.status === filterReqStatus;
  });

  const lowStockMaterials = materials.filter((m) => m.inStock <= m.minThreshold);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--deep-brown)' }}>
            Materials Inventory & Artisan Supply Requests
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '2px' }}>
            Monitor central craft supplies, replenish fabrics & zips, and fulfill artisan field requisitions
          </p>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockMaterials.length > 0 && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#FFF8F7',
            border: '1.5px solid #F6CEC7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={22} color="#B43828" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#B43828' }}>
                {lowStockMaterials.length} Raw Materials Low in Stock!
              </div>
              <div style={{ fontSize: '12px', color: 'var(--deep-brown)', marginTop: '2px' }}>
                {lowStockMaterials.map((m) => `${m.name} (${m.inStock} ${m.unit} left)`).join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Materials Stock Cards */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '12px' }}>
          Central Raw Materials Inventory
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {materials.map((mat) => {
            const isLow = mat.inStock <= mat.minThreshold;

            return (
              <div
                key={mat.id}
                className="artisan-card"
                style={{
                  padding: '18px 16px',
                  borderLeft: isLow ? '4px solid #D8A7AD' : '4px solid var(--sage-green)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="tag-textile" style={{ fontSize: '10px' }}>
                      {mat.category}
                    </span>
                    {isLow && (
                      <span style={{ fontSize: '11px', color: '#B43828', fontWeight: 700 }}>
                        Low Stock Alert
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-brown)', marginTop: '6px' }}>
                    {mat.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--muted-grey)', fontFamily: 'var(--font-hindi)' }}>
                    {mat.hindiName}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '1px solid var(--light-border)', paddingTop: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>Available:</span>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: isLow ? '#B43828' : 'var(--deep-brown)' }}>
                      {mat.inStock} {mat.unit}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--muted-grey)' }}>
                    Threshold: {mat.minThreshold} {mat.unit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Artisan Supply Requests Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
              Artisan Supply Requisitions
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
              Requests submitted by artisans for fresh fabric, zips, or thread
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['pending', 'approved', 'fulfilled', 'all'].map((statusKey) => (
              <button
                key={statusKey}
                onClick={() => setFilterReqStatus(statusKey)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: filterReqStatus === statusKey ? 'var(--deep-brown)' : 'var(--white)',
                  color: filterReqStatus === statusKey ? '#FFFFFF' : 'var(--muted-grey)',
                  border: filterReqStatus === statusKey ? 'none' : '1px solid var(--light-border)',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                {statusKey.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="artisan-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--light-border)', color: 'var(--muted-grey)', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Artisan</th>
                <th style={{ padding: '12px 16px' }}>Requested Material</th>
                <th style={{ padding: '12px 16px' }}>Quantity</th>
                <th style={{ padding: '12px 16px' }}>Reason / Note</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => {
                const isPending = req.status === 'pending';
                const isApproved = req.status === 'approved';
                const isFulfilled = req.status === 'fulfilled';

                return (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--light-border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{req.requestDate}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                      {req.artisanName}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{req.materialName}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--deep-brown)' }}>
                      {req.requestedQty} {req.unit}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--muted-grey)', maxWidth: '240px' }}>
                      {req.reason || 'Standard batch requirement'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        className={`badge-status ${
                          isFulfilled ? 'badge-completed' : isApproved ? 'badge-in-progress' : 'badge-not-started'
                        }`}
                        style={{ fontSize: '10px' }}
                      >
                        {req.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      {isPending && (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => updateMaterialRequestStatus(req.id, 'approved')}
                            className="btn-sage"
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateMaterialRequestStatus(req.id, 'rejected')}
                            className="btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '11px', color: '#B43828' }}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      {isApproved && (
                        <button
                          onClick={() => updateMaterialRequestStatus(req.id, 'fulfilled')}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                        >
                          Fulfill & Dispatch
                        </button>
                      )}
                      {isFulfilled && (
                        <span style={{ fontSize: '11px', color: 'var(--sage-green-dark)', fontWeight: 600 }}>
                          ✓ Dispatched
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
