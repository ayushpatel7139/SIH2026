"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { useEffect, useState } from "react";
import { analyzeLocalMarket } from "@/lib/market-data";
import { calculateFinancials } from "@/lib/calculator";
import { generateRiskAnalysis } from "@/lib/feasibility";
import { getMatchingSchemes } from "@/lib/scheme-data";
import { CheckCircle2, TrendingUp, ShieldCheck, Download, Plus, ArrowRight, Sparkles } from "lucide-react";

export default function SuccessScreen() {
  const router = useRouter();
  const {
    businessCategory,
    businessIdea,
    district,
    previousBusinessExperience,
    ownInvestment,
    existingLoanPayment,
    entrepreneurType,
    socialCategory,
    gender
  } = useAssessmentStore();

  const [hasSchemes, setHasSchemes] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const marketData = analyzeLocalMarket(district, businessCategory, businessIdea);
    const fin = calculateFinancials(businessCategory, ownInvestment, existingLoanPayment);
    const riskAnalysis = generateRiskAnalysis(
      businessCategory,
      businessIdea,
      previousBusinessExperience,
      marketData.opportunityLevel,
      marketData.competitionLevel,
      fin.repaymentRisk,
      fin.fundingGap
    );
    const matches = getMatchingSchemes(
      entrepreneurType,
      socialCategory,
      gender,
      businessCategory,
      fin.fundingGap
    );
    
    setHasSchemes(matches.length > 0);
    setIsReady(true);
  }, [district, businessCategory, businessIdea, previousBusinessExperience, ownInvestment, existingLoanPayment, entrepreneurType, socialCategory, gender]);

  const handleViewReport = () => {
    router.push("/report");
  };

  const handleNewAssessment = () => {
    router.push("/assessment/location");
  };

  if (!isReady) return null;

  return (
    <main className="welcome-page min-h-screen bg-[var(--cream)] relative overflow-hidden flex items-center justify-center p-4 sm:p-8 fade-in">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-[var(--line)] shadow-2xl overflow-hidden flex flex-col relative z-10">
        
        {/* Celebration Header */}
        <div className="p-8 sm:p-12 text-center relative overflow-hidden">
          
          <div className="w-24 h-24 bg-green-50 rounded-3xl border-2 border-green-200 mx-auto flex items-center justify-center mb-8 shadow-sm relative z-10 animate-in zoom-in duration-500">
            <CheckCircle2 className="text-[var(--success)] w-12 h-12" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--ink)] mb-6 tracking-tight relative z-10 leading-tight">
            YOU'VE GOT A PLAN.<br />NOW TAKE THE NEXT STEP.
          </h1>
          <p className="text-base sm:text-lg text-[var(--muted)] font-medium max-w-md mx-auto relative z-10 leading-relaxed">
            Your business assessment is ready. Use your report to validate the opportunity, compare financing options and make your next decision with confidence.
          </p>
        </div>

        {/* Body Content */}
        <div className="px-8 pb-12 sm:px-12 sm:pb-12 flex-1 flex flex-col items-center">
          
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            
            <div className="bg-white border border-[var(--line)] rounded-2xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[var(--primary)]">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Business Idea</p>
              <p className="text-base font-extrabold text-[var(--ink)]">Assessed</p>
            </div>
            
            <div className="bg-white border border-[var(--line)] rounded-2xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <span className="font-extrabold text-lg">₹</span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Financial Plan</p>
              <p className="text-base font-extrabold text-[var(--ink)]">Prepared</p>
            </div>
            
            <div className="bg-white border border-[var(--line)] rounded-2xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[var(--success)]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Financing</p>
              <p className="text-base font-extrabold text-[var(--ink)]">
                {hasSchemes ? "Matches Found" : "Options Checked"}
              </p>
            </div>

          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-4 max-w-sm mx-auto mb-12">
            <button
              onClick={handleViewReport}
              className="primary-button w-full py-5 text-center text-lg shadow-xl shadow-orange-500/20 hover:-translate-y-1"
            >
              <Sparkles className="w-5 h-5 mr-2" /> View Final Report <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => {
                handleViewReport();
                setTimeout(() => window.print(), 500);
              }}
              className="ghost-button w-full flex justify-center py-5 text-base font-bold bg-white border-2 border-[var(--line)] hover:border-[var(--primary)]"
            >
              <Download className="w-5 h-5 mr-2" /> Download PDF
            </button>
            <button
              onClick={handleNewAssessment}
              className="w-full py-5 rounded-xl border border-transparent text-[var(--muted)] font-bold text-sm hover:bg-slate-50 hover:text-[var(--ink)] transition-all mt-4 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Start A New Assessment
            </button>
          </div>

          {/* Trust Disclaimer */}
          <div className="text-center w-full p-6 bg-slate-50 rounded-2xl border border-[var(--line)]">
            <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Disclaimer</p>
            <p className="text-xs text-[var(--muted)] font-medium leading-relaxed max-w-md mx-auto">
              Your assessment is advisory. Final business decisions, scheme eligibility and loan approval remain with the concerned authorities and lenders.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
