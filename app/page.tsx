'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, DollarSign, Volume2, VolumeX, Compass } from 'lucide-react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { supabase } from '@/app/lib/supabase';
interface Property {
  id: string;
  title?: string;
  name?: string;
  location: string;
  price_per_semester?: number;
  price?: number;
  phone_number?: string;
  amenities: string[];
  is_available: boolean;
  image_urls?: string[];
}

export default function RongoStayExplorerPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  
  // Global offset tracker to rotationally shuffle all ad cards every 10s
  const [adShiftOffset, setAdShiftOffset] = useState(0);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [manualPrice, setManualPrice] = useState('');

  const fetchAllProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('DATABASE_FETCH_ERROR:', error);
    } finally {
      if (loading) setLoading(false);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const { data } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true);
      
      if (data) setAds(data);
    } catch (error) {
      console.error('ADS_FETCH_ERROR:', error);
    }
  };

  useEffect(() => {
    fetchAllProperties();
    fetchAdvertisements();

    window.addEventListener('focus', fetchAllProperties);
    return () => window.removeEventListener('focus', fetchAllProperties);
  }, []);

  // Shuffle master loop: Changes the ad seed index every 10 seconds
  useEffect(() => {
    if (!ads || ads.length <= 1) return;

    const interval = setInterval(() => {
      setAdShiftOffset((prev) => (prev + 1) % ads.length);
    }, 10000); // 10000ms = 10 seconds

    return () => clearInterval(interval);
  }, [ads]);

  const filteredProperties = properties.filter((item) => {
    const propertyTitle = (item.title || item.name || '').toLowerCase();
    const matchesSearch = propertyTitle.includes(searchQuery.toLowerCase().trim());
    
    const propertyLocation = (item.location || '').toLowerCase();
    const selectedLocLower = selectedLocation.toLowerCase();
    const matchesLocation = selectedLocation === 'All' || propertyLocation.includes(selectedLocLower);
    
    const actualPrice = item.price_per_semester !== undefined ? item.price_per_semester : (item.price || 0);
    const maxBudget = manualPrice === '' ? Infinity : Number(manualPrice);
    const matchesPrice = actualPrice <= maxBudget;
    
    return matchesSearch && matchesLocation && matchesPrice;
  });

  // MIXING LOGIC: Starts ad at card 2, then repeats every 6 cards seamlessly
  const renderMixedGridItems = () => {
    const mixedItems: Array<{ type: 'property'; data: Property } | { type: 'ad'; data: any }> = [];
    
    if (filteredProperties.length === 0) return mixedItems;

    let propertyIndex = 0;
    let localAdSlotCounter = 0;

    // We build the layout linearly item-by-item to map perfectly to a responsive grid layout
    while (propertyIndex < filteredProperties.length || (mixedItems.length === 1 && ads.length > 0)) {
      const currentGridPosition = mixedItems.length;

      // Condition: Place ad at position 1 (which is the 2nd Card), 
      // then subsequently every 6 cards after that (Position 7, 13, 19...)
      const isAdSlot = currentGridPosition === 1 || (currentGridPosition > 1 && (currentGridPosition - 1) % 6 === 0);

      if (isAdSlot && ads.length > 0) {
        // Calculate sequence order + global tick offset shuffle
        const targetedAdIndex = (localAdSlotCounter + adShiftOffset) % ads.length;
        mixedItems.push({ type: 'ad', data: ads[targetedAdIndex] });
        localAdSlotCounter++;
      } else if (propertyIndex < filteredProperties.length) {
        mixedItems.push({ type: 'property', data: filteredProperties[propertyIndex] });
        propertyIndex++;
      } else {
        // Break loop if properties run dry and it's not a mandated ad layout space
        break;
      }
    }

    return mixedItems;
  };

  const mixedGridContent = renderMixedGridItems();

  return (
    <div className="bg-slate-950 text-slate-100 antialiased font-sans relative min-h-screen">
      
      {/* BACKGROUND ACCENT GLOWS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[15%] w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[-5%] right-[15%] w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      {/* COMPACT, SLEEK HERO WRAPPER */}
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-6 relative z-10 text-center flex flex-col items-center space-y-4">
        
        {/* Anti-Scorching Micro Capsule */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
          <Compass className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-orange-400">
            Stop the endless roam beneath the scorching sun looking for hostel that suits you
          </span>
        </div>

        {/* Minimized & Bold Dynamic Typography Configuration */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">
          Verified Student Housing Units. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 font-extrabold">
            Direct Caretaker Connection.
          </span>
        </h1>
        
        {/* Secondary Detailed Explainer */}
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-medium">
          Find all the info about a hostel here and get direct communication with the caretakers.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 font-bold font-mono">
            All these just from the comfort of your sit or bed.
          </span>
        </p>
      </header>

      {/* ULTRA-SLEEK, ULTRA-COMPACT UNIFIED FILTER SEARCH CONSOLE */}
      <section className="max-w-5xl mx-auto px-6 mb-12 relative z-10">
        <div className="bg-slate-900/40 border border-white/[0.06] backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-2">
          <div className="flex flex-col md:flex-row items-center bg-slate-950 rounded-xl divide-y md:divide-y-0 md:divide-x divide-white/[0.04] border border-white/[0.03]">
            
            {/* INPUT FIELD 01: HOSTEL NAME SEARCH */}
            <div className="w-full md:w-[45%] flex items-center px-4 py-2.5 group relative">
              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors shrink-0" />
              <div className="w-full pl-3 flex flex-col">
                <span className="text-[8px] font-mono font-bold tracking-widest text-slate-500 uppercase leading-none mb-0.5">01 // HOSTEL SEARCH</span>
                <input
                  type="text"
                  placeholder="Type house name to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-slate-600 font-mono focus:outline-none py-0.5"
                />
              </div>
            </div>

            {/* INPUT FIELD 02: TARGET SECTOR SELECTOR */}
            <div className="w-full md:w-[32%] flex items-center px-4 py-2.5 group relative">
              <MapPin className="w-4 h-4 text-slate-500 group-focus-within:text-teal-400 transition-colors shrink-0" />
              <div className="w-full pl-3 flex flex-col">
                <span className="text-[8px] font-mono font-bold tracking-widest text-slate-500 uppercase leading-none mb-0.5">02 // SECTOR ZONE</span>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-300 focus:outline-none cursor-pointer py-0.5 border-none p-0 appearance-none filter drop-shadow-md"
                >
                  <option value="All" className="bg-slate-950 text-white">All Regions Distributed</option>
                  <option value="Kitere Center" className="bg-slate-950 text-white">Kitere Center Zone</option>
                  <option value="Main Gate Area" className="bg-slate-950 text-white">Main Gate Area Zone</option>
                  <option value="Showground Area" className="bg-slate-950 text-white">Showground Area Zone</option>
                  <option value="Rongo Town" className="bg-slate-950 text-white">Rongo Town Cluster</option>
                </select>
              </div>
            </div>

            {/* INPUT FIELD 03: BUDGET CEILING CAP */}
            <div className="w-full md:w-[23%] flex items-center px-4 py-2.5 group relative">
              <DollarSign className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors shrink-0" />
              <div className="w-full pl-3 flex flex-col">
                <span className="text-[8px] font-mono font-bold tracking-widest text-slate-500 uppercase leading-none mb-0.5">03 // MAX BUDGET</span>
                <input
                  type="number"
                  placeholder="Max KES..."
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-slate-600 font-mono focus:outline-none py-0.5"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPACTED INTEGRATED DISPLAY MATRIX */}
      <main className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => <div key={n} className="bg-slate-900/40 border border-white/[0.04] rounded-2xl h-64 animate-pulse" />)}
          </div>
        ) : mixedGridContent.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/20 border border-white/[0.03] rounded-2xl">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">No listings match your active search settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mixedGridContent.map((item, index) => {
              
              // HOUSING PROPERTY DISPLAY FORM
              if (item.type === 'property') {
                const property = item.data;
                const displayTitle = property.title || property.name || 'Unnamed Hostel';
                const displayPrice = property.price_per_semester !== undefined ? property.price_per_semester : (property.price || 0);

                return (
                  <article key={`prop-${property.id}-${index}`} className="bg-slate-900/40 border border-white/[0.04] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/[0.1] hover:bg-slate-900/70 transition-all duration-300 group">
                    <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-white/[0.02]">
                      {property.image_urls && property.image_urls.length > 0 ? (
                        <img
                          src={property.image_urls[0]}
                          alt={displayTitle}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xl opacity-15">📸</span>
                      )}
                      <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border backdrop-blur-md ${property.is_available ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        {property.is_available ? 'VACANT' : 'FULL'}
                      </span>
                    </div>

                    <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-black tracking-wider text-cyan-400 uppercase block">📍 {property.location}</span>
                        <h3 className="font-bold text-sm text-white tracking-tight line-clamp-1">{displayTitle}</h3>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {property.amenities && property.amenities.map((stuff, idx) => (
                          <span key={idx} className="bg-white/[0.02] border border-white/[0.04] text-slate-400 text-[8px] font-mono px-1.5 py-0.5 rounded">
                            {stuff.trim().toLowerCase()}
                          </span>
                        ))}
                      </div>

                      <div className="border-t border-white/[0.04] pt-3 flex justify-between items-center">
                        <div>
                          <p className="text-[8px] font-mono text-slate-500 uppercase">Rate per Semester</p>
                          <p className="text-xs font-black text-white font-mono">
                            {Number(displayPrice).toLocaleString()} <span className="text-cyan-400 text-[9px]">KES</span>
                          </p>
                        </div>
                        <a
                          href={`/hostel/${property.id}`}
                          className="bg-white hover:bg-cyan-500 text-slate-950 text-[9px] font-mono font-black px-3 py-2 rounded-lg transition-all text-center"
                        >
                          VIEW_DETAILS_
                        </a>
                      </div>
                    </div>
                  </article>
                );
              }

              // SEQUENTIAL INTERACTIVE AD PREVIEW CARD
              if (item.type === 'ad') {
                const ad = item.data;
                const whatsappUrl = `https://wa.me/${ad.phone_number.replace(/\s+/g, '')}?text=Hi%20${encodeURIComponent(ad.business_name)},%20I%20saw%20your%20ad%20on%20RongoStay.`;

                return (
                  <article key={`ad-${ad.id}-${index}`} className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col justify-between shadow-[0_0_25px_rgba(6,182,212,0.03)] group relative">
                    
                    {/* Media Display Block with Fixed Object Contain Fitting */}
                    <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-white/[0.02]">
                      {ad.is_video ? (
                        <div className="w-full h-full relative">
                          <video
                            key={ad.media_url} 
                            src={ad.media_url}
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsMuted(!isMuted);
                            }}
                            className="absolute bottom-3 right-3 z-20 p-1 rounded bg-slate-950/80 text-white hover:bg-white hover:text-slate-950 transition-all border border-white/[0.05]"
                          >
                            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          </button>
                        </div>
                      ) : (
                        <img 
                          src={ad.media_url} 
                          alt={ad.business_name} 
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-102"
                        />
                      )}
                      
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[7px] font-mono font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 backdrop-blur-md">
                        SPONSORED_CAMPUS_AD
                      </span>
                    </div>

                    {/* Meta/Text Action Fields */}
                    <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono font-bold tracking-widest text-slate-500 uppercase block">BUSINESS BRAND PROFILE</span>
                        <h3 className="font-black text-sm text-white tracking-tight line-clamp-1 font-mono uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-400">
                          {ad.business_name}
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-normal line-clamp-2 font-medium pt-1">
                          Active dynamic partner around campus area. Tap below to inquire info, products, delivery status or catalogs directly.
                        </p>
                      </div>

                      <div className="border-t border-white/[0.03] pt-3">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full block bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 text-[9px] font-mono font-black py-2.5 rounded-lg transition-all text-center tracking-wider uppercase"
                        >
                          CONNECT_ON_WHATSAPP // 💬
                        </a>
                      </div>
                    </div>

                  </article>
                );
              }

              return null;
            })}
          </div>
        )}
      </main>

    </div>
  );
}