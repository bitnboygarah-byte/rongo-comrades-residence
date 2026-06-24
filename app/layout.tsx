import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
export const metadata: Metadata = {
  title: "RongoStay",
  description: "Student Housing Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        
        {/* GLOBAL HEADER - NAVIGATION MATRIX */}
        <nav className="w-full bg-slate-950/90 backdrop-blur-xl border-b border-white/[0.04] py-6 px-6 relative z-50 select-none shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* LEFT LOGO & BRAND SECTION */}
            <Link href="/" className="flex items-center gap-5 group focus:outline-none shrink-0">
              <div className="relative w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md group-hover:bg-amber-500/30 transition-all" />
                
                <div className="w-9 h-9 bg-gradient-to-br from-amber-400/80 via-amber-500 to-orange-500 rounded-full rounded-tr-none rotate-[135deg] relative flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-300/40">
                  <div className="w-6 h-6 bg-slate-950 rounded-full flex items-center justify-center -rotate-[135deg] shadow-inner relative overflow-hidden">
                    <div className="w-3.5 h-3.5 relative flex flex-col items-center justify-end group-hover:translate-y-[-1px] transition-transform duration-300">
                      <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[6px] border-b-amber-400 drop-shadow-[0_0_3px_rgba(245,158,11,0.6)]" />
                      <div className="w-[12px] h-[7px] bg-gradient-to-b from-amber-400 to-amber-500 relative flex gap-[1px] p-[1px] rounded-t-[0.5px]">
                        <div className="flex-1 bg-slate-950 rounded-[0.5px]" />
                        <div className="flex-1 bg-slate-950 rounded-[0.5px]" />
                      </div>
                      <div className="absolute top-[2px] right-[1px] w-[1.5px] h-2 bg-amber-400 rounded-t-[0.5px]" />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-0.5 w-6 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent rounded-full blur-[0.5px] scale-x-100 group-hover:scale-x-125 transition-transform" />
              </div>

              <div className="flex flex-col text-left space-y-0.5">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-amber-400 uppercase leading-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  Rongo<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-extrabold">Stay</span>
                </h2>
                <span className="text-[11px] font-mono font-black text-amber-400/80 uppercase tracking-[0.4em] leading-none pl-0.5">
                  Housing Network
                </span>
              </div>
            </Link>

            {/* MIDDLE SECTION: HIGH-FIDELITY SVG RONGO UNIVERSITY EMBLEM */}
            <div className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/[0.01] border border-white/[0.03] shadow-inner max-w-sm mx-auto lg:mx-0">
              
              {/* THE SVG SHIELD GENERATOR */}
              <svg 
                width="38" 
                height="42" 
                viewBox="0 0 100 110" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.2)] shrink-0"
              >
                {/* Shield Background Path with Traditional Curvature */}
                <path 
                  d="M10 10 H90 V55 C90 85 50 105 50 105 C50 105 10 85 10 55 V10 Z" 
                  fill="#020617" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="4"
                  strokeLinejoin="round"
                />

                {/* Top Section: Rising Sun Crest */}
                <g id="rising-sun">
                  {/* Sun Base */}
                  <circle cx="50" cy="42" r="12" fill="url(#sunGradient)" />
                  {/* Sun Rays */}
                  <line x1="50" y1="42" x2="50" y2="18" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="42" x2="28" y2="28" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="42" x2="72" y2="28" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="42" x2="20" y2="42" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="42" x2="80" y2="42" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="42" x2="33" y2="55" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="42" x2="67" y2="55" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* Bottom Section: Open Book Emblem */}
                <g id="open-book" transform="translate(0, 10)">
                  {/* Left Page Leaf */}
                  <path 
                    d="M50 72 C42 67 28 67 20 70 V50 C28 47 42 47 50 52 Z" 
                    fill="#1e293b" 
                    stroke="#fbbf24" 
                    strokeWidth="2" 
                  />
                  {/* Right Page Leaf */}
                  <path 
                    d="M50 72 C58 67 72 67 80 70 V50 C72 47 58 47 50 52 Z" 
                    fill="#1e293b" 
                    stroke="#fbbf24" 
                    strokeWidth="2" 
                  />
                  {/* Book Detail Lines representing text pages */}
                  <path d="M25 56 H43 M25 61 H43 M57 56 H75 M57 61 H75" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                </g>

                {/* Bottom Swirling Base Ribbon Banner Shape */}
                <path 
                  d="M12 90 Q50 100 88 90 L84 98 Q50 106 16 98 Z" 
                  fill="url(#goldGradient)" 
                  stroke="#d97706"
                  strokeWidth="1"
                />

                {/* Gradients Definitions */}
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  <linearGradient id="sunGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#fef08a" />
                  </linearGradient>
                </defs>
              </svg>

              {/* TEXTUAL COUPLING DESCRIPTION */}
              <div className="flex flex-col text-left font-mono">
                <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase leading-none">Official Partner Zone</span>
                <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 uppercase tracking-tight mt-0.5">
                  Rongo University Area
                </span>
              </div>
            </div>

            {/* RIGHT SECTION: NAV NAVIGATION PLATFORM BUTTONS */}
            <div className="flex items-center gap-3 shrink-0">
              <Link 
                href="/" 
                className="px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase border border-white/[0.05] bg-slate-900/80 rounded-xl text-slate-400 hover:text-white hover:border-white/20 hover:bg-slate-900 transition-all shadow-sm"
              >
                // EXPLORE_ROOMS
              </Link>
              
              <Link 
                href="/post" 
                className="px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase border border-amber-500/20 bg-amber-500/5 rounded-xl text-amber-400 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 hover:text-slate-950 hover:border-amber-400 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.1)]"
              >
                + POST_ACCOMMODATION
              </Link>
            </div>

          </div>
        </nav>

        {/* MAIN PAGE CONTENT STREAM */}
        <div className="flex-1">
          {children}
        </div>

      </body>
    </html>
  );
}