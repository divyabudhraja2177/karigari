import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  PackageCheck,
  IndianRupee,
  Clock,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Layers,
  ClipboardCheck,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const ArtisanHome: React.FC = () => {
  const {
    currentUser,
    orders,
    workingHours,
    earnings,
    t,
    language,
    setArtisanTab,
    artisans
  } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const artisanProfile = artisans.find((a) => a.id === artisanId);

  // Active assigned orders
  const myOrders = orders.filter((o) => o.artisanId === artisanId);
  const activeOrders = myOrders.filter((o) => o.status === 'in_progress' || o.status === 'not_started');
  const completedThisMonth = myOrders.filter((o) => o.status === 'completed');

  // Next order deadline
  const urgentOrder = activeOrders.sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  )[0];

  // Calculate current month's earnings
  const myEarnings = earnings.filter((e) => e.artisanId === artisanId);
  const totalEarnedThisMonth = myEarnings.reduce((sum, e) => sum + e.amount, 0);
  const pendingApprovalAmount = myEarnings
    .filter((e) => e.status === 'calculated')
    .reduce((sum, e) => sum + e.amount, 0);

  // Calculate hours worked this week
  const myHours = workingHours.filter((h) => h.artisanId === artisanId);
  const hoursThisWeek = myHours.reduce((sum, h) => sum + h.durationHours, 0);

  // Recent activity
  const recentActivities = [
    ...myHours.slice(0, 2).map((h) => ({
      title: language === 'hi' ? `${h.durationHours} घंटे का कार्य दर्ज किया गया` : `Logged ${h.durationHours} crafting hours`,
      subtitle: `${h.date} • ${h.orderNumber || ''}`,
      time: h.submittedAt
    })),
    ...myOrders.filter((o) => o.status === 'completed').slice(0, 1).map((o) => ({
      title: language === 'hi' ? `ऑर्डर पूर्ण हुआ: ${o.productHindiName}` : `Completed order: ${o.productName}`,
      subtitle: `${o.completedQty} units • ${o.orderNumber}`,
      time: o.completedAt || o.createdAt
    }))
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '24px' }}>
      {/* Hero Welcome Header with subtle botanical motif from 1.png */}
      <div
        className="botanical-watermark"
        style={{
          background: 'linear-gradient(135deg, #F6F0E7 0%, #FFFFFF 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--light-border)',
          padding: '24px 20px',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="tag-textile" style={{ backgroundColor: 'var(--dusty-pink-light)', borderColor: 'var(--dusty-pink)' }}>
                <Sparkles size={12} color="var(--dusty-pink-dark)" />
                {artisanProfile?.ngoPartner || 'Karigari Partner'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
                {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--deep-brown)', lineHeight: 1.2 }}>
              {language === 'hi' ? `नमस्ते, ${currentUser.hindiName || currentUser.name} जी` : `Namaste, ${currentUser.name}`}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '4px' }}>
              {language === 'hi'
                ? 'आज का आपका काम और कमाई का विवरण नीचे देखें।'
                : 'Here is your daily craft progress and verified earnings.'}
            </p>
          </div>

          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundImage: `url(${currentUser.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '2.5px solid var(--dusty-pink)',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0
            }}
          />
        </div>
      </div>

      {/* QUESTION 1 & 2: What work do I have? & How much have I earned? */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Card 1: What work do I have? */}
        <div
          onClick={() => setArtisanTab('orders')}
          className="artisan-card artisan-card-interactive"
          style={{
            padding: '18px 16px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderLeft: '4px solid var(--dusty-pink)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
                {t.q1WorkTitle}
              </span>
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
                <PackageCheck size={18} color="var(--dusty-pink-dark)" />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--deep-brown)' }}>
              {activeOrders.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted-grey)', marginTop: '2px' }}>
              {activeOrders.length === 1 ? t.q1WorkDesc : t.q1WorkDescPlural}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--dusty-pink-dark)',
              marginTop: '12px'
            }}
          >
            <span>{t.btnViewOrders}</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Card 2: How much have I earned? */}
        <div
          onClick={() => setArtisanTab('earnings')}
          className="artisan-card artisan-card-interactive"
          style={{
            padding: '18px 16px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderLeft: '4px solid var(--sage-green)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
                {t.q2EarnTitle}
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--sage-green-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IndianRupee size={18} color="var(--sage-green-dark)" />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--deep-brown)' }}>
              ₹{totalEarnedThisMonth.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>
              {t.q2EarnDesc}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--sage-green-dark)',
              marginTop: '12px'
            }}
          >
            <span>{language === 'hi' ? 'खाता देखें' : 'View Ledger'}</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* QUESTION 3: What do I need to complete today? (Urgent Deadline Card) */}
      {urgentOrder ? (
        <div
          className="artisan-card border-stitched"
          style={{
            padding: '18px',
            backgroundColor: '#FFFCFA',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#FDF1EF',
                color: '#B43828',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              <AlertCircle size={13} />
              {t.q3TodayTitle}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
              {t.orderNumber} {urgentOrder.orderNumber}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginTop: '10px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                {language === 'hi' ? urgentOrder.productHindiName : urgentOrder.productName}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--muted-grey)', marginTop: '3px' }}>
                {language === 'hi' ? urgentOrder.hindiInstructions : urgentOrder.instructions}
              </p>

              {/* Progress bar */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  <span>{language === 'hi' ? 'तैयार वस्तुएं:' : 'Progress:'} {urgentOrder.completedQty} / {urgentOrder.assignedQty}</span>
                  <span style={{ color: 'var(--dusty-pink-dark)' }}>
                    {Math.round((urgentOrder.completedQty / urgentOrder.assignedQty) * 100)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--warm-cream)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(urgentOrder.completedQty / urgentOrder.assignedQty) * 100}%`,
                      backgroundColor: 'var(--dusty-pink)',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setArtisanTab('orders')}
              className="btn-primary"
              style={{ padding: '10px 14px', fontSize: '13px', flexShrink: 0 }}
            >
              <span>{t.updateProgressBtn}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="artisan-card"
          style={{
            padding: '16px',
            backgroundColor: 'var(--sage-green-light)',
            borderColor: 'var(--sage-green-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Award size={24} color="var(--sage-green-dark)" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--sage-green-dark)' }}>
              {language === 'hi' ? 'सभी कार्य समय पर पूर्ण हैं!' : 'All scheduled crafts up to date!'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
              {language === 'hi' ? 'नया बैच जल्द ही सौंपा जाएगा।' : 'New craft orders will be assigned soon.'}
            </div>
          </div>
        </div>
      )}

      {/* QUESTION 4: What should I do next? (Two Prominent Primary Buttons + Quick Services) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {t.q4NextTitle}
        </div>

        {/* 2 Prominent Large Buttons as required */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={() => setArtisanTab('hours')}
            className="btn-primary"
            style={{
              padding: '16px 14px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-card)',
              textAlign: 'center'
            }}
          >
            <Clock size={22} color="var(--deep-brown-dark)" />
            <span style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.2 }}>
              {t.btnLogHours}
            </span>
            <span style={{ fontSize: '11px', opacity: 0.85, fontWeight: 500 }}>
              {language === 'hi' ? 'समय दर्ज करें' : 'Record craft time'}
            </span>
          </button>

          <button
            onClick={() => setArtisanTab('orders')}
            className="btn-sage"
            style={{
              padding: '16px 14px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-card)',
              textAlign: 'center'
            }}
          >
            <PackageCheck size={22} color="var(--deep-brown-dark)" />
            <span style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.2 }}>
              {t.btnViewOrders}
            </span>
            <span style={{ fontSize: '11px', opacity: 0.85, fontWeight: 500 }}>
              {language === 'hi' ? 'ऑर्डर सूची व प्रगति' : 'Track production'}
            </span>
          </button>
        </div>

        {/* 2 Secondary Action Shortcuts: Materials & Impact Survey */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
          <button
            onClick={() => setArtisanTab('materials')}
            className="btn-secondary"
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '10px',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--warm-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Layers size={16} color="var(--deep-brown)" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--deep-brown)' }}>
                {t.btnRequestMaterials}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted-grey)' }}>
                {language === 'hi' ? 'कच्चा माल मांगें' : 'Cloth, zips, thread'}
              </div>
            </div>
          </button>

          <button
            onClick={() => setArtisanTab('surveys')}
            className="btn-secondary"
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '10px',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--warm-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ClipboardCheck size={16} color="var(--deep-brown)" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--deep-brown)' }}>
                {t.btnTakeSurvey}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted-grey)' }}>
                {language === 'hi' ? 'प्रभाव समीक्षा' : 'Impact questionnaire'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Craft Summary Row: Hours this week & Orders completed */}
      <div
        className="artisan-card"
        style={{
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          backgroundColor: 'var(--white)'
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
            {t.hoursThisWeek}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--deep-brown)' }}>
              {hoursThisWeek}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
              {language === 'hi' ? 'घंटे' : 'hrs'}
            </span>
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--light-border)', paddingLeft: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
            {t.ordersCompletedMonth}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--sage-green-dark)' }}>
              {completedThisMonth.length}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
              {language === 'hi' ? 'ऑर्डर' : 'orders'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Craft Activity */}
      <div className="artisan-card" style={{ padding: '18px 20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '14px' }}>
          {t.recentActivity}
        </div>

        {recentActivities.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.map((act, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  paddingBottom: idx !== recentActivities.length - 1 ? '12px' : '0',
                  borderBottom: idx !== recentActivities.length - 1 ? '1px solid var(--light-border)' : 'none'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--dusty-pink-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px',
                    flexShrink: 0
                  }}
                >
                  <TrendingUp size={14} color="var(--dusty-pink-dark)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--deep-brown)' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>
                    {act.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: 'var(--muted-grey)', textAlign: 'center', padding: '12px 0' }}>
            {t.noRecentActivity}
          </div>
        )}
      </div>
    </div>
  );
};
