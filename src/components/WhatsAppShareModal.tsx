import React, { useState } from 'react';
import { DailySummary, Order } from '../types';
import { formatCurrency, formatTime, exportOrdersToCSV } from '../utils/storage';
import { Share2, Copy, Check, MessageSquare, Download, X } from 'lucide-react';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: DailySummary;
  orders: Order[];
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  summary,
  orders,
}) => {
  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!isOpen) return null;

  // Format daily tally message
  const generateMessage = (): string => {
    const todayOrders = orders.filter((o) => o.date === summary.date);
    const itemMap = new Map<string, number>();
    for (const o of todayOrders) {
      if (o.status === 'paid') {
        for (const i of o.items) {
          itemMap.set(i.name, (itemMap.get(i.name) || 0) + i.quantity);
        }
      }
    }

    const topItemsStr = Array.from(itemMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => `• ${name}: ${qty} sold`)
      .join('\n');

    return (
      `*🍢 FOODIE'Z FIESTA ERODE - SALES REPORT*\n` +
      `📅 *Date:* ${summary.date}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *TOTAL COLLECTION:* ${formatCurrency(summary.totalSales)}\n` +
      `📦 *Total Orders:* ${summary.totalOrders} (Paid: ${summary.paidOrders})\n` +
      `💵 *Cash Received:* ${formatCurrency(summary.cashSales)}\n` +
      `📱 *UPI / GPay:* ${formatCurrency(summary.upiSales)}\n` +
      (summary.pendingOrders > 0 ? `⚠️ *Pending Unpaid:* ${summary.pendingOrders}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      (topItemsStr ? `🔥 *Top Selling Items:*\n${topItemsStr}\n━━━━━━━━━━━━━━━━━━━━\n` : '') +
      `_Foodie'z Fiesta Erode Mobile Kiosk POS_`
    );
  };

  const messageText = generateMessage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = messageText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeOrWhatsAppShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Foodiez Fiesta Report - ${summary.date}`,
          text: messageText,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    const encoded = encodeURIComponent(messageText);
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    let url = '';
    if (cleanPhone) {
      const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      url = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encoded}`;
    } else {
      url = `https://api.whatsapp.com/send?text=${encoded}`;
    }

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = () => {
    const csv = exportOrdersToCSV(summary.date);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `foodiez_fiesta_${summary.date}_sales.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[#121216] border border-[#E6B325]/30 p-5 shadow-2xl text-[#F5F5F7] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#F5D061] to-[#E6B325] text-black flex items-center justify-center font-black shadow-md shadow-[#E6B325]/20">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#F5D061]">Share Sales Report</h3>
              <p className="text-xs text-stone-400">Date: {summary.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Preview */}
        <div className="my-3.5 rounded-2xl bg-black/60 border border-white/10 p-3.5 text-xs text-[#F5F5F7] font-mono whitespace-pre-wrap flex-1 overflow-y-auto leading-relaxed shadow-inner">
          {messageText}
        </div>

        {/* Optional phone number */}
        <div className="mb-3 shrink-0">
          <label className="text-[11px] font-medium text-stone-400 block mb-1">
            Brother's WhatsApp Mobile Number (Optional):
          </label>
          <div className="flex items-center rounded-xl bg-black/70 border border-white/10 px-3 py-2 text-xs">
            <span className="text-stone-500 font-bold mr-1.5">+91</span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 9876543210 (or leave blank to pick contact)"
              className="bg-transparent text-white placeholder-stone-600 focus:outline-none w-full text-xs font-mono"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 shrink-0">
          <button
            onClick={handleNativeOrWhatsAppShare}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] hover:brightness-110 active:scale-98 py-3.5 text-xs sm:text-sm font-black text-black shadow-lg shadow-[#E6B325]/25 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Send to WhatsApp</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] py-2.5 text-xs font-semibold text-[#F5F5F7] transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#F5D061]" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] py-2.5 text-xs font-semibold text-[#F5F5F7] transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#F5D061]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
