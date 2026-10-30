import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, MapPin, Calendar, Award, HeartHandshake, ShieldCheck, LogOut, Globe, Sparkles, TrendingUp } from 'lucide-react';

export const ArtisanProfile: React.FC = () => {
  const { currentUser, artisans, language, setLanguage, t, setHasPassedWelcome, setArtisanTab } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const profile = artisans.find((a) => a.id === artisanId) || artisans[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '28px' }}>
      {/* Profile Header Card */}
      <div
        className="artisan-card border-stitched"
        style={{
          padding: '24px 20px',
          backgroundColor: '#FFFCFA',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundImage: `url(${profile.photoUrl || currentUser.avatarUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '3px solid var(--dusty-pink)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '12px'
          }}
        />

        <span className="tag-textile" style={{ fontSize: '11px', marginBottom: '6px' }}>
          {profile.artisanCode}
        </span>

        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--deep-brown)' }}>
          {language === 'hi' ? profile.hindiName : profile.name}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--muted-grey)', marginTop: '4px' }}>
          <MapPin size={14} color="var(--dusty-pink-dark)" />
          <span>{profile.area}, {profile.city}</span>
        </div>

        <div
          style={{
            marginTop: '14px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--sage-green-light)',
            border: '1px solid var(--sage-green-border)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--sage-green-dark)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={13} />
          <span>{profile.ngoPartner}</span>
        </div>
      </div>

      {/* Verified Skills */}
      <div className="artisan-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Award size={18} color="var(--dusty-pink-dark)" />
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-brown)' }}>
            {t.verifiedSkills}
          </h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {profile.skills.map((skill, idx) => (
            <span
              key={idx}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--warm-cream)',
                border: '1px solid var(--light-border)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--deep-brown)'
              }}
            >
              • {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="artisan-card" style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>{t.totalCrafted}</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--deep-brown)', marginTop: '2px' }}>
            {profile.totalCompletedOrders} {language === 'hi' ? 'ऑर्डर' : 'batches'}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--light-border)', paddingLeft: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>{t.hoursContributed}</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--sage-green-dark)', marginTop: '2px' }}>
            {profile.recordedHours} {language === 'hi' ? 'घंटे' : 'hrs'}
          </div>
        </div>
      </div>

      {/* Partner NGO Help & Direct Coordinator Dial */}
      <div
        className="artisan-card"
        style={{
          padding: '20px',
          backgroundColor: 'var(--warm-cream)',
          border: '1.5px solid var(--light-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HeartHandshake size={20} color="var(--dusty-pink-dark)" />
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-brown)' }}>
            {t.coordinatorHelp}
          </h2>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--muted-grey)', lineHeight: 1.4 }}>
          {language === 'hi'
            ? 'कच्ची सामग्री, सिलाई मशीन सहायता या स्वास्थ्य परामर्श के लिए अपने एनजीओ समन्वयक से संपर्क करें।'
            : 'For emergency supply replenishment, sewing machine repairs, or health assistance, call your NGO supervisor.'}
        </p>

        <a
          href="tel:9820011223"
          className="btn-secondary"
          style={{
            padding: '12px',
            fontSize: '13px',
            backgroundColor: 'var(--white)',
            justifyContent: 'center'
          }}
        >
          <Phone size={15} color="var(--sage-green-dark)" />
          <span>{t.callCoordinator} (98200 11223)</span>
        </a>
      </div>

      {/* Project Impact & Before-After Analytics Shortcut */}
      <button
        onClick={() => setArtisanTab('impact')}
        className="artisan-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backgroundColor: '#FFFCFA',
          borderLeft: '4px solid var(--sage-green)',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--sage-green-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <TrendingUp size={20} color="var(--sage-green-dark)" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)' }}>
              {language === 'hi' ? 'सामाजिक प्रभाव विश्लेषण देखें' : 'View Impact Analytics & Reports'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
              {language === 'hi' ? 'पहले और बाद की आय व आजीविका के आंकड़े' : 'Before vs After income gains across all artisans'}
            </div>
          </div>
        </div>
        <span style={{ fontSize: '18px', color: 'var(--muted-grey)' }}>›</span>
      </button>

      {/* Language Preference Quick Toggle */}
      <div
        className="artisan-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe size={18} color="var(--dusty-pink-dark)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)' }}>
              {language === 'hi' ? 'भाषा (Language)' : 'App Language'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
              {language === 'hi' ? 'वर्तमान: हिंदी' : 'Current: English'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          {language === 'hi' ? 'English' : 'हिंदी'}
        </button>
      </div>

      {/* Logout / Switch Role */}
      <button
        onClick={() => setHasPassedWelcome(false)}
        className="btn-secondary"
        style={{
          padding: '14px',
          fontSize: '14px',
          color: '#B43828',
          borderColor: '#F6CEC7',
          backgroundColor: '#FFF8F7',
          justifyContent: 'center'
        }}
      >
        <LogOut size={16} />
        <span>{t.logoutBtn}</span>
      </button>
    </div>
  );
};
