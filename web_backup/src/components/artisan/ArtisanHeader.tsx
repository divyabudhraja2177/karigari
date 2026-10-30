import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { Globe, LogOut, ArrowLeftRight, User, ShieldCheck } from 'lucide-react';

export const ArtisanHeader: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    availableUsers,
    language,
    setLanguage,
    t,
    viewMode,
    setViewMode,
    setHasPassedWelcome
  } = useApp();

  const [showSwitchModal, setShowSwitchModal] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  return (
    <>
      <header
        style={{
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--light-border)',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Brand Logo */}
        <Logo size="sm" showTagline={false} />

        {/* Right actions: Language Switcher, Role Switcher, Profile/Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--dusty-pink)',
              backgroundColor: 'var(--dusty-pink-light)',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--deep-brown)',
              cursor: 'pointer'
            }}
            title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
          >
            <Globe size={14} color="var(--dusty-pink-dark)" />
            <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>

          {/* Quick Role / Profile Switcher Modal Trigger */}
          <button
            onClick={() => setShowSwitchModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--light-border)',
              backgroundColor: 'var(--warm-cream)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--deep-brown)',
              cursor: 'pointer'
            }}
            title={t.switchRoleTo}
          >
            <ArrowLeftRight size={13} />
            <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {language === 'hi' ? currentUser.hindiName || currentUser.name : currentUser.name}
            </span>
          </button>
        </div>
      </header>

      {/* Switch Role / Quick User Modal */}
      {showSwitchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 37, 35, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 100
          }}
          onClick={() => setShowSwitchModal(false)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--light-border)',
              padding: '24px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', color: 'var(--deep-brown)', fontWeight: 700 }}>
                {t.switchRoleTo}
              </h3>
              <button
                onClick={() => setShowSwitchModal(false)}
                style={{ fontSize: '13px', color: 'var(--muted-grey)', padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginBottom: '14px' }}>
              {language === 'hi'
                ? 'कारीगर और एडमिन दोनों अनुभवों का परीक्षण करने के लिए किसी भी प्रोफाइल को चुनें:'
                : 'Select any profile to experience the artisan app or admin impact dashboard:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {availableUsers.map((u) => {
                const isCurrent = currentUser.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowSwitchModal(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: isCurrent ? '2px solid var(--dusty-pink)' : '1px solid var(--light-border)',
                      backgroundColor: isCurrent ? 'var(--dusty-pink-light)' : 'var(--white)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: u.role === 'admin' ? 'var(--soft-yellow)' : 'var(--dusty-pink)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px',
                          color: 'var(--deep-brown)'
                        }}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--deep-brown)' }}>
                          {language === 'hi' ? u.hindiName : u.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                          {u.role === 'admin'
                            ? (language === 'hi' ? 'व्यवस्थापक (Admin Dashboard)' : 'Business Admin (Dashboard)')
                            : (language === 'hi' ? 'महिला कारीगर (Mobile App)' : 'Artisan (Mobile Experience)')}
                        </div>
                      </div>
                    </div>
                    {isCurrent && (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dusty-pink-dark)' }}>
                        ✓ {language === 'hi' ? 'सक्रिय' : 'Active'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                marginTop: '18px',
                paddingTop: '14px',
                borderTop: '1px solid var(--light-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <button
                onClick={() => {
                  setHasPassedWelcome(false);
                  setShowSwitchModal(false);
                }}
                style={{ fontSize: '12px', color: 'var(--muted-grey)', textDecoration: 'underline' }}
              >
                {language === 'hi' ? 'भाषा स्वागत स्क्रीन पर लौटें' : 'Back to Welcome Screen'}
              </button>
              <button
                onClick={() => {
                  setShowSwitchModal(false);
                }}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
