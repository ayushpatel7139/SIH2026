"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { analyzeLocalMarket } from "@/lib/market-data";
import { calculateFinancials, formatCurrency } from "@/lib/calculator";
import { generateRiskAnalysis, calculateFeasibilityScore, FeasibilityResult } from "@/lib/feasibility";
import { getMatchingSchemes } from "@/lib/scheme-data";
import SourceBadge from "@/components/common/SourceBadge";
import FeasibilityScoreGauge from "@/components/results/FeasibilityScoreGauge";
import { useEffect, useState } from "react";
import { SchemeMatch } from "@/types/scheme";
import { FinancialRoadmap } from "@/lib/calculator";
import ContextualLoader from "@/components/common/ContextualLoader";
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  CircleCheck, 
  TriangleAlert, 
  Store, 
  Grid2X2, 
  Wallet, 
  Landmark, 
  TrendingUp,
  AlertTriangle,
  ListTodo
} from "lucide-react";

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
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    setIsAnalyzing(true);
    // Remove artificial timeout, calculate synchronously and let ContextualLoader handle the delay
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

  const handleLoaderComplete = () => {
    setIsAnalyzing(false);
  };

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
    resultData.outcome === 'PROMISING TO PROCEED' ? { text: 'text-[var(--success)]', bg: 'bg-green-50' } :
    resultData.outcome === 'PROCEED WITH CAUTION' ? { text: 'text-[var(--warning)]', bg: 'bg-amber-50' } :
    { text: 'text-[var(--danger)]', bg: 'bg-red-50' };

  return (
    <main className="flex-1 flex flex-col bg-[var(--cream)] relative overflow-hidden fade-in">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 sm:px-8 py-10 lg:py-16 relative z-10">
        
        <header className="mb-10 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </header>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ink)] mb-4">
              Can I realistically pursue this business?
            </h1>
            <p className="text-lg text-[var(--muted)] font-medium max-w-2xl leading-relaxed">
              Based on your market, finances, and risks, here is the overall feasibility of your business idea.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-[var(--line)] shadow-sm">
             <div className="flex items-center gap-3">
               <Store className="w-4 h-4 text-[var(--primary)]" />
               <span className="text-sm font-bold text-[var(--ink)] truncate max-w-[150px]">{displayBusiness}</span>
             </div>
             <div className="hidden sm:block w-px h-4 bg-[var(--line)]"></div>
             <div className="flex items-center gap-3">
               <MapPin className="w-4 h-4 text-orange-500" />
               <span className="text-sm font-bold text-[var(--ink)] truncate max-w-[150px]">{displayLocation}</span>
             </div>
          </div>
        </div>

        {isAnalyzing ? (
          <ContextualLoader 
            steps={[
              { text: "Understanding your local market...", subtext: "Checking business category" },
              { text: "Estimating financial feasibility...", subtext: "Calculating project cost" },
              { text: "Exploring suitable schemes...", subtext: "Matching available schemes" },
              { text: "Preparing your business roadmap...", subtext: "Building repayment plan" }
            ]}
            stepDuration={1000}
            onComplete={handleLoaderComplete}
          />
        ) : (
          <div className="slide-up space-y-16">
            
            {/* HERO BREAKDOWN: The Payoff */}
            <div className={`rounded-3xl border border-[var(--line)] p-8 md:p-12 shadow-sm relative overflow-hidden flex flex-col lg:flex-row gap-12 items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white`}>
              <div className="relative z-10 flex-1 w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 border border-[var(--line)] mb-6">
                  <Grid2X2 className="w-4 h-4 text-[var(--muted)]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Our Recommendation</span>
                </div>
                
                <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 ${outcomeColors.text} leading-tight`}>
                  {resultData.outcome}
                </h2>
                
                <div className={`p-6 rounded-2xl border border-[var(--line)] ${outcomeColors.bg}`}>
                  <p className="text-lg font-bold leading-relaxed text-[var(--ink)]">
                    {resultData.topAdvantage}
                  </p>
                  <div className="w-12 h-px bg-[var(--line)] my-4"></div>
                  <p className="text-base font-medium leading-relaxed text-[var(--muted)]">
                    <span className="font-bold text-[var(--ink)]">However, {resultData.topConcern.risk.toLowerCase()} requires attention:</span> {resultData.topConcern.action}
                  </p>
                </div>
              </div>
              
              <div className="relative z-10 flex-shrink-0 bg-slate-50 border border-[var(--line)] p-8 rounded-3xl shadow-inner">
                <FeasibilityScoreGauge score={resultData.score} />
                <p className="text-center text-xs font-bold text-[var(--muted)] uppercase tracking-widest mt-4">Feasibility Score</p>
              </div>
            </div>

            {/* WHY SECTION: The Evidence */}
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--ink)] mb-8 tracking-tight flex items-center gap-3">
                Why did we reach this result?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Market Pillar */}
                <div className="card-standard p-8 flex flex-col hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                    <TrendingUp className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink)] mb-6">Market Opportunity</h3>
                  <div className="space-y-6 flex-1">
                    <div>
                      <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">Local Demand</p>
                      <p className="font-extrabold text-lg text-[var(--ink)]">{resultData.breakdown.marketOpportunity > 60 ? "Promising" : "Limited"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">Competition Level</p>
                      <p className="font-extrabold text-lg text-[var(--ink)]">{resultData.breakdown.businessRisk < 60 ? "High" : "Manageable"}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Pillar */}
                <div className="card-standard p-8 flex flex-col hover:-translate-y-1">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                    <Wallet className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink)] mb-6">Financial Picture</h3>
                  <div className="space-y-6 flex-1">
                    <div>
                      <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">Estimated finance requirement</p>
                      <p className="font-extrabold text-2xl text-[var(--ink)] tracking-tight">{formatCurrency(financials.fundingGap)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">Estimated EMI</p>
                      <p className="font-extrabold text-lg text-[var(--ink)]">{formatCurrency(financials.estimatedEmi)} / month</p>
                    </div>
                  </div>
                </div>

                {/* Risks Pillar */}
                <div className="card-standard p-8 flex flex-col hover:-translate-y-1">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                    <AlertTriangle className="w-6 h-6 text-rose-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink)] mb-6">Key Signals</h3>
                  <ul className="space-y-4 flex-1">
                    {resultData.reasons.slice(0,3).map((reason, idx) => {
                      const isPositive = reason.startsWith('✓');
                      return (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0">
                            {isPositive ? (
                              <CircleCheck className="w-4 h-4 text-[var(--success)]" />
                            ) : (
                              <TriangleAlert className="w-4 h-4 text-[var(--warning)]" />
                            )}
                          </div>
                          <span className="text-sm font-bold text-[var(--ink)] leading-snug">
                            {reason.substring(2)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

              </div>

              {/* Scheme Banner */}
              <div className="mt-6 bg-[var(--ink)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-lg">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                 <div className="flex items-center gap-4 relative z-10">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                     <Landmark className="w-6 h-6 text-white" />
                   </div>
                   <div>
                     <h4 className="text-lg font-extrabold text-white">Government Support</h4>
                     <p className="text-sm font-medium text-slate-300">We found {schemes.length} schemes that may help bridge your capital gap.</p>
                   </div>
                 </div>
                 <div className="relative z-10">
                   <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-bold whitespace-nowrap">
                     Review in Roadmap
                   </span>
                 </div>
              </div>
            </div>

            {/* WHAT SHOULD I DO NEXT? */}
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--ink)] mb-8 tracking-tight flex items-center gap-3">
                <ListTodo className="w-6 h-6 text-[var(--action)]" /> What should I do next?
              </h2>
              
              <div className="card-standard p-8 md:p-12">
                <ul className="space-y-8 relative before:absolute before:inset-y-0 before:left-[1.3rem] before:w-px before:bg-[var(--line)]">
                  
                  <li className="relative flex gap-6 z-10">
                    <div className="w-11 h-11 bg-white border-2 border-[var(--ink)] rounded-full flex items-center justify-center font-extrabold text-[var(--ink)] flex-shrink-0 z-10 shadow-sm">1</div>
                    <div className="pt-2">
                      <h4 className="text-lg font-bold text-[var(--ink)] mb-2">Validate your market manually</h4>
                      <p className="text-base text-[var(--muted)] font-medium leading-relaxed max-w-2xl">
                        Before spending any money, speak to at least 10 potential customers in your area to confirm they would buy your service/product at your planned price.
                      </p>
                    </div>
                  </li>
                  
                  <li className="relative flex gap-6 z-10">
                    <div className="w-11 h-11 bg-white border-2 border-[var(--ink)] rounded-full flex items-center justify-center font-extrabold text-[var(--ink)] flex-shrink-0 z-10 shadow-sm">2</div>
                    <div className="pt-2">
                      <h4 className="text-lg font-bold text-[var(--ink)] mb-2">Review your financial buffer</h4>
                      <p className="text-base text-[var(--muted)] font-medium leading-relaxed max-w-2xl">
                        Ensure you have enough working capital to survive the first 3-6 months without strong sales, as businesses take time to stabilize.
                      </p>
                    </div>
                  </li>
                  
                  <li className="relative flex gap-6 z-10">
                    <div className="w-11 h-11 bg-white border-2 border-[var(--ink)] rounded-full flex items-center justify-center font-extrabold text-[var(--ink)] flex-shrink-0 z-10 shadow-sm">3</div>
                    <div className="pt-2">
                      <h4 className="text-lg font-bold text-[var(--ink)] mb-2">Explore financing and schemes</h4>
                      <p className="text-base text-[var(--muted)] font-medium leading-relaxed max-w-2xl">
                        Check your eligibility for the recommended government schemes before opting for a standard commercial loan, as subsidies can significantly reduce your burden.
                      </p>
                    </div>
                  </li>

                </ul>
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

            <div className="mt-8 pt-10 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-sm text-[var(--muted)] font-medium hidden sm:block">Step 8 of 8</p>
              <button
                onClick={handleContinue}
                className="primary-button btn-lg w-full sm:w-auto shadow-xl shadow-orange-500/20 hover:-translate-y-1"
              >
                Show me my roadmap <ArrowRight className="btn-icon ml-1" />
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
