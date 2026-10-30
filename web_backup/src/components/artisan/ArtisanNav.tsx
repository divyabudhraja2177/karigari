import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Home, PackageCheck, IndianRupee, MoreHorizontal, Clock, Layers, ClipboardCheck, User, X, TrendingUp } from 'lucide-react';

export const ArtisanNav: React.FC = () => {
  const { artisanTab, setArtisanTab, t, language } = useApp();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isPrimaryTab = artisanTab === 'home' || artisanTab === 'orders' || artisanTab === 'earnings';

  const selectTab = (tab: typeof artisanTab) => {
    setArtisanTab(tab);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Bottom Floating Navigation Bar */}
      <nav
        style={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid var(--light-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px 6px 12px',
          zIndex: 45,
          boxShadow: '0 -2px 10px rgba(89, 71, 63, 0.06)'
        }}
      >
        {/* Destination 1: Home */}
        <button
          onClick={() => selectTab('home')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 2px',
            color: artisanTab === 'home' ? 'var(--deep-brown)' : 'var(--muted-grey)',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: artisanTab === 'home' ? 'var(--dusty-pink-light)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Home
              size={22}
              color={artisanTab === 'home' ? 'var(--dusty-pink-dark)' : 'var(--muted-grey)'}
              strokeWidth={artisanTab === 'home' ? 2.5 : 2}
            />
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: artisanTab === 'home' ? 700 : 500,
              lineHeight: 1
            }}
          >
            {t.navHome}
          </span>
        </button>

        {/* Destination 2: Orders */}
        <button
          onClick={() => selectTab('orders')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 2px',
            color: artisanTab === 'orders' ? 'var(--deep-brown)' : 'var(--muted-grey)',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: artisanTab === 'orders' ? 'var(--dusty-pink-light)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
          >
            <PackageCheck
              size={22}
              color={artisanTab === 'orders' ? 'var(--dusty-pink-dark)' : 'var(--muted-grey)'}
              strokeWidth={artisanTab === 'orders' ? 2.5 : 2}
            />
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: artisanTab === 'orders' ? 700 : 500,
              lineHeight: 1
            }}
          >
            {t.navOrders}
          </span>
        </button>

        {/* Destination 3: Earnings */}
        <button
          onClick={() => selectTab('earnings')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 2px',
            color: artisanTab === 'earnings' ? 'var(--deep-brown)' : 'var(--muted-grey)',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: artisanTab === 'earnings' ? 'var(--dusty-pink-light)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
          >
            <IndianRupee
              size={22}
              color={artisanTab === 'earnings' ? 'var(--dusty-pink-dark)' : 'var(--muted-grey)'}
              strokeWidth={artisanTab === 'earnings' ? 2.5 : 2}
            />
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: artisanTab === 'earnings' ? 700 : 500,
              lineHeight: 1
            }}
          >
            {t.navEarnings}
          </span>
        </button>

        {/* Secondary Navigation / More Drawer Trigger */}
        <button
          onClick={() => setShowMoreMenu(true)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 2px',
            color: !isPrimaryTab ? 'var(--deep-brown)' : 'var(--muted-grey)',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: !isPrimaryTab ? 'var(--dusty-pink-light)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
          >
            <MoreHorizontal
              size={22}
              color={!isPrimaryTab ? 'var(--dusty-pink-dark)' : 'var(--muted-grey)'}
              strokeWidth={!isPrimaryTab ? 2.5 : 2}
            />
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: !isPrimaryTab ? 700 : 500,
              lineHeight: 1
            }}
          >
            {language === 'hi' ? 'अन्य सुविधाएं' : 'More'}
          </span>
        </button>
      </nav>

      {/* Secondary Features Bottom Sheet Drawer */}
      {showMoreMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 37, 35, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100
          }}
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'var(--white)',
              borderTopLeftRadius: 'var(--radius-xl)',
              borderTopRightRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--light-border)',
              borderBottom: 'none',
              padding: '24px 20px 36px',
              maxWidth: '430px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--warm-cream)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MoreHorizontal size={18} color="var(--deep-brown)" />
                </div>
                <h3 style={{ fontSize: '17px', color: 'var(--deep-brown)', fontWeight: 700 }}>
                  {language === 'hi' ? 'अन्य सुविधाएं व सेवाएं' : 'Craft Services & Tools'}
                </h3>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--warm-cream)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--muted-grey)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Grid of secondary actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Working Hours */}
              <button
                onClick={() => selectTab('hours')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: artisanTab === 'hours' ? 'var(--dusty-pink-light)' : 'var(--warm-cream)',
                  border: artisanTab === 'hours' ? '1.5px solid var(--dusty-pink)' : '1px solid var(--light-border)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}
                >
                  <Clock size={20} color="var(--deep-brown)" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '2px' }}>
                  {t.navHours}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                  {language === 'hi' ? 'दैनिक समय दर्ज करें' : 'Log daily hours'}
                </div>
              </button>

              {/* Materials */}
              <button
                onClick={() => selectTab('materials')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: artisanTab === 'materials' ? 'var(--dusty-pink-light)' : 'var(--warm-cream)',
                  border: artisanTab === 'materials' ? '1.5px solid var(--dusty-pink)' : '1px solid var(--light-border)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}
                >
                  <Layers size={20} color="var(--deep-brown)" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '2px' }}>
                  {t.navMaterials}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                  {language === 'hi' ? 'कपड़ा, ज़िप व धागे' : 'Request supplies'}
                </div>
              </button>

              {/* Impact Surveys */}
              <button
                onClick={() => selectTab('surveys')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: artisanTab === 'surveys' ? 'var(--dusty-pink-light)' : 'var(--warm-cream)',
                  border: artisanTab === 'surveys' ? '1.5px solid var(--dusty-pink)' : '1px solid var(--light-border)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}
                >
                  <ClipboardCheck size={20} color="var(--deep-brown)" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '2px' }}>
                  {t.navSurveys}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                  {language === 'hi' ? 'प्रगति एवं प्रभाव' : 'Impact check-in'}
                </div>
              </button>

              {/* Artisan Profile */}
              <button
                onClick={() => selectTab('profile')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: artisanTab === 'profile' ? 'var(--dusty-pink-light)' : 'var(--warm-cream)',
                  border: artisanTab === 'profile' ? '1.5px solid var(--dusty-pink)' : '1px solid var(--light-border)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}
                >
                  <User size={20} color="var(--deep-brown)" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '2px' }}>
                  {t.navProfile}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                  {language === 'hi' ? 'विवरण व एनजीओ' : 'View craft details'}
                </div>
              </button>

              {/* Data Analytics & Impact Reports (Main Feature from Project Brief) */}
              <button
                onClick={() => selectTab('impact')}
                style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: artisanTab === 'impact' ? 'var(--sage-green-light)' : '#FFFFFF',
                  border: artisanTab === 'impact' ? '2px solid var(--sage-green-dark)' : '1.5px solid var(--sage-green-border)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--sage-green-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <TrendingUp size={20} color="var(--sage-green-dark)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--deep-brown)' }}>
                      {language === 'hi' ? 'डेटा एनालिटिक्स व प्रभाव रिपोर्ट' : 'Impact Analytics & Reports'}
                    </span>
                    <span className="tag-textile" style={{ fontSize: '9px', backgroundColor: 'var(--sage-green-light)', borderColor: 'var(--sage-green)', color: 'var(--sage-green-dark)' }}>
                      {language === 'hi' ? 'मुख्य फीचर' : 'Main Feature'}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>
                    {language === 'hi' ? 'पहले और बाद की आय तुलना व आंकड़े' : 'Before vs After metrics across all artisans'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
