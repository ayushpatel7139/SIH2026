"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { analyzeLocalMarket } from "@/lib/market-data";
import SourceBadge from "@/components/common/SourceBadge";
import { useEffect, useState } from "react";
import { MarketAnalysis } from "@/types/market";
import ContextualLoader from "@/components/common/ContextualLoader";
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Store, 
  Target, 
  CircleCheck, 
  TriangleAlert, 
  Info, 
  ChartNoAxesCombined,
  Users,
  Loader2
} from "lucide-react";

export default function MarketAnalysisScreen() {
  const router = useRouter();
  const {
    district,
    village,
    businessCategory,
    businessIdea
  } = useAssessmentStore();

  const [marketData, setMarketData] = useState<MarketAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    setIsAnalyzing(true);
    // Remove artificial timeout, let ContextualLoader handle the minimum time
    const data = analyzeLocalMarket(district, businessCategory, businessIdea);
    setMarketData(data);
  }, [district, businessCategory, businessIdea]);

  const handleLoaderComplete = () => {
    setIsAnalyzing(false);
  };

  const handleContinue = () => {
    router.push("/assessment/roadmap");
  };

  const handleBack = () => {
    router.push("/assessment/capital");
  };
  
  const getOpportunityBg = (level: string) => {
    switch (level) {
      case 'Promising': return 'bg-[var(--success)] text-white';
      case 'Moderate': return 'bg-[var(--primary)] text-white';
      case 'Limited': return 'bg-[var(--warning)] text-white';
      default: return 'bg-[var(--ink)] text-white';
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
    <main className="flex-1 flex flex-col bg-[var(--cream)] relative overflow-hidden fade-in">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-blue-50/50 via-transparent to-transparent -z-10 rounded-bl-full opacity-60"></div>

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-6 sm:px-8 py-10 lg:py-16 relative z-10">
        
        <header className="mb-10 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-4 px-4 py-2 bg-white rounded-full border border-[var(--line)] shadow-sm">
             <div className="flex items-center gap-2">
               <Store className="w-3.5 h-3.5 text-[var(--muted)]" />
               <span className="text-xs font-bold text-[var(--ink)] truncate max-w-[100px]">{displayBusiness}</span>
             </div>
             <div className="w-px h-3 bg-[var(--line)]"></div>
             <div className="flex items-center gap-2">
               <MapPin className="w-3.5 h-3.5 text-[var(--muted)]" />
               <span className="text-xs font-bold text-[var(--ink)] truncate max-w-[100px]">{displayLocation}</span>
             </div>
          </div>
        </header>

        <div className="flex items-center gap-4 mb-6">
           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[var(--line)] flex items-center justify-center flex-shrink-0">
              <ChartNoAxesCombined className="w-6 h-6 text-[var(--primary)]" />
           </div>
           <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
             What's happening in my local market?
           </h1>
        </div>

        <p className="text-lg text-[var(--muted)] font-medium mb-12 leading-relaxed ml-0 sm:ml-16">
          We've analyzed data for {displayLocation} to understand your true potential.
        </p>

        {isAnalyzing ? (
          <ContextualLoader 
            steps={[
              { text: "Understanding your local market...", subtext: "Reviewing district data" },
              { text: "Analyzing business category...", subtext: "Checking current trends" }
            ]}
            stepDuration={1200}
            onComplete={handleLoaderComplete}
          />
        ) : (
          <>
          <div className="ml-0 sm:ml-16 space-y-8 slide-up">
            
            {/* BIG CENTRAL INSIGHT */}
            <div className={`${getOpportunityBg(marketData.opportunityLevel)} rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500`}>
             
             <div className="relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full mb-6">
                 <Target className="w-4 h-4 text-white" />
                 <span className="text-xs font-bold uppercase tracking-widest text-white">Market Opportunity</span>
               </div>
               
               <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter mb-4 text-white">
                 {marketData.opportunityLevel}
               </h2>
               
               <p className="text-lg sm:text-xl font-medium text-white/90 mb-8 max-w-lg leading-relaxed">
                 {getOpportunityHeadline(marketData.opportunityLevel)}
               </p>

               <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6 mt-6">
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">Estimated Reach</p>
                   <p className="text-xl font-bold text-white flex items-center gap-2"><Users className="w-4 h-4" /> {marketData.estimatedReach}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">Demand Signal</p>
                   <p className="text-xl font-bold text-white flex items-center gap-2"><ChartNoAxesCombined className="w-4 h-4" /> {marketData.demandSignal}</p>
                 </div>
               </div>
             </div>
          </div>

          {/* TWO COLUMN EVIDENCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Demand Evidence */}
            <div className="card-standard p-8">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-[var(--ink)]">How strong is demand?</h3>
                 <span className={`px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full ${
                   marketData.localDemandLevel === 'High' ? 'bg-green-100 text-[var(--success)]' :
                   marketData.localDemandLevel === 'Medium' ? 'bg-blue-100 text-[var(--primary)]' :
                   'bg-amber-100 text-[var(--warning)]'
                 }`}>
                   {marketData.localDemandLevel}
                 </span>
               </div>
               <p className="text-base text-[var(--muted)] font-medium leading-relaxed">
                 {marketData.demandExplanation}
               </p>
            </div>

            {/* Competition Evidence */}
            <div className="card-standard p-8">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-[var(--ink)]">How crowded is the market?</h3>
                 <span className="px-3 py-1 bg-slate-100 text-[var(--ink)] font-bold text-[10px] rounded-full uppercase tracking-wider">
                   {marketData.competitionLevel}
                 </span>
               </div>
               
               <div className="flex items-center gap-4 mb-4">
                 <div className="text-4xl font-extrabold tracking-tighter text-[var(--ink)]">{marketData.nearbyBusinesses}</div>
                 <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Similar<br/>Businesses</div>
               </div>
               
               <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                 {marketData.competitionExplanation}
               </p>
            </div>

          </div>

          {/* Market Signals */}
          <div className="card-standard p-8">
             <h3 className="text-lg font-bold text-[var(--ink)] mb-6">What this means for you</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               {marketData.signals.map((signal, idx) => (
                 <div key={idx} className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-50 border border-[var(--line)]">
                   <div className="flex-shrink-0">
                     {signal.type === 'positive' ? <CircleCheck className="w-6 h-6 text-[var(--success)]" /> : 
                      signal.type === 'warning' ? <TriangleAlert className="w-6 h-6 text-[var(--warning)]" /> : 
                      <Info className="w-6 h-6 text-[var(--primary)]" />}
                   </div>
                   <p className="text-sm font-bold text-[var(--ink)] leading-relaxed">
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

        <div className="mt-8 ml-0 sm:ml-16 pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)] font-medium hidden sm:block">Analysis complete</p>
          <button
            onClick={handleContinue}
            className="primary-button btn-lg w-full sm:w-auto"
          >
            Can I financially manage this? <ArrowRight className="btn-icon ml-1" />
          </button>
        </div>
        </>
        )}

      </div>
    </main>
  );
}
