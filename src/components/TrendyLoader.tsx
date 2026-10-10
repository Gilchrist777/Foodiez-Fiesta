import React from 'react';
import { KioskLogo } from './KioskLogo';

interface TrendyLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  customLogoUrl?: string | null;
}

export const TrendyLoader: React.FC<TrendyLoaderProps> = ({
  message = 'Loading Foodiez Fiesta...',
  size = 'md',
  customLogoUrl = null,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Animated Orbit Rings with Logo in Black & Gold */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing gradient gold spinner ring */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-transparent border-t-amber-400 border-r-yellow-300 animate-spin" />
        
        {/* Inner reverse spinner */}
        <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-transparent border-b-amber-500/60 border-l-yellow-400/60 animate-[spin_1.5s_linear_infinite_reverse]" />
        
        {/* Logo in center */}
        <div className="absolute inset-0 flex items-center justify-center scale-75">
          <KioskLogo size="sm" customLogoUrl={customLogoUrl} animated={true} />
        </div>
      </div>

      {message && (
        <p className="mt-3 text-xs font-bold text-amber-300/90 animate-pulse tracking-wide text-center">
          {message}
        </p>
      )}
    </div>
  );

  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};
