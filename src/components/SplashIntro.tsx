import React, { useEffect, useState } from 'react';
import { KioskLogo } from './KioskLogo';
import { Sparkles } from 'lucide-react';

interface SplashIntroProps {
  onComplete: () => void;
  customLogoUrl?: string | null;
}

export const SplashIntro: React.FC<SplashIntroProps> = ({
  onComplete,
  customLogoUrl = null,
}) => {
  // Phase sequence: 'init' (heavy blur + rotated) -> 'resolving' (spin to clear) -> 'sharp' (glow & title) -> 'exit'
  const [animationStep, setAnimationStep] = useState<'blurred-spin' | 'resolving' | 'sharp' | 'exit'>('blurred-spin');

  useEffect(() => {
    // Step 1: Start rotation and blur clearing almost immediately
    const t1 = setTimeout(() => {
      setAnimationStep('resolving');
    }, 60);

    // Step 2: Fully sharp with title reveal
    const t2 = setTimeout(() => {
      setAnimationStep('sharp');
    }, 950);

    // Step 3: Begin smooth exit transition to dashboard
    const t3 = setTimeout(() => {
      setAnimationStep('exit');
    }, 2100);

    // Step 4: Complete transition and mount dashboard
    const t4 = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0D] text-[#F5F5F7] select-none transition-all duration-500 cursor-pointer overflow-hidden ${
        animationStep === 'exit'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background soft luxury golden bloom */}
      <div
        className={`absolute w-96 h-96 rounded-full bg-[#E6B325]/15 blur-3xl transition-opacity duration-1000 pointer-events-none ${
          animationStep === 'blurred-spin' ? 'opacity-20' : 'opacity-100 animate-pulse'
        }`}
      />
      <div className="absolute w-72 h-72 rounded-full bg-[#F5D061]/10 blur-2xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Kinetic expanding gold rings during rotation to clear transition */}
        <div
          className={`absolute -inset-8 rounded-full border border-[#E6B325]/30 pointer-events-none transition-all duration-1000 ${
            animationStep === 'sharp'
              ? 'scale-125 opacity-40 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]'
              : 'scale-75 opacity-0'
          }`}
        />
        <div
          className={`absolute -inset-14 rounded-full border border-[#F5D061]/15 pointer-events-none transition-all duration-1000 ${
            animationStep === 'sharp' ? 'scale-110 opacity-30 animate-pulse' : 'scale-50 opacity-0'
          }`}
        />

        {/* LOGO WRAPPER: Blur to Rotational Clear Image Transition */}
        <div
          className="relative flex items-center justify-center transition-all duration-1000 will-change-transform"
          style={{
            filter:
              animationStep === 'blurred-spin'
                ? 'blur(28px) brightness(1.4)'
                : 'blur(0px) brightness(1)',
            transform:
              animationStep === 'blurred-spin'
                ? 'rotate(-180deg) scale(0.65)'
                : animationStep === 'resolving'
                ? 'rotate(0deg) scale(1)'
                : 'rotate(0deg) scale(1.02)',
            opacity: animationStep === 'blurred-spin' ? 0.3 : 1,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth physical deceleration
          }}
        >
          {/* Subtle golden shimmer flare passing over the logo once clear */}
          {animationStep === 'sharp' && (
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none animate-[pulse_1.5s_ease-in-out_infinite]" />
          )}

          <KioskLogo size="splash" animated={true} customLogoUrl={customLogoUrl} />
        </div>

        {/* Brand Name Typography Reveal (Smoothly appears once logo is clear) */}
        <div
          className="mt-6 text-center transition-all duration-700 ease-out"
          style={{
            opacity: animationStep === 'sharp' || animationStep === 'exit' ? 1 : 0,
            transform:
              animationStep === 'sharp' || animationStep === 'exit'
                ? 'translateY(0px)'
                : 'translateY(16px)',
          }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6B325]/15 border border-[#E6B325]/30 text-[#F5D061] text-[11px] font-black tracking-widest uppercase mb-2 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#F5D061] animate-spin" />
            Pushcart Food Kiosk
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-[#F5F5F7] drop-shadow-2xl">
            FOODIEZ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B]">
              FIESTA
            </span>
          </h1>

          <p className="text-xs text-stone-400 font-medium tracking-wide mt-1">
            Order Noting & Daily Sales POS
          </p>
        </div>
      </div>

      {/* Bottom loading indicator & tap hint */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2.5">
        <div className="w-36 h-1 rounded-full bg-white/[0.08] border border-white/5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] rounded-full animate-[shimmer_1.2s_infinite]" />
        </div>
        <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
          Tap anywhere to enter dashboard
        </span>
      </div>
    </div>
  );
};
