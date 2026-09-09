import { RiskAction } from '@/lib/feasibility';
import { CircleAlert, ShieldAlert } from "lucide-react";

export default function RiskCard({ riskData, index }: { riskData: RiskAction, index?: number }) {
  return (
    <div className="card-interactive p-8 h-full flex flex-col relative overflow-hidden group hover:!border-[var(--danger)]">
      {index && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full flex items-start justify-end p-6 transition-colors group-hover:bg-red-100">
          <span className="font-extrabold text-red-200 text-3xl leading-none">0{index}</span>
        </div>
      )}
      
      <div className="w-12 h-12 rounded-2xl bg-red-50 text-[var(--danger)] flex items-center justify-center flex-shrink-0 mb-6">
        <ShieldAlert className="w-6 h-6" />
      </div>

      <h3 className="font-extrabold text-[var(--ink)] text-lg leading-tight mb-4 pr-12">{riskData.risk}</h3>
      
      <p className="text-sm font-medium text-[var(--muted)] mb-8 flex-1 leading-relaxed">
        {riskData.reason}
      </p>
      
      <div className="bg-slate-50 rounded-2xl p-5 border border-[var(--line)]">
        <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2 flex items-center gap-2">
          <CircleAlert className="w-3 h-3 text-[var(--action)]" /> Recommended Action
        </p>
        <p className="text-sm font-bold text-[var(--ink)] leading-snug">{riskData.action}</p>
      </div>
    </div>
  );
}
