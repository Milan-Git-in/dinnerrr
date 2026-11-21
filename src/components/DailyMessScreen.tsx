import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  Clock,
  PauseCircle,
  ShoppingCart,
  Star,
  Sun,
  Coffee,
  Utensils,
  Moon,
  MapPin,
} from 'lucide-react';
import {
  DIETARY_FILTERS,
  MESS_KITCHENS,
  SUBSCRIPTION_PLANS,
  TESTIMONIALS,
} from '../data/campusData';
import type {
  CartItem,
  HostelAddress,
  MealSlotKey,
  MessKitchen,
  SubscriptionPlan,
} from '../types/campus';
import { DietaryMark, FoodImage } from './DietaryMark';

interface DailyMessScreenProps {
  selectedHostel: HostelAddress;
  searchQuery: string;
  onAddToCart: (item: CartItem) => void;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onClaimPromo: () => void;
  tomorrowBreakfastActive: boolean;
  onToggleTomorrowBreakfast: () => void;
  onOpenHostelPicker: () => void;
  onOpenDeliveryNote: () => void;
  deliveryNote: string;
  promoSectionRef?: React.RefObject<HTMLDivElement | null>;
}

const SLOTS: { key: MealSlotKey; label: string; time: string; cutoffText: string; icon: React.ReactNode }[] = [
  {
    key: 'breakfast',
    label: 'Breakfast',
    time: '7:30 - 10 AM',
    cutoffText: 'Breakfast Cut-off:',
    icon: <Coffee className="w-3.5 h-3.5" />,
  },
  {
    key: 'lunch',
    label: 'Lunch Live',
    time: '12:30 - 3 PM',
    cutoffText: 'Lunch Cut-off:',
    icon: <Sun className="w-3.5 h-3.5" />,
  },
  {
    key: 'snacks',
    label: 'Evening Snacks',
    time: '4 - 7 PM',
    cutoffText: 'Snacks Cut-off:',
    icon: <Utensils className="w-3.5 h-3.5" />,
  },
  {
    key: 'dinner',
    label: 'Dinner Pre-Order',
    time: '8 - 10:30 PM',
    cutoffText: 'Dinner Cut-off:',
    icon: <Moon className="w-3.5 h-3.5" />,
  },
];

