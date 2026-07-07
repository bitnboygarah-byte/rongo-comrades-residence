"use client";

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState, use } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, Phone, ArrowLeft, ShieldAlert, Expand, Map } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
import { supabase } from '@/app/lib/supabase';
interface Hostel {
  id: string;
  title: string;
  name?: string;
  price_per_semester?: number;
  price?: number;
  location: string;
  image_urls: string[];
  phone_number: string;
  amenities: string[];
  is_available: boolean;
  map_link?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StandaloneHostelDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams?.id || "";

  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Carousel slider tracking
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  
  // Immersive Lightbox Modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    async function fetchHostel() {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setHostel(data);
      } else {
        console.error("SUPABASE_FETCH_ERROR:", error);
      }
      setLoading(false);
    }

    fetchHostel();
  }, [id]);

  const nextCarouselImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hostel?.image_urls) return;
    setActiveImgIdx((prev) => (prev + 1) % hostel.image_urls.length);
  };

  const prevCarouselImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hostel?.image_urls) return;
    setActiveImgIdx((prev) => (prev - 1 + hostel.image_urls.length) % hostel.image_urls.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-xs text-slate-400 gap-2">
        <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        RETRIEVING RESIDENCE DATA STREAM...
      </div>
    );
  }
  
  if (!hostel) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-xs text-rose-500 gap-4">
        <ShieldAlert className="w-8 h-8" />
        CRITICAL_ERROR: HOSTEL RESIDENCE ASSET NOT FOUND
        <p className="text-slate-500 text-[10px]">Target Row Route Target ID: [{id || "NULL"}]</p>
        <Link href="/" className="px-4 py-2 bg-slate-900 border border-white/[0.1] rounded-xl text-slate-300 hover:text-white">
          Return To Secure Grid Base
        </Link>
      </div>
    );
  }

  const hasImages = hostel.image_urls && hostel.image_urls.length > 0;
  const hostelTitle = hostel.title || hostel.name || 'Unnamed Hostel';
  const hostelPrice = hostel.price_per_semester !== undefined ? hostel.price_per_semester : (hostel.price || 0);

  // Formatting mobile number strings securely
  const rawPhone = hostel.phone_number || "0700000000";
  const formattedWaPhone = rawPhone.replace(/^0/, '254');

  // Parse Google Maps URLs or Plus Codes into a clean clickable interface
  const getCleanMapUrl = (input: string) => {
    const trimmed = input.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-10 pb-20 relative">
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-200">
        
        {/* Navigation Anchor */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> BACK_TO_EXPLORER_MATRIX
          </Link>
        </div>

        {/* IMAGE DISPLAY ZONE / CAROUSEL SHOWCASE */}
        <div className="w-full h-72 sm:h-[400px] bg-slate-950 relative flex items-center justify-center border-b border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl group">
          {hasImages ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={hostel.image_urls[activeImgIdx]} 
                alt="Maximized Architectural View" 
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />

              {/* Left/Right Swipe Inline Arrows */}
              {hostel.image_urls.length > 1 && (
                <>
                  <button 
                    onClick={prevCarouselImage}
                    className="absolute left-4 p-2 rounded-full bg-slate-950/70 text-white hover:bg-cyan-500 hover:text-slate-950 transition z-20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={nextCarouselImage}
                    className="absolute right-4 p-2 rounded-full bg-slate-950/70 text-white hover:bg-cyan-500 hover:text-slate-950 transition z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dynamic Inline Dots Pagination Indicator Bar */}
              {hostel.image_urls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20 bg-slate-950/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {hostel.image_urls.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`h-1.5 transition-all duration-200 rounded-full ${idx === activeImgIdx ? 'w-4 bg-cyan-400' : 'w-1.5 bg-slate-600'}`}
                    />
                  ))}
                </div>
              )}
              
              {/* Fixed Action Overlay Button */}
              <div className="absolute bottom-4 right-4 z-30">
                <button
                  onClick={(e) => { 
                    e.stopPropagation();
                    setIsLightboxOpen(true); 
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-black text-xs shadow-2xl transition-all active:scale-95 duration-100"
                >
                  <Expand className="w-4 h-4" /> VIEW FULL UNCROPPED PHOTO
                </button>
              </div>
            </>
          ) : (
            <div className="font-mono text-xs text-slate-600">NULL_IMAGE_STREAM</div>
          )}
        </div>

        {/* METRICS & INFORMATION TEXT BLOCKS */}
        <div className="space-y-6 mt-8">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
                {hostel.location}
              </span>
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-3">
                {hostelTitle}
              </h1>
            </div>
          </div>

          <p className="text-3xl font-black text-emerald-400 font-mono">
            KES {Number(hostelPrice).toLocaleString()} <span className="text-xs text-slate-500 font-normal uppercase">/ Semester</span>
          </p>
          
          {hostel.amenities && hostel.amenities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Included Infrastructure</h3>
              <div className="flex flex-wrap gap-2">
                {hostel.amenities.map((amenity, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-slate-900 border border-white/[0.05] text-xs font-medium capitalize text-slate-300">
                    ⚡ {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GEOGRAPHICAL NAVIGATION PLATFORM MATRIX */}
          {hostel.map_link && (
            <div className="space-y-2 bg-slate-900/50 border border-white/[0.04] rounded-2xl p-4">
              <h3 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Map className="w-3 h-3 text-cyan-400" /> Geographical Location Map
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-3">
                Tap below to verify and navigate directly to the physical structure's exact coordinate blueprint.
              </p>
              <a
                href={getCleanMapUrl(hostel.map_link)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-cyan-500/20 hover:border-cyan-400/60 text-xs font-mono font-bold text-slate-200 hover:text-cyan-400 transition-all shadow-md uppercase tracking-wider"
              >
                📍 Launch Satellite Pin Routing
              </a>
            </div>
          )}

          {/* DUAL ACTION COMMUNICATION MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {/* Direct Cellular Phone Call Connection */}
            <a 
              href={`tel:${rawPhone}`}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 text-cyan-400 py-4 rounded-2xl font-mono font-black text-base transition shadow-lg tracking-wider active:scale-98"
            >
              <Phone className="w-4 h-4" /> Direct Mobile Call
            </a>

            {/* Instant WhatsApp Interface API Access */}
            <a 
              href={`https://wa.me/${formattedWaPhone}?text=Hello%20Caretaker,%20I%20am%20a%20Rongo%20Comrade%20viewing%20rongostay%20website.%20I%20am%20highly%20interested%20in%20booking%20a%20room%20at%20${encodeURIComponent(hostelTitle)}.%20Please%20let%20me%20know%20if%20its%20available.%20`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 py-4 rounded-2xl font-mono font-black text-base hover:from-emerald-400 hover:to-teal-500 transition shadow-lg tracking-wider active:scale-98"
            >
              <Phone className="w-4 h-4" /> WhatsApp Booking Connection
            </a>
          </div>

        </div>
      </div>

      {/* ON-SITE IMMERSIVE IN-SCREEN LIGHTBOX OVERLAY */}
      {isLightboxOpen && hasImages && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-2xl flex flex-col items-center justify-center select-none animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Panel Controls */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between px-4 z-50">
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900/80 px-4 py-1.5 rounded-full border border-white/[0.05]">
              ORIGINAL IMAGE VIEW • {activeImgIdx + 1} OF {hostel.image_urls.length}
            </span>
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="p-3 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white border border-white/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Flipper Buttons for Overlay view mapping */}
          {hostel.image_urls.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveImgIdx((prev) => (prev - 1 + hostel.image_urls.length) % hostel.image_urls.length); }}
                className="absolute left-4 p-4 rounded-full bg-slate-900/80 hover:bg-cyan-500 text-white hover:text-slate-950 border border-white/[0.05] z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveImgIdx((prev) => (prev + 1) % hostel.image_urls.length); }}
                className="absolute right-4 p-4 rounded-full bg-slate-900/80 hover:bg-cyan-500 text-white hover:text-slate-950 border border-white/[0.05] z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Full Screen Unclipped Canvas Frame */}
          <div className="w-full h-full max-w-4xl max-h-[85vh] p-4 flex items-center justify-center">
            <img 
              src={hostel.image_urls[activeImgIdx]} 
              alt="Unaltered view" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-300"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>

          <p className="absolute bottom-6 text-[10px] font-mono text-slate-500 tracking-wider">
            TAP ANYWHERE OUTSIDE THE IMAGE TO ESCAPE FULLSCREEN MODE
          </p>
        </div>
      )}
    </main>
  );
}