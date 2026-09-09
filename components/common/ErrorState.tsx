"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this information right now. Please try again.",
  onRetry
}: ErrorStateProps) {
  return (
    <div className="card-standard p-12 text-center w-full max-w-2xl mx-auto flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-2 !border-red-100">
      <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight mb-3">
        {title}
      </h2>
      <p className="text-base text-[var(--muted)] font-medium mb-8 max-w-sm leading-relaxed">
        {description}
      </p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="secondary-button btn-lg !border-2 shadow-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
}
