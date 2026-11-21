import React, { useState } from 'react';
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  RefreshCw,
  Shield,
  Star,
  TrendingUp,
  Undo2,
  Wallet,
} from 'lucide-react';
import { SWAP_ALTERNATIVES } from '../data/campusData';
import type {
  DaySchedule,
  HostelAddress,
  ScheduledMeal,
  WalletTransaction,
} from '../types/campus';
import { FoodImage } from './DietaryMark';

interface MealCalendarScreenProps {
  schedule: DaySchedule[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  selectedHostel: HostelAddress;
  handoffMode: 'room' | 'guard';
  onChangeHandoff: (mode: 'room' | 'guard') => void;
  deliveryNote: string;
  onSaveDeliveryNote: (note: string) => void;
  onSkipMeal: (dayKey: string, mealId: string) => void;
  onUndoSkipMeal: (dayKey: string, mealId: string) => void;
  onSwapMealDish: (dayKey: string, mealId: string, newTitle: string, newKcal: number, newImage: string) => void;
  onRateMeal: (dayKey: string, mealId: string, rating: number) => void;
  onBulkPause: (mode: 'weekend' | 'term') => void;
  goingHomeMode: boolean;
  onToggleGoingHome: () => void;
  onSpendOnCravings: () => void;
  onOpenLiveRoute: () => void;
  onOpenHostelPicker: () => void;
}

export function MealCalendarScreen({
  schedule,
  walletBalance,
  walletTransactions,
  selectedHostel,
  handoffMode,
  onChangeHandoff,
  deliveryNote,
  onSaveDeliveryNote,
  onSkipMeal,
  onUndoSkipMeal,
  onSwapMealDish,
  onRateMeal,
  onBulkPause,
  goingHomeMode,
  onToggleGoingHome,
  onSpendOnCravings,
  onOpenLiveRoute,
  onOpenHostelPicker,
}: MealCalendarScreenProps) {
  const [selectedDayKey, setSelectedDayKey] = useState<string>('2025-10-22');
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [showWalletHistory, setShowWalletHistory] = useState(false);
  const [swapTargetMealId, setSwapTargetMealId] = useState<string | null>(null);
  const [ratingMealId, setRatingMealId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(deliveryNote);

  const selectedDayIndex = Math.max(
    0,
    schedule.findIndex((d) => d.dayKey === selectedDayKey)
  );
  const activeDay = schedule[selectedDayIndex] ?? schedule[0];

  const handleStepDay = (dir: -1 | 1) => {
    const nextIdx = Math.max(0, Math.min(schedule.length - 1, selectedDayIndex + dir));
    setSelectedDayKey(schedule[nextIdx].dayKey);
  };

  const applyQuickSwap = (alt: (typeof SWAP_ALTERNATIVES)[number]) => {
    const targetMeal =
      activeDay.meals.find((m) => m.id === swapTargetMealId) ??
      activeDay.meals.find((m) => m.status === 'upcoming' || m.status === 'confirmed') ??
      activeDay.meals[activeDay.meals.length - 1];
    if (!targetMeal) return;
    onSwapMealDish(activeDay.dayKey, targetMeal.id, alt.title, alt.kcal, alt.image);
    setSwapTargetMealId(null);
  };

  const renderSlotBadge = (meal: ScheduledMeal) => {
    if (meal.status === 'delivered') {
      return (
        <span className="px-2 py-0.5 rounded bg-[#e6faee] text-[#006d40] text-[10px] font-extrabold uppercase tracking-wider">
          {meal.statusBadge}
        </span>
      );
    }
    if (meal.status === 'confirmed') {
      return (
        <span className="px-2 py-0.5 rounded bg-[#ffdea8] text-[#5e4200] text-[10px] font-extrabold uppercase tracking-wider">
          {meal.statusBadge}
        </span>
      );
    }
    if (meal.status === 'skipped') {
      return (
        <span className="px-2 py-0.5 rounded bg-[#f4ece8] text-[#5a4139] text-[10px] font-extrabold uppercase tracking-wider">
          {meal.statusBadge}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded bg-[#ffdbd0] text-[#832600] text-[10px] font-extrabold uppercase tracking-wider">
        {meal.statusBadge}
      </span>
    );
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Heading & View Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider uppercase text-[#006d40] mb-1">
            <Check className="w-3.5 h-3.5" />
            AUTO-REFILL &amp; DELIVERY SYNC ACTIVE · Fall Term &apos;26
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1e1b19] tracking-tight">
            My Meal Schedule &amp; Delivery Timeline
          </h1>
          <p className="text-xs sm:text-sm text-[#5a4139] mt-1">
            Manage daily hostel mess deliveries, swap dishes without fee, and pause meals up to 2 hours prior to save
            credits into your digital wallet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="inline-flex rounded-xl bg-white border border-[#e9e1dd] p-1">
            <button
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'weekly' ? 'bg-[#a83300] text-white' : 'text-[#5a4139]'
              }`}
            >
              Weekly View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'monthly' ? 'bg-[#a83300] text-white' : 'text-[#5a4139]'
              }`}
            >
              Monthly Grid
            </button>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#fff4d6] border border-[#f5d47a] text-xs font-extrabold text-[#5e4200] tabular-nums">
            REFUND BANK: ₹{walletBalance} Credit
          </div>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Mess Plan */}
        <div className="rounded-2xl bg-white border border-[#e9e1dd] p-5 shadow-card flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                ACTIVE MESS PLAN
              </div>
              <h2 className="font-display text-lg font-extrabold text-[#1e1b19] mt-0.5">
                Monthly Homestyle Mess
              </h2>
              <p className="text-xs text-[#5a4139]">Sharma Ji Kitchen (Knowledge Park Hub)</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#e6faee] text-[#006d40] text-[10px] font-extrabold">
              Auto-Renew
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[#f4ece8] text-xs">
            <span className="font-extrabold text-[#1e1b19] tabular-nums">18 Days Left</span>
            <span className="font-bold text-[#a83300]">Active · Fall Pass</span>
          </div>
        </div>

        {/* Skip Credit Balance */}
        <div className="rounded-2xl bg-white border border-[#e9e1dd] p-5 shadow-card flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                SKIP CREDIT BALANCE
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-display text-2xl font-extrabold text-[#1e1b19] tabular-nums">
                  ₹{walletBalance}
                </span>
                <span className="text-xs font-bold text-[#006d40]">Instant Spendable</span>
              </div>
              <p className="text-[11px] text-[#5a4139] mt-1">
                Accumulated from paused/skipped meals. Auto-deducts on next order!
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#e6faee] text-[#006d40] flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onSpendOnCravings}
              className="flex-1 py-2 rounded-lg bg-[#006d40] hover:bg-[#00522f] text-white text-xs font-extrabold transition-colors cursor-pointer"
            >
              Spend on Cravings
            </button>
            <button
              type="button"
              onClick={() => setShowWalletHistory((v) => !v)}
              className="px-3 py-2 rounded-lg border border-[#e9e1dd] hover:border-[#8e7067] text-xs font-bold text-[#1e1b19] cursor-pointer"
            >
              History
            </button>
          </div>
        </div>

        {/* Up Next Tonight Orange Highlight Card */}
        <div className="rounded-2xl bg-gradient-to-br from-[#a83300] to-[#d04408] text-white p-5 shadow-card-active flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-extrabold tracking-wider uppercase text-white/85">
              <span>UP NEXT TONIGHT</span>
              <span>Est. 8:30 PM</span>
            </div>
            <h2 className="font-display text-lg font-extrabold leading-snug">
              Dinner: Royal Dal Makhani &amp; Rotis
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {handoffMode === 'room' ? `${selectedHostel.room} (${selectedHostel.name})` : `Guard Desk (${selectedHostel.name})`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <span className="font-mono text-[11px] font-bold text-white/95">Gate Pass #{selectedHostel.gatePassCode}</span>
            <button
              type="button"
              onClick={onOpenLiveRoute}
              className="btn-shimmer px-3.5 py-1.5 rounded-lg bg-white text-[#832600] hover:bg-[#fff8f5] text-xs font-extrabold cursor-pointer"
            >
              Live Route
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Wallet History */}
      {showWalletHistory && (
        <div className="rounded-2xl bg-white border border-[#e9e1dd] p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-extrabold text-[#1e1b19]">Campus Wallet Ledger</h3>
            <button
              type="button"
              onClick={() => setShowWalletHistory(false)}
              className="text-xs font-bold text-[#a83300] cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="divide-y divide-[#f4ece8]">
            {walletTransactions.map((tx) => (
              <div key={tx.id} className="py-2 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#1e1b19]">{tx.title}</div>
                  <div className="text-[11px] text-[#8e7067]">{tx.date}</div>
                </div>
                <span
                  className={`font-extrabold tabular-nums ${
                    tx.type === 'credit' ? 'text-[#006d40]' : 'text-[#a83300]'
                  }`}
                >
                  {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Timeline + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Timeline Column */}
        <div className="lg:col-span-8 space-y-4">
          {viewMode === 'monthly' ? (
            <div className="rounded-2xl bg-white border border-[#e9e1dd] p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-extrabold text-[#1e1b19]">
                  October 2025 — Mess Delivery Grid
                </h3>
                <span className="text-xs text-[#5a4139]">Click any Oct 20–26 date to edit meals</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {schedule.map((day) => {
                  const skippedCount = day.meals.filter((m) => m.status === 'skipped').length;
                  const active = day.dayKey === selectedDayKey;
                  return (
                    <button
                      key={day.dayKey}
                      type="button"
                      onClick={() => {
                        setSelectedDayKey(day.dayKey);
                        setViewMode('weekly');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-[#a83300] border-[#a83300] text-white'
                          : 'bg-[#faf2ee] border-[#e9e1dd] text-[#1e1b19] hover:border-[#a83300]'
                      }`}
                    >
                      <div className="text-[10px] font-bold opacity-80">{day.dayShort}</div>
                      <div className="font-display text-lg font-extrabold tabular-nums">{day.dateNum}</div>
                      <div className="text-[10px] mt-1 font-semibold">
                        {skippedCount > 0 ? `${3 - skippedCount} active` : '3 meals'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Week Bar */}
          <div className="rounded-2xl bg-white border border-[#e9e1dd] p-4 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous day"
                onClick={() => handleStepDay(-1)}
                className="w-8 h-8 rounded-lg bg-[#faf2ee] hover:bg-[#ffdbd0] flex items-center justify-center text-[#1e1b19] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 px-2">
                <Calendar className="w-4 h-4 text-[#a83300]" />
                <span className="font-display text-sm font-extrabold text-[#1e1b19]">Oct 20 - Oct 26, 2025</span>
              </div>
              <button
                type="button"
                aria-label="Next day"
                onClick={() => handleStepDay(1)}
                className="w-8 h-8 rounded-lg bg-[#faf2ee] hover:bg-[#ffdbd0] flex items-center justify-center text-[#1e1b19] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {schedule.map((day) => {
                const isSelected = day.dayKey === activeDay.dayKey;
                return (
                  <button
                    key={day.dayKey}
                    type="button"
                    onClick={() => setSelectedDayKey(day.dayKey)}
                    className={`px-3 py-1.5 rounded-xl text-center transition-colors shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#a83300] text-white'
                        : 'bg-[#faf2ee] text-[#5a4139] hover:bg-[#f4ece8] hover:text-[#1e1b19]'
                    }`}
                  >
                    <div className="text-[9px] font-extrabold uppercase">{day.dayShort}</div>
                    <div className="text-xs font-extrabold tabular-nums">{day.dateNum}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notice Bar */}
          <div className="rounded-xl bg-[#fff4d6] border border-[#f5d47a] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5e4200]">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-[#986d00]" />
              <span>
                Dinner cancellation window closes at <strong>6:30 PM</strong> (2 hrs before drop-off)
              </span>
            </div>
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#a83300] tabular-nums">
              84 MINS TO CUTOFF
            </span>
          </div>

          {/* Meals for Selected Day */}
          <div className="space-y-4">
            {activeDay.meals.map((meal) => {
              const isSwapping = swapTargetMealId === meal.id;
              const isRating = ratingMealId === meal.id;

              return (
                <article
                  key={meal.id}
                  className={`rounded-2xl bg-white border p-5 shadow-card space-y-3 ${
                    meal.status === 'skipped' ? 'border-[#e9e1dd] opacity-85' : 'border-[#e9e1dd]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base font-extrabold text-[#1e1b19]">{meal.slotName}</h3>
                        {renderSlotBadge(meal)}
                      </div>
                      <div className="text-[11px] text-[#8e7067] mt-0.5">
                        Slot: {meal.slotTimeRange} · Vendor: {meal.kitchenName}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-[#5a4139]">{meal.deliveryModeLabel}</div>
                  </div>

                  <div className="rounded-xl bg-[#faf2ee] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <FoodImage
                        src={meal.image}
                        alt={meal.dishTitle}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-[#1e1b19] leading-snug">
                          {meal.dishTitle}
                        </div>
                        <div className="text-[11px] text-[#5a4139] mt-1 tabular-nums">
                          {meal.kcal} kcal · {meal.proteinLabel} ·{' '}
                          <span className="text-[#006d40] font-bold">{meal.noteTag}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {meal.status === 'delivered' && (
                        <button
                          type="button"
                          onClick={() => setRatingMealId(isRating ? null : meal.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-[#e9e1dd] hover:border-[#a83300] text-xs font-bold text-[#1e1b19] cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-[#ffb800] text-[#ffb800]" />
                          {meal.userRating ? `Rated ${meal.userRating}/5` : 'Rate Meal'}
                        </button>
                      )}

                      {(meal.status === 'confirmed' || meal.status === 'upcoming') && (
                        <>
                          <button
                            type="button"
                            onClick={() => setSwapTargetMealId(isSwapping ? null : meal.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#e9e1dd] hover:border-[#a83300] text-xs font-bold text-[#1e1b19] cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Swap Dish
                          </button>
                          <button
                            type="button"
                            onClick={() => onSkipMeal(activeDay.dayKey, meal.id)}
                            className="px-3 py-2 rounded-lg bg-[#ffdad6] hover:bg-[#ffc4bd] text-[#93000a] text-xs font-extrabold cursor-pointer tabular-nums"
                          >
                            Skip Meal (+₹{meal.skipCreditAmount})
                          </button>
                        </>
                      )}

                      {meal.status === 'skipped' && (
                        <button
                          type="button"
                          onClick={() => onUndoSkipMeal(activeDay.dayKey, meal.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#e2bfb4] text-xs font-bold text-[#a83300] hover:bg-[#fff5eb] cursor-pointer"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          Undo Skip
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Interactive Rating Drawer */}
                  {isRating && (
                    <div className="px-3.5 py-2.5 rounded-xl bg-[#fff8f5] border border-[#e9e1dd] flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#5a4139]">How was today&apos;s meal quality?</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            aria-label={`Rate ${star} stars`}
                            onClick={() => {
                              onRateMeal(activeDay.dayKey, meal.id, star);
                              setRatingMealId(null);
                            }}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                (meal.userRating ?? 0) >= star
                                  ? 'fill-[#ffb800] text-[#ffb800]'
                                  : 'text-[#c5b3aa]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Dish Swap Drawer */}
                  {isSwapping && (
                    <div className="p-3.5 rounded-xl bg-[#fff8f5] border border-[#e2bfb4] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#832600]">
                          Choose Zero-Fee Swap for {meal.slotName}:
                        </span>
                        <button
                          type="button"
                          onClick={() => setSwapTargetMealId(null)}
                          className="text-[11px] font-bold text-[#5a4139] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {SWAP_ALTERNATIVES.map((alt) => (
                          <button
                            key={alt.id}
                            type="button"
                            onClick={() => applyQuickSwap(alt)}
                            className="p-2.5 rounded-lg bg-white border border-[#e9e1dd] hover:border-[#a83300] text-left transition-colors cursor-pointer"
                          >
                            <div className="text-xs font-extrabold text-[#1e1b19]">{alt.title}</div>
                            <div className="text-[10px] text-[#006d40] font-semibold mt-0.5">{alt.meta}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Tomorrow Preview */}
          <div className="rounded-xl bg-white border border-[#e9e1dd] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                TOMORROW: THURSDAY, OCT 23
              </div>
              <div className="text-xs font-bold text-[#1e1b19] mt-0.5">
                3 Meals Scheduled (Aloo Paratha · Chole Kulche Thali · Dal Palak)
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDayKey('2025-10-23')}
              className="text-xs font-extrabold text-[#a83300] hover:underline shrink-0 cursor-pointer"
            >
              Customize Tomorrow →
            </button>
          </div>

          {/* Nutrition Consistency Footer Card */}
          <div className="rounded-xl bg-[#e6faee] border border-[#94f7ba] p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#006d40] text-white flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#002110]">Nutrition Consistency: 88% on Target</div>
                <div className="text-[11px] text-[#00522f] tabular-nums">
                  Average daily intake: 1,820 kcal &amp; 64g protein across mess meals.
                </div>
              </div>
            </div>
            <svg viewBox="0 0 100 28" className="w-24 h-7 stroke-[#006d40] fill-none stroke-[2.5] hidden sm:block">
              <polyline points="4,22 20,18 36,20 52,11 68,14 84,6 96,4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Right Sidebar Controls */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Going Home Mode */}
          <div className="rounded-2xl bg-white border border-[#e9e1dd] p-5 shadow-card space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-[#a83300]" />
                <div>
                  <h3 className="font-display text-sm font-extrabold text-[#1e1b19]">Going Home Mode</h3>
                  <div className="text-[10px] font-bold text-[#8e7067]">Instant Bulk Pause</div>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={goingHomeMode}
                aria-label="Toggle Going Home Mode"
                onClick={onToggleGoingHome}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  goingHomeMode ? 'bg-[#006d40]' : 'bg-[#e0d8d5]'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    goingHomeMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-[#5a4139] leading-relaxed">
              Heading home or campus fest this weekend? Pause all Saturday &amp; Sunday meals with one click. ₹480
              instantly credited to your mess balance.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onBulkPause('weekend')}
                className="py-2 px-3 rounded-lg bg-[#faf2ee] hover:bg-[#ffdbd0] text-xs font-bold text-[#1e1b19] cursor-pointer"
              >
                Pause Sat &amp; Sun
              </button>
              <button
                type="button"
                onClick={() => onBulkPause('term')}
                className="py-2 px-3 rounded-lg bg-[#faf2ee] hover:bg-[#ffdbd0] text-xs font-bold text-[#1e1b19] cursor-pointer"
              >
                Term Break (5 Days)
              </button>
            </div>
          </div>

          {/* Hostel Drop Protocol */}
          <div className="rounded-2xl bg-white border border-[#e9e1dd] p-5 shadow-card space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#006d40]" />
                <h3 className="font-display text-sm font-extrabold text-[#1e1b19]">Hostel Drop Protocol</h3>
              </div>
              <button
                type="button"
                onClick={onOpenHostelPicker}
                className="text-[11px] font-extrabold text-[#a83300] hover:underline cursor-pointer"
              >
                EDIT HUB
              </button>
            </div>

            <div className="space-y-2 text-xs border-b border-[#f4ece8] pb-3">
              <div className="flex justify-between">
                <span className="text-[#8e7067]">Campus PG</span>
                <span className="font-bold text-[#1e1b19]">{selectedHostel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e7067]">Block &amp; Room</span>
                <span className="font-bold text-[#1e1b19]">
                  {selectedHostel.block}, {selectedHostel.room}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8e7067]">Security Gate Pass</span>
                <span className="font-mono px-2 py-0.5 rounded bg-[#e6faee] text-[#006d40] font-bold text-[10px]">
                  {selectedHostel.gatePassCode}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                DROP HANDOFF PREFERENCE
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChangeHandoff('guard')}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    handoffMode === 'guard'
                      ? 'bg-[#fff5eb] border-[#a83300] text-[#832600]'
                      : 'bg-white border-[#e9e1dd] text-[#5a4139]'
                  }`}
                >
                  <div className="text-[11px] font-extrabold">GUARD DESK</div>
                  <div className="text-[10px] opacity-80">Pick from foyer</div>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeHandoff('room')}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    handoffMode === 'room'
                      ? 'bg-[#fff5eb] border-[#a83300] text-[#832600]'
                      : 'bg-white border-[#e9e1dd] text-[#5a4139]'
                  }`}
                >
                  <div className="text-[11px] font-extrabold">ROOM DOOR</div>
                  <div className="text-[10px] opacity-80">Contactless knock</div>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                <span>NOTE FOR MESS COURIER</span>
                <button
                  type="button"
                  onClick={() => {
                    if (editingNote) {
                      onSaveDeliveryNote(noteDraft);
                      setEditingNote(false);
                    } else {
                      setNoteDraft(deliveryNote);
                      setEditingNote(true);
                    }
                  }}
                  className="text-[#a83300] cursor-pointer"
                >
                  {editingNote ? 'Save' : 'Edit'}
                </button>
              </div>
              {editingNote ? (
                <input
                  type="text"
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#a83300] text-xs bg-white focus:outline-none"
                />
              ) : (
                <div className="px-3 py-2 rounded-lg bg-[#faf2ee] text-xs text-[#5a4139]">{deliveryNote}</div>
              )}
            </div>
          </div>

          {/* Zero-Fee Swaps Available */}
          <div className="rounded-2xl bg-white border border-[#e9e1dd] p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-extrabold text-[#1e1b19]">Zero-Fee Swaps Available</h3>
              <span className="text-[10px] font-extrabold text-[#006d40] uppercase">UNLIMITED SWAPS</span>
            </div>

            <div className="space-y-2.5">
              {SWAP_ALTERNATIVES.slice(0, 2).map((alt) => (
                <button
                  key={alt.id}
                  type="button"
                  onClick={() => applyQuickSwap(alt)}
                  className="w-full p-2.5 rounded-xl bg-[#faf2ee] hover:bg-[#ffdbd0]/60 border border-[#eee7e3] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FoodImage
                      src={alt.image}
                      alt={alt.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-[#1e1b19] truncate">{alt.title}</div>
                      <div className="text-[10px] text-[#006d40] font-semibold">{alt.meta}</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-white text-[#a83300] text-[10px] font-extrabold shrink-0">
                    Swap
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const firstSwappable = activeDay.meals.find(
                  (m) => m.status === 'upcoming' || m.status === 'confirmed'
                );
                if (firstSwappable) {
                  setSwapTargetMealId(firstSwappable.id);
                }
              }}
              className="w-full py-2.5 rounded-xl border border-[#e9e1dd] hover:border-[#a83300] text-xs font-bold text-[#1e1b19] transition-colors cursor-pointer"
            >
              Browse All 14 Alternate Menus
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
