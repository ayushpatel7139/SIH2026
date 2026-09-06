"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { MapPin, Search, ArrowRight, ArrowLeft, Navigation, Map } from "lucide-react";

export default function LocationScreen() {
  const router = useRouter();
  const { setLocation, village, district, state } = useAssessmentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const hasLocation = village || district || state;

  const handleSearch = () => {
    if (!searchQuery) return;
    setLocation({
      village: searchQuery,
      district: "Ahmedabad",
      state: "Gujarat",
      latitude: 23.0225,
      longitude: 72.5714,
    });
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setLocation({
        village: "Bopal",
        district: "Ahmedabad",
        state: "Gujarat",
        latitude: 23.0333,
        longitude: 72.4667,
      });
      setIsLocating(false);
    }, 1000);
  };

  const handleContinue = () => {
    router.push("/assessment/profile");
  };

  return (
    <main className="welcome-page fade-in bg-[var(--cream)] min-h-screen relative overflow-hidden flex flex-col">
      {/* Decorative abstract background element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-slate-200 via-transparent to-transparent -z-10 rounded-bl-full opacity-30"></div>
      
      <div className="welcome-container p-6 sm:p-8 lg:p-12 flex-1 flex flex-col relative z-10">
        <header className="mb-12">
          <button 
            onClick={() => router.push("/")}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </header>

        <section className="flex-1 max-w-3xl mx-auto w-full flex flex-col justify-center">
          
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[var(--line)] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[var(--primary)]" />
             </div>
             <div>
                <div className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-1">Step 1 of 4</div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
                  Where will your business operate?
                </h1>
             </div>
          </div>
          
          <p className="text-lg text-[var(--muted)] font-medium mb-12 leading-relaxed ml-16 max-w-xl">
            Your location helps us understand nearby demand, competition, and local market conditions.
          </p>

          <div className="ml-16">
            {!hasLocation ? (
              <div className="space-y-6 max-w-xl">
                <div className="relative flex items-center shadow-sm group">
                  <Search className="absolute left-5 w-5 h-5 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter your village, town or district"
                    className="w-full py-5 pl-14 pr-32 rounded-2xl border-2 border-[var(--line)] bg-white focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)] text-lg font-medium transition-all"
                  />
                  <button 
                    onClick={handleSearch}
                    className="absolute right-2 px-6 py-3 bg-[var(--ink)] hover:bg-black text-white rounded-xl font-bold text-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    Search
                  </button>
                </div>

                <div className="flex items-center gap-4 py-2 opacity-60">
                  <div className="flex-1 h-px bg-slate-300"></div>
                  <span className="text-[var(--muted)] text-xs font-bold tracking-widest uppercase">OR</span>
                  <div className="flex-1 h-px bg-slate-300"></div>
                </div>

                <button 
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="w-full py-5 rounded-2xl border-2 border-[var(--line)] text-[var(--ink)] font-bold flex items-center justify-center gap-3 hover:bg-white hover:border-slate-300 transition-all disabled:opacity-50 bg-slate-50 hover:shadow-sm"
                >
                  <Navigation className="w-5 h-5 text-[var(--action)]" /> 
                  {isLocating ? "Detecting location..." : "Use my current location"}
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
                
                <div className="p-8 rounded-3xl bg-white border-2 border-[var(--primary)] shadow-md relative overflow-hidden flex items-start gap-6">
                  {/* Decorative map background hint */}
                  <div className="absolute right-0 bottom-0 opacity-5 w-48 h-48 pointer-events-none transform translate-x-12 translate-y-12">
                     <Map className="w-full h-full" />
                  </div>
                  
                  <div className="w-14 h-14 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center flex-shrink-0 relative z-10 border border-blue-100">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-[var(--primary)] mb-2 tracking-widest uppercase">Location Confirmed</h3>
                    <div className="text-3xl font-extrabold text-[var(--ink)] mb-2 tracking-tight">
                      {village}, {state}
                    </div>
                    <div className="text-[var(--muted)] text-base font-medium">
                      {district} District
                    </div>
                    
                    <button 
                      onClick={() => setLocation({ village: null, district: null, state: null })}
                      className="mt-6 text-sm font-bold text-[var(--action)] hover:text-[var(--action-hover)] underline underline-offset-4"
                    >
                      Change location
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    className="primary-button w-full sm:w-auto px-10 py-4 text-lg"
                    onClick={handleContinue}
                  >
                    Continue <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
                
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
