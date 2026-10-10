import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle } from 'lucide-react';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  // If already installed, show gold/emerald badge
  if (isInstalled) {
    if (compact) return null;
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-bold border border-emerald-500/40">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span>Installed App</span>
      </div>
    );
  }

  // Chromium / Android native prompt flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 active:scale-95 px-3 py-1.5 text-xs font-black text-stone-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        title="Install Foodiez Fiesta App on Mobile"
      >
        <Download className="w-4 h-4 animate-pulse stroke-[2.5]" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 active:scale-95 px-3 py-1.5 text-xs font-black text-stone-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Smartphone className="w-4 h-4" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="w-full max-w-sm rounded-3xl bg-stone-900 border border-amber-500/40 p-5 shadow-2xl text-stone-100">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black">
                    FF
                  </div>
                  <div>
                    <h3 className="text-base font-black text-amber-300">Install on iPhone</h3>
                    <p className="text-xs text-stone-400">Run like a native App, 100% Free</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 my-4 text-xs text-stone-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-black border border-stone-800">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-xs shrink-0">
                    1
                  </span>
                  <div>
                    Tap the <strong className="inline-flex items-center gap-1 text-amber-300 font-bold"><Share2 className="w-3.5 h-3.5 text-cyan-400 inline" /> Share</strong> icon at the bottom of Safari.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-black border border-stone-800">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-xs shrink-0">
                    2
                  </span>
                  <div>
                    Scroll down and tap <strong className="inline-flex items-center gap-1 text-amber-300 font-bold"><PlusSquare className="w-3.5 h-3.5 inline text-amber-400" /> Add to Home Screen</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-black border border-stone-800">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-xs shrink-0">
                    3
                  </span>
                  <div>
                    Tap <strong>Add</strong> in top right. Foodiez Fiesta will appear on the home screen and work offline with zero store fees!
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-stone-800 py-2.5 text-xs font-bold text-stone-200 hover:bg-stone-700"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback
  return (
    <>
      <button
        onClick={() => setShowAndroidGuide(true)}
        className="flex items-center gap-1.5 rounded-xl bg-stone-900 border border-amber-500/40 text-amber-300 hover:bg-stone-800 active:scale-95 px-2.5 py-1 text-xs font-bold transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install PWA</span>
      </button>

      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-stone-900 border border-amber-500/40 p-5 shadow-2xl text-stone-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-black text-amber-300">Install Foodiez Fiesta</h3>
              <button
                onClick={() => setShowAndroidGuide(false)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-300 mt-3 leading-relaxed">
              On Android Chrome: Tap the <strong>⋮ (3 dots)</strong> menu icon at the top right, then select <strong>Install App</strong> or <strong>Add to Home screen</strong>.
            </p>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              Works 100% offline at the food kiosk with zero monthly store fees!
            </p>

            <button
              onClick={() => setShowAndroidGuide(false)}
              className="mt-4 w-full rounded-xl bg-amber-400 py-2.5 text-xs font-black text-stone-950 hover:bg-amber-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
