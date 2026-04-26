'use client';

import { motion } from 'framer-motion';
import { GeneratedOffer } from '@/types';
import { Clock, ArrowRight, Zap } from 'lucide-react';

interface OfferWidgetProps {
  offer: GeneratedOffer;
  onAccept: () => void;
  onDismiss: () => void;
}

export default function OfferWidget({ offer, onAccept, onDismiss }: OfferWidgetProps) {
  // Cyberpunk/Data-driven theme mapping
  const themeMap: Record<string, string> = {
    warm: 'bg-orange-950/90 border-orange-500/50 text-orange-100 shadow-[0_0_40px_rgba(249,115,22,0.25)]',
    cool: 'bg-blue-950/90 border-blue-500/50 text-blue-100 shadow-[0_0_40px_rgba(59,130,246,0.25)]',
    urgent: 'bg-red-950/90 border-red-500/50 text-red-100 shadow-[0_0_40px_rgba(239,68,68,0.25)]',
    minimal: 'bg-slate-900/90 border-slate-500/50 text-slate-100 shadow-[0_0_40px_rgba(148,163,184,0.25)]',
  };

  const badgeThemeMap: Record<string, string> = {
    warm: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    cool: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    urgent: 'bg-red-500/20 text-red-300 border-red-500/30',
    minimal: 'bg-slate-700/50 text-slate-300 border-slate-600',
  };

  const buttonThemeMap: Record<string, string> = {
    warm: 'bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]',
    cool: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]',
    urgent: 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]',
    minimal: 'bg-slate-200 hover:bg-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.4)]',
  };

  const containerClasses = themeMap[offer.uiTheme] || themeMap.minimal;
  const badgeClasses = badgeThemeMap[offer.uiTheme] || badgeThemeMap.minimal;
  const buttonClasses = buttonThemeMap[offer.uiTheme] || buttonThemeMap.minimal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`relative w-full max-w-sm rounded-2xl border backdrop-blur-xl p-6 ${containerClasses} font-mono z-50`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`flex items-center space-x-1 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${badgeClasses}`}>
          <Zap className="w-3 h-3" />
          <span>{offer.discountPercentage}% Yield</span>
        </div>
        <button onClick={onDismiss} className="text-opacity-50 hover:text-opacity-100 p-1 text-xs tracking-widest uppercase hover:text-white transition-colors">
          [ESC]
        </button>
      </div>

      <h3 className="mb-3 text-xl font-bold tracking-tight uppercase border-b border-current pb-3 opacity-90">{offer.headline}</h3>
      <p className="mb-8 text-sm opacity-80 leading-relaxed font-sans">{offer.body}</p>

      <button
        onClick={onAccept}
        className={`flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-3 font-bold uppercase tracking-widest transition-all active:scale-95 ${buttonClasses}`}
      >
        <span>{offer.callToAction}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="mt-5 flex items-center justify-center space-x-2 text-[10px] opacity-50 uppercase tracking-widest">
        <Clock className="w-3 h-3" />
        <span>Generated 0ms ago • Edge Compute</span>
      </div>
    </motion.div>
  );
}
