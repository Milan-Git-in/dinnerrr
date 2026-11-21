import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Clock,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  Check,
} from 'lucide-react';
import { CRAVING_CATEGORIES, CRAVING_ITEMS } from '../data/campusData';
import type { CartItem, CravingItem, HostelAddress } from '../types/campus';
import { DietaryMark, FoodImage } from './DietaryMark';
import { calculateRoommateSplit } from '../utils/billing';

interface CravingsScreenProps {
  selectedHostel: HostelAddress;
  searchQuery: string;
  cartItems: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onUpdateQty: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  handoffMode: 'room' | 'guard';
  onChangeHandoff: (mode: 'room' | 'guard') => void;
  onProceedToCheckout: () => void;
  onOpenSop: () => void;
}

export function CravingsScreen({
  selectedHostel,
  searchQuery,
  cartItems,
  onAddToCart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  handoffMode,
  onChangeHandoff,
  onProceedToCheckout,
  onOpenSop,
}: CravingsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Cravings');
  const [sortBy, setSortBy] = useState<'fastest' | 'price-asc' | 'protein'>('fastest');
  const [batchSeconds, setBatchSeconds] = useState(16 * 60 + 11);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setBatchSeconds((prev) => (prev > 15 ? prev - 1 : 16 * 60 + 11));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(batchSeconds / 60)).padStart(2, '0');
  const ss = String(batchSeconds % 60).padStart(2, '0');

  const filteredItems = CRAVING_ITEMS.filter((item) => {
    const matchesCat =
      selectedCategory === 'All Cravings' ||
      (selectedCategory === 'Under ₹99 Cravings' && item.price <= 99) ||
      item.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'protein') return b.proteinGrams - a.proteinGrams;
    return a.etaMinutes - b.etaMinutes;
  });

  const handleAddCraving = (item: CravingItem) => {
    onAddToCart({
      id: `craving-${item.id}`,
      sourceId: item.id,
      title: item.name,
      subtitle: item.description,
      unitPrice: item.price,
      quantity: 1,
      dietary: item.dietary,
      kcal: item.kcal,
      proteinGrams: item.proteinGrams,
      image: item.image,
      kitchenName: 'Midnight Cravings Hub',
      addedBy: 'You',
    });
  };

  const getCartEntry = (itemId: string) =>
    cartItems.find((c) => c.sourceId === itemId || c.id === `craving-${itemId}`);

  const itemTotal = cartItems.reduce((s, c) => s + c.unitPrice * c.quantity, 0);
  const totalCount = cartItems.reduce((s, c) => s + c.quantity, 0);
  const freeChaiThreshold = 300;
  const remainingForChai = Math.max(0, freeChaiThreshold - itemTotal);
  const chaiProgressPct = Math.min(100, Math.round((itemTotal / freeChaiThreshold) * 100));
  const roommateSplit = calculateRoommateSplit(itemTotal, 3);

  const handleShareRoomLink = () => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Banner: Late Night Cravings Station */}
      <section className="rounded-2xl bg-[#fff5eb] border border-[#f2d6c4] p-6 sm:p-8 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#a83300] text-white text-[10px] font-extrabold tracking-wider uppercase">
                LIVE TILL 3:30 AM
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e6faee] border border-[#94f7ba] text-[#00522f] text-[10px] font-extrabold tracking-wider uppercase">
                100% PURE VEG KITCHEN
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#e9e1dd] text-[#006d40] text-[10px] font-extrabold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                Gate Pass Authorized
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1e1b19] tracking-tight">
              Late Night Cravings Station
            </h1>
            <p className="text-sm text-[#5a4139] leading-relaxed">
              Piping hot comfort bowls, cheesy late-night rolls, and study-fuel snacks delivered straight past security
              checkpoints to your hostel door.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-bold text-[#1e1b19]">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#a83300]" />
                Avg ETA: 14 mins
              </span>
              <span aria-hidden="true" className="text-[#c5b3aa]">·</span>
              <span>No Min. Order for Students</span>
              <span aria-hidden="true" className="text-[#c5b3aa]">·</span>
              <span className="text-[#006d40]">100% Biodegradable Boxes</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e2bfb4] p-4 sm:p-5 shrink-0 min-w-[230px] shadow-sm">
            <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067] mb-1">
              NEXT KITCHEN BATCH CUTOFF
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-[#a83300] tabular-nums">
                {mm}:{ss}
              </span>
              <span className="text-xs font-semibold text-[#5a4139]">mins remaining</span>
            </div>
            <div className="text-[11px] font-medium text-[#8e7067] mt-1">
              {selectedHostel.name} &amp; Tech Hub Hostels
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CRAVING_CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#a83300] border-[#a83300] text-white'
                  : 'bg-white border-[#e9e1dd] text-[#5a4139] hover:border-[#8e7067] hover:text-[#1e1b19]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Content: Midnight Roster + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Catalog */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#1e1b19]">
                Curated Midnight Roster
              </h2>
              <p className="text-xs text-[#5a4139]">
                Cooked fresh on order. Delivered warm with tamper-resistant seal.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="cravings-sort" className="text-[11px] font-bold uppercase tracking-wider text-[#8e7067]">
                Sort By:
              </label>
              <select
                id="cravings-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'fastest' | 'price-asc' | 'protein')}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#e9e1dd] text-xs font-bold text-[#1e1b19] focus:outline-none focus:border-[#a83300]"
              >
                <option value="fastest">Fastest Delivery (12-18m)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="protein">Highest Protein</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredItems.map((item) => {
              const cartEntry = getCartEntry(item.id);
              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl border border-[#e9e1dd] overflow-hidden shadow-card card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-[#faf2ee] overflow-hidden">
                      <FoodImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#1e1b19]/85 text-white text-[10px] font-extrabold tracking-wider uppercase">
                        {item.badge}
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <DietaryMark type={item.dietary} />
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-white/95 text-[#1e1b19] text-[10px] font-extrabold tabular-nums">
                        {item.etaMinutes} mins
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h3 className="font-display text-[15px] font-extrabold text-[#1e1b19] leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#5a4139] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="text-[11px] font-semibold text-[#8e7067] pt-0.5 tabular-nums">
                        {item.kcal} kcal · {item.proteinGrams}g protein
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2 flex items-center justify-between gap-2 border-t border-[#f4ece8]">
                    <div>
                      <div className="text-[9px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                        STUDENT PRICE
                      </div>
                      <div className="flex items-baseline gap-1.5 tabular-nums">
                        <span className="font-display text-lg font-extrabold text-[#1e1b19]">₹{item.price}</span>
                        <span className="text-xs text-[#8e7067] line-through">₹{item.originalPrice}</span>
                      </div>
                    </div>

                    {cartEntry ? (
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-[#faf2ee] border border-[#e2bfb4]">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => onUpdateQty(cartEntry.id, -1)}
                          className="w-6 h-6 rounded bg-white text-[#1e1b19] flex items-center justify-center hover:bg-[#ffdbd0] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-extrabold text-[#1e1b19] w-4 text-center tabular-nums">
                          {cartEntry.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => onUpdateQty(cartEntry.id, 1)}
                          className="w-6 h-6 rounded bg-[#a83300] text-white flex items-center justify-center hover:bg-[#832600] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddCraving(item)}
                        className="px-4 py-2 rounded-lg bg-[#a83300] hover:bg-[#832600] text-white text-xs font-extrabold transition-transform active:scale-[0.97] cursor-pointer"
                      >
                        + ADD
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Midnight Gate Protocol Banner */}
          <div className="rounded-xl bg-[#faf2ee] border border-[#e9e1dd] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#006d40] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#1e1b19]">Midnight Gate Protocol Active</div>
                <div className="text-xs text-[#5a4139]">
                  Riders carry warden-signed campus QR codes. Direct hostel lobby access verified.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenSop}
              className="px-3.5 py-2 rounded-lg bg-white border border-[#e9e1dd] hover:border-[#a83300] text-xs font-bold text-[#1e1b19] whitespace-nowrap shrink-0 cursor-pointer"
            >
              View Delivery SOP
            </button>
          </div>
        </div>

        {/* Right Sidebar: Hostel Common Order + Midnight Basket */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
          {/* Hostel Common Order Card */}
          <div className="rounded-2xl bg-white border border-[#e9e1dd] p-5 shadow-card space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#006d40]" />
                <h3 className="font-display text-sm font-extrabold text-[#1e1b19]">Hostel Common Order</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#e6faee] text-[#006d40] text-[10px] font-extrabold uppercase">
                LIVE
              </span>
            </div>

            <p className="text-xs text-[#5a4139] leading-relaxed">
              Ordering for the whole room? Share this link so roommates add munchies directly. Split-pay ready:
              <strong className="text-[#1e1b19] tabular-nums"> ~₹{roommateSplit}/person (3 flatmates)</strong>.
            </p>

            <div className="rounded-xl bg-[#faf2ee] p-3 flex items-center justify-between gap-2">
              <div className="flex items-center -space-x-2">
                <span className="w-7 h-7 rounded-full bg-[#a83300] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white">
                  AS
                </span>
                <span className="w-7 h-7 rounded-full bg-[#006d40] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white">
                  RV
                </span>
                <span className="w-7 h-7 rounded-full bg-[#795600] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white">
                  AV
                </span>
              </div>
              <button
                type="button"
                onClick={handleShareRoomLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e9e1dd] text-[11px] font-bold text-[#1e1b19] hover:border-[#a83300] cursor-pointer"
              >
                {linkCopied ? <Check className="w-3.5 h-3.5 text-[#006d40]" /> : <Share2 className="w-3.5 h-3.5" />}
                {linkCopied ? 'Link Copied!' : 'Share Link'}
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-[#5a4139]">Roommate Cart Contributions</span>
                <span className="text-[#1e1b19] tabular-nums">
                  {totalCount} Items · ₹{itemTotal}
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#f4ece8] overflow-hidden">
                <div
                  className="h-full bg-[#006d40] rounded-full transition-all duration-300"
                  style={{ width: `${chaiProgressPct}%` }}
                />
              </div>
              <p className="text-[11px] text-[#006d40] font-semibold">
                {remainingForChai > 0
                  ? `Add ₹${remainingForChai} more to unlock complimentary Karamchara Chai`
                  : 'Complimentary Karamchara Chai unlocked!'}
              </p>
            </div>
          </div>

          {/* Midnight Basket */}
          <div className="rounded-2xl bg-white border border-[#e9e1dd] p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#f4ece8] pb-3">
              <h3 className="font-display text-base font-extrabold text-[#1e1b19]">Midnight Basket</h3>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[11px] font-extrabold text-[#a83300] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-[#8e7067] mx-auto" />
                <p className="text-xs font-bold text-[#1e1b19]">Your Midnight Basket is empty</p>
                <p className="text-[11px] text-[#8e7067]">Tap + ADD on any craving to start a room drop.</p>
              </div>
            ) : (
              <>
                <ul className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#f4ece8] last:border-b-0">
                      <div className="flex items-start gap-2 min-w-0">
                        <DietaryMark type={item.dietary} className="mt-1" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#1e1b19] truncate">{item.title}</div>
                          <div className="text-[11px] text-[#8e7067]">
                            {item.addedBy ?? 'You'} · ₹{item.unitPrice}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="inline-flex items-center gap-1 border border-[#e9e1dd] rounded-md px-1 py-0.5">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.title}`}
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-[#5a4139] hover:text-[#1e1b19] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center tabular-nums">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.title}`}
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#a83300] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-extrabold text-[#1e1b19] w-10 text-right tabular-nums">
                          ₹{item.unitPrice * item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Remove ${item.title}`}
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#8e7067] hover:text-[#ba1a1a] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Delivery Drop Preference */}
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                    DELIVERY DROP INSTRUCTION
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onChangeHandoff('room')}
                      className={`px-3 py-2 rounded-lg border text-xs font-bold text-left transition-colors cursor-pointer ${
                        handoffMode === 'room'
                          ? 'bg-[#fff5eb] border-[#a83300] text-[#832600]'
                          : 'bg-white border-[#e9e1dd] text-[#5a4139]'
                      }`}
                    >
                      At Room Door
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeHandoff('guard')}
                      className={`px-3 py-2 rounded-lg border text-xs font-bold text-left transition-colors cursor-pointer ${
                        handoffMode === 'guard'
                          ? 'bg-[#fff5eb] border-[#a83300] text-[#832600]'
                          : 'bg-white border-[#e9e1dd] text-[#5a4139]'
                      }`}
                    >
                      Guard Desk
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1.5 pt-2 border-t border-[#f4ece8] text-xs">
                  <div className="flex justify-between text-[#5a4139]">
                    <span>Item Total</span>
                    <span className="font-bold text-[#1e1b19] tabular-nums">₹{itemTotal}</span>
                  </div>
                  <div className="flex justify-between text-[#5a4139]">
                    <span>Student Late Night Packaging</span>
                    <span className="font-bold text-[#006d40]">FREE</span>
                  </div>
                  <div className="flex justify-between text-[#5a4139]">
                    <span>Hostel Gate Delivery</span>
                    <span className="font-bold text-[#006d40]">FREE</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#f4ece8]">
                    <span className="font-display font-extrabold text-sm text-[#1e1b19]">To Pay</span>
                    <span className="font-display font-extrabold text-xl text-[#a83300] tabular-nums">
                      ₹{itemTotal}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="btn-shimmer w-full py-3.5 rounded-xl bg-[#a83300] hover:bg-[#832600] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
                >
                  Place Room Drop Order
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
