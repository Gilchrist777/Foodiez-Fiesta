import React from 'react';
import { KioskLogo } from './KioskLogo';
import { Settings, Store } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  customLogoUrl: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  customLogoUrl,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0b0b0d]/95 backdrop-blur-md border-b border-[#E6B325]/20 px-4 sm:px-5 pb-3 safe-header-pt shadow-2xl">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Trendy Animated Kiosk Logo */}
        <div className="flex items-center gap-3">
          <KioskLogo size="sm" customLogoUrl={customLogoUrl} animated={true} />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#F5F5F7] leading-none">
                Foodie&apos;z <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B]">Fiesta</span>
              </h1>
              <span className="hidden xs:inline-flex items-center gap-0.5 rounded-full bg-[#E6B325]/15 text-[#F5D061] px-2 py-0.5 text-[10px] font-bold border border-[#E6B325]/25">
                <Store className="w-2.5 h-2.5" />
                ERODE
              </span>
            </div>
            <p className="text-[10.5px] sm:text-[11px] text-[#F5D061]/80 font-medium tracking-wide">
              Pushcart Food Kiosk • Daily POS
            </p>
          </div>
        </div>

        {/* Right Corner: Only Settings (No duplicates) */}
        <div className="flex items-center">
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-2xl text-stone-300 hover:text-[#F5D061] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition cursor-pointer shadow-xs"
            title="Kiosk Master Menu & Settings"
          >
            <Settings className="w-5 h-5 text-[#F5D061]" />
          </button>
        </div>
      </div>
    </header>
  );
};
