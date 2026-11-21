import React, { useState } from 'react';
import { Check, MapPin, ShieldCheck, Sparkles, X } from 'lucide-react';
import { motion } from 'motion/react';
import { HOSTEL_ADDRESSES } from '../data/campusData';
import type { HostelAddress, SubscriptionPlan } from '../types/campus';

export function HostelPickerModal({
  open,
  selectedId,
  onSelect,
  onClose,
}: {
  open: boolean;
  selectedId: string;
  onSelect: (hostel: HostelAddress) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hostel-picker-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl border border-[#e9e1dd] max-w-lg w-full p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 id="hostel-picker-title" className="font-display text-lg font-extrabold text-[#1e1b19]">
              Select Hostel or PG Drop-Off
            </h2>
            <p className="text-xs text-[#5a4139]">Verified campus housing blocks with doorstep gate clearance</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg hover:bg-[#faf2ee] text-[#5a4139] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {HOSTEL_ADDRESSES.map((h) => {
            const active = h.id === selectedId;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => {
                  onSelect(h);
                  onClose();
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  active
                    ? 'bg-[#fff5eb] border-[#a83300] ring-1 ring-[#a83300]'
                    : 'bg-[#faf2ee] border-[#eee7e3] hover:border-[#a83300]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#a83300]" />
                    <span className="font-display text-sm font-extrabold text-[#1e1b19]">{h.name}</span>
                    <span className="px-2 py-0.5 rounded bg-[#e6faee] text-[#006d40] text-[9px] font-extrabold">
                      {h.badge}
                    </span>
                  </div>
                  <div className="text-xs text-[#1e1b19] font-medium">{h.addressLine}</div>
                  <div className="text-[11px] text-[#8e7067]">{h.landmark}</div>
                </div>
                {active && <Check className="w-4 h-4 text-[#a83300] shrink-0 mt-1" />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export function DeliveryNoteModal({
  open,
  initialNote,
  onSave,
  onClose,
}: {
  open: boolean;
  initialNote: string;
  onSave: (note: string) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState(initialNote);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-note-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl border border-[#e9e1dd] max-w-md w-full p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 id="delivery-note-title" className="font-display text-lg font-extrabold text-[#1e1b19]">
            Update Hostel Delivery Note
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg hover:bg-[#faf2ee] text-[#5a4139] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-3 rounded-xl bg-[#faf2ee] border border-[#e9e1dd] text-xs text-[#1e1b19] focus:outline-none focus:border-[#a83300]"
          placeholder="e.g. Ring bell twice; leave on wooden rack outside Room 304."
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#e9e1dd] text-xs font-bold text-[#5a4139] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(note.trim() || initialNote);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-[#a83300] text-white text-xs font-extrabold cursor-pointer"
          >
            Save Instructions
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function SopModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sop-title"
    >
      <div className="bg-white rounded-2xl border border-[#e9e1dd] max-w-lg w-full p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#006d40]" />
            <h2 id="sop-title" className="font-display text-lg font-extrabold text-[#1e1b19]">
              Hostel Gate &amp; Midnight Delivery SOP
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close SOP modal"
            className="p-1.5 rounded-lg hover:bg-[#faf2ee] text-[#5a4139] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul className="space-y-3 text-xs text-[#5a4139]">
          <li className="p-3 rounded-xl bg-[#faf2ee]">
            <strong className="text-[#1e1b19] block mb-0.5">1. Warden-Signed Campus QR Pass</strong>
            All Campus Dining cycle couriers carry verified biometric gate passes valid until 3:30 AM.
          </li>
          <li className="p-3 rounded-xl bg-[#faf2ee]">
            <strong className="text-[#1e1b19] block mb-0.5">2. Zero-Spill Thermal Packaging</strong>
            Curries and dals are double-sealed inside recyclable aluminum-lined tiffins with tamper strips.
          </li>
          <li className="p-3 rounded-xl bg-[#faf2ee]">
            <strong className="text-[#1e1b19] block mb-0.5">3. Contactless Shelf &amp; Guard Desk Fallback</strong>
            If dorm corridors close after 11:30 PM, orders drop automatically in the numbered student rack with SMS OTP.
          </li>
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#a83300] text-white text-xs font-extrabold cursor-pointer"
        >
          Got It
        </button>
      </div>
    </div>
  );
}

export function PlanConfirmModal({
  plan,
  onConfirm,
  onClose,
}: {
  plan: SubscriptionPlan | null;
  onConfirm: (plan: SubscriptionPlan) => void;
  onClose: () => void;
}) {
  if (!plan) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-modal-title"
    >
      <div className="bg-white rounded-2xl border border-[#e9e1dd] max-w-md w-full p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#006d40]">
            <Sparkles className="w-3.5 h-3.5" />
            {plan.tierLabel}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg hover:bg-[#faf2ee] text-[#5a4139] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 id="plan-modal-title" className="font-display text-xl font-extrabold text-[#1e1b19]">
            {plan.name}
          </h2>
          <p className="text-xs text-[#5a4139] mt-1">{plan.description}</p>
        </div>

        <div className="rounded-xl bg-[#faf2ee] p-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-[#5a4139]">Subscription Per-Plate Rate</div>
            <div className="text-[11px] text-[#8e7067] tabular-nums mt-0.5">
              ₹{plan.perPlatePrice}/plate × {plan.plateCount} plates
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-extrabold text-[#a83300] tabular-nums leading-none">
              ₹{plan.perPlatePrice}
              <span className="text-xs font-semibold text-[#5a4139]">/plate</span>
            </div>
            <div className="text-[11px] font-bold text-[#1e1b19] tabular-nums mt-1">
              Total: ₹{plan.price.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <ul className="space-y-1.5 text-xs text-[#1e1b19]">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#006d40]" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#e9e1dd] text-xs font-bold text-[#5a4139] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(plan)}
            className="flex-1 py-2.5 rounded-xl bg-[#a83300] hover:bg-[#832600] text-white text-xs font-extrabold cursor-pointer"
          >
            Add Pass to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
