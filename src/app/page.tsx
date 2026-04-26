'use client';

import { useState } from 'react';
import { mockBounties, mockContexts } from '@/lib/mockData';
import { Bounty, LocalContext, GeneratedOffer } from '@/types';
import OfferWidget from '@/components/OfferWidget';
import dynamic from 'next/dynamic';
import PhoneSimulator from '@/components/PhoneSimulator';

const SpatialMap = dynamic(() => import('@/components/SpatialMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-3xl"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
});
import { Sparkles, Loader2, CheckCircle2, Navigation, CloudRain, Sun, Cloud, Snowflake, Battery, Activity, Settings2, Wallet, Clock, Store, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

export default function DesktopDashboard() {
  const [bounty, setBounty] = useState<Bounty>(mockBounties[0]);
  const [context, setContext] = useState<LocalContext>(mockContexts[0]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [offer, setOffer] = useState<GeneratedOffer | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showAllContexts, setShowAllContexts] = useState(false);
  const [showAllBounties, setShowAllBounties] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setOffer(null);
    setIsAccepted(false);

    try {
      const res = await fetch('/api/generate-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bounty, context }),
      });

      if (!res.ok) throw new Error('Generation failed');
      
      const data = await res.json();
      setOffer(data);
    } catch (error) {
      console.error(error);
      alert('Failed to generate offer. Ensure Ollama is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const WeatherIcon = () => {
    switch(context.weather) {
      case 'raining': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'snowing': return <Snowflake className="w-5 h-5 text-white" />;
      default: return <Cloud className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      {/* Header */}
      <header className="flex-none border-b border-slate-800 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="flex h-16 items-center justify-between px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[0.4rem] bg-white overflow-hidden shadow-sm">
              <img src="/logo.svg" alt="Pulse Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
              <span>Pulse</span>
              <span className="text-slate-500 font-normal">|</span>
              <span className="text-sm font-medium text-slate-400">Zero-Click Bounties</span>
            </h1>
          </div>
          <nav className="flex items-center space-x-4">
             <Link href="/" className="text-sm font-medium text-white px-3 py-1.5 bg-slate-800 rounded-md">Live Demo</Link>
             <Link href="/admin" className="text-sm font-medium text-slate-400 hover:text-white px-3 py-1.5 transition-colors flex items-center space-x-1.5">
               <Store className="w-4 h-4" />
               <span>Merchant Dashboard</span>
             </Link>
          </nav>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex flex-col xl:flex-row overflow-hidden">
        
        {/* Left Panel: Simulator Controls */}
        <aside className="w-full xl:w-[350px] 2xl:w-[400px] border-r border-slate-800 bg-slate-900/50 p-6 lg:p-8 overflow-y-auto shrink-0 flex flex-col">
          <div className="flex items-center space-x-2 mb-6 text-slate-300">
            <Settings2 className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Demo Controls</h2>
          </div>

          <div className="space-y-8 flex-1">
            {/* Context Simulator */}
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">1. Simulate Local Context</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">Select the real-time signals detected by the user's device. This data remains on-device for privacy.</p>
              <div className="grid grid-cols-1 gap-3">
                {(showAllContexts ? mockContexts : mockContexts.slice(0, 3)).map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setContext(c)}
                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                      context === c
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between mb-2">
                      <span className="font-semibold text-white capitalize flex items-center space-x-2">
                        {c.weather === 'raining' && <CloudRain className="w-4 h-4 text-blue-400" />}
                        {c.weather === 'sunny' && <Sun className="w-4 h-4 text-yellow-400" />}
                        {c.weather === 'cloudy' && <Cloud className="w-4 h-4 text-slate-400" />}
                        <span>{c.weather}, {c.temperatureC}°C</span>
                      </span>
                      <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded">{c.timeOfDay}</span>
                    </div>
                    <div className="flex w-full items-center justify-start mb-2 space-x-1 text-xs text-indigo-300 font-medium bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20 w-max">
                      <MapPin className="w-3 h-3" />
                      <span>{c.city}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 w-full flex-wrap gap-2">
                      <div className="flex space-x-4">
                        <span className="flex items-center space-x-1"><Activity className="w-3 h-3 text-indigo-400"/> <span>{c.walkingSpeed}</span></span>
                        <span className="flex items-center space-x-1"><Battery className="w-3 h-3 text-emerald-400"/> <span>{c.batteryLevel}%</span></span>
                        <span className="flex items-center space-x-1" title="Payone Transaction Density"><Wallet className="w-3 h-3 text-blue-400"/> <span className="capitalize">{c.transactionDensity} Vol</span></span>
                      </div>
                    </div>
                    {c.localEvents.length > 0 && (
                      <div className="mt-3 flex w-full">
                        <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-1 rounded-full border border-indigo-500/30 flex items-center space-x-1">
                          <span>📍</span> <span>{c.localEvents.join(', ')}</span>
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowAllContexts(!showAllContexts)}
                className="w-full mt-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800/50"
              >
                {showAllContexts ? 'Hide' : `Show All (${mockContexts.length})`}
              </button>
            </section>

            {/* Bounty Selection */}
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">2. Active Broadcasted Bounties</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">Select which merchant's rules the LLM will use to generate the offer.</p>
              <div className="grid grid-cols-1 gap-3">
                {(showAllBounties ? mockBounties : mockBounties.slice(0, 2)).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBounty(b)}
                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                      bounty.id === b.id
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-semibold text-white text-base">{b.merchantName}</span>
                    <span className="text-xs text-slate-400 mt-1">{b.merchantType} • Up to {b.maxDiscountPercentage}% off</span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {b.rules.map((rule, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-1 rounded-full">{rule}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowAllBounties(!showAllBounties)}
                className="w-full mt-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800/50"
              >
                {showAllBounties ? 'Hide' : `Show All (${mockBounties.length})`}
              </button>
            </section>
          </div>
        </aside>

        {/* Center Panel: The Radar Experience (God View) */}
        <section className="flex-1 relative bg-slate-950 flex flex-col p-6 lg:p-10 overflow-y-auto">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 z-0"></div>

          <div className="relative z-10 max-w-4xl mx-auto w-full h-full flex flex-col">
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light tracking-tight text-white">Live <span className="font-bold">Pulse Radar</span></h2>
              
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex items-center space-x-2 rounded-xl bg-white px-5 py-2.5 font-bold text-slate-950 transition-all hover:bg-slate-200 active:scale-95 disabled:opacity-50 shadow-[0_0_30px_rgba(255,255,255,0.15)] text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Inference...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Zero-Click Offer</span>
                  </>
                )}
              </button>
            </div>

            {/* Spatial Map Area */}
            <div className="flex-1 flex items-center justify-center relative min-h-[500px]">
              <AnimatePresence mode="wait">
                  <motion.div 
                    key="map"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full h-full"
                  >
                    <SpatialMap 
                      isLoading={isLoading}
                      activeBounty={bounty}
                      offer={offer}
                      isAccepted={isAccepted}
                      onAcceptOffer={() => setIsAccepted(true)}
                      onDismissOffer={() => setOffer(null)}
                    />
                  </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* Right Panel: End-User UX (Mia's Phone) */}
        <aside className="hidden xl:flex flex-col w-[400px] border-l border-slate-800 bg-slate-900/30 shrink-0 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-20 relative">
          
          <div className="p-6 border-b border-slate-800/50 bg-slate-950/50">
            <h3 className="text-sm font-bold text-slate-300 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Consumer View (Simulated)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">End-to-end checkout and push payload delivery.</p>
          </div>

          <div className="flex-1 flex items-start justify-center p-8 pt-12 relative overflow-y-auto">
            {/* Subtle glow behind phone */}
            <div className="absolute top-32 left-1/2 -translate-x-1/2 w-64 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <PhoneSimulator 
              offer={offer}
              context={context}
              bounty={bounty}
              isAccepted={isAccepted}
              onAccept={() => setIsAccepted(true)}
            />
          </div>
        </aside>

      </main>
    </div>
  );
}
