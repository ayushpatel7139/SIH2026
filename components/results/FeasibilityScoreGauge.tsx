interface FeasibilityScoreGaugeProps {
  score: number;
}

export default function FeasibilityScoreGauge({ score }: FeasibilityScoreGaugeProps) {
  let colorClass = 'text-[var(--warning)]';
  let strokeClass = 'stroke-[var(--warning)]';
  let bgClass = 'bg-[var(--warning-bg)]';
  
  if (score >= 75) {
    colorClass = 'text-[var(--success)]';
    strokeClass = 'stroke-[var(--success)]';
    bgClass = 'bg-green-50';
  } else if (score < 55) {
    colorClass = 'text-[var(--danger)]';
    strokeClass = 'stroke-[var(--danger)]';
    bgClass = 'bg-red-50';
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-full ${bgClass} shadow-inner`}>
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            className="text-white/50 mix-blend-overlay"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            strokeWidth="8" 
            strokeDasharray={`${(score / 100) * 283} 283`}
            strokeLinecap="round"
            className={`${strokeClass} transition-all duration-1000 ease-out`}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-6xl font-extrabold tracking-tighter ${colorClass} drop-shadow-sm`}>{score}</span>
          <span className={`text-xs font-bold uppercase tracking-widest mt-1 opacity-70 ${colorClass}`}>Score</span>
        </div>
      </div>
    </div>
  );
}
