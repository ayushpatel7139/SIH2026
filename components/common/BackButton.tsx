"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  fallbackRoute?: string;
}

export default function BackButton({ label = "Back", fallbackRoute = "/" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Basic heuristic to check if we can actually go back, otherwise use fallback
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackRoute);
    }
  };

  return (
    <button 
      onClick={handleBack}
      className="ghost-button group w-fit !pl-2"
    >
      <ArrowLeft className="btn-icon-sm group-hover:-translate-x-1 transition-transform duration-200" />
      {label}
    </button>
  );
}
