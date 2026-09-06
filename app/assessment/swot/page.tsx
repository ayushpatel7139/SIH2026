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
import { ArrowRight, ArrowLeft, Target, TrendingUp, AlertTriangle, Lightbulb, MapPin, CheckCircle2, ShieldAlert } from "lucide-react";

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
    <main className="welcome-page min-h-screen bg-[var(--cream)] relative overflow-hidden flex flex-col fade-in">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-50 via-transparent to-transparent -z-10 opacity-70"></div>

      <div className="welcome-container p-6 sm:p-8 lg:p-12 flex-1 flex flex-col relative z-10 max-w-5xl mx-auto">
        
        <header className="mb-12">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Financial Plan
          </button>
        </header>

        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[var(--line)] flex items-center justify-center flex-shrink-0">
                 <ShieldAlert className="w-5 h-5 text-[var(--warning)]" />
              </div>
              <div>
                 <div className="text-[10px] font-bold tracking-widest text-[var(--warning)] uppercase mb-1">Risk Assessment</div>
                 <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
                   Risks & Potential
                 </h1>
              </div>
           </div>
        </div>
        
        <p className="text-lg text-[var(--muted)] font-medium mb-10 leading-relaxed max-w-2xl">
          Before you invest or borrow, here's what could work in your favor—and what needs attention.
        </p>

        {/* Selected Context Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12 px-6 py-4 bg-white rounded-2xl border border-[var(--line)] shadow-sm">
           <div className="flex items-center gap-3">
             <Lightbulb className="w-4 h-4 text-[var(--muted)]" />
             <span className="text-sm font-bold text-[var(--ink)]">{displayBusiness}</span>
           </div>
           <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
           <div className="flex items-center gap-3">
             <MapPin className="w-4 h-4 text-[var(--muted)]" />
             <span className="text-sm font-bold text-[var(--ink)]">{displayLocation}</span>
           </div>
        </div>

        {/* 1. Business Snapshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm">
            <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-3 flex items-center gap-2"><Target className="w-3 h-3 text-[var(--primary)]"/> Market</p>
            <p className="font-extrabold text-lg text-[var(--ink)] tracking-tight">{riskData.marketOpportunity}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm">
            <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-3 flex items-center gap-2"><TrendingUp className="w-3 h-3 text-orange-500"/> Competition</p>
            <p className="font-extrabold text-lg text-[var(--ink)] tracking-tight">{riskData.competitionLevel}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm">
            <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-red-500"/> Repayment</p>
            <p className="font-extrabold text-lg text-[var(--ink)] tracking-tight">{riskData.repaymentBurden}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm">
            <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-3 flex items-center gap-2"><Lightbulb className="w-3 h-3 text-[var(--success)]"/> Gap</p>
            <p className="font-extrabold text-lg text-[var(--ink)] tracking-tight">{formatCurrency(riskData.capitalGap)}</p>
          </div>
        </div>

        {/* 2. SWOT Analysis */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-[var(--ink)] mb-8 tracking-tight">What's working & What could help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <SwotQuadrant title="Strengths" type="strength" insights={riskData.swot.strengths} />
            <SwotQuadrant title="Opportunities" type="opportunity" insights={riskData.swot.opportunities} />
          </div>
          
          <div className="w-full h-px bg-slate-200 my-12"></div>
          
          <h2 className="text-2xl font-extrabold text-[var(--ink)] mb-8 tracking-tight">What needs attention</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SwotQuadrant title="Weaknesses" type="weakness" insights={riskData.swot.weaknesses} />
            <SwotQuadrant title="Risks" type="threat" insights={riskData.swot.threats} />
          </div>
        </div>

        {/* 3. Top Risks */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-[var(--ink)] mb-8 tracking-tight">3 things we would watch before investing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {riskData.topRisks.map((risk, idx) => (
              <RiskCard key={idx} riskData={risk} index={idx + 1} />
            ))}
          </div>
        </div>

        {/* 4. Risk Level & 5. What to do next */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl mb-12 flex flex-col lg:flex-row gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="flex-1 relative z-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-12">
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-8 flex items-center gap-2">
              <Target className="w-4 h-4"/> Risk Signal
            </h3>
            
            <div className="mb-6">
               <span className={`inline-flex px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest border ${
                 riskData.overallRisk === 'LOW RISK' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-500/50' :
                 riskData.overallRisk === 'MODERATE RISK' ? 'bg-amber-900/50 text-amber-400 border-amber-500/50' :
                 'bg-red-900/50 text-red-400 border-red-500/50'
               }`}>
                 {riskData.overallRisk}
               </span>
            </div>
            
            <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-xs">
              This is an advisory signal based on the assessment, not a formal credit decision.
            </p>
          </div>
          
          <div className="flex-[2] relative z-10">
            <h3 className="text-sm font-extrabold tracking-tight text-white mb-8">Before You Commit</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-5">
                <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
                <div>
                  <p className="font-bold text-white text-lg">Validate local demand</p>
                  <p className="text-sm text-slate-400 font-medium mt-1 leading-relaxed">Speak to at least 10 potential customers in your area before investing.</p>
                </div>
              </li>
              <li className="flex items-start gap-5">
                <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
                <div>
                  <p className="font-bold text-white text-lg">Keep enough working capital</p>
                  <p className="text-sm text-slate-400 font-medium mt-1 leading-relaxed">Don't spend all your funds on setup; keep cash for the first few slow months.</p>
                </div>
              </li>
              <li className="flex items-start gap-5">
                <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
                <div>
                  <p className="font-bold text-white text-lg">Compare financing options</p>
                  <p className="text-sm text-slate-400 font-medium mt-1 leading-relaxed">Check if you qualify for subsidies before accepting a standard commercial loan.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="mb-12 flex justify-end">
          <SourceBadge 
            source="Assessment Engine" 
            date="September 2026" 
            confidence="Medium" 
            isDemo={true} 
          />
        </div>

        <div className="pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            onClick={handleContinue}
            className="primary-button w-full sm:w-auto px-10 py-5 text-lg"
          >
            See Final Result <ArrowRight className="w-6 h-6 ml-2" />
          </button>
        </div>

      </div>
    </main>
  );
}
