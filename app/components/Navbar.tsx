"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* 🎨 THE RONGOSTAY STANDOUT LOGO */}
        <Link href="/">
          <span className="flex items-center gap-3 cursor-pointer group">
            {/* The 'R' + House Icon Combination */}
            <div className="bg-gradient-to-br from-slate-800 to-indigo-900 text-white w-11 h-11 rounded-xl flex items-center justify-center font-black text-2xl shadow-md relative overflow-hidden group-hover:from-blue-700 group-hover:to-indigo-800 transition-all duration-300">
              R
              {/* Decorative Roof slash line */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-orange-500 transform rotate-45 translate-x-2 -translate-y-2"></div>
            </div>
            
            {/* Brand Text */}
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-800">
                Rongo<span className="text-orange-500">Stay</span>
              </span>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase -mt-1">
                Comrade Residences
              </span>
            </div>
          </span>
        </Link>

        {/* 🌐 NAVIGATION LINKS */}
        <div className="flex items-center gap-6">
          <Link href="/post">
            <span className="cursor-pointer text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-orange-500 transition-all duration-200 active:scale-95 shadow-sm">
              Post a New House
            </span>
          </Link>
        </div>

      </div>
    </nav>
  );
}