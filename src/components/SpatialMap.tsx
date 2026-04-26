'use client';

import { motion } from 'framer-motion';
import { User, Cpu, Store, Coffee, ShoppingBag, Utensils } from 'lucide-react';
import { Bounty, GeneratedOffer } from '@/types';
import OfferWidget from './OfferWidget';
import { mockBounties } from '@/lib/mockData';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface SpatialMapProps {
  isLoading: boolean;
  activeBounty: Bounty | null;
  offer: GeneratedOffer | null;
  onAcceptOffer: () => void;
  onDismissOffer: () => void;
  isAccepted: boolean;
}

export default function SpatialMap({ isLoading, activeBounty, offer, onAcceptOffer, onDismissOffer, isAccepted }: SpatialMapProps) {
  
  // Simulated geographic relative positions (percentages over the map view)
  const nodes = {
    user: { x: 50, y: 50 }, // Center
    ai: { x: 50, y: 80 }, // Below user
    merchants: {
      'b1': { x: 80, y: 20 }, // Top Right - Cafe
      'b2': { x: 15, y: 60 }, // Bottom Left - Retail
      'b3': { x: 20, y: 20 }, // Top Left - Restaurant
      'b4': { x: 85, y: 65 }, // Bottom Right - Burger Joint
      'b5': { x: 75, y: 40 }, // Middle Right
      'b6': { x: 25, y: 80 }, // Bottom Middle Left
    }
  };

  const getMerchantIcon = (type: string) => {
    switch (type) {
      case 'Cafe': return <Coffee className="w-5 h-5" />;
      case 'Retail': return <ShoppingBag className="w-5 h-5" />;
      case 'Restaurant': return <Utensils className="w-5 h-5" />;
      default: return <Store className="w-5 h-5" />;
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-[#020617] rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Real Map Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <MapContainer 
          center={[48.7758, 9.1829]} // Stuttgart City Center
          zoom={14} 
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          style={{ width: '100%', height: '100%', background: '#020617' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </MapContainer>
      </div>

      {/* Ambient Glowing Backgrounds */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen z-0"></div>

      {/* SVG Canvas for Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        
        {/* Draw edges to active merchant if loading or generated */}
        {(isLoading || offer) && activeBounty && nodes.merchants[activeBounty.id as keyof typeof nodes.merchants] && (
          <>
            {/* Glowing outer line */}
            <motion.line
              x1={`${nodes.merchants[activeBounty.id as keyof typeof nodes.merchants].x}%`}
              y1={`${nodes.merchants[activeBounty.id as keyof typeof nodes.merchants].y}%`}
              x2={`${nodes.user.x}%`}
              y2={`${nodes.user.y}%`}
              stroke="rgb(99 102 241)" // Indigo
              strokeWidth="6"
              strokeLinecap="round"
              className="opacity-40 blur-sm"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            {/* Core inner line */}
            <motion.line
              x1={`${nodes.merchants[activeBounty.id as keyof typeof nodes.merchants].x}%`}
              y1={`${nodes.merchants[activeBounty.id as keyof typeof nodes.merchants].y}%`}
              x2={`${nodes.user.x}%`}
              y2={`${nodes.user.y}%`}
              stroke="rgb(165 180 252)" // Indigo 300
              strokeWidth="2"
              strokeDasharray="8 8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            {/* Animated data packet traveling from Merchant to User */}
            {isLoading && (
              <motion.circle
                r="6"
                fill="#ffffff"
                className="drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
                initial={{ 
                  cx: `${nodes.merchants[activeBounty.id as keyof typeof nodes.merchants].x}%`, 
                  cy: `${nodes.merchants[activeBounty.id as keyof typeof nodes.merchants].y}%` 
                }}
                animate={{ 
                  cx: `${nodes.user.x}%`, 
                  cy: `${nodes.user.y}%` 
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </>
        )}

        {/* Draw edge from User to AI if loading */}
        {isLoading && (
          <>
            <motion.line
              x1={`${nodes.user.x}%`}
              y1={`${nodes.user.y}%`}
              x2={`${nodes.ai.x}%`}
              y2={`${nodes.ai.y}%`}
              stroke="rgb(16 185 129)" // Emerald
              strokeWidth="6"
              className="opacity-40 blur-sm"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
            />
            <motion.line
              x1={`${nodes.user.x}%`}
              y1={`${nodes.user.y}%`}
              x2={`${nodes.ai.x}%`}
              y2={`${nodes.ai.y}%`}
              stroke="rgb(110 231 183)" // Emerald 300
              strokeWidth="2"
              strokeDasharray="8 8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
            />
             {/* Animated data packet traveling from User to AI */}
             <motion.circle
                r="6"
                fill="#ffffff"
                className="drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
                initial={{ cx: `${nodes.user.x}%`, cy: `${nodes.user.y}%` }}
                animate={{ cx: `${nodes.ai.x}%`, cy: `${nodes.ai.y}%` }}
                transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: "linear" }}
              />
          </>
        )}
      </svg>

      {/* Merchant Nodes */}
      {mockBounties.map((b) => {
        const isTarget = activeBounty?.id === b.id;
        const pos = nodes.merchants[b.id as keyof typeof nodes.merchants];
        if (!pos) return null;
        return (
          <div 
            key={b.id} 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-700 ${
              isTarget && (isLoading || offer) 
                ? 'bg-indigo-950/95 border-indigo-400 text-indigo-300 shadow-[0_0_40px_rgba(99,102,241,0.8)] scale-110 backdrop-blur-xl' 
                : 'bg-slate-900/60 border-slate-700/80 text-slate-400 scale-90 backdrop-blur-md hover:border-slate-500 hover:bg-slate-800/80'
            }`}>
              {getMerchantIcon(b.merchantType)}
            </div>
            <span className={`mt-3 text-[10px] font-mono px-3 py-1.5 rounded-full bg-[#020617]/95 backdrop-blur-xl border transition-colors uppercase tracking-widest ${isTarget && (isLoading || offer) ? 'border-indigo-500 text-indigo-300 font-bold shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border-slate-800 text-slate-400'}`}>
              {b.merchantName}
            </span>
          </div>
        );
      })}

      {/* User Node (Mia) */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30"
        style={{ left: `${nodes.user.x}%`, top: `${nodes.user.y}%` }}
      >
        <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border border-slate-600 shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-[#020617]/95 backdrop-blur-2xl transition-all duration-700 ${
          isLoading ? 'border-white text-white shadow-[0_0_50px_rgba(255,255,255,0.6)] scale-110' : 'text-slate-200'
        }`}>
          {isLoading && (
            <>
              <div className="absolute inset-0 border-[3px] border-indigo-500 rounded-full animate-[spin_3s_linear_infinite] border-t-transparent"></div>
              <div className="absolute inset-[-8px] border-[2px] border-emerald-500 rounded-full animate-[spin_4s_linear_infinite_reverse] border-b-transparent opacity-80"></div>
            </>
          )}
          <User className="w-8 h-8 relative z-10" />
        </div>
        <span className={`mt-3 text-[10px] font-mono backdrop-blur-xl px-3 py-1.5 rounded-full border tracking-widest uppercase transition-all shadow-lg ${isLoading ? 'bg-indigo-950/90 border-indigo-500 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-[#020617]/95 border-slate-700 text-slate-300'}`}>
          Local Context
        </span>
      </div>

      {/* AI Node or Offer Widget */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-40 w-full"
        style={{ left: `${nodes.ai.x}%`, top: `${nodes.ai.y}%` }}
      >
        {!offer && !isAccepted && (
          <div className="flex flex-col items-center mt-12">
            <motion.div 
              animate={isLoading ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 60px rgba(16,185,129,0.8)", "0 0 0px rgba(16,185,129,0)"] } : {}}
              transition={isLoading ? { duration: 1.5, repeat: Infinity } : {}}
              className={`relative w-24 h-24 rounded-3xl flex items-center justify-center border transition-all duration-700 shadow-xl ${
                isLoading 
                  ? 'bg-emerald-950/95 border-emerald-400 text-emerald-300 backdrop-blur-2xl' 
                  : 'bg-[#020617]/90 border-slate-700/80 text-slate-500 backdrop-blur-xl'
              }`}
            >
              {isLoading && (
                <div className="absolute inset-[-10px] border-[1px] border-emerald-500/50 rounded-3xl animate-ping" style={{ animationDuration: '2s' }}></div>
              )}
              <Cpu className="w-12 h-12 relative z-10" />
            </motion.div>
            <span className={`mt-3 text-[10px] font-mono font-bold tracking-widest px-3 py-1.5 rounded-full border backdrop-blur-xl transition-colors shadow-lg ${isLoading ? 'text-emerald-300 border-emerald-500/50 bg-emerald-950/90 shadow-[0_0_20px_rgba(16,185,129,0.6)]' : 'text-slate-500 border-slate-800 bg-[#020617]/90'}`}>
              SLM ENGINE
            </span>
          </div>
        )}

        {/* Offer Rendered right where the AI was */}
        {offer && !isAccepted && (
          <div className="transform -translate-y-1/2 mt-12">
            <OfferWidget 
              offer={offer} 
              onAccept={onAcceptOffer} 
              onDismiss={onDismissOffer} 
            />
          </div>
        )}
      </div>

    </div>
  );
}
