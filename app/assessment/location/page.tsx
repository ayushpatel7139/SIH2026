"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { MapPin, Search, ArrowRight, Navigation, Map, CircleCheck } from "lucide-react";

export default function LocationScreen() {
  const router = useRouter();
  const { setLocation, village, district, state } = useAssessmentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const hasLocation = village || district || state;

  const handleSearch = () => {
    if (!searchQuery) return;
    // Simulate lookup
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
    <main className="flex-1 flex flex-col bg-[var(--cream)] relative overflow-hidden fade-in">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-50 via-transparent to-transparent -z-10 rounded-bl-full opacity-60"></div>
      
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 sm:px-8 py-12 lg:py-24">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)] mb-4">
            Where am I?
          </h1>
          <p className="text-lg text-[var(--muted)] font-medium max-w-2xl leading-relaxed">
            Your location helps us analyze local market demand, competition, and identify government schemes available in your district.
          </p>
        </div>

        <div className="flex-1 w-full max-w-2xl">
          {!hasLocation ? (
            <div className="space-y-6 slide-up">
              <div>
                <label className="premium-label" htmlFor="location-search">
                  Search by village, town or district
                </label>
                <span className="helper-text">
                  Enter your area to fetch local schemes and market data.
                </span>
                
                <div className="relative flex items-center shadow-sm group mt-2">
                  <Search className="absolute left-6 w-6 h-6 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                  <input 
                    id="location-search"
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="e.g., Bopal, Ahmedabad"
                    className="input-standard py-6 pl-16 pr-36 rounded-2xl text-xl font-medium shadow-sm"
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={!searchQuery.trim()}
                    className="absolute right-3 primary-button !h-10 !px-6"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-[var(--line)]"></div>
                <span className="text-[var(--muted)] text-xs font-bold tracking-widest uppercase">OR</span>
                <div className="flex-1 h-px bg-[var(--line)]"></div>
              </div>

              <button 
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="secondary-button btn-lg w-full bg-slate-50 border-2"
              >
                <Navigation className="w-5 h-5 text-[var(--action)]" /> 
                {isLocating ? "Detecting location..." : "Use my current location"}
              </button>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="card-standard p-8 md:p-10 !border-2 !border-[var(--success)] shadow-lg shadow-green-100 relative overflow-hidden flex flex-col md:flex-row md:items-center gap-8">
                {/* Decorative map background hint */}
                <div className="absolute right-0 bottom-0 opacity-5 w-64 h-64 pointer-events-none transform translate-x-12 translate-y-12">
                   <Map className="w-full h-full" />
                </div>
                
                <div className="w-20 h-20 rounded-2xl bg-green-50 text-[var(--success)] flex items-center justify-center flex-shrink-0 relative z-10 border border-green-100">
                  <CircleCheck className="w-10 h-10" />
                </div>
                
                <div className="relative z-10 flex-1">
                  <h3 className="text-xs font-bold text-[var(--success)] mb-2 tracking-widest uppercase">Location Confirmed</h3>
                  <div className="text-4xl font-extrabold text-[var(--ink)] mb-2 tracking-tight">
                    {village}, {state}
                  </div>
                  <div className="text-[var(--muted)] text-lg font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {district} District
                  </div>
                  
                  <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-[var(--line)] text-sm font-medium text-[var(--ink)]">
                    Location confirmed. We will use this location to understand your local market.
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button
                  className="primary-button btn-lg shadow-lg shadow-orange-500/20 hover:-translate-y-1 w-full sm:w-auto"
                  onClick={handleContinue}
                >
                  Enter your profile details <ArrowRight className="btn-icon ml-1" />
                </button>
                <button 
                  onClick={() => setLocation({ village: null, district: null, state: null })}
                  className="text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] underline underline-offset-4"
                >
                  Change location
                </button>
              </div>
              
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
