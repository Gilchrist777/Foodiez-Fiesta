import React, { useState } from 'react';
import { Order } from '../types';
import { NOTE_COLORS } from '../data/defaultMenu';
import { formatCurrency, formatTime } from '../utils/storage';
import { Banknote, QrCode, CheckCircle2, Clock, Trash2, ArrowRight } from 'lucide-react';

interface OrderNoteCardProps {
  order: Order;
  onOpenOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OrderNoteCard: React.FC<OrderNoteCardProps> = ({
  order,
  onOpenOrder,
  onDeleteOrder,
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const colorTheme = NOTE_COLORS.find((c) => c.name === order.color) || NOTE_COLORS[0];

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteOrder(order.id);
    setIsConfirmingDelete(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
  };

  return (
    <div
      onClick={() => onOpenOrder(order)}
      className={`group relative flex flex-col justify-between rounded-2xl bg-[#121216] border ${colorTheme.border} p-3.5 shadow-md hover:border-[#E6B325]/80 transition-all duration-150 cursor-pointer active:scale-98`}
    >
      {/* Inline Delete Confirmation Overlay */}
      {isConfirmingDelete && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-20 rounded-2xl bg-[#0B0B0D]/95 border-2 border-rose-500/80 p-3 flex flex-col justify-center items-center text-center animate-in fade-in"
        >
          <p className="text-xs font-bold text-[#F5F5F7] mb-1">
            Delete Order #{order.tokenNumber}?
          </p>
          <p className="text-[11px] text-stone-400 mb-2.5">
            Amount: {formatCurrency(order.totalAmount)}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancelDelete}
              className="px-3 py-1 rounded-xl bg-white/[0.08] text-stone-300 text-xs font-semibold hover:bg-white/[0.14]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Top note header */}
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${colorTheme.badge}`}>
            Order #{order.tokenNumber}
          </span>
          <span className="text-[11px] font-medium text-stone-400">
            {formatTime(order.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {order.status === 'paid' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>PAID</span>
              {order.paymentMethod === 'cash' && <Banknote className="w-3 h-3 text-[#F5D061] ml-0.5" />}
              {order.paymentMethod === 'upi' && <QrCode className="w-3 h-3 text-cyan-300 ml-0.5" />}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] text-stone-300 border border-white/10 px-2 py-0.5 text-[10px] font-medium">
              <Clock className="w-3 h-3 text-[#E6B325]" />
              <span>Unpaid</span>
            </span>
          )}

          <button
            onClick={handleDeleteClick}
            className="p-1 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-white/[0.05] transition cursor-pointer"
            title="Delete this order"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle Items Summary */}
      <div className="my-2.5 space-y-1 text-xs">
        {order.items.length === 0 ? (
          <p className="text-stone-500 italic text-[11px]">No items added yet</p>
        ) : (
          order.items.slice(0, 4).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-[#F5F5F7]">
              <span className="truncate pr-2">
                <strong className="text-[#F5D061] font-bold">{item.quantity}x</strong> {item.name}
              </span>
              <span className="font-semibold text-stone-400 shrink-0">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))
        )}

        {order.items.length > 4 && (
          <p className="text-[10px] text-[#F5D061]/80 font-bold pt-0.5">
            +{order.items.length - 4} more items...
          </p>
        )}

        {order.note && (
          <p className="text-[11px] text-stone-400 italic mt-1 line-clamp-1 bg-black/40 px-2 py-0.5 rounded border border-white/5">
            "{order.note}"
          </p>
        )}
      </div>

      {/* Bottom Footer with Total and Tap hint */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.07]">
        <span className="text-[11px] font-medium text-stone-400">
          {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-base font-extrabold text-[#F5D061] drop-shadow-sm">
            {formatCurrency(order.totalAmount)}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#F5D061] group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
};
