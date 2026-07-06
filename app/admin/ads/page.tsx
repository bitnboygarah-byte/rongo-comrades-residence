'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Megaphone, Briefcase, Phone, Upload, Film, ImageIcon, Loader2, Layers, Trash2, ExternalLink } from 'lucide-react';
export const dynamic = 'force-dynamic';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
);

export default function RongoStayAdAdminPage() {
  // Input fields tracking states
  const [businessName, setBusinessName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [adFile, setAdFile] = useState<File | null>(null);
  const [isVideo, setIsVideo] = useState(false);

  // Live feed states
  const [adsFeed, setAdsFeed] = useState<any[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  // Operation status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Lifecycle execution: Pull current database rows on mount
  useEffect(() => {
    fetchActiveAds();
  }, []);

  const fetchActiveAds = async () => {
    try {
      setIsLoadingFeed(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdsFeed(data || []);
    } catch (err: any) {
      console.error("FEED_FETCH_ERROR:", err);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setAdFile(selectedFile);
      
      if (selectedFile.type.startsWith('video/')) {
        setIsVideo(true);
      } else {
        setIsVideo(false);
      }
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!businessName || !serviceType || !phoneNumber || !adFile) {
        throw new Error('Please append all required fields including business classification tags.');
      }

      let generatedPublicUrl = '';

      const fileExt = adFile.name.split('.').pop();
      const uniqueFileName = `${Math.random()}_${Date.now()}.${fileExt}`;
      const storageFilePath = `campaigns/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('ads')
        .upload(storageFilePath, adFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('ads')
        .getPublicUrl(storageFilePath);

      generatedPublicUrl = publicUrl;

      const { error: databaseError } = await supabase
        .from('advertisements')
        .insert([
          {
            business_name: businessName.trim(),
            service_type: serviceType.trim(),
            phone_number: phoneNumber.trim(),
            media_url: generatedPublicUrl,
            is_video: isVideo,
            is_active: true
          }
        ]);

      if (databaseError) throw databaseError;

      setSuccessMessage(`CAMPAIGN FOR "${businessName.toUpperCase()}" STASHED AND DEPLOYED LIVE SUCCESSFULLY.`);
      setBusinessName('');
      setServiceType('');
      setPhoneNumber('');
      setAdFile(null);
      setIsVideo(false);

      // Instantly refresh list feed to show the newly added ad
      fetchActiveAds();

    } catch (err: any) {
      console.error("FULL_SUPABASE_RAW_ERROR:", JSON.stringify(err, null, 2));
      setErrorMessage(err.message || 'Database pipeline delivery anomaly triggered.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Terminate Action: Destroys targeted row item from table
  const handleDeleteAd = async (id: string) => {
    if (!window.confirm("Are you absolutely sure you want to terminate this live advertisement campaign?")) return;
    
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Filter out deleted row from local state instantly for lightning-fast UI feel
      setAdsFeed(prev => prev.filter(ad => ad.id !== id));
      setSuccessMessage("AD UNIT DECOMMISSIONED AND REMOVED FROM DIRECTORY FEED.");
    } catch (err: any) {
      console.error("TERMINATION_FAILED:", err);
      alert(`Could not delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-6 sm:p-12 antialiased">
      
      {/* Header Area without the Back Button */}
      <header className="max-w-xl mx-auto mb-8 border-b border-white/[0.05] pb-4">
        <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest block">// MARKETING NODE</span>
        <h1 className="text-xl font-black text-white uppercase tracking-tight">Campaign Portal</h1>
      </header>

      {/* Main Container */}
      <main className="max-w-xl mx-auto space-y-10">
        <section className="bg-slate-900 border border-white/[0.05] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3">
            <Megaphone className="w-4 h-4 text-cyan-400" />
            <h2 className="font-bold text-xs tracking-wide uppercase font-mono text-white">Create Ad Unit</h2>
          </div>

          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono p-3 rounded-xl uppercase tracking-wide">
              ❌ SYSTEM_ERROR: {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono p-3 rounded-xl uppercase tracking-wide">
              🎉 SUCCESS: {successMessage}
            </div>
          )}

          <form onSubmit={handleCreateAd} className="space-y-4 text-xs">
            
            {/* Input 1: Business Identification */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-slate-400 font-mono text-[9px] uppercase font-bold">Business Name</label>
              <div className="flex items-center bg-slate-950 border border-white/[0.06] rounded-xl px-3 py-2.5 focus-within:border-cyan-500/50 transition-all">
                <Briefcase className="w-4 h-4 text-slate-600 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g., Kitere Gas Delivery"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="bg-transparent w-full text-white placeholder-slate-700 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Input 2: Service Type / Classification */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-slate-400 font-mono text-[9px] uppercase font-bold">Service Type</label>
              <div className="flex items-center bg-slate-950 border border-white/[0.06] rounded-xl px-3 py-2.5 focus-within:border-cyan-500/50 transition-all">
                <Layers className="w-4 h-4 text-slate-600 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g., gas delivery and refill"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="bg-transparent w-full text-white placeholder-slate-700 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Input 3: Lead Routing Number */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-slate-400 font-mono text-[9px] uppercase font-bold">WhatsApp Contact Phone</label>
              <div className="flex items-center bg-slate-950 border border-white/[0.06] rounded-xl px-3 py-2.5 focus-within:border-cyan-500/50 transition-all">
                <Phone className="w-4 h-4 text-slate-600 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g., 0718772190"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-transparent w-full text-white placeholder-slate-700 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            {/* Input 4: File Picker */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-slate-400 font-mono text-[9px] uppercase font-bold">Campaign Media File Blueprint</label>
              <div className="relative border border-dashed border-white/[0.08] hover:border-cyan-500/40 bg-slate-950 rounded-xl p-6 text-center group cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  required={!adFile}
                />
                <Upload className="w-5 h-5 mx-auto text-slate-500 group-hover:text-cyan-400 mb-2 transition-colors" />
                <p className="text-xs font-mono text-slate-400">
                  {adFile 
                    ? `[ STAGED ASSET: ${adFile.name} ]` 
                    : "Click or drag files here to pull poster graphic or video loop"}
                </p>
                <p className="text-[8px] font-mono text-slate-600 uppercase mt-1">supports jpg, png, mp4 structures</p>
              </div>
            </div>

            {/* Content Format Toggle Switch Container */}
            <div className="bg-slate-950 border border-white/[0.04] p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isVideo ? <Film className="w-4 h-4 text-teal-400" /> : <ImageIcon className="w-4 h-4 text-cyan-400" />}
                <div>
                  <p className="font-mono text-[9px] font-bold text-slate-300 uppercase">Media Content Format</p>
                  <p className="text-[8px] text-slate-500">Auto-detected or toggle manually for video files.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVideo(!isVideo)}
                className={`w-10 h-5 rounded-full p-0.5 transition-all duration-300 focus:outline-none ${isVideo ? 'bg-teal-500' : 'bg-slate-800'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${isVideo ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-mono font-black py-3 rounded-xl transition-all uppercase tracking-wider mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> DISPATCHING_CAMPAIGN_NODE...
                </>
              ) : (
                "LAUNCH CAMPAIGN LIVE"
              )}
            </button>
          </form>
        </section>

        {/* LIVE ACTIVE CAMPAIGN FEED TRACKER */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
            <h2 className="font-mono font-black text-xs text-slate-400 uppercase tracking-widest">// CURRENT ACTIVE ROSTER ({adsFeed.length})</h2>
            {isLoadingFeed && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
          </div>

          {adsFeed.length === 0 && !isLoadingFeed ? (
            <div className="bg-slate-900 border border-white/[0.03] text-slate-600 rounded-xl p-8 text-center font-mono text-xs uppercase">
              No live campaign segments running across nodes currently.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {adsFeed.map((ad) => (
                <div 
                  key={ad.id} 
                  className="bg-slate-900 border border-white/[0.05] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all hover:border-white/[0.1]"
                >
                  {/* Left Column: Core Info & Asset Thumbnail Block */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-16 h-12 bg-slate-950 rounded-lg overflow-hidden border border-white/[0.06] flex-shrink-0 flex items-center justify-center relative group">
                      {ad.is_video ? (
                        <video src={ad.media_url} className="w-full h-full object-cover" muted loop playsInline />
                      ) : (
                        <img src={ad.media_url} alt="" className="w-full h-full object-cover" />
                      )}
                      <a 
                        href={ad.media_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                      </a>
                    </div>
                    
                    <div className="text-xs">
                      <h3 className="font-black text-white uppercase tracking-tight">{ad.business_name}</h3>
                      <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-wider">{ad.service_type}</p>
                      <p className="text-slate-500 font-mono text-[9px] mt-0.5">Routing: {ad.phone_number}</p>
                    </div>
                  </div>

                  {/* Right Column: Delete Terminate Trigger */}
                  <button
                    onClick={() => handleDeleteAd(ad.id)}
                    disabled={deletingId === ad.id}
                    className="w-full sm:w-auto border border-rose-500/20 hover:bg-rose-500/10 text-rose-400 px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono font-bold text-[10px] tracking-wide uppercase"
                  >
                    {deletingId === ad.id ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> TERMINATING...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3 h-3" /> Terminate Ad
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

    </div>
  );
}