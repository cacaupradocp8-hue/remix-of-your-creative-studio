import React from 'react';
import { cn } from '@/lib/utils';

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Eyebrow = ({ children, className, dot = false }: EyebrowProps) => {
  return (
    <div className={cn("caption text-ink-3 flex items-center gap-3", className)}>
      {children}
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-leaf" />}
    </div>
  );
};
