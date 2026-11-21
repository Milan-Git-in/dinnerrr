import React from 'react';
import { CheckCircle2, Clock, MapPin, Phone, ShieldCheck, Truck } from 'lucide-react';
import type { ActiveOrder } from '../types/campus';
import { DietaryMark } from './DietaryMark';

interface ActiveOrdersScreenProps {
  orders: ActiveOrder[];
  onAdvanceStage: (orderId: string) => void;
  onOrderMore: () => void;
}

const STAGES = [
  { step: 1, label: 'Order Accepted' },
  { step: 2, label: 'Packed Hot at Hub' },
  { step: 3, label: 'At Hostel Gate' },
  { step: 4, label: 'Delivered' },
];

export function ActiveOrdersScreen({
  orders,
  onAdvanceStage,
  onOrderMore,
}: ActiveOrdersScreenProps) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#006d40] mb-1">
            LIVE CAMPUS TRACKING · DOORSTEP DROP
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1e1b19]">
            Active Orders &amp; Dorm Deliveries
          </h1>
          <p className="text-xs sm:text-sm text-[#5a4139] mt-0.5">
            Track real-time cycle courier progress from the mess hub to your room door or guard desk.
          </p>
        </div>
        <button
          type="button"
          onClick={onOrderMore}
          className="px-4 py-2.5 rounded-xl bg-[#a83300] hover:bg-[#832600] text-white text-xs font-extrabold cursor-pointer self-start sm:self-auto"
        >
          + Order Another Meal
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#e9e1dd] p-12 text-center space-y-3 shadow-card">
          <h2 className="font-display text-lg font-extrabold text-[#1e1b19]">No Active Orders Right Now</h2>
          <p className="text-xs text-[#5a4139]">Your next scheduled mess meal or midnight craving will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl bg-white border border-[#e9e1dd] p-5 sm:p-6 shadow-card space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#f4ece8]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-[#1e1b19] tabular-nums">
                      {order.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        order.stage === 4
                          ? 'bg-[#e6faee] text-[#006d40]'
                          : 'bg-[#ffdbd0] text-[#832600]'
                      }`}
                    >
                      {order.stage === 4 ? 'DELIVERED TO DORM' : `ETA ${order.etaMinutes} MINS`}
                    </span>
                  </div>
                  <div className="text-xs text-[#5a4139]">
                    {order.kitchenName} · Placed {order.placedAt}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                    HANDOFF OTP
                  </div>
                  <div className="font-mono text-xl font-bold text-[#a83300] tracking-widest tabular-nums">
                    {order.otp}
                  </div>
                </div>
              </div>

              {/* 4-Stage Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STAGES.map((s) => {
                  const done = order.stage >= s.step;
                  const current = order.stage === s.step;
                  return (
                    <div
                      key={s.step}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                        done
                          ? current && order.stage < 4
                            ? 'bg-[#fff5eb] border-[#a83300] text-[#832600]'
                            : 'bg-[#e6faee] border-[#94f7ba] text-[#00522f]'
                          : 'bg-[#faf2ee] border-[#eee7e3] text-[#8e7067]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-extrabold">{s.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Courier + Items */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7 rounded-xl bg-[#faf2ee] p-4 space-y-2.5">
                  <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#8e7067]">
                    ORDER ITEMS ({order.items.reduce((s, i) => s + i.quantity, 0)})
                  </div>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <DietaryMark type={item.dietary} />
                          <span className="font-bold text-[#1e1b19] truncate">
                            {item.quantity}x {item.title}
                          </span>
                        </div>
                        <span className="font-extrabold text-[#1e1b19] tabular-nums shrink-0">
                          ₹{item.unitPrice * item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-[#e9e1dd] flex items-center justify-between text-xs">
                    <span className="text-[#5a4139]">Paid via {order.paymentMethod}</span>
                    <span className="font-display text-sm font-extrabold text-[#a83300] tabular-nums">
                      ₹{order.totalPaid.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-xl bg-[#faf2ee] p-4 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#1e1b19]">
                      <Truck className="w-4 h-4 text-[#a83300]" />
                      {order.courierName}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5a4139]">
                      <MapPin className="w-3.5 h-3.5 text-[#006d40] shrink-0" />
                      <span>
                        {order.hostelName} · {order.roomLabel} (
                        {order.handoffMode === 'room' ? 'Room Door' : 'Guard Desk'})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5a4139]">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="tabular-nums">{order.courierPhone}</span>
                    </div>
                  </div>

                  {order.stage < 4 ? (
                    <button
                      type="button"
                      onClick={() => onAdvanceStage(order.id)}
                      className="w-full py-2 rounded-lg bg-white border border-[#e2bfb4] hover:border-[#a83300] text-xs font-extrabold text-[#a83300] cursor-pointer"
                    >
                      Simulate Next Delivery Step →
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006d40]">
                      <ShieldCheck className="w-4 h-4" />
                      Tamper-sealed tiffin handed off safely
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
