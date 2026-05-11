import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

interface EditorialButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  className?: string;
  variant?: 'primary' | 'ghost' | 'inverse';
}

export const EditorialButton = ({ children, onClick, to, className, variant = 'primary' }: EditorialButtonProps) => {
  const baseStyles = "h-14 px-10 flex items-center justify-center caption transition-all duration-400 border border-ink/20 hover:border-ink focus:outline-none";
  const variants = {
    primary: "bg-ink text-paper hover:bg-oxblood hover:border-oxblood",
    ghost: "bg-transparent text-ink hover:bg-ink hover:text-paper",
    inverse: "bg-paper text-ink hover:bg-ink hover:text-paper hover:border-paper",
  };

  const content = (
    <span className="relative z-10">
      {children}
    </span>
  );

  if (to) {
    return (
      <Link to={to} className={cn(baseStyles, variants[variant], className)}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cn(baseStyles, variants[variant], className)}>
      {content}
    </button>
  );
};
