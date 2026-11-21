import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBillBreakdown,
  calculateNextWalletBalance,
  calculateRoommateSplit,
  validateCoupon,
} from './billing';
import type { CartItem, CouponDefinition } from '../types/campus';

const sampleItems: CartItem[] = [
  {
    id: 'i1',
    sourceId: 'sharma-lunch',
    title: 'Sharma Ji Homestyle Lunch Thali',
    subtitle: '2x Butter Phulkas, Matar Paneer, Dal Tadka',
    unitPrice: 99,
    quantity: 1,
    dietary: 'veg',
    kcal: 640,
    proteinGrams: 22,
    image: '/src/assets/images/thali_sharma_rajma_1795282944748.jpg',
    kitchenName: 'Sharma Ji Kitchen Hub',
  },
  {
    id: 'i2',
    sourceId: 'paneer-roll',
    title: 'Crispy Paneer Tikka Roll + Mint Chutney',
    subtitle: 'Smoky paneer cubes in flaky paratha base',
    unitPrice: 65,
    quantity: 1,
    dietary: 'veg',
    kcal: 380,
    proteinGrams: 16,
    image: '/src/assets/images/craving_paneer_roll_1795282945122.jpg',
    kitchenName: 'Sharma Ji Kitchen Hub',
  },
  {
    id: 'i3',
    sourceId: 'chaas',
    title: 'Masala Buttermilk (Chaas) 250ml',
    subtitle: 'Slow-churned yogurt',
    unitPrice: 25,
    quantity: 1,
    dietary: 'veg',
    kcal: 85,
    proteinGrams: 4,
    image: '/src/assets/images/meal_poha_breakfast_1795282944160.jpg',
    kitchenName: 'Sharma Ji Kitchen Hub',
  },
];

const campusFeastCoupon: CouponDefinition = {
  code: 'CAMPUSFEAST',
  title: 'Flat ₹40 OFF',
  description: 'Flat ₹40 OFF unlocked on order value above ₹150 for campus hostels.',
  minOrderValue: 150,
  discountType: 'flat',
  discountValue: 40,
  footnote: 'You are saving ₹40 on this meal!',
};

test('calculateBillBreakdown computes exact totals with CAMPUSFEAST coupon', () => {
  const bill = calculateBillBreakdown(sampleItems, campusFeastCoupon);
  assert.equal(bill.itemTotal, 189);
  assert.equal(bill.itemCount, 3);
  assert.equal(bill.couponDiscount, 40);
  assert.equal(bill.deliveryFee, 0);
  assert.equal(bill.platformFee, 3);
  assert.equal(bill.taxes, 8.5);
  assert.equal(bill.toPay, 160.5);
  assert.equal(bill.appliedCouponCode, 'CAMPUSFEAST');
});

test('validateCoupon rejects order below minimum threshold', () => {
  const result = validateCoupon(campusFeastCoupon, 120);
  assert.equal(result.valid, false);
  assert.equal(result.discountAmount, 0);
  assert.match(result.reason ?? '', /Minimum order of ₹150/);
});

test('calculateBillBreakdown returns zeros on empty cart', () => {
  const bill = calculateBillBreakdown([], campusFeastCoupon);
  assert.equal(bill.itemTotal, 0);
  assert.equal(bill.toPay, 0);
  assert.equal(bill.appliedCouponCode, null);
});

test('calculateNextWalletBalance refunds and debits safely without negative balance', () => {
  assert.equal(calculateNextWalletBalance(320, 80), 400);
  assert.equal(calculateNextWalletBalance(320, -160.5), 159.5);
  assert.equal(calculateNextWalletBalance(100, -250), 0);
});

test('calculateRoommateSplit rounds up fairly per participant', () => {
  assert.equal(calculateRoommateSplit(237, 3), 79);
  assert.equal(calculateRoommateSplit(250, 3), 84);
});
