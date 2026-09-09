"use client";

import { useToastStore } from "@/store/toast-store";
import { CircleCheck } from "lucide-react";

export default function ToastProvider() {
  const { isVisible, message } = useToastStore();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[var(--ink)] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-sm">
        <CircleCheck className="w-5 h-5 text-[var(--success)]" />
        {message}
      </div>
    </div>
  );
}
