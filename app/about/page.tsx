"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  School,
  BadgePercent,
  Compass,
  PhoneCall,
  MessageSquare,
  Headphones
} from "lucide-react";

export default function AboutPage() {
  const phoneNumber = "0718772190";
  const formattedPhone = "+254718772190";
  const whatsappMessage = encodeURIComponent("Hello RongoStay Team, I need assistance regarding housing/hostels.");

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 relative z-10">
      
      {/* HERO SECTION */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Built By Comrades, For Comrades
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight uppercase">
          Eliminating <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500">Off-Campus Housing</span> Chaos
        </h1>
        
        <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
          RongoStay is the official housing discovery network built specifically for Rongo University students. We eliminate shady brokers, exaggerated rent rates, and misleading photos by serving fully verified hostels with direct caretaker contacts and exact Google Maps pins.
        </p>

        <div className="pt-2 flex items-center justify-center">
          <Link
            href="/"
            className="px-6 py-3.5 text-xs font-mono font-bold tracking-wider uppercase bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl transition-all shadow-lg flex items-center gap-2"
          >
            Explore Verified Rooms <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CORE VALUE PROPOSITIONS (THE 4 PILLARS OF TRUST) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pillar 1 */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.06] hover:border-amber-500/30 transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-wide">100% Admin Verified</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Every hostel listing on RongoStay passes through strict administrative authentication before going live. No fake listings, no phantom amenities, and no inflated semester prices.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.06] hover:border-amber-500/30 transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BadgePercent className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-wide">Zero Brokerage Fees</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Say goodbye to middlemen demanding viewing fees just to show you a room. You get direct mobile contact details for caretakers and landlords with zero commission added.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.06] hover:border-amber-500/30 transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-wide">Precise Telemetry Pins</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Whether you need a room around Kitere Center, Main Gate, Showground, or Rongo Town, each listing includes direct Google Maps link parameters so you navigate with confidence.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.06] hover:border-amber-500/30 transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <School className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-wide">Rongo Campus Tailored</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Designed specifically around semester cycles, student budgets, and key housing amenities like Wi-Fi strength, water availability, internal tokens, and security measures.
          </p>
        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-widest">PROTOCOL</span>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">How RongoStay Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/30 border border-white/[0.04] space-y-2">
            <span className="text-2xl font-black font-mono text-amber-400/40">01</span>
            <h4 className="text-sm font-bold text-white uppercase">Search & Filter</h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Browse houses filtered by semester rate, distance to campus, or key amenities like Wi-Fi and tiles.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/30 border border-white/[0.04] space-y-2">
            <span className="text-2xl font-black font-mono text-amber-400/40">02</span>
            <h4 className="text-sm font-bold text-white uppercase">Inspect Telemetry</h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              View real structural images, verify price points per semester, and locate exact pins on Google Maps.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/30 border border-white/[0.04] space-y-2">
            <span className="text-2xl font-black font-mono text-amber-400/40">03</span>
            <h4 className="text-sm font-bold text-white uppercase">Contact Direct</h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Call or WhatsApp the verified caretaker directly to secure your room without paying any broker fees.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT US SUPPORT SECTION */}
      <section className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black text-amber-400 uppercase tracking-widest">
            <Headphones className="w-3.5 h-3.5" /> Direct Support Desk
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Need Help or Have Inquiries?</h2>
          <p className="text-xs text-slate-400 font-sans max-w-lg mx-auto">
            Got questions about a hostel listing or need help navigating off-campus housing? Reach out directly to our support line.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* CALL DIRECT BUTTON */}
          <a
            href={`tel:${phoneNumber}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-950 border border-white/10 hover:border-amber-500/50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all group shadow-md"
          >
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span>Call {phoneNumber}</span>
          </a>

          {/* WHATSAPP DIRECT BUTTON */}
          <a
            href={`https://wa.me/${formattedPhone}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md group"
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-slate-950 group-hover:text-emerald-400 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 text-center space-y-4 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Ready to Find Your Next Hostel?</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-sans">
          Join hundreds of Rongo University students finding safe, affordable, and verified off-campus housing today.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-mono font-bold tracking-wider uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-all shadow-lg"
          >
            Start Exploring Rooms Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </main>
  );
}