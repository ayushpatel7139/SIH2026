"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { calculateFinancials, formatCurrency } from "@/lib/calculator";
import { getMatchingSchemes } from "@/lib/scheme-data";
import SourceBadge from "@/components/common/SourceBadge";
import SchemeMatchCard from "@/components/results/SchemeMatchCard";
import { useEffect, useState } from "react";
import { FinancialRoadmap } from "@/lib/calculator";
import { SchemeMatch } from "@/types/scheme";
import { ArrowRight, ArrowLeft, ArrowDown, HandCoins, Building2, Calculator, Info, Landmark } from "lucide-react";

export default function RoadmapScreen() {
  const router = useRouter();
  const {
    businessCategory,
    ownInvestment,
    existingLoanPayment,
    entrepreneurType,
    socialCategory,
    gender
  } = useAssessmentStore();

  const [financials, setFinancials] = useState<FinancialRoadmap | null>(null);
  const [schemes, setSchemes] = useState<SchemeMatch[]>([]);

  useEffect(() => {
    const calc = calculateFinancials(businessCategory, ownInvestment, existingLoanPayment);
    setFinancials(calc);

    const matches = getMatchingSchemes(
      entrepreneurType,
      socialCategory,
      gender,
      businessCategory,
      calc.fundingGap
    );
    setSchemes(matches);
  }, [businessCategory, ownInvestment, existingLoanPayment, entrepreneurType, socialCategory, gender]);

  const handleContinue = () => {
    router.push("/assessment/swot");
  };

  const handleBack = () => {
    router.push("/assessment/market");
  };

  if (!financials) return null; 

  return (
    <main className="welcome-page min-h-screen bg-[var(--cream)] relative overflow-hidden flex flex-col fade-in">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-50 via-transparent to-transparent -z-10 opacity-70"></div>

      <div className="welcome-container p-6 sm:p-8 lg:p-12 flex-1 flex flex-col relative z-10 max-w-5xl mx-auto">
        
        <header className="mb-12">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Market Analysis
          </button>
        </header>

        <div className="flex items-center justify-between mb-16">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[var(--line)] flex items-center justify-center flex-shrink-0">
                 <Calculator className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                 <div className="text-[10px] font-bold tracking-widest text-[var(--primary)] uppercase mb-1">Financial Roadmap</div>
                 <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
                   How the numbers look.
                 </h1>
              </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* LEFT: THE PIPELINE */}
          <div className="flex-1 max-w-md mx-auto w-full">
            <h2 className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-8 ml-8">Estimated Financial Flow</h2>
            
            <div className="relative">
              {/* Vertical line connecting blocks */}
              <div className="absolute left-8 top-12 bottom-12 w-1 bg-gradient-to-b from-slate-200 via-blue-200 to-orange-200 rounded-full z-0"></div>

              {/* Node 1: Project Cost */}
              <div className="relative z-10 bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm mb-6 flex gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                  <Building2 className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Estimated Cost</p>
                  <p className="text-3xl font-extrabold text-[var(--ink)] tracking-tight">{formatCurrency(financials.projectCost)}</p>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--line)] space-y-2 hidden group-hover:block transition-all">
                    <div className="flex justify-between text-xs font-medium"><span className="text-[var(--muted)]">Equipment</span><span>{formatCurrency(financials.breakdown.equipment)}</span></div>
                    <div className="flex justify-between text-xs font-medium"><span className="text-[var(--muted)]">Inventory</span><span>{formatCurrency(financials.breakdown.inventory)}</span></div>
                    <div className="flex justify-between text-xs font-medium"><span className="text-[var(--muted)]">Working Cap</span><span>{formatCurrency(financials.breakdown.workingCapital)}</span></div>
                  </div>
                </div>
              </div>

              {/* Arrow Down */}
              <div className="relative z-10 flex justify-start ml-[1.6rem] mb-6">
                 <div className="w-6 h-6 bg-white border border-[var(--line)] rounded-full flex items-center justify-center text-[var(--muted)]">
                   <ArrowDown className="w-3 h-3" />
                 </div>
              </div>

              {/* Node 2: Contribution */}
              <div className="relative z-10 bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm mb-6 flex gap-6">
                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0 border border-green-100">
                  <HandCoins className="w-6 h-6 text-[var(--success)]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--success)] mb-1">Your Contribution</p>
                  <p className="text-2xl font-extrabold text-[var(--success)] tracking-tight">− {formatCurrency(financials.ownContribution)}</p>
                </div>
              </div>

              {/* Arrow Down */}
              <div className="relative z-10 flex justify-start ml-[1.6rem] mb-6">
                 <div className="w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                   <ArrowDown className="w-3 h-3" />
                 </div>
              </div>

              {/* Node 3: Funding Gap */}
              <div className="relative z-10 bg-[var(--primary)] text-white p-8 rounded-[2rem] shadow-xl mb-12 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                   <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Estimated Gap</p>
                   <Info className="w-5 h-5 text-blue-300" />
                </div>
                <p className="text-5xl font-extrabold tracking-tighter mb-2">{formatCurrency(financials.fundingGap)}</p>
                <p className="text-sm font-medium text-blue-200">This is what you might need to finance.</p>
              </div>

            </div>
          </div>

          {/* RIGHT: INSIGHTS & SCHEMES */}
          <div className="flex-1 flex flex-col gap-12">
            
            {/* Repayment Check */}
            <div className={`p-8 rounded-3xl border-2 ${
               financials.repaymentRisk === 'LOWER RISK' ? 'bg-green-50 border-green-200' :
               financials.repaymentRisk === 'MODERATE' ? 'bg-orange-50 border-orange-200' :
               'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-4 mb-6">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                   financials.repaymentRisk === 'LOWER RISK' ? 'bg-green-200 text-green-700' :
                   financials.repaymentRisk === 'MODERATE' ? 'bg-orange-200 text-orange-700' :
                   'bg-red-200 text-red-700'
                 }`}>
                   <Info className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-sm font-extrabold tracking-tight text-[var(--ink)]">Can you carry this repayment?</h3>
                 </div>
              </div>

              <div className="flex items-end gap-3 mb-6">
                 <div className={`text-5xl font-extrabold tracking-tighter ${
                   financials.repaymentRisk === 'LOWER RISK' ? 'text-[var(--success)]' :
                   financials.repaymentRisk === 'MODERATE' ? 'text-[var(--warning)]' :
                   'text-[var(--danger)]'
                 }`}>
                   {formatCurrency(financials.estimatedEmi)}
                 </div>
                 <div className="text-sm font-bold text-[var(--ink)] pb-1">/ month</div>
              </div>

              <p className="text-base font-medium text-[var(--ink)] leading-relaxed bg-white/60 p-4 rounded-xl">
                 {financials.repaymentRisk === 'LOWER RISK' 
                  ? 'This EMI appears manageable for a typical business of this type.'
                  : financials.repaymentRisk === 'MODERATE'
                  ? 'This EMI is moderate. You will need steady sales to support this comfortably.'
                  : 'This EMI is very high. It may strain your initial business cash flow.'}
              </p>
              
              <div className="mt-6 flex justify-between items-center text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                 <span>Based on {financials.tenureYears} Years</span>
                 <span>Illustrative Only</span>
              </div>
            </div>

            {/* Schemes */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                 <Landmark className="w-6 h-6 text-[var(--primary)]" />
                 <h2 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight">Potential Government Support</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {schemes.map(scheme => (
                  <SchemeMatchCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <SourceBadge 
            source="Scheme Database & Standard Interest Rates" 
            date="September 2026" 
            confidence="High" 
            isDemo={true} 
          />
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            onClick={handleContinue}
            className="primary-button w-full sm:w-auto px-10 py-5 text-lg"
          >
            Review Risks & SWOT <ArrowRight className="w-6 h-6 ml-2" />
          </button>
        </div>

      </div>
    </main>
  );
}
