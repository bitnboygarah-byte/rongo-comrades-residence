'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Loader2, ArrowLeft, Save, Building2, MapPin, DollarSign, Phone, Sliders, Image as ImageIcon, Map } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';
export default function AdministrativeEditPage() {
  const router = useRouter();
  const { id } = useParams();

  // Core loading states
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form Field States matching your exact Supabase columns
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Kitere Center');
  const [pricePerSemester, setPricePerSemester] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('');
  const [mapLink, setMapLink] = useState(''); // Added Map Link tracking state
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Image lists: Tracking existing remote URLs and new local uploads
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<FileList | null>(null);

  // Pull initial record telemetry from Supabase
  useEffect(() => {
    if (!id) return;

    const fetchPropertyTelemetry = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setTitle(data.title || '');
          setLocation(data.location || 'Kitere Center');
          setPricePerSemester(data.price_per_semester?.toString() || '');
          setPhoneNumber(data.phone_number || '');
          setMapLink(data.map_link || ''); // Map telemetry hydration
          setIsAvailable(data.is_available ?? true);
          setExistingImages(data.image_urls || []);
          
          if (data.amenities && Array.isArray(data.amenities)) {
            setAmenitiesInput(data.amenities.join(', '));
          }
        }
      } catch (err: any) {
        console.error('FETCH_RECORD_FAILED:', err);
        setErrorMessage(err.message || 'Failed to locate asset data.');
      } finally {
        setLoadingInitialData(false); // Fixed: Changed from loadingInitialData(false)
      }
    };

    fetchPropertyTelemetry();
  }, [id]);

  // Remove a staged layout photo from the cloud link state array
  const handleRemoveExistingImage = (urlToRemove: string) => {
    setExistingImages(prev => prev.filter(url => url !== urlToRemove));
  };

  // Submit revised details block to network data tier
  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let uploadedUrls: string[] = [...existingImages];

      // Handle raw incoming uploads if any fresh images are attached
      if (newImageFiles && newImageFiles.length > 0) {
        for (let i = 0; i < newImageFiles.length; i++) {
          let file = newImageFiles[i];

          // Auto Compression Layer for large images
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
                        resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
                      } else {
                        resolve(file);
                      }
                    }, 'image/jpeg', 0.75);
                  };
                };
                reader.onerror = error => reject(error);
              });
            } catch (compressErr) {
              console.warn("Compression routine bypassed:", compressErr);
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

      // Convert comma-separated string back to clean array structure
      const amenitiesArray = amenitiesInput
        ? amenitiesInput.split(',').map(item => item.trim()).filter(item => item !== '')
        : ['wi-fi', 'water supply'];

      // Execute atomic UPDATE query on target properties row
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          title: title.trim(),
          location,
          price_per_semester: Number(pricePerSemester),
          phone_number: phoneNumber.trim(),
          amenities: amenitiesArray,
          map_link: mapLink.trim(), // Sent map link back to database
          image_urls: uploadedUrls,
          is_available: isAvailable
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setSuccessMessage('HOSTEL TELEMETRY DATA UPDATE TRANSACTION COMMITTED SUCCESSFULLY.');
      
      // Delay navigation slightly so user observes success banner
      setTimeout(() => {
        router.push('/post'); 
      }, 1500);

    } catch (err: any) {
      console.error('MUTATION_FAILED_CRITICAL:', err);
      setErrorMessage(err.message || 'Database rejected mutation request.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingInitialData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        RETRIVING CORE STRUCTURAL BLUEPRINTS FOR ROW ID [{id?.toString().slice(0,8)}]...
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 relative z-10 animate-in fade-in zoom-in-95 duration-200">
      
      <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.02)]">
        
        {/* HEADER BRAND BLOCK */}
        <div className="border-b border-white/[0.04] pb-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-cyan-400 font-black tracking-widest uppercase block">// ARCHITECTURE MUTATION MATRIX</span>
            <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" /> Alter Asset Structure
            </h1>
          </div>
          <Link 
            href="/post"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-[9px] font-mono font-bold uppercase text-slate-400 border border-white/[0.08] bg-slate-950 rounded-lg hover:bg-white hover:text-slate-950 transition-all"
          >
            <ArrowLeft className="w-3 h-3" /> Cancel
          </Link>
        </div>

        {/* NOTIFICATION TOAST BARS */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono p-3.5 rounded-xl uppercase tracking-wide">
            ❌ SCHEMA_MUTATION_CRASH: {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono p-3.5 rounded-xl uppercase tracking-wide">
            ⚡ TRANSACTION_COMMITTED: {successMessage}
          </div>
        )}

        {/* INPUT LAYOUT FORM */}
        <form onSubmit={handleUpdateTransaction} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* HOUSE NAME INPUT */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-cyan-400" /> Hostel / House Name
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            {/* SECTOR SELECTION ZONE */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" /> Target Sector Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs font-bold text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer transition-all"
              >
                <option value="Kitere Center">Kitere Center Zone</option>
                <option value="Main Gate Area">Main Gate Area Zone</option>
                <option value="Showground Area">Showground Area Zone</option>
                <option value="Rongo Town">Rongo Town Cluster</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* PRICE DYNAMIC COLUMN INPUT */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-cyan-400" /> Rate per Semester (KES)
              </label>
              <input
                type="number"
                required
                value={pricePerSemester}
                onChange={(e) => setPricePerSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs text-white font-mono focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            {/* CARETAKER CELL CONTACT */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3 text-cyan-400" /> Caretaker Mobile Contact
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs text-white font-mono focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          {/* AMENITIES FIELD DATA STRING CONTAINER */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" /> Infrastructure Amenities <span className="text-slate-600 text-[8px]">(Separate items with commas)</span>
            </label>
            <input
              type="text"
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          {/* GEOGRAPHICAL MAP VECTOR INPUT ROW */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Map className="w-3 h-3 text-cyan-400" /> Satellite Coordinates / Google Plus Code
            </label>
            <input
              type="text"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              placeholder="e.g., -0.863468, 34.761904 or 5JF8+V52 Rongo"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/[0.05] text-xs text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700"
            />
          </div>

          {/* DYNAMIC ACTIVE / ROOM FILLED TOGGLE STATE */}
          <div className="bg-slate-950 border border-white/[0.04] p-4 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-white uppercase block"> Availability Stream</label>
              <span className="text-[10px] font-mono text-slate-500">Uncheck this flag to mark the hostel completely booked / filled up.</span>
            </div>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 rounded border-white/[0.08] bg-slate-900 text-cyan-500 focus:ring-cyan-500 cursor-pointer h-5 w-5Accent"
            />
          </div>

          {/* MANAGING IMAGES CLUSTER CONTROL BLOCK */}
          <div className="space-y-3">
            <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-cyan-400" /> Active Infrastructure Images Matrix
            </label>

            {/* Pre-existing live production image map */}
            {existingImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-white/[0.03]">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-white/[0.08]">
                    <img src={url} alt="Hostel Room Blueprint" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(url)}
                      className="absolute inset-0 bg-red-600/90 text-white text-[9px] font-mono uppercase font-black tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150"
                    >
                      Purge Image Link
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Injection zone for additional imagery uploads */}
            <div className="relative border border-dashed border-white/[0.08] hover:border-cyan-500/40 bg-slate-950 rounded-xl p-5 text-center group cursor-pointer transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewImageFiles(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <p className="text-xs font-mono text-slate-400">
                {newImageFiles && newImageFiles.length > 0 
                  ? `[ STAGED ADDITIONAL IMAGES: ${newImageFiles.length} ]` 
                  : "+ Click or append extra room photos to image matrix array"}
              </p>
            </div>
          </div>

          {/* FINAL TRANSACTION DISPATCH ACTION BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-mono font-black text-xs py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> ENGAGING_DATABASE_WRITE_MUTATION...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Commit Structural Modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </main>
  );
}