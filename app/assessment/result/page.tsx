"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { analyzeLocalMarket } from "@/lib/market-data";
import { calculateFinancials, formatCurrency } from "@/lib/calculator";
import { generateRiskAnalysis, calculateFeasibilityScore, FeasibilityResult } from "@/lib/feasibility";
import { getMatchingSchemes } from "@/lib/scheme-data";
import SourceBadge from "@/components/common/SourceBadge";
import FeasibilityScoreGauge from "@/components/results/FeasibilityScoreGauge";
import SchemeMatchCard from "@/components/results/SchemeMatchCard";
import { useEffect, useState } from "react";
import { SchemeMatch } from "@/types/scheme";
import { FinancialRoadmap } from "@/lib/calculator";
import { ArrowRight, ArrowLeft, MapPin, CheckCircle2, AlertTriangle, Lightbulb, ArrowUpRight, Search, Zap, HandCoins, Compass } from "lucide-react";

export default function ResultScreen() {
  const router = useRouter();
  const {
    businessCategory,
    businessIdea,
    village,
    district,
    previousBusinessExperience,
    ownInvestment,
    existingLoanPayment,
    entrepreneurType,
    socialCategory,
    gender
  } = useAssessmentStore();

  const [resultData, setResultData] = useState<FeasibilityResult | null>(null);
  const [financials, setFinancials] = useState<FinancialRoadmap | null>(null);
  const [schemes, setSchemes] = useState<SchemeMatch[]>([]);

  useEffect(() => {
    const market = analyzeLocalMarket(district, businessCategory, businessIdea);
    const fin = calculateFinancials(businessCategory, ownInvestment, existingLoanPayment);
    const riskAnalysis = generateRiskAnalysis(
      businessCategory,
      businessIdea,
      previousBusinessExperience,
      market.opportunityLevel,
      market.competitionLevel,
      fin.repaymentRisk,
      fin.fundingGap
    );
    
    const result = calculateFeasibilityScore(riskAnalysis, previousBusinessExperience);
    setResultData(result);
    setFinancials(fin);
    
    const matches = getMatchingSchemes(
      entrepreneurType,
      socialCategory,
      gender,
      businessCategory,
      fin.fundingGap
    );
    setSchemes(matches);

  }, [
    district, village, businessCategory, businessIdea, 
    previousBusinessExperience, ownInvestment, existingLoanPayment,
    entrepreneurType, socialCategory, gender
  ]);

  const handleContinue = () => {
    router.push("/assessment/success");
  };

  const handleBack = () => {
    router.push("/assessment/swot");
  };

  if (!resultData || !financials) return null; 

  const displayLocation = village && district ? `${village}, ${district}` : district || 'Your location';
  const displayBusiness = businessIdea || businessCategory || 'Selected business';

  const outcomeColors = 
    resultData.outcome === 'PROMISING TO PROCEED' ? { bg: 'bg-emerald-900', text: 'text-emerald-400', border: 'border-emerald-500/30' } :
    resultData.outcome === 'PROCEED WITH CAUTION' ? { bg: 'bg-amber-900', text: 'text-amber-400', border: 'border-amber-500/30' } :
    { bg: 'bg-red-900', text: 'text-red-400', border: 'border-red-500/30' };

  const renderProgressBar = (label: string, value: number) => {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">{label}</span>
          <span className="text-sm font-extrabold text-[var(--ink)]">{value}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className={`h-full rounded-full transition-all duration-1000 shadow-sm ${
              value >= 75 ? 'bg-[var(--success)]' : value >= 50 ? 'bg-[var(--warning)]' : 'bg-[var(--danger)]'
            }`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <main className="welcome-page min-h-screen bg-[var(--cream)] relative overflow-hidden flex flex-col fade-in">
      <div className="welcome-container p-6 sm:p-8 lg:p-12 flex-1 flex flex-col relative z-10 max-w-6xl mx-auto">
        
        <header className="mb-10">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Risk Analysis
          </button>
        </header>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ink)]">
              The Final Verdict
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-[var(--line)] shadow-sm">
             <div className="flex items-center gap-3">
               <Lightbulb className="w-4 h-4 text-[var(--primary)]" />
               <span className="text-sm font-bold text-[var(--ink)]">{displayBusiness}</span>
             </div>
             <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
             <div className="flex items-center gap-3">
               <MapPin className="w-4 h-4 text-orange-500" />
               <span className="text-sm font-bold text-[var(--ink)]">{displayLocation}</span>
             </div>
          </div>
        </div>

        {/* HERO BREAKDOWN: Massive Result Card */}
        <div className={`rounded-[3rem] ${outcomeColors.bg} p-8 md:p-16 text-white shadow-2xl relative overflow-hidden mb-16 flex flex-col lg:flex-row gap-12 items-center`}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex-1 w-full text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-8 backdrop-blur-sm shadow-sm">
              <Compass className="w-4 h-4 text-white" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">System Recommendation</span>
            </div>
            
            <h2 className={`text-5xl sm:text-7xl font-extrabold tracking-tighter mb-6 ${outcomeColors.text} drop-shadow-sm leading-none`}>
              {resultData.outcome}
            </h2>
            
            <p className="text-xl sm:text-2xl font-medium text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {resultData.outcome === 'PROMISING TO PROCEED' ? 'The numbers align well. Move forward with careful planning.' :
               resultData.outcome === 'PROCEED WITH CAUTION' ? 'There is potential, but key risks must be addressed first.' :
               'The risks currently outweigh the potential rewards. Re-evaluate.'}
            </p>
          </div>
          
          <div className="relative z-10 flex-shrink-0">
            <FeasibilityScoreGauge score={resultData.score} />
          </div>
        </div>

        {/* 2-Column Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Why This Result? */}
          <div className="bg-white rounded-3xl border border-[var(--line)] p-10 shadow-sm">
            <h3 className="text-sm font-extrabold tracking-widest text-[var(--muted)] uppercase mb-8 flex items-center gap-3">
              <Search className="w-5 h-5 text-[var(--primary)]" /> Why did we reach this?
            </h3>
            <ul className="space-y-6">
              {resultData.reasons.map((reason, idx) => {
                const isPositive = reason.startsWith('✓');
                return (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-[var(--line)]">
                    <div className="mt-0.5">
                      {isPositive ? (
                        <CheckCircle2 className="w-6 h-6 text-[var(--success)]" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-[var(--warning)]" />
                      )}
                    </div>
                    <span className="text-base font-bold text-[var(--ink)] leading-snug">
                      {reason.substring(2)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Breakdown & Sub-scores */}
          <div className="bg-white rounded-3xl border border-[var(--line)] p-10 shadow-sm flex flex-col justify-center">
            <h3 className="text-sm font-extrabold tracking-widest text-[var(--muted)] uppercase mb-10 flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-500" /> Score Breakdown
            </h3>
            
            <div className="space-y-2">
              {renderProgressBar('Market Opportunity', resultData.breakdown.marketOpportunity)}
              {renderProgressBar('Financial Readiness', resultData.breakdown.financialReadiness)}
              {renderProgressBar('Repayment Comfort', resultData.breakdown.repaymentComfort)}
              {renderProgressBar('Business Risk', resultData.breakdown.businessRisk)}
              {renderProgressBar('Entrepreneur Fit', resultData.breakdown.entrepreneurFit)}
            </div>
          </div>
          
        </div>

        {/* Highlights: Top Advantage & Top Concern */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-green-50 rounded-3xl border border-green-200 p-10 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-200 rounded-xl text-green-700"><ArrowUpRight className="w-6 h-6" /></div>
              <h3 className="text-xs font-bold tracking-widest text-green-800 uppercase">Your Biggest Advantage</h3>
            </div>
            <p className="text-2xl font-extrabold text-[var(--ink)] tracking-tight leading-tight">
              {resultData.topAdvantage}
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-3xl border border-orange-200 p-10 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-200 rounded-xl text-orange-700"><AlertTriangle className="w-6 h-6" /></div>
              <h3 className="text-xs font-bold tracking-widest text-orange-800 uppercase">What Needs Attention</h3>
            </div>
            <p className="text-2xl font-extrabold text-[var(--ink)] tracking-tight leading-tight mb-4">
              {resultData.topConcern.action}
            </p>
            <div className="bg-white/60 p-4 rounded-xl text-sm font-bold text-[var(--ink)] flex flex-col">
              <span className="text-[10px] text-orange-600 uppercase tracking-widest mb-1">Related Risk</span>
              {resultData.topConcern.risk}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <SourceBadge 
            source="Assessment Engine" 
            date="September 2026" 
            confidence="High" 
            isDemo={true} 
          />
        </div>

        <div className="mt-12 pt-10 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-end gap-6">
          <button
            onClick={handleContinue}
            className="primary-button w-full sm:w-auto px-12 py-6 text-xl shadow-xl shadow-orange-500/20"
          >
            Generate My Business Report <ArrowRight className="w-6 h-6 ml-3" />
          </button>
        </div>

      </div>
    </main>
  );
}
