"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { analyzeLocalMarket } from "@/lib/market-data";
import { calculateFinancials, formatCurrency } from "@/lib/calculator";
import { generateRiskAnalysis, calculateFeasibilityScore, FeasibilityResult } from "@/lib/feasibility";
import { getMatchingSchemes } from "@/lib/scheme-data";
import SourceBadge from "@/components/common/SourceBadge";
import SchemeMatchCard from "@/components/results/SchemeMatchCard";
import { useEffect, useState } from "react";
import { SchemeMatch } from "@/types/scheme";
import { FinancialRoadmap } from "@/lib/calculator";
import { RiskAnalysis } from "@/lib/feasibility";
import { Download, Share2, Plus, Store, MapPin, CheckCircle2, AlertTriangle, TrendingUp, HelpCircle, ShieldCheck, Target, Calculator } from "lucide-react";

export default function ReportScreen() {
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
  const [market, setMarket] = useState<any>(null);
  const [riskData, setRiskData] = useState<RiskAnalysis | null>(null);

  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    
    const marketData = analyzeLocalMarket(district, businessCategory, businessIdea);
    setMarket(marketData);

    const fin = calculateFinancials(businessCategory, ownInvestment, existingLoanPayment);
    setFinancials(fin);

    const riskAnalysis = generateRiskAnalysis(
      businessCategory,
      businessIdea,
      previousBusinessExperience,
      marketData.opportunityLevel,
      marketData.competitionLevel,
      fin.repaymentRisk,
      fin.fundingGap
    );
    setRiskData(riskAnalysis);
    
    const result = calculateFeasibilityScore(riskAnalysis, previousBusinessExperience);
    setResultData(result);
    
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

  if (!resultData || !financials || !market || !riskData) return null;

  const displayLocation = village && district ? `${village}, ${district}` : district || 'Your location';
  const displayBusiness = businessIdea || businessCategory || 'Selected business';

  const outcomeColor = 
    resultData.outcome === 'PROMISING TO PROCEED' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
    resultData.outcome === 'PROCEED WITH CAUTION' ? 'text-amber-700 bg-amber-50 border-amber-200' :
    'text-red-700 bg-red-50 border-red-200';

  const handlePrint = () => {
    window.print();
  };

  const handleRestart = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20 print:bg-white print:pb-0">
      
      {/* Top Nav (Hidden on print) */}
      <div className="no-print border-b border-[var(--line)] bg-white py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-extrabold text-[var(--ink)] text-sm flex items-center gap-3">
             <div className="w-8 h-8 bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm rounded-lg shadow-sm">R</div>
             Rural Business Advisor Report
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="ghost-button !py-2.5 !px-5 font-bold text-[var(--primary)] hover:bg-blue-50">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={handleRestart} className="primary-button !py-2.5 !px-5 shadow-sm">
              <Plus className="w-4 h-4" /> Start New
            </button>
          </div>
        </div>
      </div>

      {/* DOCUMENT CONTAINER */}
      <div className="max-w-5xl mx-auto mt-8 sm:mt-12 bg-white print:mt-0 print:shadow-none shadow-xl border border-[var(--line)] rounded-none sm:rounded-2xl overflow-hidden print:border-none print:rounded-none">
        
        {/* HEADER */}
        <header className="p-8 sm:p-12 border-b-2 border-slate-900 bg-slate-900 text-white">
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white text-slate-900 flex items-center justify-center font-bold text-xl rounded-xl">
                R
              </div>
              <div>
                <div className="font-extrabold tracking-widest text-xs text-slate-400 uppercase">Rural Business Advisor</div>
                <div className="font-medium text-white mt-0.5">Advisory Assessment</div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Generated</p>
              <p className="font-bold text-sm">{dateStr}</p>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold mb-8 tracking-tighter text-white">
            BUSINESS FEASIBILITY REPORT
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-8 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Business</p>
              <p className="font-extrabold text-white text-lg">{displayBusiness}</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/20"></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
              <p className="font-extrabold text-white text-lg">{displayLocation}</p>
            </div>
          </div>
        </header>

        <div className="p-8 sm:p-12">

          {/* 1. EXECUTIVE SUMMARY */}
          <section className="mb-16 break-inside-avoid">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              <div className={`p-8 rounded-3xl border-2 min-w-[240px] text-center flex flex-col items-center justify-center ${outcomeColor}`}>
                <span className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-70">Feasibility Score</span>
                <span className="text-6xl font-extrabold tracking-tighter mb-4">{resultData.score}<span className="text-3xl opacity-50">/100</span></span>
                <span className="font-extrabold text-sm uppercase tracking-widest px-4 py-2 bg-white/80 rounded-full w-full">{resultData.outcome}</span>
              </div>

              <div className="flex-1 w-full">
                <h2 className="text-sm font-extrabold text-[var(--ink)] uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Target className="w-5 h-5 text-[var(--primary)]" /> System Recommendation
                </h2>
                <p className="text-2xl font-extrabold text-[var(--ink)] mb-6 leading-tight">
                  {resultData.outcome === 'PROMISING TO PROCEED' ? 'Move forward with planning, but validate local costs first.' :
                   resultData.outcome === 'PROCEED WITH CAUTION' ? 'Move forward carefully. Validate the market before taking a loan.' :
                   'Pause. Validate your market thoroughly before investing any capital.'}
                </p>
                <p className="text-base text-[var(--muted)] font-medium leading-relaxed">
                  Your assessment indicates {resultData.score >= 70 ? 'strong potential' : 'some potential'}, heavily driven by: 
                  <strong className="text-[var(--ink)] ml-1">{resultData.reasons[0].replace('✓', '').trim()}</strong>. 
                  However, {resultData.topConcern.risk === "MARKET VALIDATION" ? "market validation is critical." : `the main area to watch is ${resultData.topConcern.risk.toLowerCase()}, requiring careful review before borrowing.`}
                </p>
              </div>

            </div>
          </section>

          {/* 4. FINANCIAL PLAN */}
          <section className="mb-16 break-inside-avoid">
            <h2 className="text-sm font-extrabold tracking-widest text-[var(--ink)] uppercase mb-8 border-b-2 border-slate-100 pb-4 flex items-center gap-3">
               <Calculator className="w-5 h-5 text-orange-500" /> Financial Roadmap (Estimated)
            </h2>
            
            <div className="bg-slate-50 rounded-3xl border border-[var(--line)] p-8">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 text-center lg:text-left">
                <div className="flex-1">
                  <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Project Cost</p>
                  <p className="text-3xl font-extrabold text-[var(--ink)] tracking-tight">{formatCurrency(financials.projectCost)}</p>
                </div>
                <div className="text-[var(--muted)] font-bold hidden lg:block text-2xl">—</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Your Contribution</p>
                  <p className="text-3xl font-extrabold text-[var(--success)] tracking-tight">{formatCurrency(financials.ownContribution)}</p>
                </div>
                <div className="text-[var(--muted)] font-bold hidden lg:block text-2xl">=</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Financing Gap</p>
                  <p className="text-3xl font-extrabold text-[var(--primary)] tracking-tight">{formatCurrency(financials.fundingGap)}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                 <div>
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-1">Repayment Estimate</p>
                    <p className="text-sm font-medium text-[var(--ink)]">Based on standard {financials.tenureYears}-year commercial terms</p>
                 </div>
                 <div className="text-right">
                    <p className="text-3xl font-extrabold text-[var(--warning)] tracking-tight">{formatCurrency(financials.estimatedEmi)}<span className="text-sm font-bold text-[var(--muted)]">/mo</span></p>
                 </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            
            {/* 3. MARKET SNAPSHOT */}
            <section className="break-inside-avoid">
              <h2 className="text-sm font-extrabold tracking-widest text-[var(--ink)] uppercase mb-6 border-b-2 border-slate-100 pb-4 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-500" /> Local Market Profile
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Market Reach (Estimate)</p>
                  <p className="font-extrabold text-[var(--ink)] text-xl leading-tight">{market.estimatedReach}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Top Local Opportunity</p>
                  <p className="font-bold text-[var(--ink)] text-base leading-relaxed bg-blue-50 p-4 rounded-xl text-blue-900 border border-blue-100">{riskData.swot.opportunities[0]?.text}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-[var(--line)]">
                    <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">Competition</p>
                    <p className="font-bold text-[var(--ink)] text-sm">{riskData.competitionLevel}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-[var(--line)]">
                    <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">Repayment Risk</p>
                    <p className="font-bold text-[var(--ink)] text-sm">{riskData.repaymentBurden}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. KEY RISKS & STRENGTHS */}
            <section className="break-inside-avoid">
              <h2 className="text-sm font-extrabold tracking-widest text-[var(--ink)] uppercase mb-6 border-b-2 border-slate-100 pb-4 flex items-center gap-3">
                 <AlertTriangle className="w-5 h-5 text-red-500" /> Key Considerations
              </h2>
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                  <div className="flex gap-3 items-center mb-3">
                    <CheckCircle2 className="text-green-600 w-5 h-5" />
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Top Strength</p>
                  </div>
                  <p className="font-extrabold text-[var(--ink)] text-base leading-snug">{resultData.topAdvantage}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                  <div className="flex gap-3 items-center mb-3">
                    <AlertTriangle className="text-red-600 w-5 h-5" />
                    <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest">Top Risk Area</p>
                  </div>
                  <p className="font-extrabold text-[var(--ink)] text-base leading-snug">{resultData.topConcern.action}</p>
                </div>
              </div>
            </section>

          </div>

          {/* 5. POTENTIAL SCHEMES */}
          <section className="mb-16 break-inside-avoid">
            <h2 className="text-sm font-extrabold tracking-widest text-[var(--ink)] uppercase mb-8 border-b-2 border-slate-100 pb-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[var(--success)]" /> Potential Financing Options
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {schemes.length > 0 ? schemes.map(scheme => (
                <div key={scheme.id} className="no-print h-full">
                   <SchemeMatchCard scheme={scheme} />
                </div>
              )) : (
                <p className="text-sm text-[var(--muted)] italic bg-slate-50 p-6 rounded-2xl border border-[var(--line)]">No matching schemes identified based on current profile.</p>
              )}

              {/* Print specific rendering */}
              <div className="hidden print:block col-span-2 space-y-6">
                 {schemes.map(scheme => (
                    <div key={scheme.id} className="border border-[var(--line)] rounded-2xl p-6 bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-extrabold text-lg text-[var(--ink)]">{scheme.name}</p>
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-white px-3 py-1 border border-slate-200 rounded-lg">{scheme.financingCategory}</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--ink)] mt-4 leading-relaxed">{scheme.reasonToFit}</p>
                    </div>
                 ))}
              </div>
            </div>
          </section>

          {/* 8. NEXT STEPS */}
          <section className="mb-16 break-inside-avoid">
            <h2 className="text-sm font-extrabold tracking-widest text-[var(--ink)] uppercase mb-8 border-b-2 border-slate-100 pb-4 flex items-center gap-3">
              <Target className="w-5 h-5 text-[var(--ink)]" /> Your Next 3 Steps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              
              <div className="flex flex-col">
                <div className="text-5xl font-extrabold text-slate-200 mb-6 font-mono tracking-tighter">01</div>
                <p className="font-extrabold text-[var(--ink)] text-lg mb-3">Validate Demand</p>
                <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                  Speak directly with potential customers in your area to confirm they will pay for your product/service.
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="text-5xl font-extrabold text-slate-200 mb-6 font-mono tracking-tighter">02</div>
                <p className="font-extrabold text-[var(--ink)] text-lg mb-3">Confirm Costs</p>
                <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                  Get real quotes from suppliers for your setup and inventory. Reserve cash for the first few months.
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="text-5xl font-extrabold text-slate-200 mb-6 font-mono tracking-tighter">03</div>
                <p className="font-extrabold text-[var(--ink)] text-lg mb-3">Check Terms</p>
                <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                  Review the financing options above with a local bank or advisor before signing any loan agreement.
                </p>
              </div>

            </div>
          </section>

          {/* TRUST & SOURCES & DISCLAIMER */}
          <footer className="pt-8 border-t-2 border-slate-100 flex flex-col justify-between items-start gap-6 break-inside-avoid mt-20">
            
            <div className="w-full bg-slate-50 p-6 rounded-2xl border border-[var(--line)]">
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-3">Disclaimer & Advisory Notice</p>
              <p className="text-xs text-[var(--muted)] font-medium leading-relaxed">
                This report is generated by an automated advisory system (Rural Business Advisor) for planning purposes only. It is based on the information provided and representative local data. It does not constitute a formal credit decision, guarantee business success, or ensure eligibility for government schemes. Consult a financial professional before making investment decisions.
              </p>
            </div>
            
            <div className="flex w-full justify-between items-center mt-4 opacity-50">
               <div className="text-[10px] font-bold uppercase tracking-widest">Generated by Rural Business Advisor</div>
               <div className="text-[10px] font-bold uppercase tracking-widest">{dateStr}</div>
            </div>

          </footer>

        </div>
      </div>
    </main>
  );
}
