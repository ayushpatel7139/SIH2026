import { SwotInsight } from '@/lib/feasibility';
import { ArrowUpRight, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck } from "lucide-react";

interface SwotQuadrantProps {
  title: string;
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  insights: SwotInsight[];
}

export default function SwotQuadrant({ title, type, insights }: SwotQuadrantProps) {
  const getStyles = () => {
    switch (type) {
      case 'strength': 
        return { 
          bg: 'bg-green-50', 
          border: 'border-green-200', 
          icon: 'text-[var(--success)]',
          iconBg: 'bg-green-100', 
          IconComp: ShieldCheck 
        };
      case 'weakness': 
        return { 
          bg: 'bg-orange-50', 
          border: 'border-orange-200', 
          icon: 'text-[var(--warning)]', 
          iconBg: 'bg-orange-100', 
          IconComp: AlertTriangle 
        };
      case 'opportunity': 
        return { 
          bg: 'bg-blue-50', 
          border: 'border-blue-200', 
          icon: 'text-[var(--primary)]', 
          iconBg: 'bg-blue-100', 
          IconComp: ArrowUpRight 
        };
      case 'threat': 
        return { 
          bg: 'bg-red-50', 
          border: 'border-red-200', 
          icon: 'text-[var(--danger)]', 
          iconBg: 'bg-red-100', 
          IconComp: AlertTriangle 
        };
      default: 
        return { 
          bg: 'bg-slate-50', 
          border: 'border-slate-200', 
          icon: 'text-[var(--muted)]', 
          iconBg: 'bg-slate-200', 
          IconComp: HelpCircle 
        };
    }
  };

  const style = getStyles();
  const Icon = style.IconComp;

  return (
    <div className={`rounded-3xl border-2 p-8 h-full ${style.bg} ${style.border}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${style.iconBg} ${style.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className={`text-sm font-extrabold tracking-widest uppercase ${style.icon}`}>
          {title}
        </h3>
      </div>
      
      <ul className="space-y-4">
        {insights.map((insight, idx) => (
          <li key={idx} className="flex items-start gap-3 bg-white/60 p-4 rounded-xl">
            <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-current ${style.icon}`}></div>
            <span className="text-sm font-bold text-[var(--ink)] leading-relaxed">{insight.text}</span>
          </li>
        ))}
        {insights.length === 0 && (
          <li className="text-sm text-[var(--muted)] italic p-4">No specific insights identified.</li>
        )}
      </ul>
    </div>
  );
}
