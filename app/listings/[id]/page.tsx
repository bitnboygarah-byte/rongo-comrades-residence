"use client";

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Maximize2, X, ChevronLeft, ChevronRight, Phone, ArrowLeft, Trash2, ShieldAlert, Expand } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface House {
  id: string;
  title: string;
  price_per_semester: number;
  location: string;
  image_urls: string[];
  phone_number: string;
  amenities: string[];
  is_available: boolean;
}

export default function ListingsDetails() {
  const router = useRouter();
  const unwrappedParams = useParams();
  
  // Robust dynamic route parameter parsing for Turbopack fast-refreshes
  const id = (unwrappedParams?.id || "") as string;

  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  
  // Lightbox state streams
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    
    async function fetchHouse() {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setHouse(data);
      } else {
        console.error("SUPABASE_FETCH_ERROR:", error);
      }
      setLoading(false);
    }

    fetchHouse();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing, comrade?");
    if (!confirmDelete) return;

    setDeleting(true);
    const { error } = await supabase.from('properties').delete().eq('id', id);
    setDeleting(false);

    if (error) {
      alert("Error deleting record: " + error.message);
    } else {
      alert("Listing permanently dropped successfully! 🗑️");
      router.push('/post');
    }
  };

  const nextLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!house?.image_urls) return;
    setActiveImageIndex((prev) => (prev + 1) % house.image_urls.length);
  };

  const prevLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!house?.image_urls) return;
    setActiveImageIndex((prev) => (prev - 1 + house.image_urls.length) % house.image_urls.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-xs text-slate-400 gap-2">
        <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        RETRIVING RESIDENCE DATA STREAM...
      </div>
    );
  }
  
  if (!house) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-xs text-rose-500 gap-4">
        <ShieldAlert className="w-8 h-8" />
        CRITICAL_ERROR: RESIDENCE ASSET NOT FOUND
        <p className="text-slate-500 text-[10px]">Target Row Route Target ID: [{id || "NULL"}]</p>
        <Link href="/" className="px-4 py-2 bg-slate-900 border border-white/[0.1] rounded-xl text-slate-300 hover:text-white">
          Return To Secure Grid Base
        </Link>
      </div>
    );
  }

  const hasImages = house.image_urls && house.image_urls.length > 0;
  const activeDisplayHeroImage = hasImages ? house.image_urls[0] : "";

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-10 pb-20 relative">
      <div className="max-w-4xl mx-auto p-6 space-y-8 relative z-10">
        
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Back To Gallery Grid
          </Link>
        </div>

        {/* IMAGE DISPLAY ZONE */}
        <div className="space-y-3">
          <div className="w-full h-[400px] bg-slate-900 border border-white/[0.05] rounded-3xl relative flex items-center justify-center shadow-2xl group overflow-hidden">
            {hasImages ? (
              <>
                <img 
                  src={activeDisplayHeroImage} 
                  alt={house.title} 
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={() => { setIsLightboxOpen(true); setActiveImageIndex(0); }}
                />
                
                {/* Fixed Z-Index Overlay Button */}
                <div className="absolute bottom-4 right-4 z-30">
                  <button
                    onClick={(e) => { 
                      e.stopPropagation();
                      setIsLightboxOpen(true); 
                      setActiveImageIndex(0); 
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

          {/* MOBILE FAILSAFE INTERACTIVE ROW */}
          {hasImages && (
            <div className="w-full flex justify-end">
              <button
                onClick={() => { setIsLightboxOpen(true); setActiveImageIndex(0); }}
                className="w-full sm:w-auto text-center flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-cyan-500/20 font-mono text-xs font-bold transition-all"
              >
                <Expand className="w-4 h-4" /> Comrades Zoom: Open Full Aspect Image
              </button>
            </div>
          )}
        </div>

        {/* METRICS & INFORMATION TEXT BLOCKS */}
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
                {house.location}
              </span>
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-3">
                {house.title}
              </h1>
            </div>
            
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleting ? "DROPPING..." : "Purge Asset Data"}
            </button>
          </div>

          <p className="text-3xl font-black text-emerald-400 font-mono">
            KES {house.price_per_semester ? Number(house.price_per_semester).toLocaleString() : "0"} <span className="text-xs text-slate-500 font-normal uppercase">/ Semester</span>
          </p>
          
          {house.amenities && house.amenities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Included Infrastructure</h3>
              <div className="flex flex-wrap gap-2">
                {house.amenities.map((amenity, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-slate-900 border border-white/[0.05] text-xs font-medium capitalize text-slate-300">
                    ⚡ {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <a 
            href={`https://wa.me/${house.phone_number ? house.phone_number.replace(/^0/, '254') : '254700000000'}?text=Hello%20Caretaker,%20I%20am%20a%20Rongo%20Comrade%20interested%20in%20reserving%20${encodeURIComponent(house.title || "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full text-center items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 py-4 rounded-2xl font-mono font-black text-lg hover:from-emerald-400 hover:to-teal-500 transition shadow-lg tracking-wider"
          >
            <Phone className="w-5 h-5" /> Initiate WhatsApp Booking Connection
          </a>
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
              ORIGINAL IMAGE VIEW • {activeImageIndex + 1} OF {house.image_urls.length}
            </span>
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="p-3 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white border border-white/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Flipper Buttons for Houses */}
          {house.image_urls.length > 1 && (
            <>
              <button 
                onClick={prevLightboxImage}
                className="absolute left-4 p-4 rounded-full bg-slate-900/80 hover:bg-cyan-500 text-white hover:text-slate-950 border border-white/[0.05] z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextLightboxImage}
                className="absolute right-4 p-4 rounded-full bg-slate-900/80 hover:bg-cyan-500 text-white hover:text-slate-950 border border-white/[0.05] z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Full Screen Unclipped Canvas Frame */}
          <div className="w-full h-full max-w-4xl max-h-[85vh] p-4 flex items-center justify-center">
            <img 
              src={house.image_urls[activeImageIndex]} 
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