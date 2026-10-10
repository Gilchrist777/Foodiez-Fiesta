/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Order, MenuItem, DailySummary } from './types';
import {
  getAllOrders,
  getMenuItems,
  saveMenuItems,
  getDailySummary,
  getTodayDateStr,
  getAvailableDates,
  createNewOrder,
  deleteOrder,
  formatDateLabel,
} from './utils/storage';
import { Header } from './components/Header';
import { DailySaleCard } from './components/DailySaleCard';
import { OrderNoteCard } from './components/OrderNoteCard';
import { OrderTakingScreen } from './components/OrderTakingScreen';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { KioskSettingsModal } from './components/KioskSettingsModal';
import { SidebarReportDrawer } from './components/SidebarReportDrawer';
import { SplashIntro } from './components/SplashIntro';
import { OfflineIndicator } from './components/OfflineIndicator';
import { TrendyLoader } from './components/TrendyLoader';
import { Plus, ClipboardList } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'order-taking'>('dashboard');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateStr());
  const [orderFilter, setOrderFilter] = useState<'all' | 'paid' | 'pending'>('all');

  // Custom logo state
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    return localStorage.getItem('foodiez_fiesta_custom_logo') || null;
  });

  // Modals & Drawers
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareDate, setShareDate] = useState<string>(getTodayDateStr());
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isReportsDrawerOpen, setIsReportsDrawerOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    setOrders(getAllOrders());
    setMenuItems(getMenuItems());
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleReplaySplash = () => {
    setShowSplash(true);
  };

  const handleSaveCustomLogo = (logoUrl: string | null) => {
    setCustomLogoUrl(logoUrl);
    if (logoUrl) {
      localStorage.setItem('foodiez_fiesta_custom_logo', logoUrl);
    } else {
      localStorage.removeItem('foodiez_fiesta_custom_logo');
    }
  };

  const handleSaveMenuItems = (newItems: MenuItem[]) => {
    setMenuItems(newItems);
    saveMenuItems(newItems);
  };

  // Re-fetch daily summary based on selectedDate
  const dailySummary: DailySummary = useMemo(() => {
    return getDailySummary(selectedDate);
  }, [orders, selectedDate]);

  const shareSummary: DailySummary = useMemo(() => {
    return getDailySummary(shareDate);
  }, [orders, shareDate]);

  const availableDates = useMemo(() => {
    return getAvailableDates();
  }, [orders]);

  // Filter orders for the selected date
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => o.date === selectedDate)
      .filter((o) => {
        if (orderFilter === 'paid') return o.status === 'paid';
        if (orderFilter === 'pending') return o.status === 'pending';
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [orders, selectedDate, orderFilter]);

  // Start a new order
  const handleStartTakeOrder = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newOrder = createNewOrder(selectedDate);
      setActiveOrder(newOrder);
      setOrders(getAllOrders());
      setActiveView('order-taking');
      setIsLoading(false);
    }, 100);
  };

  // Open an existing order
  const handleOpenOrder = (orderToOpen: Order) => {
    setActiveOrder(orderToOpen);
    setActiveView('order-taking');
  };

  // When order is updated in OrderTakingScreen
  const handleOrderUpdated = (updatedOrder: Order) => {
    setActiveOrder(updatedOrder);
    setOrders(getAllOrders());
  };

  // Delete order
  const handleDeleteOrder = (orderId: string) => {
    deleteOrder(orderId);
    setOrders(getAllOrders());
  };

  // Return to dashboard
  const handleBackToDashboard = () => {
    setActiveView('dashboard');
    setActiveOrder(null);
    setOrders(getAllOrders());
  };

  // Open WhatsApp share modal for a specific date
  const handleOpenShareForDate = (dateToShare: string) => {
    setShareDate(dateToShare);
    setIsShareModalOpen(true);
  };

  // If opening splash is active
  if (showSplash) {
    return (
      <SplashIntro
        onComplete={handleSplashComplete}
        customLogoUrl={customLogoUrl}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F5F7] flex flex-col font-sans select-none antialiased">
      {/* Offline Toast Indicator */}
      <OfflineIndicator />

      {/* Screen Loader when switching */}
      {isLoading && (
        <TrendyLoader
          size="fullscreen"
          message="Preparing Foodiez Fiesta Order Note..."
          customLogoUrl={customLogoUrl}
        />
      )}

      {/* VIEW: Order Taking Screen */}
      {activeView === 'order-taking' && activeOrder ? (
        <OrderTakingScreen
          order={activeOrder}
          menuItems={menuItems}
          onBackToDashboard={handleBackToDashboard}
          onOrderUpdated={handleOrderUpdated}
          onStartNewOrder={handleStartTakeOrder}
        />
      ) : (
        /* VIEW: Dashboard & Daily Sales Tracker */
        <div className="flex-1 flex flex-col">
          {/* Clean Header: Only Logo and Settings */}
          <Header
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            customLogoUrl={customLogoUrl}
          />

          {/* Main Container */}
          <main className="flex-1 max-w-3xl w-full mx-auto p-3.5 sm:p-5 space-y-4 pb-36">
            {/* 1. Daily Sale Card */}
            <DailySaleCard
              summary={dailySummary}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              availableDates={availableDates}
              onOpenShareModal={() => handleOpenShareForDate(selectedDate)}
              onOpenSidebarReport={() => setIsReportsDrawerOpen(true)}
            />

            {/* 2. Order History Header & Filter Tabs */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#F5F5F7]">
                  {formatDateLabel(selectedDate)} Orders
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[#F5D061] text-xs font-bold">
                  {filteredOrders.length}
                </span>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center bg-black/60 p-0.5 rounded-xl text-xs font-semibold border border-white/10">
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    orderFilter === 'all'
                      ? 'bg-gradient-to-r from-[#F5D061] to-[#E6B325] text-black font-extrabold shadow-xs'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  All ({orders.filter((o) => o.date === selectedDate).length})
                </button>
                <button
                  onClick={() => setOrderFilter('paid')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    orderFilter === 'paid'
                      ? 'bg-emerald-500 text-black font-extrabold shadow-xs'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Paid ({orders.filter((o) => o.date === selectedDate && o.status === 'paid').length})
                </button>
                <button
                  onClick={() => setOrderFilter('pending')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    orderFilter === 'pending'
                      ? 'bg-[#B8860B] text-white font-extrabold shadow-xs'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Pending ({orders.filter((o) => o.date === selectedDate && o.status === 'pending').length})
                </button>
              </div>
            </div>

            {/* 3. ColorNote Style Order Sticky Notes Grid */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-[#121216]/80 border border-white/[0.08] shadow-md space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-black/60 border border-[#E6B325]/30 text-[#F5D061] mx-auto flex items-center justify-center shadow-lg shadow-[#E6B325]/10">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#F5F5F7]">
                    Fresh Dashboard — 0 Orders for {formatDateLabel(selectedDate)}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                    Today is clear! Tap <strong>"Take Order"</strong> to start writing down <strong>Order #1</strong>.
                  </p>
                </div>
                <button
                  onClick={handleStartTakeOrder}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] text-black text-xs font-black shadow-lg shadow-[#E6B325]/20 active:scale-95 transition cursor-pointer hover:brightness-110"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Take Order #1</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredOrders.map((order) => (
                  <OrderNoteCard
                    key={order.id}
                    order={order}
                    onOpenOrder={handleOpenOrder}
                    onDeleteOrder={handleDeleteOrder}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Floating Action Button (FAB) in Rich Gold with iPhone Safe Area */}
          <div className="fixed safe-fab-bottom right-4 z-30">
            <button
              onClick={handleStartTakeOrder}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] hover:brightness-110 active:scale-95 px-5 py-3.5 text-black font-black text-sm shadow-2xl shadow-[#E6B325]/30 border border-[#F5D061] transition-all cursor-pointer"
              title="Take New Order (Auto-saved)"
            >
              <ClipboardList className="w-5 h-5 stroke-[2.5]" />
              <span>Take Order</span>
              <Plus className="w-4 h-4 ml-0.5 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <WhatsAppShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        summary={shareSummary}
        orders={orders}
      />

      <SidebarReportDrawer
        isOpen={isReportsDrawerOpen}
        onClose={() => setIsReportsDrawerOpen(false)}
        orders={orders}
        availableDates={availableDates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onOpenShareModal={(date) => {
          setIsReportsDrawerOpen(false);
          handleOpenShareForDate(date);
        }}
      />

      <KioskSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        menuItems={menuItems}
        onSaveMenuItems={handleSaveMenuItems}
        customLogoUrl={customLogoUrl}
        onSaveCustomLogo={handleSaveCustomLogo}
        onReplaySplash={handleReplaySplash}
      />
    </div>
  );
}
