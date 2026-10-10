import React, { useState, useMemo, useEffect } from 'react';
import { Order, MenuItem, PaymentMethod, OrderItem } from '../types';
import { NOTE_COLORS } from '../data/defaultMenu';
import { formatCurrency, saveOrUpdateOrder } from '../utils/storage';
import { playTapSound, playSuccessChime } from '../utils/sound';
import { PaymentModal } from './PaymentModal';
import {
  ArrowLeft,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  Trash2,
  PlusCircle,
  CheckSquare,
  Square,
  X,
  Tag,
  Zap,
} from 'lucide-react';

interface OrderTakingScreenProps {
  order: Order;
  menuItems: MenuItem[];
  onBackToDashboard: () => void;
  onOrderUpdated: (updatedOrder: Order) => void;
  onStartNewOrder: () => void;
}

export const OrderTakingScreen: React.FC<OrderTakingScreenProps> = ({
  order,
  menuItems,
  onBackToDashboard,
  onOrderUpdated,
  onStartNewOrder,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [customItemModal, setCustomItemModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setCurrentOrder(order);
  }, [order.id]);

  const colorTheme = useMemo(() => {
    return NOTE_COLORS.find((c) => c.name === currentOrder.color) || NOTE_COLORS[0];
  }, [currentOrder.color]);

  const updateAndAutoSave = (updated: Order) => {
    setCurrentOrder(updated);
    saveOrUpdateOrder(updated);
    onOrderUpdated(updated);
  };

  const handleQuantityChange = (item: MenuItem, delta: number) => {
    playTapSound(delta > 0 ? 540 : 380);

    const existingItems = [...currentOrder.items];
    const index = existingItems.findIndex((i) => i.itemId === item.id);

    if (index >= 0) {
      const newQty = existingItems[index].quantity + delta;
      if (newQty <= 0) {
        existingItems.splice(index, 1);
      } else {
        existingItems[index] = {
          ...existingItems[index],
          quantity: newQty,
        };
      }
    } else if (delta > 0) {
      existingItems.push({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    }

    const newTotal = existingItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

    const updated: Order = {
      ...currentOrder,
      items: existingItems,
      totalAmount: newTotal,
      status: currentOrder.status === 'paid' && delta !== 0 ? 'paid' : currentOrder.status,
    };

    updateAndAutoSave(updated);
  };

  const getItemQuantity = (itemId: string): number => {
    const found = currentOrder.items.find((i) => i.itemId === itemId);
    return found ? found.quantity : 0;
  };

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const qty = getItemQuantity(item.id);
      const matchesOnlySelected = !showOnlySelected || qty > 0;

      return matchesSearch && matchesCategory && matchesOnlySelected;
    });
  }, [menuItems, searchQuery, selectedCategory, showOnlySelected, currentOrder.items]);

  const totalItemCount = useMemo(() => {
    return currentOrder.items.reduce((acc, item) => acc + item.quantity, 0);
  }, [currentOrder.items]);

  const handleColorChange = (colorName: string) => {
    playTapSound(600);
    const updated: Order = {
      ...currentOrder,
      color: colorName,
    };
    updateAndAutoSave(updated);
  };

  const handleNoteChange = (text: string) => {
    const updated: Order = {
      ...currentOrder,
      note: text,
    };
    updateAndAutoSave(updated);
  };

  // Once marked as paid, IMMEDIATELY redirect back to dashboard so no accidental modification can occur!
  const handleConfirmPayment = (method: PaymentMethod, note: string) => {
    playSuccessChime();
    const updated: Order = {
      ...currentOrder,
      status: 'paid',
      paymentMethod: method,
      note: note || currentOrder.note,
      updatedAt: Date.now(),
    };
    updateAndAutoSave(updated);
    setIsPaymentModalOpen(false);

    // Redirect to Dashboard immediately as requested!
    onBackToDashboard();
  };

  const handleClearOrderConfirmed = () => {
    const updated: Order = {
      ...currentOrder,
      items: [],
      totalAmount: 0,
      status: 'pending',
    };
    updateAndAutoSave(updated);
    setShowClearConfirm(false);
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(customPrice);
    if (!customName.trim() || isNaN(priceNum) || priceNum <= 0) return;

    const customId = `custom_${Date.now()}`;
    const customOrderItem: OrderItem = {
      itemId: customId,
      name: customName.trim(),
      price: priceNum,
      quantity: 1,
    };

    const newItems = [...currentOrder.items, customOrderItem];
    const newTotal = newItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

    const updated: Order = {
      ...currentOrder,
      items: newItems,
      totalAmount: newTotal,
    };

    updateAndAutoSave(updated);
    setCustomName('');
    setCustomPrice('');
    setCustomItemModal(false);
    playTapSound(550);
  };

  const handleQuickAddAddon = (name: string, price: number) => {
    playTapSound(560);
    const existing = menuItems.find((m) => m.name.toLowerCase().includes(name.toLowerCase()));
    if (existing) {
      handleQuantityChange(existing, 1);
    } else {
      const customId = `addon_${name.toLowerCase().replace(/\s+/g, '_')}`;
      const existingItems = [...currentOrder.items];
      const idx = existingItems.findIndex((i) => i.itemId === customId);
      if (idx >= 0) {
        existingItems[idx].quantity += 1;
      } else {
        existingItems.push({
          itemId: customId,
          name,
          price,
          quantity: 1,
        });
      }
      const newTotal = existingItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
      updateAndAutoSave({ ...currentOrder, items: existingItems, totalAmount: newTotal });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0D] text-[#F5F5F7] pb-36">
      {/* Top Header Sticky Bar (Whitesmoke Black & Rich Gold with iPhone Safe Area Top) */}
      <header className="sticky top-0 z-30 bg-[#121216]/95 backdrop-blur-md border-b border-[#E6B325]/20 px-3.5 sm:px-4 safe-header-pt pb-2.5 shadow-md">
        <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
          {/* Back button (Auto saves implicitly like ColorNote) */}
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 active:scale-95 px-2.5 py-1.5 text-xs font-semibold text-[#F5F5F7] transition cursor-pointer"
            title="Back to Dashboard (Auto-saved)"
          >
            <ArrowLeft className="w-4 h-4 text-[#F5D061]" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="text-[10px] text-[#F5D061] bg-[#E6B325]/15 border border-[#E6B325]/30 font-bold px-1.5 py-0.2 rounded-full">
              Auto-saved ✓
            </span>
          </button>

          {/* Order Number Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] text-black shadow-md shadow-[#E6B325]/20">
              Order #{currentOrder.tokenNumber}
            </span>
          </div>

          {/* Top Right: Next Order Shortcut */}
          <button
            onClick={onStartNewOrder}
            className="flex items-center gap-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 active:scale-95 text-[#F5F5F7] px-3 py-1.5 text-xs font-bold transition cursor-pointer"
            title="Start Next Order (Current is saved)"
          >
            <Plus className="w-3.5 h-3.5 text-[#F5D061]" />
            <span>Next Order</span>
          </button>
        </div>

        {/* ColorNote Color Palette Selector Bar */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-white/[0.06] max-w-2xl mx-auto">
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-400">
            <Tag className="w-3 h-3 text-[#F5D061]" />
            <span>Note Tag:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {NOTE_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleColorChange(c.name)}
                style={{ backgroundColor: c.accent }}
                className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                  currentOrder.color === c.name
                    ? 'scale-125 border-white ring-2 ring-[#E6B325] shadow-sm'
                    : 'border-white/20 hover:scale-110'
                }`}
                title={`${c.name} tag`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-3.5 sm:p-4 space-y-3">
        {/* Fast Add-ons Strip (Extra Mayo ₹10, Cheese Dip ₹15, etc.) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-[#F5D061] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Quick Add:
          </span>
          <button
            onClick={() => handleQuickAddAddon('Extra Mayonnaise', 10)}
            className="px-2.5 py-1 rounded-xl bg-[#16161B] hover:bg-[#1E1E24] border border-[#E6B325]/30 text-[#F5D061] text-xs font-semibold shrink-0 active:scale-95 transition"
          >
            + Extra Mayo (₹10)
          </button>
          <button
            onClick={() => handleQuickAddAddon('Cheese Dip', 15)}
            className="px-2.5 py-1 rounded-xl bg-[#16161B] hover:bg-[#1E1E24] border border-[#E6B325]/30 text-[#F5D061] text-xs font-semibold shrink-0 active:scale-95 transition"
          >
            + Cheese Dip (₹15)
          </button>
          <button
            onClick={() => handleQuickAddAddon('Extra Schezwan / Chutney', 10)}
            className="px-2.5 py-1 rounded-xl bg-[#16161B] hover:bg-[#1E1E24] border border-white/10 text-stone-300 text-xs font-semibold shrink-0 active:scale-95 transition"
          >
            + Chutney (₹10)
          </button>
        </div>

        {/* User friendly search bar + Checkbox for selected items */}
        <div className="bg-[#121216] rounded-2xl p-2.5 shadow-sm border border-white/[0.08] space-y-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chicken, strips, momos, mojito, burger, mayo..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm text-[#F5F5F7] placeholder-stone-500 focus:outline-none focus:border-[#E6B325]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-0.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Category Chips & Visible Checkbox Filter */}
          <div className="flex items-center justify-between gap-2 pt-1 overflow-x-auto text-xs scrollbar-none">
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'chicken', label: '🍗 Chicken' },
                { id: 'snacks', label: '🥟 Snacks' },
                { id: 'drinks', label: '🍹 Drinks' },
                { id: 'fastfood', label: '🍔 Burgers' },
                { id: 'custom', label: '🥣 Add-ons' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#F5D061] to-[#E6B325] text-black shadow-sm'
                      : 'bg-white/[0.04] text-stone-400 hover:text-[#F5F5F7] hover:bg-white/[0.08]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* User Friendly Visible Checkbox to filter selected items */}
            <button
              onClick={() => setShowOnlySelected(!showOnlySelected)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer border ${
                showOnlySelected
                  ? 'bg-[#E6B325] text-black border-[#F5D061] shadow-sm'
                  : 'bg-white/[0.04] text-stone-300 border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              {showOnlySelected ? (
                <CheckSquare className="w-3.5 h-3.5 text-black" />
              ) : (
                <Square className="w-3.5 h-3.5 text-[#F5D061]" />
              )}
              <span>Selected ({totalItemCount})</span>
            </button>
          </div>
        </div>

        {/* Optional Order Note & Custom Item Button */}
        <div className="flex items-center justify-between gap-2 px-1">
          <input
            type="text"
            value={currentOrder.note || ''}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Order note (e.g. Extra mayo / parcel / customer name)..."
            className="flex-1 bg-[#121216] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#E6B325]"
          />

          <button
            onClick={() => setCustomItemModal(true)}
            className="flex items-center gap-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#F5D061] border border-[#E6B325]/30 px-2.5 py-1.5 text-xs font-semibold transition whitespace-nowrap cursor-pointer"
            title="Add a custom item or special price"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Custom</span>
          </button>
        </div>

        {/* Scrollable Item List */}
        <div className="space-y-2 pb-6">
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-12 bg-[#121216] rounded-2xl border border-white/[0.08] p-6">
              <p className="text-sm font-semibold text-stone-400">No menu items match your search.</p>
              {showOnlySelected && (
                <p className="text-xs text-stone-500 mt-1">
                  You haven't added any items to this order yet.
                </p>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowOnlySelected(false);
                }}
                className="mt-3 px-3 py-1.5 text-xs font-bold bg-[#E6B325] text-black rounded-xl shadow"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredMenuItems.map((item) => {
              const qty = getItemQuantity(item.id);
              const isSelected = qty > 0;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl border transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#16161C] border-[#E6B325]/60 shadow-lg shadow-[#E6B325]/10'
                      : 'bg-[#121216] hover:bg-[#15151B] border-white/[0.07]'
                  }`}
                >
                  {/* Item info */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-2xl sm:text-3xl shrink-0 p-1.5 rounded-xl bg-black/50 border border-white/[0.08]">
                      {item.emoji || '🍽️'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`font-semibold text-sm truncate ${isSelected ? 'text-[#F5D061]' : 'text-[#F5F5F7]'}`}>
                          {item.name}
                        </h4>
                        {isSelected && (
                          <span className="shrink-0 px-1.5 py-0.2 rounded-md bg-[#E6B325] text-black text-[10px] font-black">
                            x{qty}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-stone-400 truncate hidden xs:block">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Tactile + / - buttons */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-extrabold text-[#F5D061]">
                        {formatCurrency(item.price)}
                      </div>
                      {isSelected && (
                        <div className="text-[10px] font-semibold text-stone-400">
                          ={formatCurrency(item.price * qty)}
                        </div>
                      )}
                    </div>

                    {/* Touch Buttons (+ and -) */}
                    <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        disabled={qty === 0}
                        aria-label={`Decrease ${item.name}`}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-base transition-all cursor-pointer ${
                          qty > 0
                            ? 'bg-white/[0.08] text-[#F5F5F7] hover:bg-rose-950/80 hover:text-rose-400 active:scale-90'
                            : 'opacity-25 text-stone-600 cursor-not-allowed'
                        }`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-7 text-center font-extrabold text-sm text-white">
                        {qty}
                      </span>

                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        aria-label={`Increase ${item.name}`}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] hover:brightness-110 active:scale-90 text-black flex items-center justify-center font-black shadow-md shadow-[#E6B325]/20 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Render any custom items added */}
          {currentOrder.items
            .filter((i) => !menuItems.some((m) => m.id === i.itemId))
            .map((custom) => (
              <div
                key={custom.itemId}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#16161C] border border-[#E6B325]/40 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <div>
                    <h4 className="font-semibold text-[#F5D061] text-sm">
                      {custom.name} <span className="text-xs text-stone-400">(Custom)</span>
                    </h4>
                    <span className="text-xs font-medium text-stone-300">
                      {formatCurrency(custom.price)} x{custom.quantity} = {formatCurrency(custom.price * custom.quantity)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const filtered = currentOrder.items.filter((i) => i.itemId !== custom.itemId);
                    const newTotal = filtered.reduce((acc, i) => acc + i.price * i.quantity, 0);
                    updateAndAutoSave({ ...currentOrder, items: filtered, totalAmount: newTotal });
                  }}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950"
                  title="Remove custom item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      </main>

      {/* Persistent Bottom Bar with Live Total and PAID Button */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#121216]/95 backdrop-blur-md border-t border-[#E6B325]/20 px-3.5 sm:px-4 pt-3 safe-footer-pb shadow-2xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Live Total Display in Rich Gold */}
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Order Total
                </span>
                <span className="text-[10px] font-extrabold text-[#F5D061] bg-[#E6B325]/15 border border-[#E6B325]/30 px-1.5 py-0.2 rounded-md">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] tracking-tight">
                {formatCurrency(currentOrder.totalAmount)}
              </div>
            </div>

            {currentOrder.items.length > 0 && (
              <div className="relative">
                {showClearConfirm ? (
                  <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-rose-500/60">
                    <button
                      onClick={handleClearOrderConfirmed}
                      className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-1.5 py-1 text-stone-400 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-white/[0.05] transition ml-1"
                    title="Clear order items"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Paid Confirmation Button (Auto-redirects to dashboard once confirmed) */}
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            disabled={currentOrder.totalAmount === 0}
            className={`flex items-center gap-2 rounded-2xl font-black text-sm sm:text-base px-6 sm:px-7 py-3.5 shadow-xl transition-all cursor-pointer ${
              currentOrder.totalAmount > 0
                ? 'bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] hover:brightness-110 active:scale-95 text-black shadow-[#E6B325]/25'
                : 'bg-white/[0.06] text-stone-600 border border-white/5 cursor-not-allowed shadow-none'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>PAID</span>
          </button>
        </div>
      </footer>

      {/* Payment Confirmation Popup */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        totalAmount={currentOrder.totalAmount}
        tokenNumber={currentOrder.tokenNumber}
        initialNote={currentOrder.note}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirmPaid={handleConfirmPayment}
      />

      {/* Modal for adding custom item */}
      {customItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-xs rounded-2xl bg-[#121216] border border-[#E6B325]/40 p-5 shadow-2xl text-[#F5F5F7]">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-[#F5D061]">Add Custom Item</h3>
              <button
                onClick={() => setCustomItemModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCustomItem} className="space-y-3 mt-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                  Item Description:
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Water Bottle, Extra Mayo..."
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E6B325]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                  Amount (₹):
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E6B325]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomItemModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-stone-400 hover:bg-white/[0.06] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-gradient-to-r from-[#F5D061] to-[#E6B325] text-black rounded-xl hover:brightness-110 shadow"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
