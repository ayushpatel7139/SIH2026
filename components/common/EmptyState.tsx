"use client";

import { LucideIcon } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon
}: EmptyStateProps) {
  return (
    <div className="card-standard p-12 text-center w-full max-w-2xl mx-auto flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-2">
      <div className="w-20 h-20 bg-slate-50 border border-[var(--line)] rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Icon className="w-10 h-10 text-[var(--muted)]" />
      </div>
      <h2 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight mb-3">
        {title}
      </h2>
      <p className="text-base text-[var(--muted)] font-medium mb-8 max-w-sm leading-relaxed">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="primary-button btn-lg shadow-md"
        >
          {actionLabel} {actionIcon}
        </button>
      )}
    </div>
  );
}
