import React from 'react';
import { DailySummary, Order } from '../types';
import {
  getYesterdayDateStr,
  getDailySummary,
  formatCurrency,
  formatDateLabel,
  getItemSalesAnalytics,
  getLast7DaysSales,
} from '../utils/storage';
import {
  X,
  Calendar,
  TrendingUp,
  BarChart3,
  Flame,
  Snowflake,
  Share2,
  ChevronRight,
  ArrowUpRight,
  Clock,
  Banknote,
  QrCode,
} from 'lucide-react';

interface SidebarReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  availableDates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenShareModal: (date: string) => void;
}

export const SidebarReportDrawer: React.FC<SidebarReportDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  availableDates,
  selectedDate,
  onSelectDate,
  onOpenShareModal,
}) => {
  if (!isOpen) return null;

  const yesterdayStr = getYesterdayDateStr();
  const yesterdaySummary = getDailySummary(yesterdayStr);
  const analytics = getItemSalesAnalytics(orders);
  const last7Days = getLast7DaysSales(orders);
  const maxDaySale = Math.max(...last7Days.map((d) => d.sales), 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md h-full bg-[#0B0B0D] border-l border-[#E6B325]/30 text-[#F5F5F7] flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#121216]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#F5D061] to-[#E6B325] text-black flex items-center justify-center font-black shadow-md shadow-[#E6B325]/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#F5D061]">
                Sales Reports & Analytics
              </h3>
              <p className="text-xs text-stone-400">Pushcart History & Daily Insights</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. YESTERDAY'S REPORT CARD */}
          <div className="rounded-3xl bg-gradient-to-br from-[#121216] via-[#16161D] to-[#121216] border border-[#E6B325]/40 p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#F5D061]" />
                <span className="text-xs font-black text-[#F5D061] uppercase tracking-wider">
                  Yesterday's Report
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-400">
                {yesterdayStr}
              </span>
            </div>

            <div className="my-3 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-stone-400 block font-medium">
                  Total Collection
                </span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B]">
                  {formatCurrency(yesterdaySummary.totalSales)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-stone-400 block font-medium">
                  Paid Orders
                </span>
                <span className="text-xl font-black text-[#F5F5F7]">
                  {yesterdaySummary.paidOrders}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
              <div className="rounded-xl bg-black/60 p-2 border border-white/10">
                <div className="flex items-center gap-1 text-[11px] text-stone-400">
                  <Banknote className="w-3 h-3 text-[#F5D061]" />
                  <span>Cash</span>
                </div>
                <div className="font-bold text-[#F5F5F7] mt-0.5">
                  {formatCurrency(yesterdaySummary.cashSales)}
                </div>
              </div>
              <div className="rounded-xl bg-black/60 p-2 border border-white/10">
                <div className="flex items-center gap-1 text-[11px] text-stone-400">
                  <QrCode className="w-3 h-3 text-cyan-400" />
                  <span>UPI / GPay</span>
                </div>
                <div className="font-bold text-[#F5F5F7] mt-0.5">
                  {formatCurrency(yesterdaySummary.upiSales)}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  onSelectDate(yesterdayStr);
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#F5F5F7] text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <span>View Orders</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#F5D061]" />
              </button>
              <button
                onClick={() => onOpenShareModal(yesterdayStr)}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] hover:brightness-110 text-black text-xs font-black transition flex items-center gap-1 shadow-md shadow-[#E6B325]/20 cursor-pointer"
                title="Share yesterday's sales to WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* 2. 7-DAY & MONTHLY SALES GRAPH */}
          <div className="rounded-3xl bg-[#121216] border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#F5D061]" />
                <h4 className="text-xs font-bold text-[#F5D061] uppercase tracking-wider">
                  Weekly Sales Trajectory
                </h4>
              </div>
              <span className="text-[10px] text-stone-400">Last 7 Days</span>
            </div>

            {/* Bar chart */}
            <div className="h-32 flex items-end justify-between gap-2 pt-4 px-1 border-b border-white/10">
              {last7Days.map((day, idx) => {
                const heightPercent = maxDaySale > 0 ? Math.round((day.sales / maxDaySale) * 100) : 0;
                const isToday = idx === last7Days.length - 1;

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[9px] text-stone-400 font-mono mb-1 opacity-0 group-hover:opacity-100 transition truncate">
                      ₹{day.sales}
                    </span>
                    <div
                      style={{ height: `${Math.max(heightPercent, 6)}%` }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                        isToday
                          ? 'bg-gradient-to-t from-[#B8860B] via-[#E6B325] to-[#F5D061] shadow-md shadow-[#E6B325]/30'
                          : day.sales > 0
                          ? 'bg-[#E6B325]/60 hover:bg-[#E6B325]'
                          : 'bg-white/10'
                      }`}
                    />
                    <span
                      className={`text-[10px] mt-2 font-bold ${
                        isToday ? 'text-[#F5D061] font-black' : 'text-stone-400'
                      }`}
                    >
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. HIGHLY SOLD & LESS SOLD ITEMS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Top Sellers */}
            <div className="rounded-3xl bg-[#121216] border border-[#E6B325]/30 p-3.5">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Flame className="w-4 h-4 text-[#F5D061]" />
                <h4 className="text-xs font-bold text-[#F5D061] uppercase tracking-wider">
                  Top Sellers 🔥
                </h4>
              </div>

              {analytics.topSelling.length === 0 ? (
                <p className="text-xs text-stone-500 italic">No sales recorded yet</p>
              ) : (
                <div className="space-y-2">
                  {analytics.topSelling.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-xs py-1 border-b border-white/[0.05] last:border-0"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[10px] font-mono text-[#F5D061] font-bold">
                          #{index + 1}
                        </span>
                        <span className="text-[#F5F5F7] font-semibold truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[#F5D061] font-extrabold">
                          {item.quantity} sold
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Slow Moving */}
            <div className="rounded-3xl bg-[#121216] border border-white/10 p-3.5">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Snowflake className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Slow Moving ❄️
                </h4>
              </div>

              {analytics.leastSelling.length === 0 ? (
                <p className="text-xs text-stone-500 italic">Tracking in progress...</p>
              ) : (
                <div className="space-y-2">
                  {analytics.leastSelling.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-xs py-1 border-b border-white/[0.05] last:border-0"
                    >
                      <span className="text-stone-300 truncate pr-1">
                        {item.name}
                      </span>
                      <span className="text-stone-400 font-medium shrink-0">
                        {item.quantity} sold
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 4. PAST DAYS HISTORY LIST */}
          <div className="rounded-3xl bg-[#121216] border border-white/10 p-3.5">
            <h4 className="text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#F5D061]" />
              <span>Select Date To View</span>
            </h4>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {availableDates.map((dateStr) => {
                const daySum = getDailySummary(dateStr);
                const isSelected = selectedDate === dateStr;

                return (
                  <div
                    key={dateStr}
                    onClick={() => {
                      onSelectDate(dateStr);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#F5D061] to-[#E6B325] text-black font-extrabold border-[#F5D061] shadow-md'
                        : 'bg-black/50 text-[#F5F5F7] border-white/10 hover:border-[#E6B325]/40'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">
                        {formatDateLabel(dateStr)}
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-black/70' : 'text-stone-400'}`}>
                        {dateStr} • {daySum.paidOrders} orders
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold">
                        {formatCurrency(daySum.totalSales)}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-white/10 bg-[#121216]/90 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#F5F5F7] text-xs font-bold transition cursor-pointer"
          >
            Close Reports
          </button>
        </div>
      </div>
    </div>
  );
};
