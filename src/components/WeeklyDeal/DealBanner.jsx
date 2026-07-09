import { useEffect, useState } from 'react';
import { Clock, Tag } from 'lucide-react';
import { useDeals } from '../../hooks/useDeals';

export default function DealBanner() {
  const { currentDeal, timeLeft } = useDeals();
  const [days, hours, minutes, seconds] = timeLeft;

  if (!currentDeal) return null;

  return (
    <div className="bg-gradient-to-r from-brand-teal to-brand-teal-dark text-white py-4 px-6 rounded-xl mb-8 shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Tag className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-bold">{currentDeal.title}</h2>
            <p className="text-teal-100 text-sm">{currentDeal.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
          <Clock className="w-5 h-5" />
          <div className="flex gap-2 text-sm font-mono">
            <span className="bg-white text-brand-teal rounded px-2 py-1">
              {String(days).padStart(2, '0')}d
            </span>
            <span className="bg-white text-brand-teal rounded px-2 py-1">
              {String(hours).padStart(2, '0')}h
            </span>
            <span className="bg-white text-brand-teal rounded px-2 py-1">
              {String(minutes).padStart(2, '0')}m
            </span>
            <span className="bg-white text-brand-teal rounded px-2 py-1">
              {String(seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
        
        <div className="text-2xl font-bold">
          Up to {currentDeal.discountPercent}% OFF
        </div>
      </div>
    </div>
  );
}