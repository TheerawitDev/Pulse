'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { GeneratedOffer, LocalContext, Bounty } from '@/types';
import { Wifi, Battery, ChevronRight, Lock, ScanFace, Navigation2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PhoneSimulatorProps {
  offer: GeneratedOffer | null;
  context: LocalContext;
  bounty: Bounty | null;
  isAccepted: boolean;
  onAccept: () => void;
}

export default function PhoneSimulator({ offer, context, bounty, isAccepted, onAccept }: PhoneSimulatorProps) {
  const [time, setTime] = useState('09:41');
  const [navigating, setNavigating] = useState(false);
  const [distance, setDistance] = useState(80);
  const [isRedeemed, setIsRedeemed] = useState(false);

  // Reset redemption state when a new offer is presented
  useEffect(() => {
    if (!isAccepted) setIsRedeemed(false);
  }, [isAccepted]);

  // 3D Tilt Effect State
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Simple clock effect for the lock screen
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (navigating && distance > 0) {
      const timer = setTimeout(() => setDistance(d => Math.max(0, d - 8)), 400);
      return () => clearTimeout(timer);
    } else if (navigating && distance === 0) {
      setTimeout(() => {
        setNavigating(false);
        onAccept();
      }, 800);
    }
  }, [navigating, distance, onAccept]);

  const handleNotificationTap = () => {
    setNavigating(true);
  };

  return (
    <motion.div 
      className="relative w-[320px] h-[650px] bg-black rounded-[3rem] border-[8px] border-slate-950 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 ring-1 ring-slate-800"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* Notch / Dynamic Island */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-3xl z-50"></div>

      {/* Status Bar */}
      <div className="absolute top-0 w-full px-6 py-2 flex justify-between items-center text-white z-40 text-[10px] font-medium">
        <span>{time}</span>
        <div className="flex items-center space-x-1.5">
          <Wifi className="w-3 h-3" />
          <Battery className="w-4 h-4" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isAccepted ? (
          /* Lock Screen State */
          <motion.div 
            key="lockscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full bg-slate-800"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

            {/* Lock Icon & Time */}
            <div className="relative z-10 flex flex-col items-center mt-16 text-white">
              <Lock className="w-4 h-4 mb-2 opacity-80" />
              <h1 className="text-6xl font-light tracking-tight">{time}</h1>
              <p className="text-sm font-medium mt-1 opacity-90">Tuesday, October 24</p>
            </div>

            {/* Notifications Area */}
            <div className="relative z-10 mt-8 px-4 flex flex-col space-y-2">
              <AnimatePresence>
                {offer && (
                  <motion.button
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    onClick={handleNotificationTap}
                    className="w-full bg-[#f4f4f5]/80 backdrop-blur-2xl rounded-3xl p-4 text-left shadow-lg overflow-hidden relative group border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-2 opacity-70">
                      <div className="flex items-center space-x-1.5 text-slate-900">
                        <div className="w-5 h-5 bg-indigo-500 rounded-[6px] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">P</div>
                        <span className="text-[11px] font-semibold tracking-wide">Pulse</span>
                      </div>
                      <span className="text-[11px]">now</span>
                    </div>
                    <h3 className="text-[15px] font-bold text-slate-900 leading-tight mb-1">{offer.headline}</h3>
                    <p className="text-[13px] text-slate-800 leading-snug line-clamp-2">{offer.body}</p>
                    
                    {/* Hover indicator that this is clickable */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/30 transition-colors flex items-center justify-end pr-4 opacity-0 group-hover:opacity-100">
                      <ChevronRight className="w-5 h-5 text-slate-900" />
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Swiper */}
            <div className="absolute bottom-2 w-full flex justify-center">
              <div className="w-1/3 h-1.5 bg-white/80 rounded-full"></div>
            </div>
          </motion.div>
        ) : navigating ? (
          /* Proximity Compass State */
          <motion.div
            key="compass"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full bg-[#020617] flex flex-col pt-16 px-5 text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]"></div>
            
            <div className="flex flex-col items-center mt-12 relative z-10">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">Bounty Locked</span>
              <h2 className="text-3xl font-light tracking-tight">{bounty?.merchantName}</h2>
              <p className="text-slate-400 mt-2 text-sm">Proceed to location to decrypt QR</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Radar Rings */}
                <div className="absolute inset-0 border-[2px] border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-4 border-[1px] border-indigo-500/10 rounded-full"></div>
                <div className="absolute inset-10 border-[1px] border-indigo-500/5 rounded-full"></div>
                
                {/* Pulse Animation */}
                <motion.div 
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-16 bg-indigo-500 rounded-full"
                ></motion.div>

                {/* Compass Arrow */}
                {distance > 0 ? (
                  <motion.div 
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative bg-indigo-500/20 p-4 rounded-full backdrop-blur-md border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                  >
                    <Navigation2 className="w-10 h-10 text-indigo-400 fill-indigo-400" />
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative bg-emerald-500/20 p-4 rounded-full backdrop-blur-md border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                )}
              </div>

              <div className="mt-12 flex flex-col items-center">
                <span className="text-6xl font-light tabular-nums">{distance}</span>
                <span className="text-sm font-bold text-slate-400 tracking-widest uppercase mt-1">Meters</span>
              </div>
            </div>

            {/* Bottom Swiper */}
            <div className="absolute bottom-2 w-full flex justify-center left-0 z-10">
              <div className="w-1/3 h-1.5 bg-white/20 rounded-full"></div>
            </div>
          </motion.div>
        ) : (
          /* Wallet / Payload Secured State */
          <motion.div
            key="wallet"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 w-full h-full bg-[#f2f2f7] flex flex-col pt-14 overflow-hidden"
          >
            {/* Wallet Header */}
            <div className="flex items-center justify-between px-5 mb-4">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Wallet</h2>
              <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center shadow-sm border border-white">
                <span className="text-xs font-bold text-slate-600">M</span>
              </div>
            </div>

            {/* GDPR Privacy Badge */}
            <div className="mx-4 mb-3 flex items-center justify-center space-x-1.5 bg-emerald-50/80 border border-emerald-100 rounded-lg py-1.5 px-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-700 tracking-wide">PRIVACY SHIELD: ON-DEVICE INFERENCE</span>
            </div>

            {/* Pass Card */}
            <div className="mx-4 flex-1 flex flex-col">
              <div className="w-full bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 rounded-t-[1.5rem] p-5 pb-4 text-white relative overflow-hidden shadow-xl">
                
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full"></div>

                {/* Top row: Logo + Type */}
                <div className="flex items-center justify-between relative z-10 mb-5">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <span className="text-[13px] font-black">P</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] opacity-70">Pulse Pass</span>
                  </div>
                  <div className="bg-white text-indigo-600 px-3 py-1 rounded-full text-[13px] font-extrabold shadow-lg">
                    {offer?.discountPercentage}% OFF
                  </div>
                </div>

                {/* Merchant Name */}
                <h3 className="text-[22px] font-bold tracking-tight leading-tight relative z-10">{bounty?.merchantName}</h3>
                <p className="text-white/60 text-[12px] mt-1 relative z-10">{offer?.headline}</p>

                {/* Divider with dots */}
                <div className="flex items-center my-4 relative z-10">
                  <div className="w-3 h-3 bg-[#f2f2f7] rounded-full -ml-7"></div>
                  <div className="flex-1 border-t border-dashed border-white/20 mx-1"></div>
                  <div className="w-3 h-3 bg-[#f2f2f7] rounded-full -mr-7"></div>
                </div>

                {/* Offer details row */}
                <div className="flex justify-between items-center relative z-10 text-[11px]">
                  <div>
                    <span className="text-white/50 uppercase tracking-wider font-medium block">Type</span>
                    <span className="font-bold mt-0.5 block">Zero-Click</span>
                  </div>
                  <div className="text-center">
                    <span className="text-white/50 uppercase tracking-wider font-medium block">Valid</span>
                    <span className="font-bold mt-0.5 block">Today only</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white/50 uppercase tracking-wider font-medium block">Status</span>
                    <span className="font-bold mt-0.5 block text-emerald-300">● Active</span>
                  </div>
                </div>
              </div>

              {/* QR Code Section — attached bottom of card */}
              <div className="w-full bg-white rounded-b-[1.5rem] px-5 py-5 flex flex-col items-center shadow-xl border-t-0 min-h-[220px]">
                
                {!isRedeemed ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full">
                    <div className="w-[130px] h-[130px] bg-white flex items-center justify-center rounded-xl border border-slate-100 mb-3">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=pulse://redeem/${bounty?.id}/${offer?.discountPercentage}/${Date.now()}`} 
                        alt="Redemption QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-4">Scan to redeem</span>
                    
                    {/* Simulated Merchant Scan Button */}
                    <button 
                      onClick={() => setIsRedeemed(true)}
                      className="w-full bg-slate-900 text-white py-3 rounded-2xl flex items-center justify-center space-x-2 text-[13px] font-semibold shadow-md active:scale-[0.97] transition-transform"
                    >
                      <ScanFace className="w-4 h-4" />
                      <span>Simulate Merchant Scan</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="flex flex-col items-center justify-center w-full h-full space-y-4 py-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-slate-900">Discount Applied!</h4>
                      <p className="text-xs text-slate-500 mt-1">Cashback has been credited to your Payone account.</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Bottom Swiper */}
            <div className="py-3 w-full flex justify-center">
              <div className="w-1/3 h-1.5 bg-black/15 rounded-full"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
