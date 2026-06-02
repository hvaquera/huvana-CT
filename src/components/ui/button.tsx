import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]',
      secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.98]',
      ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
      danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
    };
    const sizes = {
      sm: 'h-8 px-3 text-[11px]',
      md: 'h-9 px-4 text-[13px]',
      lg: 'h-11 px-5 text-[13px]',
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
