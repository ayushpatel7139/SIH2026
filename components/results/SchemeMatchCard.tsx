import { SchemeMatch } from '@/types/scheme';
import { ExternalLink, Landmark, ShieldCheck } from "lucide-react";

export default function SchemeMatchCard({ scheme }: { scheme: SchemeMatch }) {
  const isMatch = scheme.eligibilitySignal === 'Potential match';

  return (
    <div className="bg-white rounded-3xl border border-[var(--line)] p-8 shadow-sm flex flex-col h-full transition-all hover:border-[var(--primary)] hover:shadow-md hover:-translate-y-1">
      <div className="w-12 h-12 bg-blue-50 text-[var(--primary)] rounded-2xl flex items-center justify-center mb-6">
        <Landmark className="w-6 h-6" />
      </div>

      <h3 className="font-extrabold text-xl text-[var(--ink)] leading-tight mb-4">{scheme.name}</h3>
      
      <div className="mb-6">
        <span className={`inline-flex px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-lg border ${
          isMatch 
            ? 'bg-green-50 text-[var(--success)] border-green-200' 
            : 'bg-blue-50 text-[var(--primary)] border-blue-200'
        }`}>
          {scheme.eligibilitySignal}
        </span>
      </div>
      
      <div className="bg-slate-50 rounded-2xl p-5 mb-6 flex-1">
        <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Why it may fit you</p>
        <p className="text-sm text-[var(--ink)] font-medium leading-relaxed">
          {scheme.reasonToFit}
        </p>
      </div>
      
      <div className="mb-6 flex items-start gap-4">
        <div className="mt-1 bg-orange-50 p-2 rounded-xl text-[var(--action)]">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Financing Type</p>
          <p className="font-bold text-sm text-[var(--ink)]">{scheme.financingCategory}</p>
        </div>
      </div>
      
      <a 
        href={scheme.url} 
        onClick={(e) => e.preventDefault()} // disabled for demo
        className="w-full py-4 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-[var(--ink)] transition-colors"
      >
        Check Official Source <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
