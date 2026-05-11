import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressDotProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressDot = ({ current, total, className }: ProgressDotProps) => {
  const progress = (current / total) * 100;
  
  return (
    <div className={cn("w-full h-px bg-rule relative", className)}>
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-leaf transition-all duration-500 ease-in-out"
        style={{ left: `${progress}%` }}
      />
    </div>
  );
};
