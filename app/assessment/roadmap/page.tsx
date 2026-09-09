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
import { ArrowRight, ArrowLeft, ArrowDown, Wallet, Store, Calculator, Info, Landmark, CircleCheck } from "lucide-react";

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
    <main className="flex-1 flex flex-col bg-[var(--cream)] relative overflow-hidden fade-in">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50/50 via-transparent to-transparent -z-10 rounded-br-full opacity-60"></div>

      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 sm:px-8 py-10 lg:py-16 relative z-10">
        
        <header className="mb-10">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </header>

        <div className="flex items-center gap-4 mb-6">
           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[var(--line)] flex items-center justify-center flex-shrink-0">
              <Calculator className="w-6 h-6 text-[var(--primary)]" />
           </div>
           <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
             Can I financially manage this?
           </h1>
        </div>

        <p className="text-lg text-[var(--muted)] font-medium mb-12 leading-relaxed ml-0 sm:ml-16 max-w-2xl">
          A breakdown of your project costs, required loans, and expected profitability based on your resources.
        </p>

        <div className="ml-0 sm:ml-16 flex flex-col lg:flex-row gap-12 lg:gap-20 slide-up">
          
          {/* LEFT: THE PIPELINE */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <h2 className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-6 ml-8">Estimated Flow</h2>
            
            <div className="relative">
              {/* Vertical line connecting blocks */}
              <div className="absolute left-8 top-12 bottom-12 w-1.5 bg-gradient-to-b from-slate-200 via-blue-200 to-orange-200 rounded-full z-0"></div>

              {/* Node 1: Project Cost */}
              <div className="relative z-10 card-standard p-6 mb-6 flex gap-5 group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-[var(--line)]">
                  <Store className="w-6 h-6 text-[var(--muted)]" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Estimated project cost</p>
                  <p className="text-2xl font-extrabold text-[var(--ink)] tracking-tight">{formatCurrency(financials.projectCost)}</p>
                  
                  <div className="mt-3 pt-3 border-t border-[var(--line)] space-y-2 opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto transition-all">
                    <div className="flex justify-between text-xs font-bold"><span className="text-[var(--muted)]">Equipment</span><span>{formatCurrency(financials.breakdown.equipment)}</span></div>
                    <div className="flex justify-between text-xs font-bold"><span className="text-[var(--muted)]">Inventory</span><span>{formatCurrency(financials.breakdown.inventory)}</span></div>
                    <div className="flex justify-between text-xs font-bold"><span className="text-[var(--muted)]">Working Cap</span><span>{formatCurrency(financials.breakdown.workingCapital)}</span></div>
                  </div>
                </div>
              </div>

              {/* Arrow Down */}
              <div className="relative z-10 flex justify-start ml-[1.6rem] mb-6">
                 <div className="w-6 h-6 bg-white border-2 border-[var(--line)] rounded-full flex items-center justify-center text-[var(--muted)]">
                   <ArrowDown className="w-3 h-3" />
                 </div>
              </div>

              {/* Node 2: Contribution */}
              <div className="relative z-10 card-standard p-6 mb-6 flex gap-5 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0 border border-green-100">
                  <Wallet className="w-6 h-6 text-[var(--success)]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--success)] mb-1">Your contribution</p>
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
              <div className="relative z-10 bg-[var(--primary)] text-white p-8 rounded-3xl shadow-xl shadow-blue-500/20 mb-12 flex flex-col hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-6">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Estimated finance requirement</p>
                   <Info className="w-5 h-5 text-blue-300" />
                </div>
                <p className="text-4xl font-extrabold tracking-tighter mb-2">{formatCurrency(financials.fundingGap)}</p>
                <p className="text-sm font-medium text-blue-200">This is roughly what you might need to finance.</p>
              </div>

            </div>
          </div>

          {/* RIGHT: INSIGHTS & SCHEMES */}
          <div className="flex-1 flex flex-col gap-10">
            
            {/* Repayment Check */}
            <div className={`p-8 rounded-3xl border-2 ${
               financials.repaymentRisk === 'LOWER RISK' ? 'bg-green-50 border-green-200' :
               financials.repaymentRisk === 'MODERATE' ? 'bg-amber-50 border-amber-200' :
               'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center gap-4 mb-6">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                   financials.repaymentRisk === 'LOWER RISK' ? 'bg-green-200 text-green-700' :
                   financials.repaymentRisk === 'MODERATE' ? 'bg-amber-200 text-amber-700' :
                   'bg-orange-200 text-orange-700'
                 }`}>
                   <CircleCheck className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Estimated EMI</p>
                    <h3 className="text-lg font-bold tracking-tight text-[var(--ink)]">Can you carry this repayment?</h3>
                 </div>
              </div>

              <div className="flex items-end gap-3 mb-6">
                 <div className={`text-5xl font-extrabold tracking-tighter ${
                   financials.repaymentRisk === 'LOWER RISK' ? 'text-[var(--success)]' :
                   financials.repaymentRisk === 'MODERATE' ? 'text-[var(--warning)]' :
                   'text-[var(--action)]'
                 }`}>
                   {formatCurrency(financials.estimatedEmi)}
                 </div>
                 <div className="text-sm font-bold text-[var(--ink)] pb-1">/ month</div>
              </div>

              <p className="text-base font-medium text-[var(--ink)] leading-relaxed bg-white/60 p-5 rounded-2xl border border-white">
                 {financials.repaymentRisk === 'LOWER RISK' 
                  ? 'This estimated EMI is considered a very manageable burden for typical businesses in this category.'
                  : financials.repaymentRisk === 'MODERATE'
                  ? 'This estimated EMI is considered a moderate burden. You will need steady sales to support this comfortably.'
                  : 'This estimated EMI is considered a high burden and may severely strain your initial business cash flow.'}
              </p>
              
              <div className="mt-6 flex justify-between items-center text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
                 <span>Based on {financials.tenureYears} Years</span>
                 <span>Illustrative Only</span>
              </div>
            </div>

            {/* Schemes */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                 <Landmark className="w-6 h-6 text-[var(--primary)]" />
                 <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">Potential Government Support</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {schemes.map(scheme => (
                  <SchemeMatchCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-12 flex justify-end">
          <SourceBadge 
            source="Scheme Database & Standard Interest Rates" 
            date="September 2026" 
            confidence="High" 
            isDemo={true} 
          />
        </div>

        <div className="mt-8 ml-0 sm:ml-16 pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)] font-medium hidden sm:block">Step 6 of 8</p>
          <button
            onClick={handleContinue}
            className="primary-button btn-lg w-full sm:w-auto shadow-lg shadow-orange-500/20 hover:-translate-y-1"
          >
            What are the risks? <ArrowRight className="btn-icon ml-1" />
          </button>
        </div>

      </div>
    </main>
  );
}
