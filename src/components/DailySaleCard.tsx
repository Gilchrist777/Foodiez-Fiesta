import React from 'react';
import { DailySummary } from '../types';
import { formatCurrency, formatDateLabel, getYesterdayDateStr } from '../utils/storage';
import { TrendingUp, Banknote, QrCode, Clock, Calendar, Share2, Sparkles, BarChart2 } from 'lucide-react';

interface DailySaleCardProps {
  summary: DailySummary;
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableDates: string[];
  onOpenShareModal: () => void;
  onOpenSidebarReport: () => void;
}

export const DailySaleCard: React.FC<DailySaleCardProps> = ({
  summary,
  selectedDate,
  onDateChange,
  availableDates,
  onOpenShareModal,
  onOpenSidebarReport,
}) => {
  const isToday = () => {
    const today = new Date();
    const str = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return selectedDate === str;
  };

  const formattedDateTitle = () => {
    if (isToday()) return "Today's Live Sales";
    const yestStr = getYesterdayDateStr();
    if (selectedDate === yestStr) return "Yesterday's Report";
    return `${formatDateLabel(selectedDate)} Sales`;
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121216] via-[#16161D] to-[#121216] border border-[#E6B325]/30 p-4 sm:p-5 text-[#F5F5F7] shadow-2xl shadow-black/80">
      {/* Decorative ambient rich golden glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#E6B325]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#F5D061]/10 blur-2xl" />

      {/* Header bar of Card */}
      <div className="relative flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F5D061] to-[#E6B325] text-black font-black shadow-md shadow-[#E6B325]/20">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F5D061]">
                Pushcart Register
              </span>
              {isToday() ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              ) : (
                <span className="text-[10px] font-bold text-stone-400 bg-white/[0.06] px-1.5 py-0.5 rounded">
                  ARCHIVE
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-[#F5F5F7]">
              {formattedDateTitle()}
            </h2>
          </div>
        </div>

        {/* Date Selector & Reports Drawer */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSidebarReport}
            className="flex items-center gap-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 px-2.5 py-1.5 text-xs font-semibold text-[#F5D061] border border-[#E6B325]/30 transition cursor-pointer"
            title="Open Yesterday's Report & Sales Analytics"
          >
            <BarChart2 className="h-3.5 w-3.5 text-[#E6B325]" />
            <span className="hidden xs:inline">Analytics</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] hover:brightness-110 active:scale-95 px-2.5 py-1.5 text-xs font-extrabold text-black transition cursor-pointer shadow-md shadow-[#E6B325]/20"
            title="Share daily sales summary on WhatsApp"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <div className="relative flex items-center">
            <select
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="appearance-none rounded-xl bg-black/60 text-[#F5D061] text-xs font-bold px-2.5 py-1.5 pr-7 border border-white/10 focus:outline-none focus:border-[#E6B325] cursor-pointer"
            >
              {availableDates.map((date) => (
                <option key={date} value={date} className="bg-[#121216] text-[#F5F5F7]">
                  {formatDateLabel(date)} ({date})
                </option>
              ))}
            </select>
            <Calendar className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-stone-400" />
          </div>
        </div>
      </div>

      {/* Main Total Sales Display in Rich Gold */}
      <div className="relative my-3.5 flex items-baseline justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Total Collection
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] drop-shadow-md">
              {formatCurrency(summary.totalSales)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Paid Orders
          </span>
          <div className="text-2xl font-black text-[#F5F5F7]">
            {summary.paidOrders}
            <span className="text-xs font-normal text-stone-400"> / {summary.totalOrders} total</span>
          </div>
        </div>
      </div>

      {/* Payment Modes & Pending Breakdown Pills */}
      <div className="relative grid grid-cols-3 gap-2 pt-2.5 border-t border-white/10 text-xs">
        {/* Cash */}
        <div className="rounded-xl bg-black/50 p-2.5 border border-white/10">
          <div className="flex items-center gap-1 text-[11px] text-stone-400">
            <Banknote className="h-3.5 w-3.5 text-[#F5D061]" />
            <span>Cash</span>
          </div>
          <div className="mt-0.5 font-bold text-[#F5F5F7] text-sm">
            {formatCurrency(summary.cashSales)}
          </div>
        </div>

        {/* UPI / QR */}
        <div className="rounded-xl bg-black/50 p-2.5 border border-white/10">
          <div className="flex items-center gap-1 text-[11px] text-stone-400">
            <QrCode className="h-3.5 w-3.5 text-cyan-400" />
            <span>UPI / GPay</span>
          </div>
          <div className="mt-0.5 font-bold text-[#F5F5F7] text-sm">
            {formatCurrency(summary.upiSales)}
          </div>
        </div>

        {/* Unpaid / Pending */}
        <div className="rounded-xl bg-black/50 p-2.5 border border-white/10">
          <div className="flex items-center gap-1 text-[11px] text-stone-400">
            <Clock className="h-3.5 w-3.5 text-rose-400" />
            <span>Pending</span>
          </div>
          <div className="mt-0.5 font-bold text-[#F5F5F7] text-sm">
            {summary.pendingOrders > 0 ? (
              <span className="text-rose-400">{summary.pendingOrders} unpaid</span>
            ) : (
              <span className="text-emerald-400">All Paid ✓</span>
            )}
          </div>
        </div>
      </div>

      {/* Micro Info bar */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400">
        <div className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-[#F5D061]" />
          <span>Average Order: <strong className="text-[#F5D061] font-bold">{formatCurrency(summary.avgOrderValue)}</strong></span>
        </div>
        <div className="text-[10px] text-stone-500 italic">
          Auto-tallied in real time
        </div>
      </div>
    </div>
  );
};
