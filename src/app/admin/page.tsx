'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Store, TrendingUp, Users, Zap, CheckCircle2, Search, ArrowUpRight, BarChart3, Plus, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'create'>('analytics');
  
  // AI Campaign Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaign, setCampaign] = useState({
    name: "Rainy Day Coffee Boost",
    discount: "20",
    traffic: "Medium (Sustain flow)",
    triggers: "Target users walking slowly (browsing). Emphasize warm drinks if it's raining or cold."
  });

  const handleAIGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      if (res.ok) {
        const data = await res.json();
        setCampaign({
          name: data.name || campaign.name,
          discount: data.discount || campaign.discount,
          traffic: data.traffic || campaign.traffic,
          triggers: data.triggers || campaign.triggers
        });
        setAiPrompt('');
      }
    } catch (e) {
      console.error(e);
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* Premium Navigation Header */}
      <header className="flex-none bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[0.4rem] bg-white overflow-hidden shadow-sm border border-slate-200">
              <img src="/logo.svg" alt="Pulse Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight flex items-center space-x-2">
              <span>Pulse</span>
              <span className="text-slate-300 font-normal">|</span>
              <span className="text-sm font-semibold text-slate-600">Merchant Connect</span>
            </h1>
          </div>
          <nav className="flex items-center space-x-6">
             <button onClick={() => setActiveTab('analytics')} className={`text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Analytics</button>
             <button onClick={() => setActiveTab('create')} className={`text-sm font-medium transition-colors ${activeTab === 'create' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Campaigns</button>
             <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 px-3 py-1.5 transition-colors flex items-center space-x-1.5 ml-4 border-l border-slate-200 pl-6">
               <Sparkles className="w-4 h-4" />
               <span>Consumer Platform Demo</span>
             </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-8">
        
        {/* Profile / Context Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bäckerei Frank</h2>
            <p className="text-slate-500 mt-1">Stuttgart Old Town • Active Bounties: 2</p>
          </div>
          {activeTab === 'analytics' && (
            <button 
              onClick={() => setActiveTab('create')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center space-x-2 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>New Bounty</span>
            </button>
          )}
        </div>

        {activeTab === 'analytics' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Active Campaigns', value: '2', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100' },
                { label: 'Context Matches', value: '1,204', icon: Search, color: 'text-blue-500', bg: 'bg-blue-100' },
                { label: 'Acceptance Rate', value: '68.4%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-100' },
                { label: 'Payone Demand Index', value: '+24%', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-100' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Main Chart Area Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Offer Performance (Last 7 Days)</h3>
                  <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-700 font-medium">
                    <option>All Campaigns</option>
                  </select>
                </div>
                {/* CSS Bar Chart Mockup */}
                <div className="flex-1 flex items-end space-x-4 pt-10">
                  {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer">
                      <div className="w-full relative flex justify-center items-end h-[250px]">
                        {/* Accepts */}
                        <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.1, duration: 0.8 }} className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm z-10 opacity-90 group-hover:opacity-100 transition-opacity"></motion.div>
                        {/* Matches (Background) */}
                        <motion.div initial={{ height: 0 }} animate={{ height: `${h + 15}%` }} transition={{ delay: i * 0.1, duration: 0.8 }} className="absolute bottom-0 w-full bg-slate-100 rounded-t-sm z-0"></motion.div>
                      </div>
                      <span className="text-xs text-slate-400 mt-3 font-medium">Oct {18 + i}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Activity Stream */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                  <span className="flex items-center gap-2">Live Payone Feed</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h3>
                <div className="space-y-4">
                  {[
                    { context: 'Raining + Walking Slow', discount: '20%', time: '2m ago' },
                    { context: 'Cloudy + Low Battery', discount: '15%', time: '14m ago' },
                    { context: 'Raining + High Density', discount: '10%', time: '1h ago' },
                    { context: 'Sunny + Browsing', discount: '15%', time: '2h ago' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-start justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{act.discount} Discount Claimed</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                          <BarChart3 className="w-3 h-3 mr-1" /> Context: {act.context}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-medium">{act.time}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                  View Full Ledger
                </button>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-8 text-white">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Create Zero-Click Bounty</h3>
                <p className="text-slate-400 text-sm">Define your business goal. The Generative Engine handles the creative delivery and timing based on real-time foot traffic and weather.</p>
              </div>

              <div className="p-8 space-y-8">
                
                {/* AI Campaign Assistant Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mt-10 -mr-10"></div>
                  <div className="relative z-10">
                    <h4 className="font-bold flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5 text-indigo-200"/> AI Campaign Assistant</h4>
                    <p className="text-sm text-indigo-100 mb-4 leading-relaxed">Tell Pulse your goal in plain English, and our AI will automatically configure the perfect parameters for your campaign.</p>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., I have 30 extra pretzels to sell before 5 PM..." 
                        className="flex-1 bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-sm placeholder:text-indigo-200/70 outline-none focus:bg-black/30 focus:border-white/40 transition-all text-white"
                        onKeyDown={(e) => e.key === 'Enter' && handleAIGenerate()}
                      />
                      <button 
                        onClick={handleAIGenerate}
                        disabled={isGenerating || !aiPrompt}
                        className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4"/>}
                        {isGenerating ? 'Generating...' : 'Generate'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-2">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Or Edit Manually</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-900">Campaign Name</span>
                    <input type="text" value={campaign.name} onChange={(e) => setCampaign({...campaign, name: e.target.value})} className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 border px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-900">Maximum Discount</span>
                    <div className="mt-2 relative">
                      <input type="number" value={campaign.discount} onChange={(e) => setCampaign({...campaign, discount: e.target.value})} className="block w-full rounded-xl border-slate-200 bg-slate-50 border px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors" />
                      <span className="absolute right-4 top-3 text-slate-400 font-bold">%</span>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">Payone Transaction Density Target</span>
                    <select value={campaign.traffic} onChange={(e) => setCampaign({...campaign, traffic: e.target.value})} className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 border px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors">
                      <option>Low (Fill quiet hours)</option>
                      <option>Medium (Sustain flow)</option>
                      <option>High (Capitalize on rush)</option>
                    </select>
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-900">Contextual Triggers (Optional)</span>
                    <p className="text-xs text-slate-500 mb-3">Provide natural language rules. The AI will interpret these alongside local signals.</p>
                    <textarea 
                      className="block w-full rounded-xl border-slate-200 bg-slate-50 border px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none h-24 transition-colors" 
                      value={campaign.triggers}
                      onChange={(e) => setCampaign({...campaign, triggers: e.target.value})}
                    />
                  </label>
                </div>

                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900">GDPR Compliant by Design</h4>
                    <p className="text-xs text-indigo-700 mt-1">Your rules are broadcasted to the user's device. Offer generation happens locally on their phone via an SLM. You only receive aggregate acceptance data.</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-4">
                  <button onClick={() => setActiveTab('analytics')} className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
                  <button onClick={() => setActiveTab('analytics')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-md hover:shadow-lg">
                    <Zap className="w-4 h-4" />
                    <span>Deploy to Pulse Network</span>
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
