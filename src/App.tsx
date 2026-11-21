import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  COUPONS,
  HOSTEL_ADDRESSES,
  IMAGES,
  INITIAL_ACTIVE_ORDERS,
  INITIAL_CART_ITEMS,
  INITIAL_WALLET_TRANSACTIONS,
  INITIAL_WEEKLY_SCHEDULE,
} from './data/campusData';
import type {
  ActiveOrder,
  CartItem,
  DaySchedule,
  HostelAddress,
  ScreenTab,
  SubscriptionPlan,
  WalletTransaction,
} from './types/campus';
import { calculateBillBreakdown, calculateNextWalletBalance } from './utils/billing';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DailyMessScreen } from './components/DailyMessScreen';
import { CravingsScreen } from './components/CravingsScreen';
import { MealCalendarScreen } from './components/MealCalendarScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { ActiveOrdersScreen } from './components/ActiveOrdersScreen';
import {
  DeliveryNoteModal,
  HostelPickerModal,
  PlanConfirmModal,
  SopModal,
} from './components/Modals';

const STORAGE_KEY = 'campus_dining_state_v2_veg';

interface PersistedState {
  activeScreen: ScreenTab;
  selectedHostelId: string;
  cartItems: CartItem[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  schedule: DaySchedule[];
  handoffMode: 'room' | 'guard';
  appliedCouponCode: string | null;
  deliveryNote: string;
  tomorrowBreakfastActive: boolean;
  goingHomeMode: boolean;
  activeOrders: ActiveOrder[];
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        activeScreen: parsed.activeScreen ?? 'mess',
        selectedHostelId: parsed.selectedHostelId ?? HOSTEL_ADDRESSES[0].id,
        cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems : INITIAL_CART_ITEMS,
        walletBalance: typeof parsed.walletBalance === 'number' ? parsed.walletBalance : 320,
        walletTransactions: Array.isArray(parsed.walletTransactions)
          ? parsed.walletTransactions
          : INITIAL_WALLET_TRANSACTIONS,
        schedule: Array.isArray(parsed.schedule) ? parsed.schedule : INITIAL_WEEKLY_SCHEDULE,
        handoffMode: parsed.handoffMode ?? 'room',
        appliedCouponCode:
          parsed.appliedCouponCode !== undefined ? parsed.appliedCouponCode : 'CAMPUSFEAST',
        deliveryNote:
          parsed.deliveryNote ?? 'Ring bell twice; leave on wooden shoe rack if after 8:30 PM.',
        tomorrowBreakfastActive: parsed.tomorrowBreakfastActive ?? true,
        goingHomeMode: parsed.goingHomeMode ?? false,
        activeOrders: Array.isArray(parsed.activeOrders)
          ? parsed.activeOrders
          : INITIAL_ACTIVE_ORDERS,
      };
    }
  } catch {
    // Ignore storage read errors
  }

  return {
    activeScreen: 'mess',
    selectedHostelId: HOSTEL_ADDRESSES[0].id,
    cartItems: INITIAL_CART_ITEMS,
    walletBalance: 320,
    walletTransactions: INITIAL_WALLET_TRANSACTIONS,
    schedule: INITIAL_WEEKLY_SCHEDULE,
    handoffMode: 'room',
    appliedCouponCode: 'CAMPUSFEAST',
    deliveryNote: 'Ring bell twice; leave on wooden shoe rack if after 8:30 PM.',
    tomorrowBreakfastActive: true,
    goingHomeMode: false,
    activeOrders: INITIAL_ACTIVE_ORDERS,
  };
}

