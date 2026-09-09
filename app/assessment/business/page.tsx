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
  Store,
  CircleCheck
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

  const categories: { label: BusinessCategory, icon: any, example: string }[] = [
    { label: "Agriculture & Allied", icon: Sprout, example: "Dairy, poultry, farming" },
    { label: "Food & Processing", icon: Package, example: "Bakery, snacks, spices" },
    { label: "Retail & Local Services", icon: ShoppingBag, example: "Kirana, tailoring, repair" },
    { label: "Manufacturing", icon: Factory, example: "Handicrafts, furniture" },
    { label: "Transport & Logistics", icon: Truck, example: "Delivery, farm transport" },
    { label: "Digital & Professional Services", icon: Laptop, example: "Computer centre, printing" },
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
    <main className="flex-1 flex flex-col bg-[var(--cream)] relative overflow-hidden fade-in">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-orange-50/50 via-transparent to-transparent -z-10"></div>
      
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 sm:px-8 py-10 lg:py-16 relative z-10">
        
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
              <Store className="w-6 h-6 text-[var(--action)]" />
           </div>
           <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
             What business do I want to build?
           </h1>
        </div>
        
        <p className="text-lg text-[var(--muted)] font-medium mb-12 leading-relaxed ml-0 sm:ml-16 max-w-2xl">
          Define your idea so we can evaluate its viability in your selected market and match it with industry benchmarks.
        </p>

        <div className="ml-0 sm:ml-16 space-y-12 slide-up">
          
          {/* Category Selection */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--ink)]">Select a business category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const isSelected = businessCategory === cat.label;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setBusiness({ businessCategory: cat.label })}
                    className={`card-interactive !border-2 p-6 text-left transition-all duration-300 ${
                      isSelected 
                        ? '!border-[var(--primary)] !bg-[var(--primary)] text-white' 
                        : ''
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-4 ${isSelected ? 'text-blue-200' : 'text-[var(--primary)]'}`} />
                    <div className="font-bold text-base leading-snug mb-1">{cat.label}</div>
                    <div className={`text-xs font-medium ${isSelected ? 'text-blue-100' : 'text-[var(--muted)]'}`}>
                      {cat.example}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Business Input */}
            <div className="mt-4 card-standard p-6">
              <label htmlFor="custom-business" className="premium-label">
                Don't see your business?
              </label>
              <span className="helper-text">Type your specific business idea and we will categorize it for you.</span>
              <input
                id="custom-business"
                type="text"
                value={businessIdea || ""}
                onChange={(e) => setBusiness({ 
                  businessIdea: e.target.value,
                  businessCategory: e.target.value ? "Other" : businessCategory
                })}
                placeholder="e.g., tailoring shop, local dairy"
                className="input-standard mt-2"
              />
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stage */}
            <section className="card-standard p-8 space-y-4">
              <div>
                <label className="premium-label" id="stage-label">Where are you with this idea?</label>
                <span className="helper-text">This helps us match you with seed or expansion funding.</span>
              </div>
              <div className="flex flex-col gap-3" role="radiogroup" aria-labelledby="stage-label">
                {stageOptions.map(option => (
                  <button
                    key={option}
                    role="radio"
                    aria-checked={businessStage === option}
                    onClick={() => setBusiness({ businessStage: option, existingBusinessDuration: null })}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                      businessStage === option 
                        ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm' 
                        : 'border-[var(--line)] bg-slate-50 text-[var(--ink)] hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <span className="font-bold text-sm">{option}</span>
                    {businessStage === option && <CircleCheck className="w-5 h-5" />}
                  </button>
                ))}
              </div>

              {businessStage === "Already running" && (
                <div className="animate-in fade-in duration-300 mt-4 pt-4 border-t border-[var(--line)]">
                  <label className="premium-label" id="duration-label">How long?</label>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="duration-label">
                    {durationOptions.map(option => (
                      <button
                        key={option}
                        role="radio"
                        aria-checked={existingBusinessDuration === option}
                        onClick={() => setBusiness({ existingBusinessDuration: option })}
                        className={`px-4 py-2 rounded-lg border-2 transition-all font-bold text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                          existingBusinessDuration === option 
                            ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-sm' 
                            : 'border-[var(--line)] bg-slate-50 text-[var(--ink)] hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Goal */}
            <section className="card-standard p-8 space-y-4">
              <div>
                <label className="premium-label" id="goal-label">What are you hoping to achieve?</label>
                <span className="helper-text">We'll tailor your business roadmap based on your ultimate goal.</span>
              </div>
              <div className="flex flex-col gap-3" role="radiogroup" aria-labelledby="goal-label">
                {goalOptions.map(option => (
                  <button
                    key={option}
                    role="radio"
                    aria-checked={businessGoal === option}
                    onClick={() => setBusiness({ businessGoal: option })}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                      businessGoal === option 
                        ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm' 
                        : 'border-[var(--line)] bg-slate-50 text-[var(--ink)] hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <span className="font-bold text-sm">{option}</span>
                    {businessGoal === option && <CircleCheck className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </section>
          </div>

        </div>

        <div className="mt-16 ml-0 sm:ml-16 pt-8 border-t border-[var(--line)] flex items-center justify-between">
          <p className="text-sm text-[var(--muted)] font-medium hidden sm:block">Step 3 of 4</p>
          <button
            onClick={handleContinue}
            disabled={!isFormComplete}
            className={`primary-button btn-lg shadow-lg shadow-orange-500/20 hover:-translate-y-1 w-full sm:w-auto ${
              !isFormComplete ? 'opacity-50 cursor-not-allowed hover:-translate-y-0 shadow-none' : ''
            }`}
          >
            Review your resources <ArrowRight className="btn-icon ml-1" />
          </button>
        </div>

      </div>
    </main>
  );
}
