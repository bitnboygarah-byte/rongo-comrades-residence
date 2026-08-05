import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

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
        <nav className="w-full bg-slate-950/90 backdrop-blur-xl border-b border-white/[0.04] py-3.5 px-4 sm:px-6 relative z-50 select-none shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
            
            {/* TOP BAR ON MOBILE: LOGO & EMBLEM SIDE-BY-SIDE */}
            <div className="w-full md:w-auto flex items-center justify-between gap-3">
              {/* LEFT LOGO & BRAND SECTION */}
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
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
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-amber-400 uppercase leading-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    Rongo<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-extrabold">Stay</span>
                  </h2>
                  <span className="text-[8px] sm:text-[9px] font-mono font-black text-amber-400/80 uppercase tracking-[0.25em] leading-none pl-0.5 mt-0.5">
                    Housing Network
                  </span>
                </div>
              </Link>

              {/* EMBLEM (NESTED ON TOP RIGHT ON MOBILE) */}
              <div className="flex md:hidden items-center gap-2 px-2.5 py-1 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <svg 
                  width="22" 
                  height="24" 
                  viewBox="0 0 100 110" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="filter drop-shadow-[0_0_6px_rgba(245,158,11,0.2)] shrink-0"
                >
                  <path 
                    d="M10 10 H90 V55 C90 85 50 105 50 105 C50 105 10 85 10 55 V10 Z" 
                    fill="#020617" 
                    stroke="url(#goldGradientMobile)" 
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <g id="rising-sun-mobile">
                    <circle cx="50" cy="42" r="12" fill="url(#sunGradientMobile)" />
                    <line x1="50" y1="42" x2="50" y2="18" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="50" y1="42" x2="28" y2="28" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="50" y1="42" x2="72" y2="28" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="50" y1="42" x2="20" y2="42" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="50" y1="42" x2="80" y2="42" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                  <defs>
                    <linearGradient id="goldGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                    <linearGradient id="sunGradientMobile" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#fef08a" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex flex-col text-left font-mono">
                  <span className="text-[7px] font-black tracking-tight text-slate-400 uppercase leading-none">Partner Zone</span>
                  <span className="text-[8px] font-bold text-amber-400 uppercase tracking-tighter leading-none mt-0.5">Rongo Area</span>
                </div>
              </div>
            </div>

            {/* MIDDLE SECTION: EMBLEM FOR TABLET/DESKTOP */}
            <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-xl bg-white/[0.01] border border-white/[0.03] shadow-inner">
              <svg 
                width="30" 
                height="34" 
                viewBox="0 0 100 110" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.2)] shrink-0"
              >
                <path 
                  d="M10 10 H90 V55 C90 85 50 105 50 105 C50 105 10 85 10 55 V10 Z" 
                  fill="#020617" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                <g id="rising-sun">
                  <circle cx="50" cy="42" r="12" fill="url(#sunGradient)" />
                  <line x1="50" y1="42" x2="50" y2="18" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="42" x2="28" y2="28" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="42" x2="72" y2="28" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="42" x2="20" y2="42" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="42" x2="80" y2="42" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                </g>
                <g id="open-book" transform="translate(0, 10)">
                  <path d="M50 72 C42 67 28 67 20 70 V50 C28 47 42 47 50 52 Z" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" />
                  <path d="M50 72 C58 67 72 67 50 52 Z" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" />
                </g>
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

              <div className="flex flex-col text-left font-mono">
                <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase leading-none">Official Partner Zone</span>
                <span className="text-[9px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 uppercase tracking-tight mt-0.5">
                  Rongo University Area
                </span>
              </div>
            </div>

            {/* RIGHT SECTION: NAV ACTION BUTTONS */}
            <div className="grid grid-cols-2 md:flex items-center gap-2 w-full md:w-auto shrink-0">
              <Link 
                href="/" 
                className="px-3 py-2 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border border-white/[0.05] bg-slate-900/80 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-all text-center"
              >
                EXPLORE ROOMS
              </Link>
              
              <Link 
                href="/post" 
                className="px-3 py-2 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border border-amber-500/30 bg-amber-500/10 rounded-lg text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all text-center shadow-[0_2px_10px_rgba(245,158,11,0.15)]"
              >
                + POST ACCOMMODATION
              </Link>
            </div>

          </div>
        </nav>

        {/* MAIN PAGE CONTENT STREAM */}
        <div className="flex-1">
          {children}
        </div>
        
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}