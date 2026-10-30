import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { ArrowRight, Check, Sparkles, UserCheck } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { language, setLanguage, t, setHasPassedWelcome, currentUser, setCurrentUser, availableUsers } = useApp();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--warm-cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Botanical Watercolor Illustration Backdrop inspired by Reference Image 1 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '42%',
          backgroundImage: "url('/assets/1.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          opacity: 0.85,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Soft watercolor ambient wash overlay inspired by Reference Image 2 */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(216, 167, 173, 0.35) 0%, rgba(233, 217, 154, 0.2) 60%, transparent 80%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Main Welcome Card */}
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--light-border)',
          boxShadow: 'var(--shadow-lg)',
          padding: '36px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Logo */}
        <Logo size="lg" showTagline={false} />

        {/* Tagline */}
        <div style={{ marginTop: '16px' }}>
          <h2
            className="brand-heading"
            style={{
              fontSize: '20px',
              color: 'var(--deep-brown)',
              marginBottom: '6px'
            }}
          >
            {language === 'hi' ? 'हुनर से आत्मनिर्भरता तक' : 'Empowering Hands. Preserving Heritage.'}
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--muted-grey)',
              lineHeight: 1.5,
              maxWidth: '340px',
              margin: '0 auto'
            }}
          >
            {t.welcomeMessage}
          </p>
        </div>

        {/* Handcrafted Stitched Accent Line inspired by Reference Image 3 */}
        <div
          style={{
            width: '100%',
            margin: '24px 0 20px',
            borderBottom: '1.5px dashed var(--dusty-pink)',
            opacity: 0.7
          }}
        />

        {/* Prominent Language Selection with High Visibility */}
        <div style={{ width: '100%', textAlign: 'left' }}>
          <label
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--deep-brown)',
              display: 'block',
              marginBottom: '10px'
            }}
          >
            {t.chooseLanguage} / अपनी भाषा चुनें
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Hindi Option */}
            <button
              onClick={() => setLanguage('hi')}
              style={{
                padding: '16px 14px',
                borderRadius: 'var(--radius-md)',
                border: language === 'hi' ? '2.5px solid var(--dusty-pink)' : '1.5px solid var(--light-border)',
                backgroundColor: language === 'hi' ? 'var(--dusty-pink-light)' : 'var(--white)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                position: 'relative'
              }}
            >
              {language === 'hi' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--dusty-pink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                </div>
              )}
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--deep-brown)', fontFamily: 'var(--font-hindi)' }}>
                हिंदी
              </span>
              <span style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                नमस्ते व स्वागत
              </span>
            </button>

            {/* English Option */}
            <button
              onClick={() => setLanguage('en')}
              style={{
                padding: '16px 14px',
                borderRadius: 'var(--radius-md)',
                border: language === 'en' ? '2.5px solid var(--dusty-pink)' : '1.5px solid var(--light-border)',
                backgroundColor: language === 'en' ? 'var(--dusty-pink-light)' : 'var(--white)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                position: 'relative'
              }}
            >
              {language === 'en' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--dusty-pink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                </div>
              )}
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                English
              </span>
              <span style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                Craft Hub Portal
              </span>
            </button>
          </div>
        </div>

        {/* Quick User Persona Selector for Testing */}
        <div style={{ width: '100%', marginTop: '22px', textAlign: 'left' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--muted-grey)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px'
            }}
          >
            <UserCheck size={14} />
            {t.quickLoginAs}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {availableUsers.map((u) => {
              const isSelected = currentUser.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setCurrentUser(u)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1.5px solid var(--sage-green)' : '1px solid var(--light-border)',
                    backgroundColor: isSelected ? 'var(--sage-green-light)' : 'var(--white)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: u.role === 'admin' ? 'var(--soft-yellow)' : 'var(--dusty-pink)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                        color: 'var(--deep-brown)'
                      }}
                    >
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--deep-brown)' }}>
                        {language === 'hi' ? u.hindiName : u.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                        {u.role === 'admin' ? (language === 'hi' ? 'संस्थापक एवं एडमिन' : 'Founder & Admin') : (language === 'hi' ? 'कारीगर साथी' : 'Artisan Member')}
                      </div>
                    </div>
                  </div>
                  {isSelected && <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--sage-green-dark)' }}>✓ {language === 'hi' ? 'सक्रिय' : 'Selected'}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => setHasPassedWelcome(true)}
          className="btn-primary"
          style={{
            width: '100%',
            marginTop: '26px',
            padding: '16px 20px',
            fontSize: '16px',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <span>{t.continueBtn}</span>
          <ArrowRight size={18} />
        </button>

        {/* Small craft trust badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '16px',
            fontSize: '11px',
            color: 'var(--muted-grey)'
          }}
        >
          <Sparkles size={12} color="var(--dusty-pink-dark)" />
          <span>{language === 'hi' ? 'मुंबई और दिल्ली के स्वयंसेवी संगठनों के सहयोग से' : 'In partnership with community NGOs in Mumbai & Delhi'}</span>
        </div>
      </div>
    </div>
  );
};
