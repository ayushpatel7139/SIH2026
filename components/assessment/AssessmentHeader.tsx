"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useAssessmentStore } from "@/store/assessment-store";
import { useToastStore } from "@/store/toast-store";
import { getCompletionPercentage } from "@/lib/completion";

import BackButton from "@/components/common/BackButton";

const STEPS = [
  { id: "location", label: "Where am I?", path: "/assessment/location" },
  { id: "profile", label: "Who am I?", path: "/assessment/profile" },
  { id: "business", label: "What to build?", path: "/assessment/business" },
  { id: "capital", label: "My Resources", path: "/assessment/capital" },
  { id: "market", label: "Local Market", path: "/assessment/market" },
  { id: "roadmap", label: "Financial Plan", path: "/assessment/roadmap" },
  { id: "swot", label: "Risks", path: "/assessment/swot" },
  { id: "result", label: "Feasibility", path: "/assessment/result" },
];

export default function AssessmentHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, saveAssessment } = useAuthStore();
  const assessmentStore = useAssessmentStore();
  const { showToast } = useToastStore();
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setIsSaving(true);
    
    const id = assessmentStore.assessmentId || `ast_${Math.random().toString(36).substr(2, 9)}`;
    const name = assessmentStore.businessIdea || assessmentStore.businessCategory || 'New Business Assessment';
    
    setTimeout(() => {
      saveAssessment(
        id, 
        assessmentStore, 
        name, 
        assessmentStore.district || 'Location not set', 
        'In Progress',
        pathname,
        getCompletionPercentage(pathname)
      );
      
      setIsSaving(false);
      showToast("Assessment saved ✓");
    }, 800);
  };

  const currentStepIndex = STEPS.findIndex(step => pathname.includes(step.id));
  
  if (currentStepIndex === -1) return null;

  return (
    <header className="no-print sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--line)] shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Back & Brand */}
        <div className="flex items-center gap-4">
          <div className="pr-4 border-r border-[var(--line)] hidden sm:block">
            <BackButton label="Back" fallbackRoute="/dashboard" />
          </div>
          <Link href="/" className="flex items-center gap-4 group hidden lg:flex">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm shrink-0 p-1.5">
              <img src="/udaan-logo.jpg" alt="Mirai Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-extrabold text-[var(--ink)] tracking-[0.1em] leading-none text-2xl uppercase group-hover:text-[var(--primary)] transition-colors">MIRAI</div>
            </div>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center justify-center max-w-3xl overflow-x-auto no-scrollbar mask-edges px-2">
          <div className="flex items-center gap-1 sm:gap-2 min-w-max">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                    isCurrent ? 'bg-[var(--primary-light)] text-[var(--primary)] border border-blue-200 shadow-sm' :
                    isCompleted ? 'text-[var(--success)]' :
                    'text-[var(--muted)] opacity-60'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <div className={`w-4 h-4 flex items-center justify-center text-[10px] font-extrabold rounded-full ${
                        isCurrent ? 'bg-[var(--primary)] text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {idx + 1}
                      </div>
                    )}
                    <span className={`text-xs font-bold tracking-wide ${isCurrent ? '' : 'hidden md:block'}`}>
                      {step.label}
                    </span>
                  </div>

                  {idx < STEPS.length - 1 && (
                    <div className={`w-4 sm:w-8 h-[2px] mx-1 rounded-full transition-colors ${
                      isCompleted ? 'bg-[var(--success)] opacity-30' : 'bg-[var(--line)]'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Actions / Auth */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            {isSaving && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving
              </span>
            )}
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors hidden sm:block disabled:opacity-50"
            >
              Save & Exit
            </button>
          </div>
          
          {user ? (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-[var(--line)]">
              <button 
                onClick={() => router.push('/dashboard')}
                className="hidden lg:block text-xs font-bold text-[var(--ink)] hover:text-[var(--primary)] transition-colors"
              >
                My Assessments
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-8 h-8 bg-slate-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-sm text-[var(--ink)] overflow-hidden"
              >
                {user.firstName.charAt(0).toUpperCase()}
              </button>
            </div>
          ) : (
            <div className="flex items-center ml-2 pl-4 border-l border-[var(--line)]">
              <button 
                onClick={() => router.push('/auth/signin')}
                className="text-xs font-bold text-[var(--ink)] hover:text-[var(--primary)] transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
