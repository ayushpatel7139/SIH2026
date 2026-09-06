"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { 
  ArrowRight, 
  ArrowLeft, 
  Sprout, 
  Package, 
  ShoppingBag, 
  Factory, 
  Truck, 
  Laptop,
  Lightbulb,
  Store
} from "lucide-react";
import { 
  BusinessCategory, 
  BusinessStage, 
  BusinessDuration, 
  BusinessGoal 
} from "@/types/assessment";

export default function BusinessScreen() {
  const router = useRouter();
  const { 
    businessCategory,
    businessIdea,
    businessStage,
    existingBusinessDuration,
    businessGoal,
    setBusiness
  } = useAssessmentStore();

  const isFormComplete = 
    (businessCategory || businessIdea) && 
    businessStage && 
    (businessStage !== "Already running" || existingBusinessDuration) &&
    businessGoal;

  const handleContinue = () => {
    if (isFormComplete) {
      router.push("/assessment/capital");
    }
  };

  const handleBack = () => {
    router.push("/assessment/profile");
  };

  const categories: { label: BusinessCategory, icon: any, example: string, colorClass: string }[] = [
    { label: "Agriculture & Allied", icon: Sprout, example: "Dairy, poultry, farming", colorClass: "text-green-600 bg-green-50" },
    { label: "Food & Processing", icon: Package, example: "Bakery, snacks, spices", colorClass: "text-orange-600 bg-orange-50" },
    { label: "Retail & Local Services", icon: ShoppingBag, example: "Kirana, tailoring, repair", colorClass: "text-blue-600 bg-blue-50" },
    { label: "Manufacturing", icon: Factory, example: "Handicrafts, furniture", colorClass: "text-purple-600 bg-purple-50" },
    { label: "Transport & Logistics", icon: Truck, example: "Delivery, farm transport", colorClass: "text-slate-600 bg-slate-100" },
    { label: "Digital & Professional Services", icon: Laptop, example: "Computer centre, printing", colorClass: "text-cyan-600 bg-cyan-50" },
  ];

  const stageOptions: BusinessStage[] = ["Just exploring", "Planning to start", "Already running"];
  const durationOptions: BusinessDuration[] = ["Less than 1 year", "1–3 years", "3+ years"];
  const goalOptions: BusinessGoal[] = [
    "Start a new business", 
    "Expand my existing business", 
    "Improve an existing business", 
    "Explore a better business opportunity"
  ];

  return (
    <main className="welcome-page min-h-screen bg-[var(--cream)] relative overflow-hidden flex flex-col fade-in">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-orange-50 via-transparent to-transparent -z-10 opacity-60"></div>
      
      <div className="welcome-container p-6 sm:p-8 lg:p-12 flex-1 flex flex-col relative z-10">
        
        <header className="mb-12">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </button>
        </header>

        <section className="flex-1 max-w-4xl mx-auto w-full">
          
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[var(--line)] flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 text-[var(--action)]" />
             </div>
             <div>
                <div className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-1">Step 3 of 4</div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
                  What do you want to build?
                </h1>
             </div>
          </div>
          
          <p className="text-lg text-[var(--muted)] font-medium mb-12 leading-relaxed ml-0 sm:ml-16 max-w-2xl">
            Choose a business category so we can understand local demand, competition, and potential financing options.
          </p>

          <div className="ml-0 sm:ml-16 space-y-12">
            
            {/* 1. Category Selection */}
            <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
              <label className="text-sm font-extrabold text-[var(--ink)] tracking-tight block mb-6">1. Select a business category</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const isSelected = businessCategory === cat.label;
                  return (
                    <button
                      key={cat.label}
                      onClick={() => setBusiness({ businessCategory: cat.label })}
                      className={`p-5 rounded-2xl border-2 transition-all flex flex-col gap-4 text-left group ${
                        isSelected 
                          ? 'border-[var(--primary)] bg-[var(--primary)] shadow-md -translate-y-1' 
                          : 'border-[var(--line)] bg-slate-50 hover:bg-white hover:border-slate-300 hover:-translate-y-1 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-white/20 text-white' : cat.colorClass
                      }`}>
                        <cat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-bold text-sm mb-1 transition-colors ${isSelected ? 'text-white' : 'text-[var(--ink)]'}`}>
                          {cat.label}
                        </div>
                        <div className={`text-xs font-medium transition-colors ${isSelected ? 'text-blue-100' : 'text-[var(--muted)]'}`}>
                          {cat.example}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Business Input */}
              <div className="mt-8 pt-8 border-t border-[var(--line)]">
                <label className="text-xs font-bold tracking-widest text-[var(--muted)] uppercase block mb-4">Don't see your business?</label>
                <div className="relative group">
                  <Lightbulb className="absolute left-5 top-5 w-5 h-5 text-[var(--muted)] group-focus-within:text-[var(--action)] transition-colors" />
                  <input
                    type="text"
                    value={businessIdea || ""}
                    onChange={(e) => setBusiness({ 
                      businessIdea: e.target.value,
                      businessCategory: e.target.value ? "Other" : businessCategory
                    })}
                    placeholder="Type your business idea... (e.g. tailoring shop)"
                    className="w-full py-5 pl-14 pr-6 rounded-2xl border-2 border-[var(--line)] bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-[var(--action)] text-base font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 2. Business Stage */}
              <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
                <label className="text-sm font-extrabold text-[var(--ink)] tracking-tight block mb-6">2. Where are you with this idea?</label>
                <div className="flex flex-col gap-3">
                  {stageOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setBusiness({ businessStage: option, existingBusinessDuration: null })}
                      className={`px-6 py-4 rounded-xl border-2 transition-all font-bold text-sm text-left ${
                        businessStage === option 
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm' 
                          : 'border-[var(--line)] bg-slate-50 text-[var(--muted)] hover:border-slate-300 hover:text-[var(--ink)] hover:bg-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {businessStage === "Already running" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-6 pt-6 border-t border-[var(--line)]">
                    <label className="text-xs font-bold tracking-widest text-[var(--muted)] uppercase block mb-4">How long have you been running it?</label>
                    <div className="flex flex-wrap gap-2">
                      {durationOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => setBusiness({ existingBusinessDuration: option })}
                          className={`px-4 py-2.5 rounded-lg border-2 transition-all font-bold text-xs ${
                            existingBusinessDuration === option 
                              ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-sm' 
                              : 'border-[var(--line)] bg-slate-50 text-[var(--muted)] hover:border-slate-300 hover:text-[var(--ink)] hover:bg-white'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Business Goal */}
              <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
                <label className="text-sm font-extrabold text-[var(--ink)] tracking-tight block mb-6">3. What are you hoping to achieve?</label>
                <div className="flex flex-col gap-3">
                  {goalOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setBusiness({ businessGoal: option })}
                      className={`px-6 py-4 rounded-xl border-2 transition-all font-bold text-sm text-left ${
                        businessGoal === option 
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm' 
                          : 'border-[var(--line)] bg-slate-50 text-[var(--muted)] hover:border-slate-300 hover:text-[var(--ink)] hover:bg-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="mt-16 ml-0 sm:ml-16 pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleContinue}
              disabled={!isFormComplete}
              className={`primary-button w-full sm:w-auto px-10 py-4 text-lg ${
                !isFormComplete ? 'opacity-50 cursor-not-allowed hover:-translate-y-0' : ''
              }`}
            >
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

        </section>
      </div>
    </main>
  );
}
