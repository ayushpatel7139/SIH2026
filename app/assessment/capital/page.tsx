"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { ArrowRight, ArrowLeft, Wallet, Calculator, CircleCheck } from "lucide-react";
import { ExistingCommitments } from "@/types/assessment";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import AuthModal from "@/components/auth/AuthModal";

export default function CapitalScreen() {
  const router = useRouter();
  const { user, saveAssessment } = useAuthStore();
  const assessmentStore = useAssessmentStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {
    ownInvestment,
    hasExistingLoan,
    existingLoanPayment,
    setCapital,
    assessmentId,
    businessIdea,
    businessCategory,
    village,
    district
  } = assessmentStore;

  const isFormComplete = () => {
    if (!ownInvestment) return false;
    if (!hasExistingLoan) return false;
    if (hasExistingLoan === "Yes") {
      if (!existingLoanPayment) return false;
    }
    return true;
  };

  const saveCurrentAssessment = () => {
    const id = assessmentId || `ast_${Math.random().toString(36).substr(2, 9)}`;
    const name = businessIdea || businessCategory || 'New Business Assessment';
    const loc = village && district ? `${village}, ${district}` : district || 'Location set';
    
    saveAssessment(
      id,
      assessmentStore,
      name,
      loc,
      'In Progress',
      '/assessment/capital',
      50 // arbitrary completion percentage
    );
  };

  const proceedToAnalysis = () => {
    saveCurrentAssessment();
    router.push("/assessment/market");
  };

  const handleContinue = () => {
    if (isFormComplete()) {
      if (user) {
        proceedToAnalysis();
      } else {
        setShowAuthModal(true);
      }
    }
  };

  const handleBack = () => {
    router.push("/assessment/business");
  };

  const quickAmounts = ["₹25,000", "₹50,000", "₹1,00,000", "₹2,00,000+"];
  const existingLoanOptions: {val: ExistingCommitments, label: string}[] = [
    { val: "No", label: "No, I don't have any existing loans" },
    { val: "Yes", label: "Yes, I am currently paying EMIs" }
  ];

  const displayOwn = ownInvestment ? parseInt(ownInvestment.replace(/[^0-9]/g, '')) || 0 : 0;

  return (
    <main className="flex-1 flex flex-col bg-[var(--cream)] relative overflow-hidden fade-in">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-green-100/40 via-transparent to-transparent -z-10 rounded-bl-full"></div>

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-6 sm:px-8 py-10 lg:py-16 relative z-10">
        
        <header className="mb-10">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Main Form Area */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[var(--line)] flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-6 h-6 text-[var(--success)]" />
               </div>
               <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
                 What resources do I have?
               </h1>
            </div>
            
            <p className="text-lg text-[var(--muted)] font-medium mb-12 leading-relaxed ml-0 sm:ml-16">
              Understanding your current capital helps us calculate funding gaps and prepare a realistic financial plan.
            </p>

            <div className="ml-0 sm:ml-16 space-y-12 slide-up">
              
              {/* Own Investment */}
              <section className="space-y-4">
                <div>
                  <label htmlFor="own-investment" className="premium-label">How much can you invest from your own savings?</label>
                  <span className="helper-text">This helps determine your funding gap and eligibility for subsidies.</span>
                </div>
                
                <div className="relative group max-w-md">
                  <span className="absolute left-6 top-6 text-2xl font-extrabold text-[var(--success)] transition-colors">₹</span>
                  <input
                    id="own-investment"
                    type="text"
                    value={ownInvestment?.replace('₹', '') || ""}
                    onChange={(e) => setCapital({ ownInvestment: `₹${e.target.value.replace(/[^0-9,]/g, '')}` })}
                    placeholder="50,000"
                    className="w-full py-6 pl-14 pr-6 rounded-2xl border-2 border-[var(--line)] bg-white focus:outline-none focus:border-[var(--success)] focus:ring-4 focus:ring-green-100 text-3xl font-extrabold text-[var(--ink)] transition-all shadow-sm"
                  />
                </div>
                
                <div className="max-w-md pt-2">
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={displayOwn}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > 0) {
                        setCapital({ ownInvestment: `₹${val.toLocaleString('en-IN')}` });
                      } else {
                        setCapital({ ownInvestment: "" });
                      }
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--success)]"
                    aria-label="Investment Slider"
                  />
                  <div className="flex justify-between text-xs font-bold text-[var(--muted)] mt-2">
                    <span>₹0</span>
                    <span>₹10L+</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {quickAmounts.map(amt => (
                    <button
                      key={amt}
                      onClick={() => setCapital({ ownInvestment: amt })}
                      className="px-4 py-2 rounded-lg border border-[var(--line)] bg-white text-sm hover:border-[var(--success)] hover:text-[var(--success)] hover:bg-green-50 transition-all font-bold text-[var(--muted)]"
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </section>

              {/* Existing Commitments */}
              <section className="space-y-4">
                <div>
                  <label className="premium-label" id="loan-label">Do you currently have any loan or EMI?</label>
                  <span className="helper-text">This helps us calculate your repayment capacity securely.</span>
                </div>
                <div className="grid grid-cols-1 gap-3 max-w-md" role="radiogroup" aria-labelledby="loan-label">
                  {existingLoanOptions.map(option => (
                    <button
                      key={option.val}
                      role="radio"
                      aria-checked={hasExistingLoan === option.val}
                      onClick={() => {
                        setCapital({ 
                          hasExistingLoan: option.val,
                          existingLoanPayment: option.val === "No" ? null : existingLoanPayment
                        });
                      }}
                      className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all font-bold text-base text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                        hasExistingLoan === option.val 
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm' 
                          : 'border-[var(--line)] bg-white text-[var(--ink)] hover:border-slate-300'
                      }`}
                    >
                      {option.label}
                      {hasExistingLoan === option.val && <CircleCheck className="w-5 h-5" />}
                    </button>
                  ))}
                </div>

                {hasExistingLoan === "Yes" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 max-w-md bg-slate-50 p-6 rounded-2xl border border-[var(--line)] mt-4">
                    <label htmlFor="emi-amount" className="premium-label">Approximate monthly EMI</label>
                    <div className="relative group mt-2">
                      <span className="absolute left-5 top-4 text-lg font-bold text-[var(--warning)]">₹</span>
                      <input
                        id="emi-amount"
                        type="text"
                        value={existingLoanPayment?.replace('₹', '') || ""}
                        onChange={(e) => setCapital({ existingLoanPayment: `₹${e.target.value.replace(/[^0-9,]/g, '')}` })}
                        placeholder="5,000"
                        className="w-full py-4 pl-10 pr-6 rounded-xl border border-[var(--line)] bg-white focus:outline-none focus:border-[var(--warning)] focus:ring-2 focus:ring-amber-100 text-xl font-extrabold text-[var(--ink)] transition-all shadow-sm"
                      />
                    </div>
                    {hasExistingLoan === "Yes" && !existingLoanPayment && (
                      <span className="inline-error mt-2">Please enter your approximate EMI amount</span>
                    )}
                  </div>
                )}
              </section>

              {/* Mobile Actions */}
              <div className="pt-8 border-t border-[var(--line)] flex lg:hidden">
                <button
                  onClick={handleContinue}
                  disabled={!isFormComplete()}
                  className={`primary-button btn-lg w-full shadow-lg shadow-orange-500/20 ${
                    !isFormComplete() ? 'opacity-50 cursor-not-allowed hover:-translate-y-0 shadow-none' : ''
                  }`}
                >
                  Analyze my local market <ArrowRight className="btn-icon ml-1" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Area: Math Visual */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              
              <div className="card-standard p-6 text-center slide-up delay-200">
                <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-6">
                  <Calculator className="w-6 h-6 text-[var(--primary)]" />
                </div>
                
                <h3 className="text-sm font-bold text-[var(--ink)] mb-6">How we use this info</h3>

                <div className="flex flex-col gap-3 font-mono">
                  <div className="bg-green-50 border border-green-100 p-4 rounded-2xl">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-1 font-sans">Your contribution</div>
                    <div className="text-2xl font-extrabold text-green-700">₹{displayOwn.toLocaleString('en-IN')}</div>
                  </div>
                  
                  <div className="text-2xl font-extrabold text-[var(--muted)]">+</div>
                  
                  <div className="bg-slate-50 border border-[var(--line)] p-4 rounded-2xl border-dashed">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1 font-sans">Estimated finance requirement</div>
                    <div className="text-lg font-bold text-[var(--muted)]">Calculated next...</div>
                  </div>

                  <div className="text-2xl font-extrabold text-[var(--muted)]">=</div>

                  <div className="bg-[var(--ink)] border border-slate-700 p-4 rounded-2xl shadow-inner">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 font-sans">Estimated project cost</div>
                    <div className="text-lg font-bold text-white">Estimated based on business type</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!isFormComplete()}
                className={`primary-button btn-lg w-full hidden lg:flex shadow-lg shadow-orange-500/20 transition-all ${
                  !isFormComplete() ? 'opacity-50 cursor-not-allowed hover:-translate-y-0 shadow-none' : 'hover:-translate-y-1'
                }`}
              >
                Analyze my local market <ArrowRight className="btn-icon ml-1" />
              </button>

            </div>
          </aside>

        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          proceedToAnalysis();
        }}
      />
    </main>
  );
}
