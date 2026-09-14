import React from 'react';

interface SentrovaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'default' | 'monochrome' | 'white';
  layout?: 'horizontal' | 'stacked';
  showText?: boolean;
}

export const SentrovaLogo: React.FC<SentrovaLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  variant = 'default',
  layout = 'horizontal',
  showText = true,
}) => {
  const isWhite = variant === 'white';

  const sizeConfig = {
    sm: {
      iconSize: 36,
      text: 'text-lg sm:text-xl',
      tagline: 'text-[8px]',
      gap: 'gap-2.5',
    },
    md: {
      iconSize: 44,
      text: 'text-xl sm:text-2xl',
      tagline: 'text-[9px]',
      gap: 'gap-3',
    },
    lg: {
      iconSize: 56,
      text: 'text-2xl sm:text-3xl',
      tagline: 'text-[10px]',
      gap: 'gap-3.5',
    },
    xl: {
      iconSize: 76,
      text: 'text-3xl sm:text-4xl',
      tagline: 'text-xs',
      gap: 'gap-4',
    },
  }[size];

  // The 3D Shield Eye Emblem without background or text
  const EmblemElement = (
    <img
      src="/sentrova-emblem.png"
      alt="SENTROVA Shield"
      width={sizeConfig.iconSize}
      height={sizeConfig.iconSize}
      className="shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(8,123,255,0.3)]"
      style={{
        width: `${sizeConfig.iconSize}px`,
        height: `${sizeConfig.iconSize}px`,
      }}
    />
  );

  // When only emblem is requested or showText is false
  if (!showText) {
    return (
      <div className={`inline-flex items-center justify-center select-none group ${className}`}>
        {EmblemElement}
      </div>
    );
  }

  // When stacked (vertical lockup)
  if (layout === 'stacked') {
    return (
      <div
        className={`inline-flex flex-col items-center select-none text-center group ${className}`}
        id="sentrova-brand-logo-stacked"
      >
        {EmblemElement}
        <span
          className={`font-black tracking-[0.22em] uppercase leading-tight mt-2.5 ${sizeConfig.text} ${
            isWhite ? 'text-white' : 'text-white group-hover:text-[#00D2FF] transition-colors'
          }`}
          style={{
            fontFamily:
              "'Orbitron', 'Eurostile', 'Microgramma', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          SENTROVA
        </span>
        {showTagline && (
          <span
            className={`font-bold tracking-[0.25em] uppercase mt-1 leading-none ${sizeConfig.tagline} text-[#38BDF8]`}
          >
            REMOTE CCTV SURVEILLANCE
          </span>
        )}
      </div>
    );
  }

  // Horizontal lockup (Default for Navbar, Footer, and Headers)
  return (
    <div
      className={`inline-flex items-center ${sizeConfig.gap} select-none group ${className}`}
      id="sentrova-brand-logo"
    >
      {/* 3D Shield Eye Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        {EmblemElement}
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <span
          className={`font-black tracking-[0.16em] uppercase leading-none ${sizeConfig.text} ${
            isWhite
              ? 'text-white'
              : 'text-white transition-colors group-hover:text-[#00D2FF]'
          }`}
          style={{
            fontFamily:
              "'Orbitron', 'Eurostile', 'Microgramma', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          SENTROVA
        </span>
        {showTagline && (
          <span
            className={`font-bold tracking-[0.22em] uppercase mt-1 leading-none ${sizeConfig.tagline} text-[#38BDF8]`}
          >
            REMOTE CCTV
          </span>
        )}
      </div>
    </div>
  );
};
