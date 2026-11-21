import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Lock,
  MapPin,
  Minus,
  Plus,
  Receipt,
  ShieldCheck,
  Tag,
  Trash2,
  Wallet,
  Zap,
} from 'lucide-react';
import { COUPONS } from '../data/campusData';
import type { CartItem, CouponDefinition, HostelAddress } from '../types/campus';
import { calculateBillBreakdown, validateCoupon } from '../utils/billing';
import { DietaryMark, FoodImage } from './DietaryMark';

interface CheckoutScreenProps {
  selectedHostel: HostelAddress;
  onOpenHostelPicker: () => void;
  cartItems: CartItem[];
  onUpdateQty: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  handoffMode: 'room' | 'guard';
  onChangeHandoff: (mode: 'room' | 'guard') => void;
  appliedCouponCode: string | null;
  onApplyCoupon: (code: string | null) => void;
  walletBalance: number;
  onPlaceOrder: (payload: {
    paymentMethod: string;
    totalPaid: number;
    useWallet: boolean;
    ecoPack: boolean;
    chefNote: string;
  }) => void;
  onBrowseMess: () => void;
}

type PaymentMethodKey = 'wallet' | 'upi' | 'netbanking' | 'cod';

export function CheckoutScreen({
  selectedHostel,
  onOpenHostelPicker,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  handoffMode,
  onChangeHandoff,
  appliedCouponCode,
  onApplyCoupon,
  walletBalance,
  onPlaceOrder,
  onBrowseMess,
}: CheckoutScreenProps) {
  const [ecoPack, setEcoPack] = useState(true);
  const [chefNote, setChefNote] = useState('Less spicy, extra green chutney with lunch thali please!');
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>('wallet');

  const activeCoupon: CouponDefinition | undefined = COUPONS.find(
    (c) => c.code === appliedCouponCode
  );
  const bill = calculateBillBreakdown(cartItems, activeCoupon);
  const hasSufficientWallet = walletBalance >= bill.toPay;

  const handleValidateCoupon = () => {
    const clean = couponInput.trim().toUpperCase();
    if (!clean) {
      setCouponFeedback({ type: 'err', msg: 'Enter a promo or hostel code first.' });
      return;
    }
    const found = COUPONS.find((c) => c.code === clean);
    const check = validateCoupon(found, bill.itemTotal);
    if (!found || !check.valid) {
      setCouponFeedback({ type: 'err', msg: check.reason ?? 'Invalid promo code.' });
      return;
    }
    onApplyCoupon(found.code);
    setCouponFeedback({ type: 'ok', msg: `${found.code} applied! Saved ₹${check.discountAmount}.` });
    setCouponInput('');
  };

  const handleApplyPresetCoupon = (coupon: CouponDefinition) => {
    const check = validateCoupon(coupon, bill.itemTotal);
    if (!check.valid) {
      setCouponFeedback({ type: 'err', msg: check.reason ?? 'Not eligible.' });
      return;
    }
    onApplyCoupon(coupon.code);
    setCouponFeedback({ type: 'ok', msg: `${coupon.code} applied! Saved ₹${check.discountAmount}.` });
  };

  const paymentLabels: Record<PaymentMethodKey, string> = {
    wallet: 'Campus Wallet',
    upi: 'Instant UPI',
    netbanking: 'Net Banking / Card',
    cod: 'Cash at Hostel Gate',
  };

  const handleSubmitOrder = () => {
    if (bill.itemCount === 0) return;
    if (paymentMethod === 'wallet' && !hasSufficientWallet) {
      setPaymentMethod('upi');
      return;
    }
    onPlaceOrder({
      paymentMethod: paymentLabels[paymentMethod],
      totalPaid: bill.toPay,
      useWallet: paymentMethod === 'wallet',
      ecoPack,
      chefNote,
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Checkout Banner + 3-Step Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e9e1dd]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#a83300] text-white flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-wider uppercase text-[#006d40]">
              <span className="text-[#a83300]">FAST PG TRACK</span>
              <span aria-hidden="true">·</span>
              <span>Campus Verified Kitchens</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1e1b19] tracking-tight">
              Secure Hostel Checkout
            </h1>
          </div>
        </div>

        {/* 3-Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e6faee] text-[#006d40]">
            <span className="w-5 h-5 rounded-full bg-[#006d40] text-white text-[10px] font-extrabold flex items-center justify-center">
              1
            </span>
            Tray Items
          </span>
          <span className="w-5 h-[2px] bg-[#e2bfb4]" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffdbd0] text-[#832600]">
            <span className="w-5 h-5 rounded-full bg-[#a83300] text-white text-[10px] font-extrabold flex items-center justify-center">
              2
            </span>
            Hostel Details &amp; Pay
          </span>
          <span className="w-5 h-[2px] bg-[#e9e1dd]" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4ece8] text-[#8e7067]">
            <span className="w-5 h-5 rounded-full bg-[#e0d8d5] text-[#5a4139] text-[10px] font-extrabold flex items-center justify-center">
              3
            </span>
            Doorstep Drop
          </span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#e9e1dd] p-12 text-center space-y-4 shadow-card">
          <h2 className="font-display text-xl font-extrabold text-[#1e1b19]">Your Hostel Meal Tray is Empty</h2>
          <p className="text-sm text-[#5a4139] max-w-md mx-auto">
            Add a homestyle lunch thali or late-night Maggi combo to checkout with zero dorm delivery fees.
          </p>
          <button
            type="button"
            onClick={onBrowseMess}
            className="px-6 py-3 rounded-xl bg-[#a83300] hover:bg-[#832600] text-white text-xs font-extrabold cursor-pointer"
          >
            Browse Today&apos;s PG Mess Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Address, Items, Coupons */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address & Hostel Details */}
            <section className="rounded-2xl bg-white border border-[#e9e1dd] p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#faf2ee] text-[#a83300] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-extrabold text-[#1e1b19]">
                      Delivery Address &amp; Hostel Details
                    </h2>
                    <p className="text-xs text-[#5a4139]">
                      Selected dorm block drop-point for contactless handoff
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenHostelPicker}
                  className="px-3 py-1.5 rounded-lg border border-[#e2bfb4] hover:border-[#a83300] text-xs font-bold text-[#a83300] cursor-pointer"
                >
                  Change PG
                </button>
              </div>

              <div className="rounded-xl bg-[#faf2ee] border border-[#eee7e3] p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base font-extrabold text-[#1e1b19]">
                        {selectedHostel.name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#e6faee] text-[#006d40] text-[10px] font-extrabold uppercase">
                        {selectedHostel.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#1e1b19] font-medium mt-1">{selectedHostel.addressLine}</p>
                    <p className="text-[11px] text-[#8e7067]">{selectedHostel.landmark}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                      ESTIMATED DROP
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs font-extrabold text-[#006d40] tabular-nums">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedHostel.etaText}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e9e1dd] space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                    <span>DELIVERY HANDOFF PREFERENCE</span>
                    <span className="text-[#006d40]">Security Check Verified</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => onChangeHandoff('room')}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        handoffMode === 'room'
                          ? 'bg-white border-[#a83300] ring-1 ring-[#a83300]'
                          : 'bg-white/70 border-[#e9e1dd]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            handoffMode === 'room' ? 'border-[#a83300]' : 'border-[#8e7067]'
                          }`}
                        >
                          {handoffMode === 'room' && <span className="w-1.5 h-1.5 rounded-full bg-[#a83300]" />}
                        </span>
                        <span className="text-xs font-extrabold text-[#1e1b19]">
                          Direct to {selectedHostel.room}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5a4139] mt-1 pl-5">{selectedHostel.roommateInfo}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onChangeHandoff('guard')}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        handoffMode === 'guard'
                          ? 'bg-white border-[#a83300] ring-1 ring-[#a83300]'
                          : 'bg-white/70 border-[#e9e1dd]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            handoffMode === 'guard' ? 'border-[#a83300]' : 'border-[#8e7067]'
                          }`}
                        >
                          {handoffMode === 'guard' && <span className="w-1.5 h-1.5 rounded-full bg-[#a83300]" />}
                        </span>
                        <span className="text-xs font-extrabold text-[#1e1b19]">Main Gate Guard Desk</span>
                      </div>
                      <div className="text-[11px] text-[#5a4139] mt-1 pl-5">
                        Leave in student shelf with token #{selectedHostel.room.replace('Room ', '')}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="px-3 py-2 rounded-lg bg-white border border-[#eee7e3] text-[11px] text-[#5a4139]">
                  {selectedHostel.gateNote}
                </div>
              </div>
            </section>

            {/* Review Order Items */}
            <section className="rounded-2xl bg-white border border-[#e9e1dd] p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base font-extrabold text-[#1e1b19]">Review Order Items</h2>
                  <p className="text-xs text-[#5a4139]">From {cartItems[0]?.kitchenName ?? 'Campus Kitchen Hub'}</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#e6faee] text-[#006d40] text-[10px] font-extrabold uppercase tabular-nums">
                  {bill.itemCount} ITEMS
                </span>
              </div>

              <div className="divide-y divide-[#f4ece8]">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <FoodImage
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <DietaryMark type={item.dietary} />
                          <h3 className="text-sm font-extrabold text-[#1e1b19] truncate">{item.title}</h3>
                        </div>
                        <p className="text-[11px] text-[#5a4139] mt-0.5 line-clamp-2">{item.subtitle}</p>
                        <div className="text-[11px] font-bold text-[#8e7067] mt-1 tabular-nums">
                          {item.kcal} kcal · {item.proteinGrams}g Protein
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="font-display text-base font-extrabold text-[#1e1b19] tabular-nums">
                        ₹{item.unitPrice * item.quantity}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-2 border border-[#e9e1dd] rounded-lg px-2 py-1 bg-[#faf2ee]">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.title}`}
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="text-[#5a4139] hover:text-[#1e1b19] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-extrabold w-4 text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.title}`}
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="text-[#a83300] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.title}`}
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 text-[#8e7067] hover:text-[#ba1a1a] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#faf2ee] cursor-pointer">
                <input
                  type="checkbox"
                  checked={ecoPack}
                  onChange={(e) => setEcoPack(e.target.checked)}
                  className="w-4 h-4 accent-[#a83300]"
                />
                <span className="text-xs font-bold text-[#1e1b19]">
                  Send bio-degradable spoon &amp; napkins (PG eco-pack)
                </span>
              </label>

              <div className="space-y-1.5">
                <label
                  htmlFor="chef-notes"
                  className="block text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]"
                >
                  COOKING &amp; PACKAGING NOTES FOR MESS CHEF
                </label>
                <input
                  id="chef-notes"
                  type="text"
                  value={chefNote}
                  onChange={(e) => setChefNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf2ee] border border-[#e9e1dd] text-xs text-[#1e1b19] focus:outline-none focus:border-[#a83300]"
                />
              </div>
            </section>

            {/* Student Coupons & Mess Pass */}
            <section className="rounded-2xl bg-white border border-[#e9e1dd] p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-[#a83300]" />
                  <div>
                    <h2 className="font-display text-base font-extrabold text-[#1e1b19]">
                      Student Coupons &amp; Mess Pass
                    </h2>
                    <p className="text-xs text-[#5a4139]">Verified student subsidies &amp; promo tokens</p>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold text-[#006d40]">ID Verified</span>
              </div>

              {activeCoupon && bill.couponDiscount > 0 && (
                <div className="rounded-xl bg-[#e6faee] border border-[#94f7ba] p-4 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono px-2 py-0.5 rounded bg-[#006d40] text-white text-[10px] font-bold">
                        {activeCoupon.code}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#006d40]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Applied Successfully
                      </span>
                    </div>
                    <p className="text-xs text-[#002110]">{activeCoupon.description}</p>
                    <p className="text-[11px] font-bold text-[#006d40]">
                      You are saving ₹{bill.couponDiscount} on this meal!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onApplyCoupon(null);
                      setCouponFeedback(null);
                    }}
                    className="text-[11px] font-extrabold text-[#93000a] hover:underline cursor-pointer"
                  >
                    REMOVE
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COUPONS.filter((c) => c.code === 'HOSTELNIGHTS' || c.code === 'FIRSTMESS').map((c) => {
                  const isCurrent = appliedCouponCode === c.code;
                  return (
                    <div key={c.code} className="rounded-xl bg-[#faf2ee] border border-[#eee7e3] p-3.5 flex flex-col justify-between gap-2">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-[#1e1b19]">{c.code}</span>
                          <button
                            type="button"
                            onClick={() => handleApplyPresetCoupon(c)}
                            className="text-[11px] font-extrabold text-[#a83300] hover:underline cursor-pointer"
                          >
                            {isCurrent ? 'APPLIED' : 'APPLY'}
                          </button>
                        </div>
                        <p className="text-[11px] text-[#5a4139] mt-1">{c.description}</p>
                      </div>
                      <div className="text-[10px] font-semibold text-[#8e7067]">{c.footnote}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="ENTER COUPON OR HOSTEL SECRET CODE (e.g. PGSTUDENT20)"
                  aria-label="Enter coupon code"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#faf2ee] border border-[#e9e1dd] text-xs font-semibold text-[#1e1b19] uppercase placeholder:normal-case focus:outline-none focus:border-[#a83300]"
                />
                <button
                  type="button"
                  onClick={handleValidateCoupon}
                  className="px-4 py-2.5 rounded-xl bg-[#1e1b19] hover:bg-[#33302d] text-white text-xs font-extrabold cursor-pointer"
                >
                  Validate
                </button>
              </div>
              {couponFeedback && (
                <p
                  className={`text-xs font-bold ${
                    couponFeedback.type === 'ok' ? 'text-[#006d40]' : 'text-[#ba1a1a]'
                  }`}
                >
                  {couponFeedback.msg}
                </p>
              )}
            </section>
          </div>

          {/* Right Column: Bill Breakdown + Payment Options */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            {/* Bill Breakdown */}
            <section className="rounded-2xl bg-white border border-[#e9e1dd] p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#a83300]" />
                  <h2 className="font-display text-base font-extrabold text-[#1e1b19]">Bill Breakdown</h2>
                </div>
                {bill.totalSavings > 0 && (
                  <span className="px-2.5 py-1 rounded bg-[#e6faee] text-[#006d40] text-[11px] font-extrabold tabular-nums">
                    Saved ₹{bill.totalSavings} today
                  </span>
                )}
              </div>

              <div className="space-y-2.5 text-xs border-b border-[#f4ece8] pb-4">
                <div className="flex justify-between">
                  <span className="text-[#5a4139]">Item Total ({bill.itemCount} dishes)</span>
                  <span className="font-bold text-[#1e1b19] tabular-nums">₹{bill.itemTotal.toFixed(2)}</span>
                </div>
                {bill.couponDiscount > 0 && (
                  <div className="flex justify-between text-[#006d40] font-semibold">
                    <span>
                      Student Campus Discount{' '}
                      <span className="px-1.5 py-0.5 rounded bg-[#e6faee] text-[10px] font-extrabold ml-1">
                        {bill.appliedCouponCode}
                      </span>
                    </span>
                    <span className="tabular-nums">-₹{bill.couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#5a4139]">Dorm Delivery Fee</span>
                  <span className="font-bold text-[#006d40] tabular-nums">
                    <span className="line-through text-[#8e7067] mr-1.5">₹{bill.originalDeliveryFee}.00</span>
                    FREE
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a4139]">CampusTech Platform Fee</span>
                  <span className="font-bold text-[#1e1b19] tabular-nums">₹{bill.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a4139]">Govt. Taxes &amp; Mess Cess</span>
                  <span className="font-bold text-[#1e1b19] tabular-nums">₹{bill.taxes.toFixed(2)}</span>
                </div>
              </div>

              <div className="rounded-xl bg-[#faf2ee] p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#1e1b19]">
                    TO PAY AMOUNT
                  </div>
                  <div className="text-[10px] text-[#006d40] font-semibold">Incl. all taxes &amp; charges</div>
                </div>
                <div className="font-display text-2xl font-extrabold text-[#a83300] tabular-nums">
                  ₹{bill.toPay.toFixed(2)}
                </div>
              </div>
            </section>

            {/* Choose Payment Option */}
            <section className="rounded-2xl bg-white border border-[#e9e1dd] p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-[#a83300]" />
                <div>
                  <h2 className="font-display text-base font-extrabold text-[#1e1b19]">Choose Payment Option</h2>
                  <p className="text-xs text-[#5a4139]">Instant student verification &amp; cashless payments</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Campus Meal Wallet */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    paymentMethod === 'wallet'
                      ? 'bg-[#fff5eb] border-[#a83300] ring-1 ring-[#a83300]'
                      : 'bg-white border-[#e9e1dd]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <Wallet className="w-4 h-4 text-[#a83300] mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#1e1b19]">Campus Meal Wallet</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#e6faee] text-[#006d40] text-[9px] font-extrabold">
                          1-CLICK FAST
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5a4139] tabular-nums">
                        Prepaid balance: <strong>₹{walletBalance.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold shrink-0 ${
                      hasSufficientWallet ? 'text-[#006d40]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {hasSufficientWallet ? 'Sufficient Balance' : 'Low Balance'}
                  </span>
                </button>

                {/* Instant UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    paymentMethod === 'upi'
                      ? 'bg-[#fff5eb] border-[#a83300] ring-1 ring-[#a83300]'
                      : 'bg-white border-[#e9e1dd]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-extrabold text-[#1e1b19]">Instant UPI &amp; Dynamic QR</div>
                    <div className="text-[11px] text-[#5a4139]">GPay, PhonePe, Paytm or Any UPI App</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-[#5a4139]">
                    <span className="px-1.5 py-0.5 rounded bg-[#faf2ee]">GPay</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#faf2ee]">PhonePe</span>
                  </div>
                </button>

                {/* Net Banking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'bg-[#fff5eb] border-[#a83300] ring-1 ring-[#a83300]'
                      : 'bg-white border-[#e9e1dd]'
                  }`}
                >
                  <div className="text-xs font-extrabold text-[#1e1b19]">Net Banking &amp; ATM Cards</div>
                  <div className="text-[11px] text-[#5a4139]">All nationalized student accounts</div>
                </button>

                {/* Cash at Gate */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-[#fff5eb] border-[#a83300] ring-1 ring-[#a83300]'
                      : 'bg-white border-[#e9e1dd]'
                  }`}
                >
                  <div className="text-xs font-extrabold text-[#1e1b19]">Pay Cash at Hostel Gate</div>
                  <div className="text-[11px] text-[#5a4139] tabular-nums">
                    Handover exact ₹{Math.round(bill.toPay)} to delivery partner
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSubmitOrder}
                className="btn-shimmer w-full py-3.5 rounded-xl bg-[#a83300] hover:bg-[#832600] text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer tabular-nums"
              >
                <Lock className="w-4 h-4" />
                {paymentMethod === 'wallet' && !hasSufficientWallet
                  ? `Switch to UPI & Pay ₹${bill.toPay.toFixed(2)}`
                  : `Pay ₹${bill.toPay.toFixed(2)} via ${paymentLabels[paymentMethod]}`}
              </button>

              <p className="text-[11px] text-center text-[#8e7067]">
                By placing this order, you agree to Campus Dining&apos;s Hostel Food Hygiene Code.
              </p>
            </section>

            {/* Safe Kitchen & Campus Protocol */}
            <section className="rounded-2xl bg-white border border-[#e9e1dd] p-4 shadow-card space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#1e1b19]">
                  <ShieldCheck className="w-4 h-4 text-[#006d40]" />
                  Safe Kitchen &amp; Campus Protocol
                </div>
                <span className="px-2 py-0.5 rounded bg-[#e6faee] text-[#006d40] text-[10px] font-extrabold">
                  PASS
                </span>
              </div>
              <p className="text-[11px] text-[#5a4139] leading-relaxed">
                Daily mess staff thermal checks, double-sealed hot aluminium containers, and dedicated university cycle
                couriers.
              </p>
              <div className="rounded-xl bg-[#faf2ee] p-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-[#1e1b19]">Live Dorm GPS Drop Ready</div>
                  <div className="text-[11px] text-[#5a4139]">SMS ping sent as rider approaches Gate #4</div>
                </div>
                <Zap className="w-4 h-4 text-[#a83300] shrink-0" />
              </div>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
