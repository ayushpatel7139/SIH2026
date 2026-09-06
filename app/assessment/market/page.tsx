"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { analyzeLocalMarket } from "@/lib/market-data";
import SourceBadge from "@/components/common/SourceBadge";
import { useEffect, useState } from "react";
import { MarketAnalysis } from "@/types/market";
import { ArrowRight, ArrowLeft, MapPin, Store, Target, Users, TrendingUp, CheckCircle, AlertTriangle, Info, ChartNoAxesCombined } from "lucide-react";

export default function MarketAnalysisScreen() {
  const router = useRouter();
  const {
    district,
    village,
    businessCategory,
    businessIdea
  } = useAssessmentStore();

  const [marketData, setMarketData] = useState<MarketAnalysis | null>(null);

  useEffect(() => {
    const data = analyzeLocalMarket(district, businessCategory, businessIdea);
    setMarketData(data);
  }, [district, businessCategory, businessIdea]);

  const handleContinue = () => {
    router.push("/assessment/roadmap");
  };

  const handleBack = () => {
    router.push("/assessment/capital");
  };

  const getOpportunityColor = (level: string) => {
    switch (level) {
      case 'Promising': return 'text-[var(--success)]';
      case 'Moderate': return 'text-[var(--primary)]';
      case 'Limited': return 'text-[var(--action)]';
      default: return 'text-[var(--ink)]';
    }
  };
  
  const getOpportunityBg = (level: string) => {
    switch (level) {
      case 'Promising': return 'bg-emerald-900';
      case 'Moderate': return 'bg-blue-900';
      case 'Limited': return 'bg-orange-900';
      default: return 'bg-slate-900';
    }
  };

  const getOpportunityHeadline = (level: string) => {
     switch(level) {
        case 'Promising': return "Strong potential for success.";
        case 'Moderate': return "A viable opportunity with standard risks.";
        case 'Limited': return "Proceed with caution.";
        default: return "Analysis complete.";
     }
  }

  if (!marketData) return null; 

  const displayLocation = village && district ? `${village}, ${district}` : district || 'Your location';
  const displayBusiness = businessIdea || businessCategory || 'Selected business';

  return (
    <main className="welcome-page min-h-screen bg-[var(--cream)] relative overflow-hidden flex flex-col fade-in">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-blue-50 via-transparent to-transparent -z-10 opacity-60"></div>

      <div className="welcome-container p-6 sm:p-8 lg:p-12 flex-1 flex flex-col relative z-10 max-w-5xl mx-auto">
        
        <header className="mb-12">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Budget
          </button>
        </header>

        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[var(--line)] flex items-center justify-center flex-shrink-0">
                 <ChartNoAxesCombined className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                 <div className="text-[10px] font-bold tracking-widest text-[var(--primary)] uppercase mb-1">Market Analysis</div>
                 <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
                   What the local market is telling us.
                 </h1>
              </div>
           </div>
        </div>

        {/* Selected Context Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10 px-6 py-4 bg-white rounded-2xl border border-[var(--line)] shadow-sm">
           <div className="flex items-center gap-3">
             <MapPin className="w-4 h-4 text-[var(--muted)]" />
             <span className="text-sm font-bold text-[var(--ink)]">{displayLocation}</span>
           </div>
           <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
           <div className="flex items-center gap-3">
             <Store className="w-4 h-4 text-[var(--muted)]" />
             <span className="text-sm font-bold text-[var(--ink)]">{displayBusiness}</span>
           </div>
        </div>

        {/* THE INSIGHT LAYOUT */}
        <div className="space-y-6">
          
          {/* BIG CENTRAL INSIGHT */}
          <div className={`${getOpportunityBg(marketData.opportunityLevel)} rounded-[2rem] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden`}>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
             
             <div className="relative z-10 max-w-2xl">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-6 backdrop-blur-sm">
                 <Target className="w-4 h-4 text-white/80" />
                 <span className="text-xs font-bold uppercase tracking-widest text-white/90">Market Opportunity</span>
               </div>
               
               <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tighter mb-4">
                 {marketData.opportunityLevel}
               </h2>
               
               <p className="text-xl sm:text-2xl font-medium text-white/80 mb-10">
                 {getOpportunityHeadline(marketData.opportunityLevel)}
               </p>

               <div className="flex flex-wrap gap-8 border-t border-white/10 pt-8">
                 <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Estimated Reach</p>
                   <p className="text-2xl font-bold">{marketData.estimatedReach}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Demand Signal</p>
                   <p className="text-2xl font-bold">{marketData.demandSignal}</p>
                 </div>
               </div>
             </div>
          </div>

          {/* TWO COLUMN EVIDENCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Competition Evidence */}
            <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-extrabold tracking-tight text-[var(--ink)]">Nearby Competition</h3>
                 <span className="px-3 py-1 bg-slate-100 text-[var(--ink)] font-bold text-[10px] rounded-full uppercase tracking-wider">
                   {marketData.competitionLevel}
                 </span>
               </div>
               
               <div className="flex items-end gap-3 mb-6">
                 <div className="text-5xl font-extrabold tracking-tighter text-[var(--ink)] leading-none">{marketData.nearbyBusinesses}</div>
                 <div className="text-sm font-medium text-[var(--muted)] pb-1">similar businesses <br/>identified nearby</div>
               </div>
               
               <p className="text-base text-[var(--ink)] font-medium leading-relaxed p-4 bg-slate-50 rounded-2xl">
                 {marketData.competitionExplanation}
               </p>
            </div>

            {/* Demand Evidence */}
            <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-extrabold tracking-tight text-[var(--ink)]">Local Demand</h3>
                 <span className={`px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full ${
                   marketData.localDemandLevel === 'High' ? 'bg-green-100 text-[var(--success)]' :
                   marketData.localDemandLevel === 'Medium' ? 'bg-blue-100 text-[var(--primary)]' :
                   'bg-amber-100 text-[var(--warning)]'
                 }`}>
                   {marketData.localDemandLevel}
                 </span>
               </div>
               
               <p className="text-lg text-[var(--ink)] font-medium leading-relaxed">
                 {marketData.demandExplanation}
               </p>
            </div>

          </div>

          {/* Market Signals */}
          <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
             <h3 className="text-sm font-extrabold tracking-tight text-[var(--ink)] mb-6">Signals we're watching</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               {marketData.signals.map((signal, idx) => (
                 <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl border border-[var(--line)] bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                   <div className="flex-shrink-0">
                     {signal.type === 'positive' ? <CheckCircle className="w-6 h-6 text-[var(--success)]" /> : 
                      signal.type === 'warning' ? <AlertTriangle className="w-6 h-6 text-[var(--warning)]" /> : 
                      <Info className="w-6 h-6 text-[var(--primary)]" />}
                   </div>
                   <p className="text-sm font-bold text-[var(--ink)] leading-snug">
                     {signal.message}
                   </p>
                 </div>
               ))}
             </div>
          </div>

        </div>

        {/* Data Sources */}
        <div className="mt-8 flex justify-end">
          <SourceBadge 
            source="Government & local market data" 
            date="September 2026" 
            confidence="Medium" 
            isDemo={true} 
          />
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            onClick={handleContinue}
            className="primary-button w-full sm:w-auto px-10 py-5 text-lg"
          >
            See Financial Plan <ArrowRight className="w-6 h-6 ml-2" />
          </button>
        </div>

      </div>
    </main>
  );
}
