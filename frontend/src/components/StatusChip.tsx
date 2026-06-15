import React from 'react';

type ChipType = 'verified' | 'urgent' | 'routine' | 'info' | 'error';

interface StatusChipProps {
  type: ChipType;
  label: string;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ type, label, className = '' }) => {
  const styles: Record<ChipType, string> = {
    verified: 'bg-gradient-to-r from-amber-400 to-amber-600 text-amber-950 shadow-sm',
    urgent: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm',
    routine: 'bg-primary/10 text-primary',
    info: 'bg-surface-container-highest text-on-surface-variant',
    error: 'bg-error/10 text-error',
  };

  const icons: Record<ChipType, string> = {
    verified: 'verified',
    urgent: 'warning',
    routine: 'check_circle',
    info: 'info',
    error: 'cancel',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${styles[type]} ${className}`}>
      <span className="material-symbols-outlined text-[14px] filled-icon">{icons[type]}</span>
      {label}
    </span>
  );
};
