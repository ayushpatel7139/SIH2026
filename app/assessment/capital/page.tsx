"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { ArrowRight, ArrowLeft, Wallet, ReceiptText, Info, CircleDollarSign } from "lucide-react";
import {
  ExistingCommitments
} from "@/types/assessment";

export default function CapitalScreen() {
  const router = useRouter();
  const {
    ownInvestment,
    hasExistingLoan,
    existingLoanPayment,
    setCapital
  } = useAssessmentStore();

  const isFormComplete = () => {
    if (!ownInvestment) return false;
    if (!hasExistingLoan) return false;
    
    if (hasExistingLoan === "Yes") {
      if (!existingLoanPayment) return false;
    }
    
    return true;
  };

  const handleContinue = () => {
    if (isFormComplete()) {
      router.push("/assessment/market");
    }
  };

  const handleBack = () => {
    router.push("/assessment/business");
  };

  const quickAmounts = ["₹25,000", "₹50,000", "₹1,00,000", "₹2,00,000+"];
  const existingLoanOptions: ExistingCommitments[] = ["No", "Yes"];

  return (
    <main className="welcome-page min-h-screen bg-[var(--cream)] relative overflow-hidden flex flex-col fade-in">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-green-50 via-transparent to-transparent -z-10 opacity-60"></div>

      <div className="welcome-container p-6 sm:p-8 lg:p-12 flex-1 flex flex-col relative z-10">
        
        <header className="mb-12">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Business
          </button>
        </header>

        <section className="flex-1 max-w-5xl mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Main Form Area */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[var(--line)] flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 text-[var(--success)]" />
               </div>
               <div>
                  <div className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-1">Step 4 of 4</div>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
                    Let's understand your budget
                  </h1>
               </div>
            </div>
            
            <p className="text-lg text-[var(--muted)] font-medium mb-12 leading-relaxed ml-0 sm:ml-16">
              Knowing what you can invest helps us build a realistic financial plan. An estimate is enough—you can refine it later.
            </p>

            <div className="ml-0 sm:ml-16 space-y-10">
              
              {/* 1. Own Investment */}
              <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
                <label className="text-sm font-extrabold text-[var(--ink)] tracking-tight block mb-2">1. Your Own Investment</label>
                <p className="text-[var(--muted)] font-medium text-sm mb-6">How much can you invest from your own savings?</p>
                
                <div className="relative group">
                  <span className="absolute left-6 top-5 text-xl font-bold text-[var(--muted)] group-focus-within:text-[var(--success)] transition-colors">₹</span>
                  <input
                    type="text"
                    value={ownInvestment?.replace('₹', '') || ""}
                    onChange={(e) => setCapital({ ownInvestment: `₹${e.target.value.replace(/[^0-9,]/g, '')}` })}
                    placeholder="E.g. 50,000"
                    className="w-full py-5 pl-12 pr-6 rounded-2xl border-2 border-[var(--line)] bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-[var(--success)] text-2xl font-bold transition-all"
                  />
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  {quickAmounts.map(amt => (
                    <button
                      key={amt}
                      onClick={() => setCapital({ ownInvestment: amt })}
                      className="px-5 py-2.5 rounded-xl border-2 border-[var(--line)] bg-white text-sm hover:border-[var(--success)] hover:text-[var(--success)] hover:bg-green-50 transition-all font-bold text-[var(--muted)] hover:-translate-y-0.5"
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Existing Commitments */}
              <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
                <label className="text-sm font-extrabold text-[var(--ink)] tracking-tight block mb-2">2. Existing Commitments</label>
                <p className="text-[var(--muted)] font-medium text-sm mb-6">Do you currently have any loan or EMI?</p>
                
                <div className="flex gap-4">
                  {existingLoanOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setCapital({ 
                          hasExistingLoan: option,
                          existingLoanPayment: option === "No" ? null : existingLoanPayment
                        });
                      }}
                      className={`px-8 py-4 rounded-xl border-2 transition-all font-bold text-base flex-1 ${
                        hasExistingLoan === option 
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm -translate-y-0.5' 
                          : 'border-[var(--line)] bg-slate-50 text-[var(--muted)] hover:border-slate-300 hover:text-[var(--ink)] hover:bg-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {hasExistingLoan === "Yes" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-6 pt-6 border-t border-[var(--line)]">
                    <label className="text-xs font-bold tracking-widest text-[var(--muted)] uppercase block mb-3">Approximate monthly EMI</label>
                    <div className="relative group">
                      <span className="absolute left-5 top-4 text-lg font-bold text-[var(--muted)] group-focus-within:text-[var(--warning)] transition-colors">₹</span>
                      <input
                        type="text"
                        value={existingLoanPayment?.replace('₹', '') || ""}
                        onChange={(e) => setCapital({ existingLoanPayment: `₹${e.target.value.replace(/[^0-9,]/g, '')}` })}
                        placeholder="E.g. 5,000"
                        className="w-full py-4 pl-10 pr-6 rounded-xl border-2 border-[var(--line)] bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-100 focus:border-[var(--warning)] text-lg font-bold transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
            
            {/* Mobile Actions */}
            <div className="mt-12 ml-0 sm:ml-16 pt-8 border-t border-[var(--line)] flex lg:hidden">
              <button
                onClick={handleContinue}
                disabled={!isFormComplete()}
                className={`primary-button w-full py-5 text-xl ${
                  !isFormComplete() ? 'opacity-50 cursor-not-allowed hover:-translate-y-0' : ''
                }`}
              >
                Analyze Market <ArrowRight className="w-6 h-6 ml-2" />
              </button>
            </div>

          </div>

          {/* Right Area: Smart Summary Card (Desktop) */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <div className="sticky top-8 flex flex-col gap-6">
              
              <div className="bg-[var(--ink)] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <h3 className="text-[10px] font-bold tracking-widest text-slate-400 mb-8 uppercase flex items-center gap-2">
                    <CircleDollarSign className="w-4 h-4 text-emerald-400" />
                    Your Financial Start
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="text-slate-400 font-medium text-xs mb-1 uppercase tracking-wider">Own Contribution</div>
                      <div className="font-extrabold text-3xl text-emerald-400 tracking-tight">
                        {ownInvestment ? (ownInvestment.startsWith('₹') ? ownInvestment : `₹${ownInvestment}`) : '—'}
                      </div>
                    </div>
                    
                    <div className="h-px bg-white/10"></div>

                    <div>
                      <div className="text-slate-400 font-medium text-xs mb-1 uppercase tracking-wider">Existing Monthly EMI</div>
                      <div className="font-extrabold text-2xl text-amber-400 tracking-tight">
                        {hasExistingLoan === 'No'
                          ? '₹0'
                          : existingLoanPayment
                            ? (existingLoanPayment.startsWith('₹') ? existingLoanPayment : `₹${existingLoanPayment}`)
                            : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <p className="text-sm text-[var(--primary)] font-medium leading-relaxed">
                  We'll use this along with your business details to estimate your funding gap and repayment capacity in the next step.
                </p>
              </div>

              <button
                onClick={handleContinue}
                disabled={!isFormComplete()}
                className={`primary-button w-full hidden lg:flex py-5 text-lg shadow-lg shadow-orange-500/20 ${
                  !isFormComplete() ? 'opacity-50 cursor-not-allowed hover:-translate-y-0 shadow-none' : ''
                }`}
              >
                Analyze Market <ArrowRight className="w-5 h-5 ml-2" />
              </button>

            </div>
          </aside>

        </section>
      </div>
    </main>
  );
}
