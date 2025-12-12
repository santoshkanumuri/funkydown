import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  icon,
  className = '', 
  disabled,
  ...props 
}) => {
  
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-6 py-3 font-bold transition-all duration-200 border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed font-sans uppercase tracking-wide text-sm";
  
  const variants = {
    primary: "bg-funky-pink text-black hover:-translate-y-1 hover:shadow-hard shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none",
    secondary: "bg-funky-cyan text-black hover:-translate-y-1 hover:shadow-hard shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none",
    accent: "bg-funky-yellow text-black hover:-translate-y-1 hover:shadow-hard shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none",
    danger: "bg-red-500 text-white hover:-translate-y-1 hover:shadow-hard shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none",
    ghost: "bg-transparent hover:bg-black hover:text-white border-transparent hover:border-black",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && icon}
      {children}
    </button>
  );
};
