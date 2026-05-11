import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

interface QuietLinkProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const QuietLink = ({ children, to, onClick, className, disabled }: QuietLinkProps) => {
  const styles = cn(
    "relative caption text-ink-3 hover:text-ink transition-colors duration-300 group inline-block",
    disabled && "opacity-30 cursor-not-allowed pointer-events-none",
    className
  );

  const underline = (
    <span className="absolute -bottom-1 left-0 w-0 h-px bg-ink transition-all duration-400 group-hover:w-full" />
  );

  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
        {underline}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={styles}>
      {children}
      {underline}
    </button>
  );
};
