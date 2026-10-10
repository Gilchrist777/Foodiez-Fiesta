import React, { useState } from 'react';
import { MenuItem } from '../types';
import { KioskLogo } from './KioskLogo';
import { DEFAULT_MENU_ITEMS } from '../data/defaultMenu';
import { formatCurrency } from '../utils/storage';
import {
  Settings,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  X,
  Image as ImageIcon,
  AlertCircle,
  Link,
  UtensilsCrossed,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';

interface KioskSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onSaveMenuItems: (items: MenuItem[]) => void;
  customLogoUrl: string | null;
  onSaveCustomLogo: (logoUrl: string | null) => void;
  onReplaySplash: () => void;
}

export const KioskSettingsModal: React.FC<KioskSettingsModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  onSaveMenuItems,
  customLogoUrl,
  onSaveCustomLogo,
  onReplaySplash,
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'logo' | 'appurl'>('menu');
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [logoPreview, setLogoPreview] = useState<string | null>(customLogoUrl);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<MenuItem['category']>('chicken');
  const [newItemEmoji, setNewItemEmoji] = useState('🍗');

  // Keep local items in sync with prop if it changes
  React.useEffect(() => {
    setItems(menuItems);
  }, [menuItems]);

  if (!isOpen) return null;

  // Handle Logo Upload from file
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size should be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      onSaveCustomLogo(result);
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefaultLogo = () => {
    setLogoPreview(null);
    onSaveCustomLogo(null);
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    const updated = items.map((item) =>
      item.id === id ? { ...item, price: newPrice } : item
    );
    setItems(updated);
    onSaveMenuItems(updated);
  };

  const handleToggleAvailable = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, available: !item.available } : item
    );
    setItems(updated);
    onSaveMenuItems(updated);
  };

  const handleConfirmDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onSaveMenuItems(updated);
    setDeletingItemId(null);
  };

  const handleResetDefaults = () => {
    setItems(DEFAULT_MENU_ITEMS);
    onSaveMenuItems(DEFAULT_MENU_ITEMS);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newItemPrice);
    if (!newItemName.trim() || isNaN(price) || price <= 0) return;

    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      price,
      available: true,
      emoji: newItemEmoji || '🍽️',
    };

    const updated = [newItem, ...items];
    setItems(updated);
    onSaveMenuItems(updated);

    setNewItemName('');
    setNewItemPrice('');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-[#121216] border border-[#E6B325]/30 p-5 shadow-2xl text-[#F5F5F7] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#F5D061] to-[#E6B325] text-black flex items-center justify-center font-black shadow-md shadow-[#E6B325]/20">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#F5D061]">Master Menu & Settings</h3>
              <p className="text-xs text-stone-400">Edit item prices, add items & change logo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl my-3 shrink-0 text-xs font-semibold border border-white/10">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
              activeTab === 'menu' ? 'bg-[#E6B325] text-black font-extrabold shadow-sm' : 'text-stone-400 hover:text-white'
            }`}
          >
            Master Menu Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
              activeTab === 'logo' ? 'bg-[#E6B325] text-black font-extrabold shadow-sm' : 'text-stone-400 hover:text-white'
            }`}
          >
            Kiosk Logo
          </button>
          <button
            onClick={() => setActiveTab('appurl')}
            className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
              activeTab === 'appurl' ? 'bg-[#E6B325] text-black font-extrabold shadow-sm' : 'text-stone-400 hover:text-white'
            }`}
          >
            App URL Link
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-3 text-xs pr-1">
          {activeTab === 'menu' && (
            <div className="space-y-3">
              {/* Form to Add New Item to Master */}
              <form onSubmit={handleAddNewItem} className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#F5D061] text-xs">
                    + Add New Item to Master Menu
                  </span>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="text-[10px] text-stone-400 hover:text-[#F5D061] flex items-center gap-1 transition"
                    title="Restore default kiosk menu"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Defaults</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <select
                    value={newItemEmoji}
                    onChange={(e) => setNewItemEmoji(e.target.value)}
                    className="rounded-xl border border-white/15 bg-[#18181F] text-center text-sm"
                  >
                    <option value="🍗">🍗 Chicken</option>
                    <option value="🥢">🥢 Strips</option>
                    <option value="🔥">🔥 Wings</option>
                    <option value="🥟">🥟 Momos</option>
                    <option value="🍔">🍔 Burger</option>
                    <option value="🥪">🥪 Sandwich</option>
                    <option value="🍟">🍟 Fries</option>
                    <option value="🍿">🍿 Pops</option>
                    <option value="🧊">🧊 Blue Mojito</option>
                    <option value="🍃">🍃 Green Mojito</option>
                    <option value="🥣">🥣 Mayo</option>
                    <option value="🧀">🧀 Cheese</option>
                    <option value="🌶️">🌶️ Spicy</option>
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="Item name (e.g. Chicken Shawarma)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="col-span-2 rounded-xl border border-white/15 bg-[#18181F] px-2.5 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E6B325]"
                  />

                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Price ₹"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="rounded-xl border border-white/15 bg-[#18181F] px-2.5 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#E6B325]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="flex-1 rounded-xl border border-white/15 bg-[#18181F] px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="chicken">🍗 Chicken Category</option>
                    <option value="snacks">🥟 Snacks & Momos</option>
                    <option value="drinks">🍹 Drinks & Mojitos</option>
                    <option value="fastfood">🍔 Burgers & Sandwiches</option>
                    <option value="custom">🥣 Add-ons & Sauces</option>
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#F5D061] to-[#E6B325] text-black font-extrabold text-xs hover:brightness-110 shadow-md shadow-[#E6B325]/20 cursor-pointer"
                  >
                    Add Item
                  </button>
                </div>
              </form>

              {/* Existing Items List with Inline Price Editor & Delete */}
              <div className="space-y-1.5">
                <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                  Menu Master List ({items.length} Items)
                </span>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10 shadow-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-base">{item.emoji || '🍽️'}</span>
                      <div className="min-w-0 truncate">
                        <span className={`font-semibold text-xs block truncate ${item.available !== false ? 'text-[#F5F5F7]' : 'text-stone-500 line-through'}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-stone-400 capitalize">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Price Edit input */}
                      <div className="flex items-center">
                        <span className="text-xs font-bold text-[#F5D061] mr-1">₹</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handlePriceChange(item.id, parseFloat(e.target.value))}
                          className="w-16 rounded-lg border border-white/15 bg-[#18181F] px-2 py-1 text-xs font-black text-white text-right focus:border-[#E6B325] focus:outline-none"
                          title="Edit item price"
                        />
                      </div>

                      {/* Stock availability toggle */}
                      <button
                        onClick={() => handleToggleAvailable(item.id)}
                        className={`p-1.5 rounded-lg transition ${item.available !== false ? 'text-emerald-400 hover:bg-white/5' : 'text-stone-500 hover:bg-white/5'}`}
                        title={item.available !== false ? 'In Stock (tap to mark sold out)' : 'Sold Out (tap to mark available)'}
                      >
                        {item.available !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Delete item confirmation */}
                      {deletingItemId === item.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleConfirmDeleteItem(item.id)}
                            className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeletingItemId(null)}
                            className="px-1 text-stone-400 text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingItemId(item.id)}
                          className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-white/5"
                          title="Delete item from master"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/60 border border-[#E6B325]/30 text-center">
                <span className="text-xs font-bold text-[#F5D061] block mb-2">
                  Active Logo Preview
                </span>
                <div className="flex justify-center my-2">
                  <KioskLogo size="xl" customLogoUrl={logoPreview} animated={true} />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {logoPreview ? 'Using brother\'s custom kiosk logo' : 'Using default Foodiez Fiesta Black & Gold emblem'}
                </p>
              </div>

              {uploadError && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Upload Brother's Logo */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <h4 className="font-bold text-[#F5D061] flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#F5D061]" />
                  Upload Brother's Kiosk Logo
                </h4>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Upload any PNG, JPG, or SVG image. It will immediately show on the kiosk header, animated loader, and opening screen!
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <label className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#F5D061] to-[#E6B325] text-black font-extrabold text-xs cursor-pointer shadow-md shadow-[#E6B325]/20 hover:brightness-110">
                    <ImageIcon className="w-4 h-4" />
                    <span>Choose Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      className="hidden"
                    />
                  </label>

                  {logoPreview && (
                    <button
                      onClick={handleResetDefaultLogo}
                      className="py-2.5 px-3 rounded-xl border border-white/20 text-stone-300 hover:bg-white/10 font-bold text-xs"
                    >
                      Reset Default
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onReplaySplash();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#E6B325]/40 bg-white/[0.04] text-[#F5D061] font-semibold hover:bg-white/[0.08] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replay Opening Splash Animation</span>
              </button>
            </div>
          )}

          {activeTab === 'appurl' && (
            <div className="space-y-3 p-1">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#F5D061] block">
                  Live App URL to Open on Brother's Phone:
                </span>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Send this exact link to your brother via WhatsApp. He can open it in Chrome on Android or Safari on iPhone and tap "Add to Home screen" to use it as a standalone app!
                </p>
                <div className="p-2.5 rounded-xl bg-[#18181F] border border-[#E6B325]/30 text-[#F5D061] font-mono text-[11px] break-all select-all">
                  {window.location.href}
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F5D061] via-[#E6B325] to-[#B8860B] text-black font-extrabold text-xs shadow-md shadow-[#E6B325]/20 flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-110"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied URL to Clipboard!' : 'Copy App URL Link'}</span>
                  </button>

                  <a
                    href="/foodiez-fiesta-project.zip"
                    download="foodiez-fiesta-project.zip"
                    className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-[#E6B325]/30 text-[#F5D061] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition text-center"
                  >
                    <span>📦 Download Full Project ZIP (For Local / Backup)</span>
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-stone-400 text-[11px]">
                <strong className="text-white block text-xs">How to run locally:</strong>
                <p>1. Unzip the downloaded file.</p>
                <p>2. In your terminal run: <code className="text-[#F5D061]">npm install</code></p>
                <p>3. Start the app: <code className="text-[#F5D061]">npm run dev</code></p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 mt-2 shrink-0">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#F5F5F7] font-bold py-2.5 text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
