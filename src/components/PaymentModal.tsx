import React, { useState } from 'react';
import { PaymentMethod } from '../types';
import { formatCurrency } from '../utils/storage';
import { CheckCircle2, Banknote, QrCode, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  totalAmount: number;
  tokenNumber: number;
  onClose: () => void;
  onConfirmPaid: (method: PaymentMethod, note: string) => void;
  initialNote?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  totalAmount,
  tokenNumber,
  onClose,
  onConfirmPaid,
  initialNote = '',
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash');
  const [note, setNote] = useState(initialNote);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirmPaid(selectedMethod, note);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-[#121216] border border-[#E6B325]/30 p-5 shadow-2xl text-[#F5F5F7]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#F5D061] to-[#E6B325] text-black flex items-center justify-center font-black text-sm shadow-md shadow-[#E6B325]/20">
              #{tokenNumber}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#F5D061]">Confirm Payment</h3>
              <p className="text-xs text-stone-400">Add to Today's Daily Sales</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Big Highlight */}
        <div className="my-4 text-center rounded-2xl bg-black/70 border border-[#E6B325]/30 p-4 shadow-inner">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F5D061]/90">
            Order #{tokenNumber} Total Due
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] mt-1">
            {formatCurrency(totalAmount)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Foodiez Fiesta Kiosk
          </p>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-1.5 mb-4">
          <label className="text-xs font-semibold text-stone-300">
            Payment Mode Received:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMethod('cash')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                selectedMethod === 'cash'
                  ? 'border-[#F5D061] bg-gradient-to-r from-[#F5D061] to-[#E6B325] text-black shadow-lg shadow-[#E6B325]/25'
                  : 'border-white/10 bg-black/50 text-[#F5F5F7] hover:bg-white/[0.05]'
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>Cash</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                selectedMethod === 'upi'
                  ? 'border-[#F5D061] bg-gradient-to-r from-[#F5D061] to-[#E6B325] text-black shadow-lg shadow-[#E6B325]/25'
                  : 'border-white/10 bg-black/50 text-[#F5F5F7] hover:bg-white/[0.05]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>UPI / QR / GPay</span>
            </button>
          </div>
        </div>

        {/* Note / Customer Remark */}
        <div className="mb-5">
          <label className="text-[11px] font-medium text-stone-400 mb-1 block">
            Order Remark / Notes (Optional):
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Extra mayo, parcel, less spicy..."
            className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E6B325]"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleConfirm}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] hover:brightness-110 active:scale-98 py-3.5 px-4 text-sm font-black text-black shadow-xl shadow-[#E6B325]/30 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Confirm & Return to Dashboard</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-stone-400 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
