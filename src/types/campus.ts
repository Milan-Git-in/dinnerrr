export type ScreenTab = 'mess' | 'cravings' | 'calendar' | 'checkout' | 'orders';

export type MealSlotKey = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type DietaryType = 'veg';

export interface MessKitchen {
  id: string;
  name: string;
  subtitle: string;
  dietary: DietaryType;
  tags: string[];
  rating: number;
  reviewCount: string;
  eta: string;
  badgeText: string;
  image: string;
  pricePerMeal: number;
  monthlyPrice: number;
  slotMenus: Record<
    MealSlotKey,
    {
      label: string;
      dishTitle: string;
      kcal: number;
      protein: number;
      carbsLabel: string;
      carbsValue: string;
    }
  >;
  customizationType: 'spice' | 'addons' | 'protein' | 'bread';
  customizationLabel: string;
  options: { id: string; label: string; extraPrice?: number }[];
}

export interface CravingItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  dietary: DietaryType;
  description: string;
  price: number;
  originalPrice: number;
  etaMinutes: number;
  proteinGrams: number;
  kcal: number;
  image: string;
}

export interface CartItem {
  id: string;
  sourceId: string;
  title: string;
  subtitle: string;
  unitPrice: number;
  quantity: number;
  dietary: DietaryType;
  kcal: number;
  proteinGrams: number;
  image: string;
  kitchenName: string;
  addedBy?: string;
}

export type ScheduledMealStatus = 'delivered' | 'confirmed' | 'upcoming' | 'skipped';

export interface ScheduledMeal {
  id: string;
  slotName: 'Breakfast Slot' | 'Lunch Slot' | 'Dinner Slot';
  slotTimeRange: string;
  status: ScheduledMealStatus;
  statusBadge: string;
  kitchenName: string;
  deliveryModeLabel: string;
  dishTitle: string;
  kcal: number;
  proteinLabel: string;
  noteTag: string;
  skipCreditAmount: number;
  image: string;
  userRating?: number;
  swappedFrom?: string;
}

export interface DaySchedule {
  dayKey: string;
  dayShort: string;
  dateNum: string;
  fullDateLabel: string;
  meals: ScheduledMeal[];
}

export interface HostelAddress {
  id: string;
  name: string;
  shortLabel: string;
  badge: string;
  addressLine: string;
  landmark: string;
  block: string;
  floor: string;
  room: string;
  gatePassCode: string;
  roommateInfo: string;
  gateNote: string;
  etaText: string;
}

export interface SubscriptionPlan {
  id: string;
  tierLabel: string;
  name: string;
  description: string;
  price: number;
  perPlatePrice: number;
  regularPerPlate?: number;
  plateCount: number;
  unitLabel: string;
  highlighted?: boolean;
  highlightTag?: string;
  features: string[];
  ctaLabel: string;
}

export interface CouponDefinition {
  code: string;
  title: string;
  description: string;
  minOrderValue: number;
  discountType: 'flat' | 'percent';
  discountValue: number;
  maxDiscount?: number;
  footnote: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  title: string;
  amount: number;
  type: 'credit' | 'debit';
}

export interface ActiveOrder {
  id: string;
  placedAt: string;
  kitchenName: string;
  hostelName: string;
  roomLabel: string;
  handoffMode: 'room' | 'guard';
  items: CartItem[];
  totalPaid: number;
  paymentMethod: string;
  stage: 1 | 2 | 3 | 4;
  etaMinutes: number;
  otp: string;
  courierName: string;
  courierPhone: string;
  ecoPack: boolean;
  chefNote: string;
}
