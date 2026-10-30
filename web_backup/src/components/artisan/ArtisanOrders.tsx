import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  PackageCheck,
  Calendar,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  X,
  UploadCloud,
  FileCheck,
  Plus,
  Send,
  Circle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ArtisanOrders: React.FC = () => {
  const { currentUser, orders, updateOrderProgress, updateOrderStatus, createMaterialRequest, materials, t, language, showToast } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const myOrders = orders.filter((o) => o.artisanId === artisanId);

  // Filter tabs: All, In Progress, Completed
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Selected order for progress update modal
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);
  const [newCompletedQty, setNewCompletedQty] = useState<number>(0);
  const [proofNotes, setProofNotes] = useState<string>('');
  const [proofImagePreview, setProofImagePreview] = useState<string>('');

  // Selected order for "Report Problem / Missing Material" modal
  const [problemModalOrder, setProblemModalOrder] = useState<Order | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [problemDescription, setProblemDescription] = useState<string>('');

  const filteredOrders = myOrders.filter((o) => {
    if (filterTab === 'in_progress') return o.status === 'in_progress' || o.status === 'not_started';
    if (filterTab === 'completed') return o.status === 'completed';
    return true;
  });

  const openUpdateModal = (order: Order) => {
    setActiveModalOrder(order);
    setNewCompletedQty(order.completedQty);
    setProofNotes(order.proofNotes || '');
    setProofImagePreview(order.proofUrl || '');
  };

  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalOrder) return;

    const success = updateOrderProgress(
      activeModalOrder.id,
      Number(newCompletedQty),
      proofNotes,
      proofImagePreview || activeModalOrder.proofUrl
    );

    if (success) {
      if (Number(newCompletedQty) === activeModalOrder.assignedQty) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#D8A7AD', '#A8B5A0', '#E9D99A', '#59473F']
          });
        } catch (e) { /* ignore */ }
      }
      setActiveModalOrder(null);
    }
  };

  const handleReportProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemModalOrder) return;

    if (selectedMaterialId) {
      createMaterialRequest(selectedMaterialId, 10, `Reported via Order ${problemModalOrder.orderNumber}: ${problemDescription}`);
    } else {
      showToast(
        language === 'hi'
          ? 'समस्या की सूचना एनजीओ समन्वयक को भेज दी गई है।'
          : 'Issue reported to NGO supervisor.',
        'info'
      );
    }
    setProblemModalOrder(null);
    setProblemDescription('');
    setSelectedMaterialId('');
  };

  const handleSimulatedPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast(language === 'hi' ? 'कृपया केवल छवि (Image) फाइल चुनें' : 'Please upload an image file', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImagePreview(reader.result as string);
        showToast(language === 'hi' ? 'फोटो प्रमाण सफलतापूर्वक संलग्न हुआ' : 'Proof photo attached', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '24px' }}>
      {/* Title & Filter Tabs */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--deep-brown)' }}>
          {t.myOrders}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '2px' }}>
          {language === 'hi'
            ? 'अपने हस्तशिल्प ऑर्डरों का उत्पादन व समयसीमा यहां ट्रैक करें।'
            : 'Track your assigned Indian handicraft batches and log finished items.'}
        </p>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '14px',
            borderBottom: '1px solid var(--light-border)',
            paddingBottom: '8px'
          }}
        >
          <button
            onClick={() => setFilterTab('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: filterTab === 'all' ? 'var(--deep-brown)' : 'transparent',
              color: filterTab === 'all' ? '#FFFFFF' : 'var(--muted-grey)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            {t.allOrdersTab} ({myOrders.length})
          </button>

          <button
            onClick={() => setFilterTab('in_progress')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: filterTab === 'in_progress' ? 'var(--dusty-pink)' : 'transparent',
              color: filterTab === 'in_progress' ? 'var(--deep-brown-dark)' : 'var(--muted-grey)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            {t.inProgressTab} ({myOrders.filter((o) => o.status !== 'completed').length})
          </button>

          <button
            onClick={() => setFilterTab('completed')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: filterTab === 'completed' ? 'var(--sage-green)' : 'transparent',
              color: filterTab === 'completed' ? 'var(--deep-brown-dark)' : 'var(--muted-grey)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            {t.completedTab} ({myOrders.filter((o) => o.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const isCompleted = order.status === 'completed';
            const remaining = Math.max(0, order.assignedQty - order.completedQty);
            const percentage = Math.min(100, Math.round((order.completedQty / order.assignedQty) * 100));

            return (
              <div
                key={order.id}
                className="artisan-card border-stitched-subtle"
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--white)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative'
                }}
              >
                {/* Header row: Order # & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="tag-textile" style={{ fontSize: '11px', fontWeight: 700 }}>
                      {order.orderNumber}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                      {order.productCategory}
                    </span>
                  </div>

                  <span
                    className={`badge-status ${
                      isCompleted
                        ? 'badge-completed'
                        : order.status === 'in_progress'
                        ? 'badge-in-progress'
                        : 'badge-not-started'
                    }`}
                  >
                    {isCompleted ? t.statusCompleted : order.status === 'in_progress' ? t.statusInProgress : t.statusNotStarted}
                  </span>
                </div>

                {/* Main Product Info */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  {/* Product thumbnail */}
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: 'var(--radius-md)',
                      backgroundImage: `url(${order.proofUrl || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid var(--light-border)',
                      flexShrink: 0
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                      {language === 'hi' ? order.productHindiName : order.productName}
                    </h3>

                    {/* Rate & Total Value */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--sage-green-dark)', fontWeight: 700 }}>
                        ₹{order.pieceRate} / {language === 'hi' ? 'वस्तु' : 'unit'}
                      </span>
                      <span style={{ color: 'var(--muted-grey)' }}>•</span>
                      <span style={{ color: 'var(--muted-grey)' }}>
                        {t.totalPotential}: <strong style={{ color: 'var(--deep-brown)' }}>₹{(order.assignedQty * order.pieceRate).toLocaleString('en-IN')}</strong>
                      </span>
                    </div>

                    {/* Deadline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12px', color: 'var(--muted-grey)' }}>
                      <Calendar size={13} color="var(--dusty-pink-dark)" />
                      <span>
                        {language === 'hi' ? 'जमा करने की तारीख:' : 'Deadline:'} <strong style={{ color: 'var(--deep-brown)' }}>{order.deadline}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Quantities */}
                <div
                  style={{
                    backgroundColor: 'var(--warm-cream)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-brown)' }}>
                      {language === 'hi' ? 'उत्पादन स्थिति' : 'Production Yield'}: {order.completedQty} / {order.assignedQty} {language === 'hi' ? 'तैयार' : 'completed'}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: isCompleted ? 'var(--sage-green-dark)' : 'var(--dusty-pink-dark)' }}>
                      {percentage}%
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--white)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: isCompleted ? 'var(--sage-green)' : 'var(--dusty-pink)',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--muted-grey)' }}>
                    <span>{t.assignedQty}: <strong>{order.assignedQty}</strong></span>
                    <span>{t.remainingQty}: <strong style={{ color: remaining > 0 ? '#B43828' : 'var(--sage-green-dark)' }}>{remaining}</strong></span>
                  </div>
                </div>

                {/* Instructions & Materials Accordion */}
                <div style={{ fontSize: '12px', color: 'var(--deep-brown)', borderLeft: '3px solid var(--soft-yellow)', paddingLeft: '10px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--muted-grey)', fontSize: '11px' }}>
                    {t.craftInstructions}:
                  </div>
                  <div style={{ marginTop: '2px' }}>
                    {language === 'hi' ? order.hindiInstructions : order.instructions}
                  </div>
                  <div style={{ marginTop: '4px', color: 'var(--muted-grey)', fontSize: '11px' }}>
                    <strong>{t.materialsRequired}:</strong> {language === 'hi' ? order.hindiMaterials : order.requiredMaterials}
                  </div>
                </div>

                {/* 3 Simple Buttons to Mark Order Status: Not Started, In Progress, Completed */}
                <div
                  style={{
                    backgroundColor: 'var(--warm-cream-alt)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--deep-brown)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{language === 'hi' ? 'सीधे स्थिति चुनें (सरल बटन):' : 'Mark Status (Simple Buttons):'}</span>
                    <span style={{ fontSize: '10px', color: 'var(--muted-grey)' }}>
                      {language === 'hi' ? '1-क्लिक में बदलें' : '1-tap change'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                    {/* 1. Not Started Button */}
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, 'not_started')}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 'var(--radius-sm)',
                        border: order.status === 'not_started' ? '2px solid var(--muted-grey)' : '1px solid var(--light-border)',
                        backgroundColor: order.status === 'not_started' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                        color: order.status === 'not_started' ? 'var(--deep-brown)' : 'var(--muted-grey)',
                        fontWeight: order.status === 'not_started' ? 700 : 500,
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        boxShadow: order.status === 'not_started' ? 'var(--shadow-sm)' : 'none'
                      }}
                    >
                      <Circle size={12} fill={order.status === 'not_started' ? 'var(--muted-grey)' : 'none'} />
                      <span>{t.statusNotStarted}</span>
                    </button>

                    {/* 2. In Progress Button */}
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, 'in_progress')}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 'var(--radius-sm)',
                        border: order.status === 'in_progress' ? '2px solid var(--dusty-pink-dark)' : '1px solid var(--light-border)',
                        backgroundColor: order.status === 'in_progress' ? 'var(--dusty-pink-light)' : 'rgba(255, 255, 255, 0.6)',
                        color: order.status === 'in_progress' ? 'var(--dusty-pink-dark)' : 'var(--muted-grey)',
                        fontWeight: order.status === 'in_progress' ? 700 : 500,
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        boxShadow: order.status === 'in_progress' ? 'var(--shadow-sm)' : 'none'
                      }}
                    >
                      <Clock size={12} />
                      <span>{t.statusInProgress}</span>
                    </button>

                    {/* 3. Completed Button */}
                    <button
                      type="button"
                      onClick={() => {
                        updateOrderStatus(order.id, 'completed');
                        try {
                          confetti({
                            particleCount: 80,
                            spread: 60,
                            origin: { y: 0.6 },
                            colors: ['#D8A7AD', '#A8B5A0', '#E9D99A', '#59473F']
                          });
                        } catch (e) {}
                      }}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 'var(--radius-sm)',
                        border: isCompleted ? '2px solid var(--sage-green-dark)' : '1px solid var(--light-border)',
                        backgroundColor: isCompleted ? 'var(--sage-green-light)' : 'rgba(255, 255, 255, 0.6)',
                        color: isCompleted ? 'var(--sage-green-dark)' : 'var(--muted-grey)',
                        fontWeight: isCompleted ? 700 : 500,
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        boxShadow: isCompleted ? 'var(--shadow-sm)' : 'none'
                      }}
                    >
                      <CheckCircle2 size={12} />
                      <span>{t.statusCompleted}</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  {!isCompleted ? (
                    <>
                      <button
                        onClick={() => openUpdateModal(order)}
                        className="btn-primary"
                        style={{ flex: 1, padding: '12px 14px', fontSize: '13px' }}
                      >
                        <PackageCheck size={16} />
                        <span>{t.updateProgressBtn}</span>
                      </button>

                      <button
                        onClick={() => setProblemModalOrder(order)}
                        className="btn-secondary"
                        style={{ padding: '12px', fontSize: '12px' }}
                        title={t.reportIssueBtn}
                      >
                        <AlertTriangle size={15} color="var(--deep-brown)" />
                      </button>
                    </>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: 'var(--sage-green-light)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--sage-green-dark)', fontWeight: 600 }}>
                        <CheckCircle2 size={16} />
                        <span>{language === 'hi' ? 'बैच पूरा हुआ और निरीक्षण हेतु जमा है' : 'Batch completed & ready for inspection'}</span>
                      </div>
                      <span className="badge-status badge-in-progress" style={{ fontSize: '10px' }}>
                        {order.paymentStatus === 'paid' ? t.statusPaid : order.paymentStatus === 'approved' ? t.statusApproved : t.statusCalculated}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="artisan-card"
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <PackageCheck size={36} color="var(--dusty-pink)" />
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
              {language === 'hi' ? 'इस श्रेणी में कोई ऑर्डर नहीं है' : 'No orders in this category'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted-grey)', maxWidth: '280px' }}>
              {language === 'hi'
                ? 'नया हस्तशिल्प कार्य मिलने पर आपको यहां दिखाई देगा।'
                : 'Assigned textile batches will be listed here.'}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Update Progress Modal */}
      {activeModalOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 37, 35, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100
          }}
          onClick={() => setActiveModalOrder(null)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'var(--white)',
              borderTopLeftRadius: 'var(--radius-xl)',
              borderTopRightRadius: 'var(--radius-xl)',
              padding: '24px 20px 32px',
              maxWidth: '430px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span className="tag-textile" style={{ fontSize: '10px' }}>
                  {activeModalOrder.orderNumber}
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--deep-brown)', marginTop: '4px' }}>
                  {language === 'hi' ? activeModalOrder.productHindiName : activeModalOrder.productName}
                </h3>
              </div>
              <button onClick={() => setActiveModalOrder(null)} style={{ padding: '6px', color: 'var(--muted-grey)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProgressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Stepper / Completed Count Input */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)', display: 'block', marginBottom: '6px' }}>
                  {t.enterCompletedCount}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Quick increment buttons for low digital literacy */}
                  <button
                    type="button"
                    onClick={() => setNewCompletedQty((prev) => Math.min(activeModalOrder.assignedQty, Number(prev) + 1))}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--warm-cream)',
                      border: '1.5px solid var(--light-border)',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: 'var(--deep-brown)'
                    }}
                  >
                    +1 {language === 'hi' ? 'तैयार' : ''}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCompletedQty((prev) => Math.min(activeModalOrder.assignedQty, Number(prev) + 5))}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--dusty-pink-light)',
                      border: '1.5px solid var(--dusty-pink)',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: 'var(--deep-brown)'
                    }}
                  >
                    +5 {language === 'hi' ? 'तैयार' : ''}
                  </button>

                  <input
                    type="number"
                    min="0"
                    max={activeModalOrder.assignedQty}
                    value={newCompletedQty}
                    onChange={(e) => setNewCompletedQty(Math.max(0, Math.min(activeModalOrder.assignedQty, Number(e.target.value))))}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--dusty-pink)',
                      fontSize: '20px',
                      fontWeight: 700,
                      textAlign: 'center',
                      color: 'var(--deep-brown)'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setNewCompletedQty(0)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--light-border)',
                        backgroundColor: newCompletedQty === 0 ? 'var(--warm-cream-alt)' : '#FFFFFF',
                        fontSize: '11px',
                        color: 'var(--muted-grey)',
                        cursor: 'pointer'
                      }}
                    >
                      {language === 'hi' ? '0 (शुरू नहीं)' : '0 (Not Started)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCompletedQty(activeModalOrder.assignedQty)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--sage-green)',
                        backgroundColor: newCompletedQty === activeModalOrder.assignedQty ? 'var(--sage-green-light)' : '#FFFFFF',
                        fontSize: '11px',
                        color: 'var(--sage-green-dark)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {language === 'hi' ? `सभी ${activeModalOrder.assignedQty} पूर्ण` : `All ${activeModalOrder.assignedQty} Completed`}
                    </button>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                    {language === 'hi' ? 'कुल संख्या:' : 'Assigned Total:'} {activeModalOrder.assignedQty}
                  </div>
                </div>
              </div>

              {/* Photo Proof Upload Simulation */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)', display: 'block', marginBottom: '6px' }}>
                  {t.uploadProofBtn} ({language === 'hi' ? 'वैकल्पिक' : 'Optional'})
                </label>
                <div
                  style={{
                    border: '1.5px dashed var(--light-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: 'var(--warm-cream)',
                    position: 'relative'
                  }}
                >
                  {proofImagePreview ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={proofImagePreview}
                        alt="Proof preview"
                        style={{ maxHeight: '110px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '12px', color: 'var(--sage-green-dark)', fontWeight: 600 }}>
                        ✓ {t.proofUploaded}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <Camera size={26} color="var(--dusty-pink-dark)" style={{ margin: '0 auto 6px' }} />
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-brown)' }}>
                        {language === 'hi' ? 'कैमरा या गैलरी से फोटो चुनें' : 'Take or upload batch photo'}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--muted-grey)', marginTop: '2px' }}>
                        {t.photoUploadTip}
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSimulatedPhotoUpload}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>

              {/* Proof Notes */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-brown)', display: 'block', marginBottom: '4px' }}>
                  {language === 'hi' ? 'टिप्पणी / विवरण (वैकल्पिक)' : 'Notes / Inspection remarks'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'उदा. 24 पाउच सिल दिए गए हैं, धागा काट दिया गया है' : 'e.g. 24 pouches finished and trimmed'}
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--light-border)'
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModalOrder(null)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 2, padding: '12px' }}
                >
                  <span>{t.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Report Problem / Missing Material Modal */}
      {problemModalOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 37, 35, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 100
          }}
          onClick={() => setProblemModalOrder(null)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#B43828" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                  {t.reportIssueBtn}
                </h3>
              </div>
              <button onClick={() => setProblemModalOrder(null)} style={{ color: 'var(--muted-grey)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReportProblem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-brown)', display: 'block', marginBottom: '4px' }}>
                  {language === 'hi' ? 'किस सामग्री की कमी है?' : 'Select missing raw material:'}
                </label>
                <select
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--light-border)',
                    backgroundColor: 'var(--white)'
                  }}
                >
                  <option value="">{language === 'hi' ? '-- सामग्री चुनें --' : '-- Choose material --'}</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {language === 'hi' ? m.hindiName : m.name} ({m.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-brown)', display: 'block', marginBottom: '4px' }}>
                  {language === 'hi' ? 'समस्या का संक्षिप्त विवरण:' : 'Describe the problem:'}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={language === 'hi' ? 'उदा. सिलाई के धागे समाप्त हो गए हैं या ज़िपर अटक रहा है' : 'e.g. running out of brass zips or fabric torn'}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--light-border)',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setProblemModalOrder(null)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  <Send size={14} />
                  <span>{language === 'hi' ? 'भेजें' : 'Submit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
