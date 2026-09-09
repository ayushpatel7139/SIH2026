"use client";

import { useState, useEffect } from "react";
import { Loader2, CircleCheck } from "lucide-react";

export interface LoadingStep {
  text: string;
  subtext: string;
}

interface ContextualLoaderProps {
  steps: LoadingStep[];
  stepDuration?: number; // duration per step in ms
  onComplete?: () => void;
}

export default function ContextualLoader({ 
  steps, 
  stepDuration = 1000,
  onComplete 
}: ContextualLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, stepDuration);

    return () => clearTimeout(timer);
  }, [currentStep, steps.length, stepDuration, onComplete]);

  const isComplete = currentStep >= steps.length;
  const currentText = isComplete ? "Your analysis is ready." : steps[currentStep]?.text;

  return (
    <div className="flex flex-col items-center justify-center py-24 w-full max-w-md mx-auto">
      <div className="relative mb-8">
        {isComplete ? (
          <CircleCheck className="w-16 h-16 text-[var(--success)] animate-in zoom-in duration-300" />
        ) : (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 border-4 border-slate-100 rounded-full"></div>
            <Loader2 className="w-16 h-16 text-[var(--primary)] animate-spin" />
          </div>
        )}
      </div>

      <div className="text-center w-full min-h-[120px]">
        <h2 className="text-xl md:text-2xl font-extrabold text-[var(--ink)] mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300" key={`text-${currentStep}`}>
          {currentText}
        </h2>
        
        <div className="space-y-3 flex flex-col items-start max-w-xs mx-auto">
          {steps.map((step, idx) => {
            if (idx > currentStep) return null;
            
            const isFinished = idx < currentStep || isComplete;
            return (
              <div 
                key={idx} 
                className={`flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-bottom-1 duration-300 w-full text-left ${
                  isFinished ? "text-[var(--success)]" : "text-[var(--muted)]"
                }`}
              >
                {isFinished ? (
                  <span className="text-[var(--success)] font-extrabold tracking-widest text-lg leading-none w-5 flex justify-center">✓</span>
                ) : (
                  <div className="w-5 flex justify-center">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin inline-block"></span>
                  </div>
                )}
                {step.subtext}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
