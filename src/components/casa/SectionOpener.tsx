import React from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow } from './Eyebrow';

interface SectionOpenerProps {
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
  inverted?: boolean;
}

export const SectionOpener = ({ eyebrow, title, lead, className, inverted = false }: SectionOpenerProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <Eyebrow dot className={inverted ? "text-paper/60" : ""}>{eyebrow}</Eyebrow>
      <h2 className={cn("display-lg", inverted ? "text-paper" : "text-ink")}>
        {title}
      </h2>
      {lead && (
        <p className={cn("serif-lead max-w-[680px]", inverted ? "text-paper/80" : "text-ink-2")}>
          {lead}
        </p>
      )}
    </div>
  );
};
