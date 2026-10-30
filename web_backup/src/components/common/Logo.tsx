import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconDimensions = {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 88
  }[size];

  const titleSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <svg
        width={iconDimensions}
        height={iconDimensions}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Soft background roundel */}
        <circle cx="50" cy="50" r="46" fill="#F6F0E7" stroke="#E9E1D9" strokeWidth="2" />
        
        {/* Outer Stitched Thread Circle (Craft Motif) */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#D8A7AD"
          strokeWidth="1.8"
          strokeDasharray="4 3"
        />

        {/* Central Lotus Flower Motif (Empowerment & Heritage) */}
        {/* Left Petal */}
        <path
          d="M50 72 C32 66 22 52 28 36 C34 44 44 54 50 72 Z"
          fill="#A8B5A0"
          opacity="0.85"
        />
        {/* Right Petal */}
        <path
          d="M50 72 C68 66 78 52 72 36 C66 44 56 54 50 72 Z"
          fill="#A8B5A0"
          opacity="0.85"
        />
        {/* Central Petal */}
        <path
          d="M50 20 C40 38 34 50 50 74 C66 50 60 38 50 20 Z"
          fill="#D8A7AD"
        />
        {/* Inner Golden Core */}
        <path
          d="M50 36 C45 46 42 54 50 68 C58 54 55 46 50 36 Z"
          fill="#E9D99A"
          opacity="0.95"
        />

        {/* Thread Needle Accent Stitch */}
        <line x1="28" y1="76" x2="72" y2="76" stroke="#59473F" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="76" r="3" fill="#D8A7AD" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span
            className="brand-heading"
            style={{
              fontSize: size === 'sm' ? '18px' : size === 'md' ? '24px' : size === 'lg' ? '32px' : '42px',
              fontWeight: 700,
              color: 'var(--deep-brown)',
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}
          >
            Karigari
          </span>
          <span
            style={{
              fontSize: size === 'sm' ? '11px' : size === 'md' ? '13px' : '16px',
              fontWeight: 600,
              color: 'var(--dusty-pink-dark)',
              fontFamily: 'var(--font-hindi)'
            }}
          >
            कारीगरी
          </span>
        </div>
        {showTagline && (
          <span
            style={{
              fontSize: size === 'sm' ? '10px' : '12px',
              color: 'var(--muted-grey)',
              marginTop: '2px',
              fontWeight: 500
            }}
          >
            Empowering Hands. Preserving Heritage.
          </span>
        )}
      </div>
    </div>
  );
};
