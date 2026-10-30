import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, Product } from '../../types';
import { PackageCheck, Plus, Calendar, AlertCircle, CheckCircle2, Clock, Filter, X, Eye, Image } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, products, artisans, createOrder, t, language } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [viewProofOrder, setViewProofOrder] = useState<Order | null>(null);

  // New Order Form State
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [selectedArtisanId, setSelectedArtisanId] = useState<string>(artisans[0]?.id || '');
  const [assignedQty, setAssignedQty] = useState<number>(30);
  const [deadline, setDeadline] = useState<string>('2026-11-10');
  const [priority, setPriority] = useState<Order['priority']>('high');
  const [customPieceRate, setCustomPieceRate] = useState<number>(products[0]?.pieceRate || 140);
  const [instructions, setInstructions] = useState<string>('Stitch with reinforced corners and insert clean brass zip.');
  const [hindiInstructions, setHindiInstructions] = useState<string>('कोनों को मजबूत सिलाई दें और साफ पीतल की ज़िप लगाएं।');

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setCustomPieceRate(prod.pieceRate);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId);
    const art = artisans.find((a) => a.id === selectedArtisanId);
    if (!prod || !art) return;

    createOrder({
      productId: prod.id,
      productName: prod.name,
      productHindiName: prod.hindiName,
      productCategory: prod.category,
      artisanId: art.id,
      artisanName: art.name,
      assignedQty: Number(assignedQty),
      completedQty: 0,
      deadline,
      priority,
      status: 'not_started',
      paymentStatus: 'pending',
      pieceRate: Number(customPieceRate),
      requiredMaterials: prod.requiredMaterials.join(', '),
      hindiMaterials: prod.requiredMaterials.join(', '),
      instructions,
      hindiInstructions
    });

    setShowCreateModal(false);
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Create Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--deep-brown)' }}>
            Handicraft Orders & Batch Production
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '2px' }}>
            Assign production runs to women artisans, monitor yield, and verify finished proofs
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
          style={{ padding: '10px 16px', fontSize: '13px' }}
        >
          <Plus size={16} />
          <span>Create & Assign Batch</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--light-border)', paddingBottom: '10px' }}>
        {['all', 'in_progress', 'completed', 'not_started'].map((statusKey) => {
          const isSelected = filterStatus === statusKey;
          const label =
            statusKey === 'all'
              ? `All Batches (${orders.length})`
              : statusKey === 'in_progress'
              ? `In Progress (${orders.filter((o) => o.status === 'in_progress').length})`
              : statusKey === 'completed'
              ? `Completed (${orders.filter((o) => o.status === 'completed').length})`
              : `Not Started (${orders.filter((o) => o.status === 'not_started').length})`;

          return (
            <button
              key={statusKey}
              onClick={() => setFilterStatus(statusKey)}
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

      {/* Orders Table */}
      <div className="artisan-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--light-border)', color: 'var(--muted-grey)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Order #</th>
              <th style={{ padding: '12px 16px' }}>Product</th>
              <th style={{ padding: '12px 16px' }}>Assigned Artisan</th>
              <th style={{ padding: '12px 16px' }}>Yield Progress</th>
              <th style={{ padding: '12px 16px' }}>Rate / Value</th>
              <th style={{ padding: '12px 16px' }}>Deadline</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Proof</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((ord) => {
              const percentage = Math.min(100, Math.round((ord.completedQty / ord.assignedQty) * 100));
              const isCompleted = ord.status === 'completed';

              return (
                <tr key={ord.id} style={{ borderBottom: '1px solid var(--light-border)' }}>
                  {/* Order # */}
                  <td style={{ padding: '14px 16px' }}>
                    <span className="tag-textile" style={{ fontSize: '11px', fontWeight: 700 }}>
                      {ord.orderNumber}
                    </span>
                  </td>

                  {/* Product */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--deep-brown)' }}>{ord.productName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>{ord.productCategory}</div>
                  </td>

                  {/* Artisan */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--deep-brown)' }}>{ord.artisanName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>{ord.artisanId}</div>
                  </td>

                  {/* Yield Progress */}
                  <td style={{ padding: '14px 16px', minWidth: '160px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
                      <span>{ord.completedQty} / {ord.assignedQty} units</span>
                      <span style={{ color: isCompleted ? 'var(--sage-green-dark)' : 'var(--dusty-pink-dark)' }}>{percentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--warm-cream)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${percentage}%`,
                          backgroundColor: isCompleted ? 'var(--sage-green)' : 'var(--dusty-pink)',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </td>

                  {/* Rate & Potential Value */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--deep-brown)' }}>
                      ₹{(ord.assignedQty * ord.pieceRate).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                      @ ₹{ord.pieceRate} / unit
                    </div>
                  </td>

                  {/* Deadline */}
                  <td style={{ padding: '14px 16px', fontSize: '12px' }}>
                    {ord.deadline}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      className={`badge-status ${
                        isCompleted ? 'badge-completed' : ord.status === 'in_progress' ? 'badge-in-progress' : 'badge-not-started'
                      }`}
                      style={{ fontSize: '10px' }}
                    >
                      {ord.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Proof */}
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {ord.proofUrl ? (
                      <button
                        onClick={() => setViewProofOrder(ord)}
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '11px' }}
                      >
                        <Image size={13} />
                        <span>View Proof</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>No proof</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
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
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--deep-brown)' }}>
                Create & Assign Handicraft Batch
              </h3>
              <button onClick={() => setShowCreateModal(false)} style={{ color: 'var(--muted-grey)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Handicraft Product Type
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.hindiName}) - ₹{p.pieceRate}/unit
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Assign to Woman Artisan
                </label>
                <select
                  value={selectedArtisanId}
                  onChange={(e) => setSelectedArtisanId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                >
                  {artisans.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.city} • {a.ngoPartner})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Assigned Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={assignedQty}
                    onChange={(e) => setAssignedQty(Math.max(1, Number(e.target.value)))}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Agreed Piece Rate (₹/unit)
                  </label>
                  <input
                    type="number"
                    min="50"
                    required
                    value={customPieceRate}
                    onChange={(e) => setCustomPieceRate(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Delivery Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                  >
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Artisan Instructions (English)
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  सिलाई निर्देश (हिंदी)
                </label>
                <input
                  type="text"
                  value={hindiInstructions}
                  onChange={(e) => setHindiInstructions(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>
                  Assign Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proof Inspection Modal */}
      {viewProofOrder && (
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
          onClick={() => setViewProofOrder(null)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="tag-textile" style={{ fontSize: '10px' }}>{viewProofOrder.orderNumber}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)', marginTop: '2px' }}>
                  Production Proof by {viewProofOrder.artisanName}
                </h3>
              </div>
              <button onClick={() => setViewProofOrder(null)} style={{ color: 'var(--muted-grey)' }}>
                <X size={18} />
              </button>
            </div>

            <img
              src={viewProofOrder.proofUrl}
              alt="Artisan production proof"
              style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}
            />

            <div style={{ fontSize: '12px', color: 'var(--deep-brown)', backgroundColor: 'var(--warm-cream)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <strong>Artisan Notes:</strong> {viewProofOrder.proofNotes || 'Batch finished and trimmed.'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setViewProofOrder(null)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
