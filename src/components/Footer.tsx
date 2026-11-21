import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ScreenTab } from '../types/campus';

export function Footer({
  onNavigate,
  onOpenSop,
}: {
  onNavigate: (tab: ScreenTab) => void;
  onOpenSop: () => void;
}) {
  return (
    <footer className="mt-14 border-t border-[#e9e1dd] bg-[#faf2ee] text-[#5a4139]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#d04408] text-white flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2.2]" aria-hidden="true">
                  <path d="M4 15h16M6 15a6 6 0 0 1 12 0M12 5v2M9 18h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-display font-bold text-base text-[#1e1b19]">Campus Dining</span>
            </div>
            <p className="text-xs leading-relaxed text-[#5a4139] mb-3">
              Dependable, nutritious daily mess subscriptions and high-speed dorm drop-offs engineered exclusively for
              college flatmates & PG residents.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#006d40]">
              <ShieldCheck className="w-4 h-4" />
              FSSAI Certified Student Kitchens
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-extrabold tracking-wider uppercase text-[#1e1b19] mb-3">
              CAMPUS COVERAGE
            </h4>
            <ul className="space-y-2 text-xs">
              <li>North Campus Hostels (Blocks A–K)</li>
              <li>Greenwood Student Housing & PGs</li>
              <li>Tech Zone PG Hub & Knowledge Park</li>
              <li>Girls Common Room & South Dorms</li>
              <li>East Block Late Night Desk</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-extrabold tracking-wider uppercase text-[#1e1b19] mb-3">
              NUTRITION & TRUST
            </h4>
            <ul className="space-y-2 text-xs">
              <li>100% Pure Veg Dedicated Hubs</li>
              <li>Macro-Tracked High Protein Mess</li>
              <li>Daily Allergen Breakdown (Nuts, Dairy, Gluten)</li>
              <li>Weekly Rotating Cook Roster</li>
              <li>Skip or Pause Anytime (No Lock-In)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-extrabold tracking-wider uppercase text-[#1e1b19] mb-3">
              MESS PARTNERS & HELP
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('mess')}
                  className="hover:text-[#a83300] transition-colors cursor-pointer"
                >
                  Explore Campus Mess Partners
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('calendar')}
                  className="hover:text-[#a83300] transition-colors cursor-pointer"
                >
                  Skip & Wallet Refund Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSop}
                  className="hover:text-[#a83300] transition-colors cursor-pointer"
                >
                  Room Delivery SOPs & Guard Desk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cravings')}
                  className="hover:text-[#a83300] transition-colors cursor-pointer"
                >
                  24x7 Night Cravings Desk
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#e9e1dd] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8e7067]">
          <p>© 2025 CampusTiffin Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 font-bold tracking-wider uppercase">
            <span>PRIVACY</span>
            <span>TERMS OF SERVICE</span>
            <span>MESS HYGIENE AUDIT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
