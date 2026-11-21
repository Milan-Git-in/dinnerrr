import React from 'react';
import { MapPin, ChevronDown, Search, ShoppingBag, Sparkles, X } from 'lucide-react';
import type { HostelAddress, ScreenTab } from '../types/campus';

interface HeaderProps {
  activeScreen: ScreenTab;
  onNavigate: (screen: ScreenTab) => void;
  selectedHostel: HostelAddress;
  onOpenHostelPicker: () => void;
  cartCount: number;
  cartTotal: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchOpen: boolean;
  onToggleSearch: () => void;
  activeOrderCount: number;
  onOpenPromoBanner: () => void;
}

export function Header({
  activeScreen,
  onNavigate,
  selectedHostel,
  onOpenHostelPicker,
  cartCount,
  cartTotal,
  searchQuery,
  onSearchChange,
  searchOpen,
  onToggleSearch,
  activeOrderCount,
  onOpenPromoBanner,
}: HeaderProps) {
  const navItems: { id: ScreenTab; label: string }[] = [
    { id: 'mess', label: 'Daily Mess & Tiffins' },
    { id: 'cravings', label: 'Instant Meals & Snacks' },
    { id: 'calendar', label: 'My Meal Calendar' },
    { id: 'orders', label: `Active Orders${activeOrderCount > 0 ? ` (${activeOrderCount})` : ''}` },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#e9e1dd]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand + Hostel Drop-off Selector */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 lg:flex-initial">
          <button
            type="button"
            onClick={() => onNavigate('mess')}
            aria-label="Campus Dining Home"
            className="w-9 h-9 rounded-lg bg-[#d04408] text-white flex items-center justify-center shrink-0 hover:bg-[#a83300] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[2.2]" aria-hidden="true">
              <path d="M4 15h16M6 15a6 6 0 0 1 12 0M12 5v2M9 18h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onOpenHostelPicker}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] border border-[#e9e1dd] text-left transition-colors min-w-0 flex-1 sm:flex-initial sm:min-w-[210px] sm:max-w-[260px] cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#a83300] shrink-0" />
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="text-[9px] font-extrabold tracking-wider uppercase text-[#8e7067] leading-none mb-0.5 truncate">
                HOSTEL DROP-OFF
              </div>
              <div className="text-xs font-bold text-[#1e1b19] truncate leading-tight">
                {selectedHostel.shortLabel}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#5a4139] shrink-0" />
          </button>

          <button
            type="button"
            onClick={onToggleSearch}
            aria-label="Toggle dish search"
            className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
              searchOpen
                ? 'bg-[#ffdbd0] border-[#a83300] text-[#832600]'
                : 'bg-[#faf2ee] border-[#e9e1dd] text-[#5a4139] hover:text-[#1e1b19]'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#a83300] text-white'
                    : 'text-[#5a4139] hover:text-[#1e1b19] hover:bg-[#faf2ee]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Student 20% Off + Checkout Bag + Student Avatar */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenPromoBanner}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e6faee] border border-[#94f7ba] text-[#00522f] text-[11px] font-extrabold tracking-wide whitespace-nowrap shrink-0 hover:bg-[#d1f5df] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#006d40]" />
            STUDENT 20% OFF
          </button>

          <button
            type="button"
            onClick={() => onNavigate('checkout')}
            aria-label={`Open Hostel Checkout, ${cartCount} items, total ₹${cartTotal}`}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer tabular-nums ${
              activeScreen === 'checkout'
                ? 'bg-[#832600] text-white ring-2 ring-[#ffb59d]'
                : 'bg-[#a83300] hover:bg-[#832600] text-white shadow-sm'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{cartCount > 0 ? `₹${cartTotal}` : 'Tray Empty'}</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] leading-none">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('calendar')}
            title="Arjun Sharma · Greenwood PG Rm 304"
            aria-label="Student Profile & Meal Wallet"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d04408] to-[#795600] text-white text-xs font-extrabold flex items-center justify-center shrink-0 border-2 border-[#ffdbd0] cursor-pointer"
          >
            AS
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="border-t border-[#e9e1dd] bg-[#faf2ee] px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-[1280px] mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-[#8e7067] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Rajma Chawal, High Protein Paneer, Maggi, Biryani, or PG Kitchen..."
              aria-label="Search dishes and kitchens"
              className="w-full bg-transparent text-sm text-[#1e1b19] placeholder:text-[#8e7067] focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="text-xs font-semibold text-[#5a4139] hover:text-[#1e1b19] px-2 py-1 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onToggleSearch}
              aria-label="Close search bar"
              className="p-1 text-[#5a4139] hover:text-[#1e1b19] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom-Compact Nav Bar inside Header */}
      <div className="lg:hidden border-t border-[#f4ece8] bg-white px-3 py-1.5 flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive ? 'bg-[#a83300] text-white' : 'text-[#5a4139] bg-[#faf2ee]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
