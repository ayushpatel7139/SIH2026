import { SchemeMatch } from '@/types/scheme';
import { ExternalLink, Landmark, Wallet, Check } from "lucide-react";

export default function SchemeMatchCard({ scheme }: { scheme: SchemeMatch }) {
  const isMatch = scheme.eligibilitySignal === 'Potential match';

  return (
    <div className="card-interactive p-8 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[var(--line)]">
        <div className="w-12 h-12 bg-blue-50 text-[var(--primary)] rounded-2xl flex items-center justify-center shrink-0">
          <Landmark className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-xl text-[var(--ink)] leading-tight mb-2">{scheme.name}</h3>
          <span className={`inline-flex px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-md border ${
            isMatch 
              ? 'bg-green-50 text-[var(--success)] border-green-200' 
              : 'bg-blue-50 text-[var(--primary)] border-blue-200'
          }`}>
            {scheme.eligibilitySignal}
          </span>
        </div>
      </div>

      {/* Potential Fit Checklist */}
      {scheme.potentialFit && scheme.potentialFit.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-3">Potential fit</p>
          <ul className="space-y-2">
            {scheme.potentialFit.map((fit, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm font-medium text-[var(--ink)]">
                <Check className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                <span>{fit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Potential Support */}
      <div className="mb-6 flex items-start gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
        <div className="bg-white p-2 rounded-xl text-[var(--action)] shadow-sm">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Potential Support</p>
          <p className="font-bold text-sm text-[var(--ink)]">{scheme.financingCategory}</p>
        </div>
      </div>
      
      {/* Why we're showing this */}
      <div className="bg-slate-50 rounded-2xl p-5 mb-8 flex-1 border border-slate-100">
        <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Why we're showing this</p>
        <p className="text-sm text-[var(--ink)] font-medium leading-relaxed italic">
          "{scheme.whyItMatches || scheme.reasonToFit}"
        </p>
      </div>

      {/* View Details CTA */}
      <a 
        href={scheme.url} 
        onClick={(e) => e.preventDefault()} // disabled for demo
        className="primary-button w-full mb-6 flex justify-center shadow-md"
      >
        View Details <ExternalLink className="w-4 h-4" />
      </a>

      {/* Source Footer */}
      <div className="text-xs text-[var(--muted)] font-medium text-center space-y-1">
        {scheme.source && <p>Source: {scheme.source}</p>}
        {scheme.lastUpdated && <p>Last updated: {scheme.lastUpdated}</p>}
      </div>
    </div>
  );
}
