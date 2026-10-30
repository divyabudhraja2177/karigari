import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { WelcomeScreen } from './components/artisan/WelcomeScreen';
import { ArtisanHeader } from './components/artisan/ArtisanHeader';
import { ArtisanNav } from './components/artisan/ArtisanNav';
import { ArtisanHome } from './components/artisan/ArtisanHome';
import { ArtisanOrders } from './components/artisan/ArtisanOrders';
import { ArtisanEarnings } from './components/artisan/ArtisanEarnings';
import { ArtisanHours } from './components/artisan/ArtisanHours';
import { ArtisanMaterials } from './components/artisan/ArtisanMaterials';
import { ArtisanSurveys } from './components/artisan/ArtisanSurveys';
import { ArtisanProfile } from './components/artisan/ArtisanProfile';
import { MobileImpactAnalytics } from './components/artisan/MobileImpactAnalytics';
import { ToastContainer } from './components/common/ToastContainer';
import { Smartphone, Monitor, TrendingUp, Globe, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    hasPassedWelcome,
    artisanTab,
    setArtisanTab,
    isSimulatedDevice,
    setIsSimulatedDevice,
    currentUser,
    setCurrentUser,
    availableUsers,
    language,
    setLanguage
  } = useApp();

  // 1. Welcome & Language selection screen
  if (!hasPassedWelcome) {
    return <WelcomeScreen />;
  }

  // 2. Mobile App View (Everything is 100% inside the Mobile Smartphone Container)
  const renderMobileContent = () => {
    switch (artisanTab) {
      case 'home':
        return <ArtisanHome />;
      case 'orders':
        return <ArtisanOrders />;
      case 'earnings':
        return <ArtisanEarnings />;
      case 'hours':
        return <ArtisanHours />;
      case 'materials':
        return <ArtisanMaterials />;
      case 'surveys':
        return <ArtisanSurveys />;
      case 'profile':
        return <ArtisanProfile />;
      case 'impact':
        return <MobileImpactAnalytics />;
      default:
        return <ArtisanHome />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#EBE3D8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isSimulatedDevice ? '24px 12px' : '0'
      }}
    >
      {/* Top Reviewer Controls Bar (Accessible on desktop to toggle between views) */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--light-border)',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--deep-brown)',
          zIndex: 60,
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 700 }}>Karigari Mobile App</span>
          <span style={{ color: 'var(--muted-grey)' }}>•</span>
          <span style={{ color: 'var(--dusty-pink-dark)', fontWeight: 600 }}>
            {currentUser.name} ({language === 'hi' ? 'हिंदी' : 'English'})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Frame Toggle */}
          <button
            onClick={() => setIsSimulatedDevice(!isSimulatedDevice)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--light-border)',
              backgroundColor: isSimulatedDevice ? 'var(--dusty-pink-light)' : '#FFFFFF',
              fontWeight: 600
            }}
            title="Toggle Smartphone Frame Mockup"
          >
            {isSimulatedDevice ? <Monitor size={14} /> : <Smartphone size={14} />}
            <span>{isSimulatedDevice ? 'Full Screen View' : 'Device Frame View'}</span>
          </button>

          {/* Quick Toggle for Mobile Impact Analytics */}
          <button
            onClick={() => {
              if (artisanTab === 'impact') {
                setArtisanTab('home');
              } else {
                setArtisanTab('impact');
              }
            }}
            className={artisanTab === 'impact' ? 'btn-primary' : 'btn-sage'}
            style={{ padding: '5px 12px', fontSize: '11px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <TrendingUp size={13} />
            <span>{artisanTab === 'impact' ? 'Artisan Home' : 'Impact Analytics (Mobile)'}</span>
          </button>
        </div>
      </div>

      {/* Main Artisan App Container */}
      <div
        className={isSimulatedDevice ? 'mobile-simulator-frame animate-fade-in' : ''}
        style={{
          width: '100%',
          maxWidth: isSimulatedDevice ? '430px' : '480px',
          minHeight: isSimulatedDevice ? '860px' : '100vh',
          backgroundColor: 'var(--warm-cream)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isSimulatedDevice ? 'var(--shadow-lg)' : 'none',
          position: 'relative',
          margin: '0 auto'
        }}
      >
        {/* Device Notch if simulated */}
        {isSimulatedDevice && <div className="mobile-notch" />}

        {/* Header */}
        <ArtisanHeader />

        {/* Content Body */}
        <main style={{ flex: 1, padding: '16px 16px 20px', overflowY: 'auto' }}>
          {renderMobileContent()}
        </main>

        {/* Bottom Nav */}
        <ArtisanNav />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
      <ToastContainer />
    </AppProvider>
  );
};

export default App;
