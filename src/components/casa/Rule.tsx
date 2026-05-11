import React from 'react';
import { cn } from '@/lib/utils';

interface RuleProps {
  className?: string;
  vertical?: boolean;
}

export const Rule = ({ className, vertical = false }: RuleProps) => {
  return (
    <div 
      className={cn(
        vertical ? "hairline-rule-v" : "hairline-rule", 
        className
      )} 
    />
  );
};
