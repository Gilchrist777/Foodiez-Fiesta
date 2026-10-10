import React from 'react';

interface KioskLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'splash';
  animated?: boolean;
  className?: string;
  customLogoUrl?: string | null;
}

export const KioskLogo: React.FC<KioskLogoProps> = ({
  size = 'md',
  animated = false,
  className = '',
  customLogoUrl = null,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    splash: 'w-32 h-32 sm:w-36 sm:h-36',
  };

  // If a custom uploaded logo URL is stored in localStorage
  if (customLogoUrl) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
        {(animated || size === 'splash' || size === 'xl') && (
          <div className="absolute inset-0 rounded-full bg-[#E6B325]/20 blur-xl animate-pulse -z-10 pointer-events-none" />
        )}
        <img
          src={customLogoUrl}
          alt="Foodiez Fiesta Logo"
          className="w-full h-full object-contain rounded-full shadow-lg"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Official Foodiez Fiesta Luxury Circular Gold & Obsidian Emblem
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none ${sizeMap[size]} ${className} ${
        animated ? 'group' : ''
      }`}
    >
      {/* Outer ambient golden glow */}
      {(animated || size === 'splash' || size === 'xl') && (
        <div className="absolute inset-0 rounded-full bg-[#E6B325]/30 blur-xl animate-pulse -z-10 pointer-events-none" />
      )}

      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        <defs>
          <radialGradient id="kioskBgDark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1C1A17" />
            <stop offset="65%" stopColor="#0E0D0C" />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>

          <linearGradient id="kioskGoldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3C4" />
            <stop offset="25%" stopColor="#F5D061" />
            <stop offset="50%" stopColor="#E6B325" />
            <stop offset="75%" stopColor="#C5991D" />
            <stop offset="100%" stopColor="#8C6B12" />
          </linearGradient>

          <linearGradient id="kioskGoldBright" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#B8860B" />
            <stop offset="50%" stopColor="#F5D061" />
            <stop offset="100%" stopColor="#FFFBEB" />
          </linearGradient>

          <linearGradient id="kioskGoldWarm" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#996515" />
            <stop offset="50%" stopColor="#E6B325" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>

          <filter id="kioskDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000000" floodOpacity="0.75" />
          </filter>

          <path id="kioskTopTextArc" d="M 68 256 A 188 188 0 0 1 444 256" fill="none" />
          <path id="kioskBottomTextArc" d="M 424 256 A 168 168 0 0 1 88 256" fill="none" />
        </defs>

        {/* Base Black Badge Circle */}
        <circle cx="256" cy="256" r="250" fill="url(#kioskBgDark)" />

        {/* Outer Double Gold Rim */}
        <circle cx="256" cy="256" r="246" fill="none" stroke="url(#kioskGoldMetallic)" strokeWidth="4" />
        <circle cx="256" cy="256" r="236" fill="none" stroke="#F5D061" strokeOpacity="0.35" strokeWidth="1.5" />

        {/* Decorative Dotted Gold Ring */}
        <circle
          cx="256"
          cy="256"
          r="226"
          fill="none"
          stroke="url(#kioskGoldMetallic)"
          strokeWidth="3"
          strokeDasharray="6 8"
          className={animated ? 'animate-[spin_40s_linear_infinite] origin-center' : ''}
        />
        <circle cx="256" cy="256" r="216" fill="none" stroke="url(#kioskGoldMetallic)" strokeWidth="2.5" />

        {/* Top Arched Text: FOODIEZ FIESTA */}
        <text
          fill="url(#kioskGoldBright)"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="34"
          fontWeight="900"
          letterSpacing="7"
          filter="url(#kioskDropShadow)"
        >
          <textPath href="#kioskTopTextArc" startOffset="50%" textAnchor="middle">
            FOODIEZ FIESTA
          </textPath>
        </text>

        {/* Left & Right Flanking Stars */}
        <g fill="url(#kioskGoldBright)">
          <polygon points="92,238 95,246 103,246 96,251 99,259 92,254 85,259 88,251 81,246 89,246" transform="scale(0.85) translate(18, 22)" />
          <polygon points="92,238 95,246 103,246 96,251 99,259 92,254 85,259 88,251 81,246 89,246" transform="scale(0.65) translate(48, 80)" />
          <polygon points="420,238 423,246 431,246 424,251 427,259 420,254 413,259 416,251 409,246 417,246" transform="scale(0.85) translate(64, 22)" />
          <polygon points="420,238 423,246 431,246 424,251 427,259 420,254 413,259 416,251 409,246 417,246" transform="scale(0.65) translate(180, 80)" />
        </g>

        {/* Center Decorative Divider Wings */}
        <path d="M 110 270 Q 180 262 216 274 Q 180 278 110 270 Z" fill="url(#kioskGoldMetallic)" opacity="0.8" />
        <path d="M 402 270 Q 332 262 296 274 Q 332 278 402 270 Z" fill="url(#kioskGoldMetallic)" opacity="0.8" />

        {/* Center Crest: Chef Hat & Crossed Cutlery */}
        <g filter="url(#kioskDropShadow)">
          {/* Crossed Cutlery behind hat */}
          <g transform="rotate(-32 256 220)">
            <path d="M 253 140 L 253 285 Q 253 295 256 295 Q 259 295 259 285 L 259 140 Z" fill="url(#kioskGoldMetallic)" />
            <path d="M 246 138 C 246 156 250 166 256 168 C 262 166 266 156 266 138 L 263 138 L 263 154 L 259 154 L 259 138 L 257 138 L 257 154 L 253 154 L 253 138 Z" fill="url(#kioskGoldBright)" />
          </g>

          <g transform="rotate(32 256 220)">
            <path d="M 253 140 L 253 285 Q 253 295 256 295 Q 259 295 259 285 L 259 140 Z" fill="url(#kioskGoldMetallic)" />
            <ellipse cx="256" cy="144" rx="11" ry="16" fill="url(#kioskGoldBright)" />
            <ellipse cx="256" cy="145" rx="8" ry="12" fill="#0C0A09" opacity="0.4" />
          </g>

          {/* Chef Hat Base Band */}
          <path d="M 206 206 C 206 201 216 199 256 199 C 296 199 306 201 306 206 L 303 226 C 303 230 293 232 256 232 C 219 232 209 230 209 226 Z" fill="url(#kioskGoldMetallic)" stroke="#FFF3C4" strokeWidth="1.5" />
          <line x1="226" y1="202" x2="225" y2="228" stroke="#8C6B12" strokeWidth="1.5" />
          <line x1="246" y1="200" x2="246" y2="231" stroke="#8C6B12" strokeWidth="1.5" />
          <line x1="266" y1="200" x2="266" y2="231" stroke="#8C6B12" strokeWidth="1.5" />
          <line x1="286" y1="202" x2="287" y2="228" stroke="#8C6B12" strokeWidth="1.5" />

          {/* Chef Hat Puffs */}
          <circle cx="230" cy="162" r="28" fill="url(#kioskGoldWarm)" opacity="0.9" />
          <circle cx="282" cy="162" r="28" fill="url(#kioskGoldWarm)" opacity="0.9" />
          <circle cx="204" cy="178" r="25" fill="url(#kioskGoldMetallic)" />
          <circle cx="308" cy="178" r="25" fill="url(#kioskGoldMetallic)" />
          <circle cx="256" cy="148" r="32" fill="url(#kioskGoldBright)" />
          <circle cx="232" cy="164" r="26" fill="url(#kioskGoldBright)" />
          <circle cx="280" cy="164" r="26" fill="url(#kioskGoldBright)" />

          <path d="M 190 190 C 182 170 200 152 216 156 C 220 138 244 122 256 122 C 268 122 292 138 296 156 C 312 152 330 170 322 190 C 314 204 306 206 304 206 L 208 206 C 206 206 198 204 190 190 Z" fill="url(#kioskGoldBright)" opacity="0.95" />
          <path d="M 234 160 Q 236 195 235 204" stroke="#B8860B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 256 148 Q 256 192 256 204" stroke="#B8860B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 278 160 Q 276 195 277 204" stroke="#B8860B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Golden FF Monogram Emblem Plaque */}
          <rect x="214" y="244" width="84" height="48" rx="14" fill="#0E0D0C" stroke="url(#kioskGoldMetallic)" strokeWidth="3" />
          <text x="256" y="278" fontFamily="system-ui, -apple-system, sans-serif" fontSize="32" fontWeight="900" fill="url(#kioskGoldBright)" textAnchor="middle" letterSpacing="4">
            FF
          </text>
          <path d="M 242 244 L 246 236 L 256 242 L 266 236 L 270 244 Z" fill="url(#kioskGoldBright)" />
        </g>

        {/* Bottom Section */}
        <g filter="url(#kioskDropShadow)">
          <path d="M 126 348 C 170 376 256 388 342 376 C 386 348 376 340 376 340 C 316 358 256 360 196 358 C 136 340 126 348 126 348 Z" fill="url(#kioskGoldMetallic)" opacity="0.3" />
          <text fill="url(#kioskGoldMetallic)" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="800" letterSpacing="4">
            <textPath href="#kioskBottomTextArc" startOffset="50%" textAnchor="middle">
              • STREET FOOD &amp; BEVERAGES •
            </textPath>
          </text>

          <g transform="translate(256, 386)">
            <circle cx="0" cy="0" r="14" fill="#0C0A09" stroke="url(#kioskGoldBright)" strokeWidth="2" />
            <polygon points="0,-7 2,-2 7,-2 3,2 5,7 0,4 -5,7 -3,2 -7,-2 -2,-2" fill="url(#kioskGoldBright)" />
          </g>

          <text x="256" y="420" fontFamily="system-ui, -apple-system, sans-serif" fontSize="12" fontWeight="700" fill="#E6B325" textAnchor="middle" letterSpacing="3" opacity="0.9">
            EST. 2024 • THE TASTE OF JOY
          </text>
        </g>

        {/* Sparkles */}
        <polygon points="170,140 173,130 183,127 173,124 170,114 167,124 157,127 167,130" fill="#FFFBEB" />
        <polygon points="340,140 343,130 353,127 343,124 340,114 337,124 327,127 337,130" fill="#FFFBEB" />
      </svg>
    </div>
  );
};
