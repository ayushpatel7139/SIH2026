import { ShieldAlert, Database, Calendar } from "lucide-react";

interface SourceBadgeProps {
  source: string;
  date: string;
  confidence: 'High' | 'Medium' | 'Low';
  isDemo?: boolean;
}

export default function SourceBadge({ source, date, confidence, isDemo = false }: SourceBadgeProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-[10px] font-bold px-5 py-3 bg-slate-50 rounded-xl border border-[var(--line)] w-fit">
      
      <div className="flex items-center gap-2 text-[var(--muted)]">
        <Database className="w-3 h-3" />
        <span className="text-[var(--ink)] opacity-70 uppercase tracking-wider">Source:</span> 
        <span className="text-[var(--ink)] flex items-center gap-2">
          {source} 
          {isDemo && <span className="text-[var(--warning)] bg-[var(--warning-bg)] px-2 py-0.5 rounded uppercase tracking-wider font-extrabold border border-[var(--warning)]">Demo</span>}
        </span>
      </div>
      
      <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
      
      <div className="flex items-center gap-2 text-[var(--muted)]">
        <Calendar className="w-3 h-3" />
        <span className="text-[var(--ink)] opacity-70 uppercase tracking-wider">Date:</span> 
        <span className="text-[var(--ink)]">{date}</span>
      </div>
      
      <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
      
      <div className="flex items-center gap-2 text-[var(--muted)]">
        <ShieldAlert className="w-3 h-3" />
        <span className="text-[var(--ink)] opacity-70 uppercase tracking-wider">Confidence:</span> 
        <span className={`px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
          confidence === 'High' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]' : 
          confidence === 'Medium' ? 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]' : 
          'bg-slate-200 text-slate-500 border-slate-300'
        }`}>{confidence}</span>
      </div>

    </div>
  );
}
