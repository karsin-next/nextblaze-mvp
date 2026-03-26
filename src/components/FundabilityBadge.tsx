import React from 'react';

interface FundabilityBadgeProps {
  score: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function FundabilityBadge({ score, className = '', size = 'md' }: FundabilityBadgeProps) {
  // Color configuration based on Fundability ranges:
  // >= 67: Investor Ready (Emerald)
  // 34-66: Developing (Amber)
  // <= 33: High Risk (Rose)
  let colorClasses = "bg-gray-100 text-gray-500 border-gray-200"; 
  if (score > 66) {
    colorClasses = "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-500/20";
  } else if (score >= 34) {
    colorClasses = "bg-yellow-50 text-amber-600 border-yellow-200 shadow-yellow-500/20";
  } else if (score > 0) {
    colorClasses = "bg-rose-50 text-rose-600 border-rose-200 shadow-rose-500/20";
  }

  const sizeClasses = {
    sm: "w-16 h-16 border-2",
    md: "w-24 h-24 border-4",
    lg: "w-32 h-32 border-[6px]",
    xl: "w-40 h-40 border-8"
  };

  const textClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
    xl: "text-7xl"
  };

  const percentClasses = {
    sm: "text-[10px]",
    md: "text-[14px]",
    lg: "text-[20px]",
    xl: "text-[30px]"
  };

  const labelClasses = {
    sm: "text-[6px] mb-0",
    md: "text-[8px] mb-0.5",
    lg: "text-[10px] mb-1",
    xl: "text-[12px] mb-2"
  };

  return (
    <div className={`relative flex flex-col items-center justify-center rounded-full shadow-lg transition-all ${sizeClasses[size]} ${colorClasses} ${className}`}>
      {/* Decorative outline */}
      <div className="absolute inset-1 rounded-full border border-current opacity-20 pointer-events-none"></div>
      
      {/* Score Label */}
      <span className={`font-black uppercase tracking-widest opacity-80 leading-none ${labelClasses[size]}`}>
        Score
      </span>
      
      {/* Percentage Number */}
      <div className="flex items-center">
        <span className={`font-black leading-none ${textClasses[size]}`}>
          {score}
        </span>
        <span className={`font-black opacity-60 ml-[1px] ${percentClasses[size]}`}>
          %
        </span>
      </div>
    </div>
  );
}
