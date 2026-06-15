import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  className?: string;
  containerClassName?: string;
  prefixElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  icon,
  className = '',
  containerClassName = '',
  prefixElement,
  ...props
}) => {
  return (
    <div className={`flex items-center bg-surface-container-high rounded-[16px] p-1 border border-transparent focus-within:border-primary/50 focus-within:bg-white/90 transition-all duration-200 shadow-inner ${containerClassName}`}>
      {prefixElement}
      <input
        className={`flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface text-sm px-3 py-3 w-full placeholder:text-on-surface-variant/50 ${className}`}
        {...props}
      />
      {icon && (
        <span className="material-symbols-outlined text-outline-variant pr-3 text-[20px]">{icon}</span>
      )}
    </div>
  );
};
