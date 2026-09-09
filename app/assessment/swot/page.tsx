"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { analyzeLocalMarket } from "@/lib/market-data";
import { calculateFinancials, formatCurrency } from "@/lib/calculator";
import { generateRiskAnalysis, RiskAnalysis } from "@/lib/feasibility";
import SourceBadge from "@/components/common/SourceBadge";
import SwotQuadrant from "@/components/results/SwotQuadrant";
import RiskCard from "@/components/results/RiskCard";
import { useEffect, useState } from "react";
import { 
  ArrowRight, 
  ArrowLeft, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert,
  Store
} from "lucide-react";

export default function SwotScreen() {
  const router = useRouter();
  const {
    businessCategory,
    businessIdea,
    village,
    district,
    previousBusinessExperience,
    ownInvestment,
    existingLoanPayment
  } = useAssessmentStore();

  const [riskData, setRiskData] = useState<RiskAnalysis | null>(null);

  useEffect(() => {
    const market = analyzeLocalMarket(district, businessCategory, businessIdea);
    const financials = calculateFinancials(businessCategory, ownInvestment, existingLoanPayment);
    
    const analysis = generateRiskAnalysis(
      businessCategory,
      businessIdea,
      previousBusinessExperience,
      market.opportunityLevel,
      market.competitionLevel,
      financials.repaymentRisk,
      financials.fundingGap
    );

    setRiskData(analysis);
  }, [district, village, businessCategory, businessIdea, previousBusinessExperience, ownInvestment, existingLoanPayment]);

  const handleContinue = () => {
    router.push("/assessment/result");
  };

  const handleBack = () => {
    router.push("/assessment/roadmap");
  };

  if (!riskData) return null; 

  const displayLocation = village && district ? `${village}, ${district}` : district || 'Your location';
  const displayBusiness = businessIdea || businessCategory || 'Selected business';

  return (
    <main className="flex-1 flex flex-col bg-[var(--cream)] relative overflow-hidden fade-in">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-50/50 via-transparent to-transparent -z-10 rounded-bl-full"></div>

      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 sm:px-8 py-10 lg:py-16 relative z-10">
        
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
              <ShieldAlert className="w-6 h-6 text-[var(--warning)]" />
           </div>
           <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
             What are the risks?
           </h1>
        </div>
        
        <p className="text-lg text-[var(--muted)] font-medium mb-12 leading-relaxed max-w-2xl ml-0 sm:ml-16">
          Every business faces challenges. Understanding your strengths and potential threats is key to preparation.
        </p>

        <div className="ml-0 sm:ml-16 space-y-16 slide-up">
          
          {/* 1. Business Snapshot */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-standard p-6">
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-3 flex items-center gap-2"><Target className="w-3 h-3 text-[var(--primary)]"/> Market</p>
              <p className="font-extrabold text-lg text-[var(--ink)] tracking-tight">{riskData.marketOpportunity}</p>
            </div>
            <div className="card-standard p-6">
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-3 flex items-center gap-2"><TrendingUp className="w-3 h-3 text-orange-500"/> Competition</p>
              <p className="font-extrabold text-lg text-[var(--ink)] tracking-tight">{riskData.competitionLevel}</p>
            </div>
            <div className="card-standard p-6">
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-red-500"/> Repayment</p>
              <p className="font-extrabold text-lg text-[var(--ink)] tracking-tight">{riskData.repaymentBurden}</p>
            </div>
            <div className="card-standard p-6">
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-3 flex items-center gap-2"><Lightbulb className="w-3 h-3 text-[var(--success)]"/> Gap</p>
              <p className="font-extrabold text-lg text-[var(--ink)] tracking-tight">{formatCurrency(riskData.capitalGap)}</p>
            </div>
          </div>

          {/* 2. Actionable Analysis (Swot Replacement) */}
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--ink)] mb-8 tracking-tight">What's working & What could help</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <SwotQuadrant title="Strengths" type="strength" insights={riskData.swot.strengths} />
              <SwotQuadrant title="Opportunities" type="opportunity" insights={riskData.swot.opportunities} />
            </div>
            
            <div className="w-full h-px bg-[var(--line)] my-12"></div>
            
            <h2 className="text-2xl font-extrabold text-[var(--ink)] mb-8 tracking-tight">What needs attention</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SwotQuadrant title="Weaknesses" type="weakness" insights={riskData.swot.weaknesses} />
              <SwotQuadrant title="Risks" type="threat" insights={riskData.swot.threats} />
            </div>
          </div>

          {/* 3. Top Risks */}
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--ink)] mb-8 tracking-tight">3 things we would watch before investing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {riskData.topRisks.map((risk, idx) => (
                <RiskCard key={idx} riskData={risk} index={idx + 1} />
              ))}
            </div>
          </div>

          {/* 4. Risk Level & What to do next */}
          <div className="bg-[var(--ink)] rounded-3xl p-8 md:p-12 shadow-xl flex flex-col lg:flex-row gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="flex-1 relative z-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-12">
              <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-2">
                <Target className="w-4 h-4"/> Risk Signal
              </h3>
              
              <div className="mb-6">
                 <span className={`inline-flex px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest border ${
                   riskData.overallRisk === 'LOW RISK' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' :
                   riskData.overallRisk === 'MODERATE RISK' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' :
                   'bg-red-900/30 text-red-400 border-red-500/30'
                 }`}>
                   {riskData.overallRisk}
                 </span>
              </div>
              
              <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-xs">
                This is an advisory signal based on the assessment, not a formal credit decision.
              </p>
            </div>
            
            <div className="flex-[2] relative z-10">
              <h3 className="text-sm font-extrabold tracking-tight text-white mb-6">Before You Commit</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <p className="font-bold text-white text-base">Validate local demand</p>
                    <p className="text-sm text-slate-400 font-medium mt-1 leading-relaxed">Speak to at least 10 potential customers in your area before investing.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <p className="font-bold text-white text-base">Keep enough working capital</p>
                    <p className="text-sm text-slate-400 font-medium mt-1 leading-relaxed">Don't spend all your funds on setup; keep cash for the first few slow months.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <p className="font-bold text-white text-base">Compare financing options</p>
                    <p className="text-sm text-slate-400 font-medium mt-1 leading-relaxed">Check if you qualify for subsidies before accepting a standard commercial loan.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div className="mt-12 flex justify-end">
          <SourceBadge 
            source="Assessment Engine" 
            date="September 2026" 
            confidence="Medium" 
            isDemo={true} 
          />
        </div>

        <div className="mt-8 ml-0 sm:ml-16 pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)] font-medium hidden sm:block">Step 7 of 8</p>
          <button
            onClick={handleContinue}
            className="primary-button btn-lg w-full sm:w-auto shadow-lg shadow-orange-500/20 hover:-translate-y-1"
          >
            Is this business feasible? <ArrowRight className="btn-icon ml-1" />
          </button>
        </div>

      </div>
    </main>
  );
}
