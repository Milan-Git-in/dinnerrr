import type { CartItem, CouponDefinition } from '../types/campus';

export interface BillBreakdown {
  itemTotal: number;
  itemCount: number;
  couponDiscount: number;
  deliveryFee: number;
  originalDeliveryFee: number;
  platformFee: number;
  taxes: number;
  toPay: number;
  totalSavings: number;
  appliedCouponCode: string | null;
}

export interface CouponValidationResult {
  valid: boolean;
  discountAmount: number;
  reason?: string;
}

export function validateCoupon(
  coupon: CouponDefinition | undefined,
  itemTotal: number
): CouponValidationResult {
  if (!coupon) {
    return { valid: false, discountAmount: 0, reason: 'Invalid coupon or hostel code.' };
  }
  if (itemTotal <= 0) {
    return { valid: false, discountAmount: 0, reason: 'Add items to tray before applying a coupon.' };
  }
  if (itemTotal < coupon.minOrderValue) {
    return {
      valid: false,
      discountAmount: 0,
      reason: `Minimum order of ₹${coupon.minOrderValue} required for ${coupon.code}.`,
    };
  }
  if (coupon.discountType === 'flat') {
    return {
      valid: true,
      discountAmount: Math.min(coupon.discountValue, itemTotal),
    };
  }
  const rawPercent = Math.round((itemTotal * coupon.discountValue) / 100);
  const capped = coupon.maxDiscount ? Math.min(rawPercent, coupon.maxDiscount) : rawPercent;
  return {
    valid: true,
    discountAmount: Math.min(capped, itemTotal),
  };
}

export function calculateBillBreakdown(
  items: CartItem[],
  coupon: CouponDefinition | undefined
): BillBreakdown {
  const itemTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0) {
    return {
      itemTotal: 0,
      itemCount: 0,
      couponDiscount: 0,
      deliveryFee: 0,
      originalDeliveryFee: 25,
      platformFee: 0,
      taxes: 0,
      toPay: 0,
      totalSavings: 0,
      appliedCouponCode: null,
    };
  }

  const couponCheck = validateCoupon(coupon, itemTotal);
  const couponDiscount = couponCheck.valid ? couponCheck.discountAmount : 0;
  const appliedCouponCode = couponCheck.valid && coupon ? coupon.code : null;

  const originalDeliveryFee = 25;
  const deliveryFee = 0; // Free student dorm delivery
  const platformFee = 3;

  // Govt. taxes & mess cess ~5% on discounted subtotal, rounded to nearest 0.50
  const taxableBase = Math.max(0, itemTotal - couponDiscount);
  const rawTax = taxableBase * 0.0567;
  const taxes = Math.round(rawTax * 2) / 2;

  const toPay = Number((taxableBase + platformFee + taxes).toFixed(2));
  const totalSavings = couponDiscount + originalDeliveryFee;

  return {
    itemTotal,
    itemCount,
    couponDiscount,
    deliveryFee,
    originalDeliveryFee,
    platformFee,
    taxes,
    toPay,
    totalSavings,
    appliedCouponCode,
  };
}

export function calculateNextWalletBalance(
  currentBalance: number,
  delta: number
): number {
  return Math.max(0, Number((currentBalance + delta).toFixed(2)));
}

export function calculateRoommateSplit(totalAmount: number, participantCount: number): number {
  if (participantCount <= 0) return totalAmount;
  return Math.ceil(totalAmount / participantCount);
}
