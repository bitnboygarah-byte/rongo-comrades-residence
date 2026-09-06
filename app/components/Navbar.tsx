"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-slate-950/90 backdrop-blur-xl border-b border-white/[0.04] py-2.5 px-4 sm:px-6 relative z-50 select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* BRAND LOGO: RONGOSTAY */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none shrink-0">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md group-hover:bg-amber-500/30 transition-all" />
            
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-400/80 via-amber-500 to-orange-500 rounded-full rounded-tr-none rotate-[135deg] relative flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)] border border-amber-300/40">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-slate-950 rounded-full flex items-center justify-center -rotate-[135deg] shadow-inner relative overflow-hidden">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 relative flex flex-col items-center justify-end group-hover:translate-y-[-1px] transition-transform duration-300">
                  <div className="w-0 h-0 border-l-[5px] sm:border-l-[6px] border-l-transparent border-r-[5px] sm:border-r-[6px] border-r-transparent border-b-[5px] sm:border-b-[6px] border-b-amber-400 drop-shadow-[0_0_3px_rgba(245,158,11,0.6)]" />
                  <div className="w-[10px] sm:w-[12px] h-[5px] sm:h-[6px] bg-gradient-to-b from-amber-400 to-amber-500 relative flex gap-[1px] p-[1px] rounded-t-[0.5px]">
                    <div className="flex-1 bg-slate-950 rounded-[0.5px]" />
                    <div className="flex-1 bg-slate-950 rounded-[0.5px]" />
                  </div>
                  <div className="absolute top-[1px] right-[0.5px] w-[1px] sm:w-[1.5px] h-1.5 bg-amber-400 rounded-t-[0.5px]" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-0.5 w-5 sm:w-6 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent rounded-full blur-[0.5px] scale-x-100 group-hover:scale-x-125 transition-transform" />
          </div>

          <div className="flex flex-col text-left space-y-0">
            <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-amber-400 uppercase leading-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Rongo<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-extrabold">Stay</span>
            </h2>
            <span className="text-[7.5px] sm:text-[8.5px] font-mono font-black text-amber-400/80 uppercase tracking-[0.25em] leading-none pl-0.5 mt-0.5">
              Housing Network
            </span>
          </div>
        </Link>

        {/* LOGO WITH SUBTITLE ALIGNED UNDER UNIVERSITY */}
        <div className="flex flex-col shrink-0 items-end">
          <img
            src="/rongo-logo.png"
            alt="Rongo University Logo"
            className="h-8 sm:h-10 w-auto object-contain filter contrast-125 brightness-110"
          />
          <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold tracking-[0.22em] text-amber-400/90 uppercase leading-none pr-1.5 sm:pr-2 mt-0.5">
            OFFICIAL PARTNER
          </span>
        </div>

        {/* DESKTOP NAV BUTTONS */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link 
            href="/" 
            className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-white/[0.05] bg-slate-900/80 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
          >
            EXPLORE ROOMS
          </Link>
          
          <Link 
            href="/post" 
            className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-amber-500/30 bg-amber-500/10 rounded-xl text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all shadow-[0_2px_10px_rgba(245,158,11,0.15)]"
          >
            ADMIN ZONE
          </Link>

          <Link 
            href="/about" 
            className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-white/[0.05] bg-slate-900/80 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
          >
            ABOUT US
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl border border-white/10 bg-slate-900/80 text-amber-400 hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 pb-2 border-t border-white/10 flex flex-col gap-2.5 animate-in slide-in-from-top duration-200">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-2.5 px-4 text-xs font-mono font-bold tracking-wider uppercase border border-white/[0.05] bg-slate-900/90 rounded-xl text-slate-300 hover:text-white text-center"
          >
            EXPLORE ROOMS
          </Link>
          
          <Link 
            href="/post" 
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-2.5 px-4 text-xs font-mono font-bold tracking-wider uppercase border border-amber-500/30 bg-amber-500/10 rounded-xl text-amber-400 text-center shadow-[0_2px_10px_rgba(245,158,11,0.15)]"
          >
            ADMIN ZONE
          </Link>

          <Link 
            href="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-2.5 px-4 text-xs font-mono font-bold tracking-wider uppercase border border-white/[0.05] bg-slate-900/90 rounded-xl text-slate-300 hover:text-white text-center"
          >
            ABOUT US
          </Link>
        </div>
      )}
    </nav>
  );
}