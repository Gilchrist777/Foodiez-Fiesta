import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-sm flex items-center justify-between gap-2 rounded-2xl bg-stone-900/95 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-amber-200 shadow-2xl border border-amber-500/50 animate-bounce">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400" />
        <span>Pushcart Offline Mode (100% Operational)</span>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-emerald-400">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Saving</span>
      </div>
    </div>
  );
};
