'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminAccess } from '../actions'; 
import { ShieldAlert, KeyRound, Building2, Upload, CheckCircle2, Loader2, ArrowLeft, Trash2, MapPin, DollarSign, Edit2, Map, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';

interface Property {
  id: string;
  title?: string;
  name?: string;
  location: string;
  price_per_semester?: number;
  price?: number;
  map_link?: string;
}

export default function AdministrativePostPage() {
  // Gatekeeper state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [gateError, setGateError] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Kitere Center');
  const [price, setPrice] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  
  // Existing Properties Management state
  const [existingProperties, setExistingProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');

  // Automatically load asset index safely upon secure state unlock
  useEffect(() => {
    if (isAuthenticated) {
      fetchActivePropertiesList();
    }
  }, [isAuthenticated]);

  // Fetch properties for management when authenticated
  const fetchActivePropertiesList = async () => {
    setLoadingProperties(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExistingProperties(data || []);
    } catch (err) {
      console.error('FAILED_TO_LOAD_MANAGEMENT_STREAM:', err);
    } finally {
      setLoadingProperties(false);
    }
  };

  // Gatekeeper Auth Handler -> Now unified single async method
  const handleGateUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError('');
    
    try {
      const isValid = await verifyAdminAccess(passcodeAttempt);
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        setGateError('INVALID DEPLOYMENT TOKEN. ACCESS DENIED.');
      }
    } catch (err) {
      setGateError('SERVER AUTHENTICATION ROUTINE BREAKAGE DETECTED.');
    }
  };

  // House Destruction Purge Handler
  const handlePurgeAsset = async (id: string, name: string) => {
    const confirmPurge = window.confirm(`CRITICAL DESTRUCTION PROTOCOL:\nAre you absolutely sure you want to permanently delete "${name}"? This action cannot be reversed.`);
    if (!confirmPurge) return;

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExistingProperties(prev => prev.filter(item => item.id !== id));
      setSuccessMessage(`ASSET "${name.toUpperCase()}" COMPLETELY WIPE-DELETED FROM NETWORK TEMPLATE.`);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Purge routine encountered an error.');
    } finally {
      setDeletingId(null);
    }
  };

  // Form Submission Handler
  const handleUploadAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setSuccessMessage('');

    try {
      if (!title || !price || !phoneNumber) {
        throw new Error('Please fill out all fundamental verification metrics.');
      }

      const uploadedUrls: string[] = [];

      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          let file = imageFiles[i];

          if (file.size > 1024 * 1024) { 
            try {
              file = await new Promise<File>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                  const img = new Image();
                  img.src = event.target?.result as string;
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200; 
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > MAX_WIDTH) {
                      height *= MAX_WIDTH / width;
                      width = MAX_WIDTH;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                      if (blob) {
                        const compressedFile = new File([blob], file.name, {
                          type: 'image/jpeg',
                          lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                      } else {
                        resolve(file);
                      }
                    }, 'image/jpeg', 0.75); 
                  };
                };
                reader.onerror = error => reject(error);
              });
            } catch (compressionErr) {
              console.warn("Compression skipped, sending original raw data:", compressionErr);
            }
          }

          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}_${Date.now()}.${fileExt}`;
          const filePath = `properties/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('hostel-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('hostel-images')
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrl);
        }
      }

      const amenitiesArray = amenitiesInput
        ? amenitiesInput.split(',').map((item) => item.trim()).filter((item) => item !== '')
        : ['wi-fi', 'water supply'];

      const { error: insertError } = await supabase
        .from('properties')
        .insert([
          {
            title: title.trim(),
            location,
            price_per_semester: Number(price),
            phone_number: phoneNumber.trim(),
            amenities: amenitiesArray,
            image_urls: uploadedUrls,
            is_available: true,
            map_link: mapLink.trim()
          }
        ]);

      if (insertError) throw insertError;

      setSuccessMessage('HOSTEL INFRASTRUCTURE VERIFIED AND DEPLOYED LIVE SUCCESSFULLY.');
      
      setTitle('');
      setPrice('');
      setPhoneNumber('');
      setAmenitiesInput('');
      setMapLink('');
      setImageFiles(null);

      fetchActivePropertiesList();

    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Transmission anomaly triggered.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-slate-900 border border-red-500/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.03)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
          
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-2">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-sm font-mono font-black uppercase tracking-[0.2em] text-red-400">
              SECURE ADMIN LINK DETECTED
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Only the system network operator can verify and append structures to avoid exaggerated details.
            </p>
          </div>

          <form onSubmit={handleGateUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-red-400" /> Enter Master Network Token:
              </label>
              <input
                type="password"
                placeholder="•••••••••••••••"
                value={passcodeAttempt}
                onChange={(e) => setPasscodeAttempt(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/[0.08] text-sm text-center text-white placeholder-slate-800 font-mono focus:outline-none focus:border-red-500/60 transition-all tracking-widest"
              />
            </div>

            {gateError && (
              <p className="text-[10px] font-mono font-bold text-red-400 text-center uppercase tracking-wide">
                ⚠️ {gateError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-black text-xs py-3 rounded-xl transition-all shadow-md tracking-widest uppercase"
            >
              UNLOCK CONSOLE MANAGEMENT
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase">
              <ArrowLeft className="w-3 h-3" /> Abort and return home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 relative z-10 animate-in fade-in zoom-in-95 duration-200 space-y-8">
      
      {/* 1. MINT NEW HOUSE CONTAINER */}
      <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(245,158,11,0.02)]">
        <div className="border-b border-white/[0.04] pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-amber-400 font-black tracking-widest uppercase block">ACTIVE TERMINAL CONSOLE</span>
            <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" /> List New Hostel
            </h1>
          </div>
          
          {/* NAVIGATION AND SYSTEM CONTROLS SPLIT GROUP */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <Link 
              href="/admin/ads"
              className="px-3 py-1.5 text-[9px] font-mono font-black uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 rounded-lg transition-all flex items-center gap-1"
            >
              <Megaphone className="w-3 h-3" /> ADS CENTER
            </Link>
            
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-red-400 border border-red-500/20 bg-red-500/5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
            >
              EXIT PAGE
            </button>
          </div>
        </div>

        {formError && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono p-3.5 rounded-xl uppercase tracking-wide">
            ❌ SYSTEM_ERROR: {formError}
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono p-3.5 rounded-xl flex items-center gap-2 uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMessage}
          </div>
        )}

        <form onSubmit={handleUploadAndSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400">Hostel / House Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Riverside Plaza Elite"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs text-white placeholder-slate-700 focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400">Target Sector Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs font-bold text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer transition-all"
              >
                <option value="Kitere Center">Kitere Center Zone</option>
                <option value="Main Gate Area">Main Gate Area Zone</option>
                <option value="Showground Area">Showground Area Zone</option>
                <option value="Rongo Town">Rongo Town Cluster</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400">Price Rate per Semester (KES)</label>
              <input
                type="number"
                required
                placeholder="e.g., 14500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs text-white placeholder-slate-700 font-mono focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400">Caretaker Mobile Contact</label>
              <input
                type="text"
                required
                placeholder="e.g., 0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs text-white placeholder-slate-700 font-mono focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* GOOGLE MAPS TELEMETRY LINK CONTAINER */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Map className="w-3 h-3 text-amber-400" /> Google Maps Pin URL / Plus Code <span className="text-slate-600 text-[8px]">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 5JF8+V52 Rongo OR map share link"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs text-white placeholder-slate-700 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400">
              Infrastructure Amenities <span className="text-slate-600 text-[8px]">(Separate items with commas)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Free Wi-Fi, Hot Shower, Inside Tokens, Tiled Floors"
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs text-white placeholder-slate-700 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400">Structural Telemetry Images</label>
            <div className="relative border border-dashed border-white/[0.08] hover:border-amber-500/40 bg-slate-950 rounded-xl p-6 text-center group cursor-pointer transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-5 h-5 mx-auto text-slate-500 group-hover:text-amber-400 mb-2 transition-colors" />
              <p className="text-xs font-mono text-slate-400">
                {imageFiles && imageFiles.length > 0 
                  ? `[ STAGED IMAGES FOR CAPTURE: ${imageFiles.length} ]` 
                  : "Click or drag files here to stash structural blueprints"}
              </p>
              <p className="text-[8px] font-mono text-slate-600 uppercase mt-1">supports standard imaging format clusters</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono font-black text-xs py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> DISPATCHING_STRUCTURAL_BLUEPRINTS...
                </>
              ) : (
                "PUBLISH AND DEPLOY ASSET LIVE"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 2. LIVE PURGE AND ALTER LOGISTICS CONTAINER */}
      <div className="bg-slate-900 border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="border-b border-white/[0.04] pb-3">
          <span className="text-[9px] font-mono text-cyan-400 font-black tracking-widest uppercase block"> TERMINAL CONTROL SYSTEM</span>
          <h2 className="text-base font-black text-white uppercase tracking-tight">Active Hostel Listings</h2>
        </div>

        {loadingProperties ? (
          <div className="flex justify-center items-center py-8 gap-2 text-xs font-mono text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> Pulling internal core registry...
          </div>
        ) : existingProperties.length === 0 ? (
          <p className="text-xs font-mono text-slate-600 text-center py-6">Database housing index is currently empty.</p>
        ) : (
          <div className="divide-y divide-white/[0.03] overflow-hidden">
            {existingProperties.map((asset) => {
              const currentTitle = asset.title || asset.name || 'Unnamed Asset';
              const currentPrice = asset.price_per_semester !== undefined ? asset.price_per_semester : (asset.price || 0);

              return (
                <div key={asset.id} className="py-3.5 flex items-center justify-between gap-4 group">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white tracking-tight line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {currentTitle}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                      <span className="flex items-center gap-0.5 text-cyan-400/80">
                        <MapPin className="w-2.5 h-2.5" /> {asset.location}
                      </span>
                      <span className="flex items-center gap-0.5 text-emerald-400/80">
                        <DollarSign className="w-2.5 h-2.5" /> {Number(currentPrice).toLocaleString()} KES
                      </span>
                    </div>
                  </div>

                  {/* CONTROL PANEL ACTIONS BLOCK */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/edit/${asset.id}`}
                      className="p-2 bg-slate-950 border border-white/[0.05] hover:border-cyan-500 text-slate-400 hover:text-cyan-400 rounded-lg transition-all"
                      title="Alter Fields Template"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handlePurgeAsset(asset.id, currentTitle)}
                      disabled={deletingId === asset.id}
                      className="p-2 bg-red-500/5 border border-red-500/10 hover:border-red-500 hover:bg-red-500 hover:text-slate-950 text-red-400 rounded-lg transition-all disabled:opacity-30"
                      title="Vaporize Listing"
                    >
                      {deletingId === asset.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </main>
  );
}