export default function App() {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [hostelPickerOpen, setHostelPickerOpen] = useState(false);
  const [deliveryNoteOpen, setDeliveryNoteOpen] = useState(false);
  const [sopOpen, setSopOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<SubscriptionPlan | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage write errors
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const selectedHostel: HostelAddress =
    HOSTEL_ADDRESSES.find((h) => h.id === state.selectedHostelId) ?? HOSTEL_ADDRESSES[0];

  const activeCoupon = COUPONS.find((c) => c.code === state.appliedCouponCode);
  const bill = calculateBillBreakdown(state.cartItems, activeCoupon);

  const handleNavigate = (screen: ScreenTab) => {
    setState((prev) => ({ ...prev, activeScreen: screen }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (newItem: CartItem) => {
    setState((prev) => {
      const existing = prev.cartItems.find((i) => i.id === newItem.id);
      const nextItems = existing
        ? prev.cartItems.map((i) =>
            i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev.cartItems, newItem];
      return { ...prev, cartItems: nextItems };
    });
    showToast(`Added ${newItem.title} to your hostel tray`);
  };

  const handleUpdateQty = (cartId: string, delta: number) => {
    setState((prev) => {
      const nextItems = prev.cartItems
        .map((item) =>
          item.id === cartId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0);
      return { ...prev, cartItems: nextItems };
    });
  };

  const handleRemoveItem = (cartId: string) => {
    setState((prev) => ({
      ...prev,
      cartItems: prev.cartItems.filter((item) => item.id !== cartId),
    }));
  };

  const handleClearCart = () => {
    setState((prev) => ({ ...prev, cartItems: [] }));
    showToast('Midnight basket cleared');
  };

  const handleToggleTomorrowBreakfast = () => {
    setState((prev) => {
      const nextActive = !prev.tomorrowBreakfastActive;
      const delta = nextActive ? -60 : 60;
      const nextBalance = calculateNextWalletBalance(prev.walletBalance, delta);
      const tx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        date: 'Just now',
        title: nextActive
          ? "Resumed Tomorrow's Breakfast"
          : "Paused Tomorrow's Breakfast (Poha & Chai)",
        amount: delta,
        type: delta > 0 ? 'credit' : 'debit',
      };
      return {
        ...prev,
        tomorrowBreakfastActive: nextActive,
        walletBalance: nextBalance,
        walletTransactions: [tx, ...prev.walletTransactions],
      };
    });
    showToast(
      state.tomorrowBreakfastActive
        ? "Tomorrow's breakfast paused — ₹60 refunded to Campus Wallet"
        : "Tomorrow's breakfast resumed"
    );
  };

  const handleSkipMeal = (dayKey: string, mealId: string) => {
    let credited = 0;
    let mealTitle = '';
    setState((prev) => {
      const nextSchedule = prev.schedule.map((day) => {
        if (day.dayKey !== dayKey) return day;
        return {
          ...day,
          meals: day.meals.map((meal) => {
            if (meal.id !== mealId || meal.status === 'skipped') return meal;
            credited = meal.skipCreditAmount;
            mealTitle = meal.slotName;
            return {
              ...meal,
              status: 'skipped' as const,
              statusBadge: `SKIPPED · +₹${meal.skipCreditAmount} CREDITED`,
              noteTag: 'Refunded to Wallet',
            };
          }),
        };
      });
      if (credited === 0) return prev;
      const tx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        date: 'Just now',
        title: `Skipped ${mealTitle} (${dayKey})`,
        amount: credited,
        type: 'credit',
      };
      return {
        ...prev,
        schedule: nextSchedule,
        walletBalance: calculateNextWalletBalance(prev.walletBalance, credited),
        walletTransactions: [tx, ...prev.walletTransactions],
      };
    });
    showToast(`Meal skipped · ₹${credited || 80} credited to Campus Wallet`);
  };

  const handleUndoSkipMeal = (dayKey: string, mealId: string) => {
    let debited = 0;
    setState((prev) => {
      const nextSchedule = prev.schedule.map((day) => {
        if (day.dayKey !== dayKey) return day;
        return {
          ...day,
          meals: day.meals.map((meal) => {
            if (meal.id !== mealId || meal.status !== 'skipped') return meal;
            debited = meal.skipCreditAmount;
            return {
              ...meal,
              status: 'upcoming' as const,
              statusBadge: 'RESTORED',
              noteTag: 'Scheduled for Delivery',
            };
          }),
        };
      });
      if (debited === 0) return prev;
      return {
        ...prev,
        schedule: nextSchedule,
        walletBalance: calculateNextWalletBalance(prev.walletBalance, -debited),
      };
    });
    showToast('Meal slot restored to delivery schedule');
  };

  const handleSwapMealDish = (
    dayKey: string,
    mealId: string,
    newTitle: string,
    newKcal: number,
    newImage: string
  ) => {
    setState((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day) => {
        if (day.dayKey !== dayKey) return day;
        return {
          ...day,
          meals: day.meals.map((meal) =>
            meal.id === mealId
              ? {
                  ...meal,
                  dishTitle: newTitle,
                  kcal: newKcal,
                  image: newImage,
                  statusBadge: 'SWAPPED · CONFIRMED',
                  noteTag: 'Zero-Fee Swap Applied',
                }
              : meal
          ),
        };
      }),
    }));
    showToast(`Swapped dish to ${newTitle} at zero extra fee`);
  };

  const handleRateMeal = (dayKey: string, mealId: string, rating: number) => {
    setState((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day) => {
        if (day.dayKey !== dayKey) return day;
        return {
          ...day,
          meals: day.meals.map((meal) =>
            meal.id === mealId ? { ...meal, userRating: rating } : meal
          ),
        };
      }),
    }));
    showToast(`Thanks! Rated ${rating}/5 stars`);
  };

  const handleBulkPause = (mode: 'weekend' | 'term') => {
    const targetDays =
      mode === 'weekend'
        ? ['2025-10-25', '2025-10-26']
        : ['2025-10-23', '2025-10-24', '2025-10-25', '2025-10-26'];
    let totalCredit = 0;

    setState((prev) => {
      const nextSchedule = prev.schedule.map((day) => {
        if (!targetDays.includes(day.dayKey)) return day;
        return {
          ...day,
          meals: day.meals.map((meal) => {
            if (meal.status !== 'upcoming') return meal;
            totalCredit += meal.skipCreditAmount;
            return {
              ...meal,
              status: 'skipped' as const,
              statusBadge: `PAUSED · +₹${meal.skipCreditAmount} CREDITED`,
              noteTag: 'Going Home Pause',
            };
          }),
        };
      });
      if (totalCredit === 0) return prev;
      const tx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        date: 'Just now',
        title:
          mode === 'weekend'
            ? 'Going Home Weekend Bulk Pause'
            : 'Term Break Multi-Day Bulk Pause',
        amount: totalCredit,
        type: 'credit',
      };
      return {
        ...prev,
        goingHomeMode: true,
        schedule: nextSchedule,
        walletBalance: calculateNextWalletBalance(prev.walletBalance, totalCredit),
        walletTransactions: [tx, ...prev.walletTransactions],
      };
    });

    showToast(
      totalCredit > 0
        ? `Paused meals · +₹${totalCredit} credited to Campus Wallet`
        : 'Upcoming weekend meals are already paused'
    );
  };

  const handleConfirmPlanToCheckout = (plan: SubscriptionPlan) => {
    const planItem: CartItem = {
      id: `plan-${plan.id}`,
      sourceId: plan.id,
      title: `${plan.name} Subscription Pass`,
      subtitle: `${plan.plateCount} plates at ₹${plan.perPlatePrice}/plate · ${plan.description}`,
      unitPrice: plan.price,
      quantity: 1,
      dietary: 'veg',
      kcal: 600,
      proteinGrams: 22,
      image: IMAGES.sharmaRajma,
      kitchenName: 'Campus Dining Mess Pass',
      addedBy: 'You',
    };
    setState((prev) => ({
      ...prev,
      cartItems: [...prev.cartItems.filter((i) => i.id !== planItem.id), planItem],
      appliedCouponCode: 'PGSTUDENT20',
      activeScreen: 'checkout',
    }));
    setSelectedPlanForModal(null);
    showToast(`${plan.name} added with PGSTUDENT20 20% student discount`);
  };

  const handlePlaceOrder = (payload: {
    paymentMethod: string;
    totalPaid: number;
    useWallet: boolean;
    ecoPack: boolean;
    chefNote: string;
  }) => {
    const newOrder: ActiveOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      placedAt: 'Just now',
      kitchenName: state.cartItems[0]?.kitchenName ?? 'Sharma Ji Kitchen Hub',
      hostelName: selectedHostel.name,
      roomLabel: `${selectedHostel.block}, ${selectedHostel.room}`,
      handoffMode: state.handoffMode,
      items: state.cartItems,
      totalPaid: payload.totalPaid,
      paymentMethod: payload.paymentMethod,
      stage: 1,
      etaMinutes: 24,
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      courierName: 'Arjun Patel (Campus Cycle Courier)',
      courierPhone: '+91 98114 77201',
      ecoPack: payload.ecoPack,
      chefNote: payload.chefNote,
    };

    setState((prev) => {
      const nextBalance = payload.useWallet
        ? calculateNextWalletBalance(prev.walletBalance, -payload.totalPaid)
        : prev.walletBalance;
      const nextTransactions = payload.useWallet
        ? [
            {
              id: `tx-${Date.now()}`,
              date: 'Just now',
              title: `Checkout Order ${newOrder.id}`,
              amount: -payload.totalPaid,
              type: 'debit' as const,
            },
            ...prev.walletTransactions,
          ]
        : prev.walletTransactions;

      return {
        ...prev,
        cartItems: [],
        walletBalance: nextBalance,
        walletTransactions: nextTransactions,
        activeOrders: [newOrder, ...prev.activeOrders],
        activeScreen: 'orders',
      };
    });

    showToast(`Order ${newOrder.id} confirmed! Courier dispatched to ${selectedHostel.room}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvanceOrderStage = (orderId: string) => {
    setState((prev) => ({
      ...prev,
      activeOrders: prev.activeOrders.map((ord) => {
        if (ord.id !== orderId || ord.stage >= 4) return ord;
        const nextStage = (ord.stage + 1) as 1 | 2 | 3 | 4;
        return {
          ...ord,
          stage: nextStage,
          etaMinutes: nextStage === 4 ? 0 : Math.max(2, ord.etaMinutes - 8),
        };
      }),
    }));
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen flex flex-col bg-[#fff8f5] text-[#1e1b19]">
      <Header
        activeScreen={state.activeScreen}
        onNavigate={handleNavigate}
        selectedHostel={selectedHostel}
        onOpenHostelPicker={() => setHostelPickerOpen(true)}
        cartCount={bill.itemCount}
        cartTotal={Math.round(bill.itemTotal)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchOpen={searchOpen}
        onToggleSearch={() => setSearchOpen((v) => !v)}
        activeOrderCount={state.activeOrders.filter((o) => o.stage < 4).length}
        onOpenPromoBanner={() => {
          setState((prev) => ({
            ...prev,
            appliedCouponCode: 'PGSTUDENT20',
            activeScreen: prev.cartItems.length > 0 ? 'checkout' : 'mess',
          }));
          showToast('PGSTUDENT20 (20% Student Discount) activated!');
        }}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeScreen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
        {state.activeScreen === 'mess' && (
          <DailyMessScreen
            selectedHostel={selectedHostel}
            searchQuery={searchQuery}
            onAddToCart={handleAddToCart}
            onSelectPlan={(plan) => setSelectedPlanForModal(plan)}
            onClaimPromo={() => {
              setState((prev) => ({ ...prev, appliedCouponCode: 'PGSTUDENT20' }));
              setSelectedPlanForModal({
                id: 'monthly-standard',
                tierLabel: 'SEMESTER PASS · 20% OFF',
                name: 'Monthly Standard (Student Pass)',
                description: 'Complete daily meal coverage with PGSTUDENT20 20% semester savings.',
                price: 2208,
                perPlatePrice: 55,
                regularPerPlate: 99,
                plateCount: 40,
                unitLabel: '/ plate (20% OFF)',
                features: [
                  '40 wholesome plates (Lunch + Dinner)',
                  'Unlimited meal skips with 100% wallet carry-forward',
                  'Free Room Door drop-off',
                ],
                ctaLabel: 'Add Pass to Checkout',
              });
            }}
            tomorrowBreakfastActive={state.tomorrowBreakfastActive}
            onToggleTomorrowBreakfast={handleToggleTomorrowBreakfast}
            onOpenHostelPicker={() => setHostelPickerOpen(true)}
            onOpenDeliveryNote={() => setDeliveryNoteOpen(true)}
            deliveryNote={state.deliveryNote}
          />
        )}

        {state.activeScreen === 'cravings' && (
          <CravingsScreen
            selectedHostel={selectedHostel}
            searchQuery={searchQuery}
            cartItems={state.cartItems}
            onAddToCart={handleAddToCart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            handoffMode={state.handoffMode}
            onChangeHandoff={(mode) => setState((prev) => ({ ...prev, handoffMode: mode }))}
            onProceedToCheckout={() => handleNavigate('checkout')}
            onOpenSop={() => setSopOpen(true)}
          />
        )}

        {state.activeScreen === 'calendar' && (
          <MealCalendarScreen
            schedule={state.schedule}
            walletBalance={state.walletBalance}
            walletTransactions={state.walletTransactions}
            selectedHostel={selectedHostel}
            handoffMode={state.handoffMode}
            onChangeHandoff={(mode) => setState((prev) => ({ ...prev, handoffMode: mode }))}
            deliveryNote={state.deliveryNote}
            onSaveDeliveryNote={(note) => {
              setState((prev) => ({ ...prev, deliveryNote: note }));
              showToast('Mess courier delivery note updated');
            }}
            onSkipMeal={handleSkipMeal}
            onUndoSkipMeal={handleUndoSkipMeal}
            onSwapMealDish={handleSwapMealDish}
            onRateMeal={handleRateMeal}
            onBulkPause={handleBulkPause}
            goingHomeMode={state.goingHomeMode}
            onToggleGoingHome={() =>
              setState((prev) => ({ ...prev, goingHomeMode: !prev.goingHomeMode }))
            }
            onSpendOnCravings={() => handleNavigate('cravings')}
            onOpenLiveRoute={() => handleNavigate('orders')}
            onOpenHostelPicker={() => setHostelPickerOpen(true)}
          />
        )}

        {state.activeScreen === 'checkout' && (
          <CheckoutScreen
            selectedHostel={selectedHostel}
            onOpenHostelPicker={() => setHostelPickerOpen(true)}
            cartItems={state.cartItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            handoffMode={state.handoffMode}
            onChangeHandoff={(mode) => setState((prev) => ({ ...prev, handoffMode: mode }))}
            appliedCouponCode={state.appliedCouponCode}
            onApplyCoupon={(code) => setState((prev) => ({ ...prev, appliedCouponCode: code }))}
            walletBalance={state.walletBalance}
            onPlaceOrder={handlePlaceOrder}
            onBrowseMess={() => handleNavigate('mess')}
          />
        )}

        {state.activeScreen === 'orders' && (
          <ActiveOrdersScreen
            orders={state.activeOrders}
            onAdvanceStage={handleAdvanceOrderStage}
            onOrderMore={() => handleNavigate('mess')}
          />
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigate} onOpenSop={() => setSopOpen(true)} />

      {/* Modals */}
      <HostelPickerModal
        open={hostelPickerOpen}
        selectedId={selectedHostel.id}
        onSelect={(h) => {
          setState((prev) => ({ ...prev, selectedHostelId: h.id }));
          showToast(`Drop-off updated to ${h.shortLabel}`);
        }}
        onClose={() => setHostelPickerOpen(false)}
      />

      <DeliveryNoteModal
        open={deliveryNoteOpen}
        initialNote={state.deliveryNote}
        onSave={(note) => {
          setState((prev) => ({ ...prev, deliveryNote: note }));
          showToast('Hostel delivery instructions saved');
        }}
        onClose={() => setDeliveryNoteOpen(false)}
      />

      <SopModal open={sopOpen} onClose={() => setSopOpen(false)} />

      <PlanConfirmModal
        plan={selectedPlanForModal}
        onConfirm={handleConfirmPlanToCheckout}
        onClose={() => setSelectedPlanForModal(null)}
      />

      {/* Non-blocking Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#1e1b19] text-white text-xs font-bold shadow-xl border border-white/10 whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4 text-[#78da9f] shrink-0" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}
