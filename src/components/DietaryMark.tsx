import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import type { DietaryType } from '../types/campus';

export function DietaryMark({
  type = 'veg',
  className = '',
}: {
  type?: DietaryType;
  className?: string;
}) {
  void type;
  return (
    <span
      title="100% Pure Vegetarian"
      aria-label="Pure Vegetarian"
      className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] border-[1.5px] bg-white shrink-0 border-[#1B8754] text-[#1B8754] ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#1B8754]" />
    </span>
  );
}

export function FoodImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#faf2ee] to-[#ffdbd0] text-[#832600] p-3 text-center ${className}`}
      >
        <Utensils className="w-6 h-6 mb-1 opacity-70" />
        <span className="text-[11px] font-semibold line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