export function DailyMessScreen({
  selectedHostel,
  searchQuery,
  onAddToCart,
  onSelectPlan,
  onClaimPromo,
  tomorrowBreakfastActive,
  onToggleTomorrowBreakfast,
  onOpenHostelPicker,
  onOpenDeliveryNote,
  deliveryNote,
}: DailyMessScreenProps) {
  const [activeSlot, setActiveSlot] = useState<MealSlotKey>('lunch');
  const [activeFilter, setActiveFilter] = useState<string>('All Pure Veg Kitchens');
  const [cutoffSeconds, setCutoffSeconds] = useState(42 * 60 + 18);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({
    'sharma-ji': ['medium'],
    'south-spice': [],
    'fitbite-protein': ['paneer-150'],
    'annapurna-veg': ['butter-roti'],
  });
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setCutoffSeconds((prev) => (prev > 60 ? prev - 1 : 42 * 60));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const minsLeft = Math.floor(cutoffSeconds / 60);

  const toggleOption = (kitchen: MessKitchen, optionId: string) => {
    setSelectedOptions((prev) => {
      const current = prev[kitchen.id] ?? [];
      if (kitchen.customizationType === 'addons') {
        const exists = current.includes(optionId);
        return {
          ...prev,
          [kitchen.id]: exists ? current.filter((x) => x !== optionId) : [...current, optionId],
        };
      }
      return {
        ...prev,
        [kitchen.id]: [optionId],
      };
    });
  };

  const handleOrderKitchen = (kitchen: MessKitchen) => {
    const menu = kitchen.slotMenus[activeSlot];
    const chosenIds = selectedOptions[kitchen.id] ?? [];
    const chosenOptions = kitchen.options.filter((o) => chosenIds.includes(o.id));
    const extraPrice = chosenOptions.reduce((sum, o) => sum + (o.extraPrice ?? 0), 0);
    const optionSummary = chosenOptions.map((o) => o.label).join(', ');

    const cartItem: CartItem = {
      id: `${kitchen.id}-${activeSlot}-${chosenIds.join('-') || 'std'}`,
      sourceId: kitchen.id,
      title: `${kitchen.name} (${SLOTS.find((s) => s.key === activeSlot)?.label.replace(' Live', '').replace(' Pre-Order', '')})`,
      subtitle: optionSummary ? `${menu.dishTitle} · ${optionSummary}` : menu.dishTitle,
      unitPrice: kitchen.pricePerMeal + extraPrice,
      quantity: 1,
      dietary: kitchen.dietary,
      kcal: menu.kcal,
      proteinGrams: menu.protein,
      image: kitchen.image,
      kitchenName: kitchen.name,
      addedBy: 'You',
    };

    onAddToCart(cartItem);
    setJustAddedId(kitchen.id);
    setTimeout(() => setJustAddedId(null), 1400);
  };

  const filteredKitchens = MESS_KITCHENS.filter((kitchen) => {
    const matchesFilter =
      activeFilter === 'All Pure Veg Kitchens' || kitchen.tags.includes(activeFilter);
    const q = searchQuery.trim().toLowerCase();
    const menu = kitchen.slotMenus[activeSlot];
    const matchesSearch =
      !q ||
      kitchen.name.toLowerCase().includes(q) ||
      kitchen.subtitle.toLowerCase().includes(q) ||
      menu.dishTitle.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const activeSlotObj = SLOTS.find((s) => s.key === activeSlot)!;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Semester Meal Pass Hero Banner */}
      <section className="rounded-2xl overflow-hidden hero-mesh text-white p-6 sm:p-8 shadow-card-active">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-extrabold tracking-wider uppercase">
              100% PURE VEG HOSTEL MESS · LIMITED SLOTS
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-balance">
              Semester Meal Pass: From ₹59/Plate (20% Off)
            </h1>
            <p className="text-sm sm:text-[15px] text-white/90 leading-relaxed">
              Lock in lower per-plate subscription rates with zero-delay pure vegetarian room delivery to Greenwood PG,
              Stanza Living, and North Campus hostel blocks. Unlimited skips with 100% wallet carry-forward.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 bg-black/15 backdrop-blur-sm border border-white/15 rounded-xl p-3.5">
            <div className="px-2">
              <div className="text-[10px] font-bold tracking-wider uppercase text-white/80">COUPON CODE</div>
              <div className="font-mono text-lg font-bold tracking-wide tabular-nums">PGSTUDENT20</div>
            </div>
            <button
              type="button"
              onClick={onClaimPromo}
              className="btn-shimmer inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-[#832600] hover:bg-[#fff8f5] font-bold text-sm whitespace-nowrap shrink-0 transition-transform active:scale-[0.98] cursor-pointer"
            >
              Claim Meal Pass
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Meal Slot Tabs + Cut-off Alert */}
      <section className="space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 bg-white p-2 rounded-xl border border-[#e9e1dd] shadow-card">
          {SLOTS.map((slot) => {
            const active = activeSlot === slot.key;
            return (
              <button
                key={slot.key}
                type="button"
                onClick={() => setActiveSlot(slot.key)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#a83300] text-white shadow-sm'
                    : 'text-[#5a4139] hover:bg-[#faf2ee] hover:text-[#1e1b19]'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {slot.icon}
                  <span>{slot.label}</span>
                </span>
                <span className={`text-[10px] sm:text-[11px] font-medium tabular-nums ${active ? 'text-white/85' : 'text-[#8e7067]'}`}>
                  ({slot.time})
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-[#fff4d6] border border-[#f5d47a] text-xs text-[#5e4200]">
          <div className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-[#986d00] shrink-0" />
            <span>
              <strong className="font-bold">{activeSlotObj.cutoffText}</strong>{' '}
              <span className="font-extrabold text-[#a83300] tabular-nums">{minsLeft} mins left</span> to pause or
              change dish
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#795600]">
            Delivering to {selectedHostel.shortLabel}
          </span>
        </div>

        {/* Dietary Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {DIETARY_FILTERS.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#006d40] border-[#006d40] text-white'
                    : 'bg-white border-[#e9e1dd] text-[#5a4139] hover:border-[#8e7067] hover:text-[#1e1b19]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Today's Kitchen Menu Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#a83300] mb-1">
              HOSTEL APPROVED KITCHENS
            </div>
            <h2 className="font-display text-2xl sm:text-[26px] font-extrabold text-[#1e1b19] tracking-tight">
              Today&apos;s {activeSlotObj.label.replace(' Live', '').replace(' Pre-Order', '')} Menu Across PG Messes
            </h2>
          </div>
          <p className="text-xs font-medium text-[#5a4139]">
            Showing {filteredKitchens.length} verified student kitchens serving near you
          </p>
        </div>

        {filteredKitchens.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e9e1dd] p-10 text-center space-y-3">
            <p className="font-display text-lg font-bold text-[#1e1b19]">
              No kitchens match &ldquo;{searchQuery || activeFilter}&rdquo;
            </p>
            <p className="text-sm text-[#5a4139]">Try clearing your dietary filter or search query.</p>
            <button
              type="button"
              onClick={() => setActiveFilter('All Pure Veg Kitchens')}
              className="px-4 py-2 rounded-lg bg-[#a83300] text-white text-xs font-bold cursor-pointer"
            >
              Show All Pure Veg Kitchens
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredKitchens.map((kitchen) => {
              const menu = kitchen.slotMenus[activeSlot];
              const chosen = selectedOptions[kitchen.id] ?? [];
              const extraCost = kitchen.options
                .filter((o) => chosen.includes(o.id))
                .reduce((s, o) => s + (o.extraPrice ?? 0), 0);
              const displayPrice = kitchen.pricePerMeal + extraCost;
              const isJustAdded = justAddedId === kitchen.id;

              return (
                <article
                  key={kitchen.id}
                  className="group bg-white rounded-2xl border border-[#e9e1dd] overflow-hidden shadow-card card-hover flex flex-col"
                >
                  {/* Dish Photo with Overlay Metadata */}
                  <div className="relative h-52 sm:h-56 overflow-hidden bg-[#faf2ee]">
                    <FoodImage
                      src={kitchen.image}
                      alt={kitchen.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#006d40] text-white text-[10px] font-extrabold tracking-wider uppercase">
                          <DietaryMark type={kitchen.dietary} />
                          {kitchen.tags.includes('High Protein / Gym Pack') ? '32G PROTEIN' : 'PURE VEG'}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-white/95 text-[#1e1b19] text-[10px] font-bold uppercase tracking-wide">
                          {kitchen.tags[1] ?? 'HOMESTYLE'}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/95 text-[#1e1b19] text-xs font-extrabold tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-[#ffb800] text-[#ffb800]" />
                        <span>{kitchen.rating}</span>
                        <span className="font-normal text-[#5a4139]">({kitchen.reviewCount})</span>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-white">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#ffb800]" />
                        <span>{kitchen.eta}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#d04408] text-white text-[11px] font-bold">
                        {kitchen.badgeText}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg font-extrabold text-[#1e1b19] leading-snug">
                            {kitchen.name}
                          </h3>
                          <p className="text-xs text-[#5a4139] mt-0.5">{kitchen.subtitle}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-display text-xl font-extrabold text-[#a83300] tabular-nums leading-none">
                            ₹{displayPrice}
                          </div>
                          <div className="text-[11px] text-[#8e7067] mt-0.5">per plate</div>
                        </div>
                      </div>

                      {/* Today's Thali Box */}
                      <div className="rounded-xl bg-[#faf2ee] border border-[#eee7e3] p-3">
                        <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#a83300] mb-1">
                          {menu.label}
                        </div>
                        <p className="text-[13px] font-semibold text-[#1e1b19] leading-snug">
                          {menu.dishTitle}
                        </p>
                      </div>

                      {/* Macro Trio */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-lg bg-[#faf2ee] px-3 py-2 text-center">
                          <div className="text-[10px] font-medium text-[#8e7067]">Energy</div>
                          <div className="text-xs font-extrabold text-[#1e1b19] tabular-nums">{menu.kcal} kcal</div>
                        </div>
                        <div className="rounded-lg bg-[#e6faee] px-3 py-2 text-center">
                          <div className="text-[10px] font-medium text-[#00522f]">Protein</div>
                          <div className="text-xs font-extrabold text-[#006d40] tabular-nums">{menu.protein}g</div>
                        </div>
                        <div className="rounded-lg bg-[#faf2ee] px-3 py-2 text-center">
                          <div className="text-[10px] font-medium text-[#8e7067]">{menu.carbsLabel}</div>
                          <div className="text-xs font-extrabold text-[#1e1b19] tabular-nums">{menu.carbsValue}</div>
                        </div>
                      </div>

                      {/* Customization Control */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                          {kitchen.customizationLabel}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {kitchen.options.map((opt) => {
                            const selected = chosen.includes(opt.id);
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleOption(kitchen, opt.id)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                                  selected
                                    ? 'bg-[#ffdbd0] border-[#a83300] text-[#832600]'
                                    : 'bg-white border-[#e9e1dd] text-[#5a4139] hover:border-[#8e7067]'
                                }`}
                              >
                                {kitchen.customizationType === 'addons' && (selected ? '✓ ' : '+ ')}
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#f4ece8]">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectPlan({
                            id: `monthly-${kitchen.id}`,
                            tierLabel: 'KITCHEN MONTHLY PASS',
                            name: `${kitchen.name} Monthly`,
                            description: `30-plate tiffin subscription exclusively from ${kitchen.name}.`,
                            price: kitchen.monthlyPrice,
                            perPlatePrice: Math.round(kitchen.monthlyPrice / 30),
                            regularPerPlate: kitchen.pricePerMeal,
                            plateCount: 30,
                            unitLabel: '/ plate',
                            features: ['Flexible 2-hr meal skips', 'Room doorstep drop-off included'],
                            ctaLabel: 'Subscribe Monthly',
                          })
                        }
                        className="px-3 py-2.5 rounded-lg bg-white border border-[#e2bfb4] hover:border-[#a83300] text-xs font-bold text-[#1e1b19] transition-colors cursor-pointer tabular-nums"
                      >
                        Sub ₹{Math.round(kitchen.monthlyPrice / 30)}/plate
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOrderKitchen(kitchen)}
                        className={`btn-shimmer inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-extrabold text-white transition-all active:scale-[0.98] cursor-pointer ${
                          isJustAdded ? 'bg-[#006d40]' : 'bg-[#a83300] hover:bg-[#832600]'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            Added to Tray
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Order {activeSlotObj.label.replace(' Live', '').replace(' Pre-Order', '')}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* One-Tap Skip Callout Card */}
      <section className="rounded-2xl bg-white border border-[#e9e1dd] p-5 sm:p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#ffdea8] text-[#795600] flex items-center justify-center shrink-0">
            <PauseCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-extrabold text-[#1e1b19]">
              Going home for the weekend or studying late outside?
            </h3>
            <p className="text-xs sm:text-sm text-[#5a4139] mt-0.5">
              Toggle off upcoming meals with one tap. 100% money is refunded instantly to your Campus Wallet for
              semester renewal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#faf2ee] border border-[#e9e1dd] shrink-0 w-full md:w-auto justify-between">
          <div>
            <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
              TOMORROW&apos;S BREAKFAST
            </div>
            <div className="text-xs font-bold text-[#1e1b19]">Poha &amp; Masala Chai</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={tomorrowBreakfastActive}
            aria-label="Toggle tomorrow breakfast delivery"
            onClick={onToggleTomorrowBreakfast}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-colors cursor-pointer ${
              tomorrowBreakfastActive
                ? 'bg-[#006d40] text-white'
                : 'bg-[#e9e1dd] text-[#5a4139]'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                tomorrowBreakfastActive ? 'bg-[#94f7ba]' : 'bg-[#8e7067]'
              }`}
            />
            {tomorrowBreakfastActive ? 'ACTIVE' : 'PAUSED (+₹60)'}
          </button>
        </div>
      </section>

      {/* Mess Subscription Plans */}
      <section className="space-y-6 pt-2">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <div className="text-[10px] font-extrabold tracking-widest uppercase text-[#a83300]">
            NO COOKING, ZERO HASSLE
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1e1b19]">
            Mess Subscription Plans
          </h2>
          <p className="text-sm text-[#5a4139]">
            Lock in lower per-plate rates than single orders. Switch mess vendors anytime within your active cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-white p-6 flex flex-col justify-between transition-shadow ${
                plan.highlighted
                  ? 'border-2 border-[#a83300] shadow-card-active'
                  : 'border border-[#e9e1dd] shadow-card'
              }`}
            >
              {plan.highlightTag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#a83300] text-white text-[10px] font-extrabold tracking-wider uppercase whitespace-nowrap">
                  {plan.highlightTag}
                </div>
              )}

              <div>
                <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#a83300] mb-1">
                  {plan.tierLabel}
                </div>
                <h3 className="font-display text-xl font-extrabold text-[#1e1b19]">{plan.name}</h3>
                <p className="text-xs text-[#5a4139] mt-1.5 min-h-[34px]">{plan.description}</p>

                <div className="mt-5 pb-5 border-b border-[#f4ece8] space-y-1.5">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-display text-3xl font-extrabold text-[#1e1b19] tabular-nums">
                      ₹{plan.perPlatePrice}
                    </span>
                    <span className="text-xs font-semibold text-[#5a4139]">{plan.unitLabel}</span>
                    {plan.regularPerPlate && plan.regularPerPlate > plan.perPlatePrice && (
                      <>
                        <span className="text-xs text-[#8e7067] line-through tabular-nums">
                          ₹{plan.regularPerPlate}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#e6faee] text-[#006d40] text-[10px] font-extrabold tabular-nums">
                          Save ₹{plan.regularPerPlate - plan.perPlatePrice}/plate
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-[#8e7067] tabular-nums">
                    Billed ₹{plan.price.toLocaleString('en-IN')} for {plan.plateCount} plates
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs text-[#1e1b19]">
                      <Check className="w-4 h-4 text-[#006d40] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onSelectPlan(plan)}
                className={`mt-6 w-full py-3 rounded-xl text-xs font-extrabold transition-all active:scale-[0.98] cursor-pointer ${
                  plan.highlighted
                    ? 'bg-[#a83300] hover:bg-[#832600] text-white'
                    : 'bg-[#faf2ee] hover:bg-[#ffdbd0] text-[#1e1b19]'
                }`}
              >
                {plan.ctaLabel}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Hostel Community Favorites */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#a83300] mb-1">
              VERIFIED HOSTEL FEEDBACK
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#1e1b19]">
              Hostel Community Favorites
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1e1b19]">
            <Star className="w-4 h-4 fill-[#ffb800] text-[#ffb800]" />
            <span className="tabular-nums">4.8/5.0</span>
            <span className="font-normal text-[#5a4139]">from 4,700+ student room orders</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white border border-[#e9e1dd] p-5 shadow-card flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#ffb800] text-[#ffb800]" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-[#5a4139] italic">{t.quote}</p>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#f4ece8]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${t.bg}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1e1b19]">{t.name}</div>
                  <div className="text-[11px] text-[#8e7067]">{t.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Hostel Delivery Instructions Strip */}
      <section className="rounded-2xl bg-white border border-[#e9e1dd] p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#ffdbd0] text-[#832600] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-[#1e1b19]">Hostel Delivery Instructions Set</div>
            <div className="text-xs text-[#5a4139]">
              Default: {selectedHostel.name} · {selectedHostel.block} · {selectedHostel.room} · {deliveryNote}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenHostelPicker}
            className="px-3.5 py-2 rounded-lg border border-[#e2bfb4] text-xs font-bold text-[#1e1b19] hover:border-[#a83300] transition-colors cursor-pointer"
          >
            Edit Room No.
          </button>
          <button
            type="button"
            onClick={onOpenDeliveryNote}
            className="px-3.5 py-2 rounded-lg bg-[#a83300] hover:bg-[#832600] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Add Delivery Note
          </button>
        </div>
      </section>
    </div>
  );
}
