import React from 'react';

export interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: string;
    onClick: () => void;
  };
  compact?: boolean;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  compact = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'py-8' : 'py-16'} ${className}`}>
      <div className={`${compact ? 'w-10 h-10 mb-2' : 'w-14 h-14 mb-4'} rounded-2xl bg-surface-raised border border-border-subtle flex items-center justify-center`}>
        <span className={`material-symbols-outlined ${compact ? 'text-[22px]' : 'text-[28px]'} text-text-disabled`}>
          {icon}
        </span>
      </div>
      <p className={`${compact ? 'text-[11px]' : 'text-[13px]'} font-bold text-text-muted`}>
        {title}
      </p>
      {description && (
        <p className={`${compact ? 'text-[10px] mt-0.5 max-w-[200px]' : 'text-[11px] mt-1.5 max-w-xs'} text-text-disabled leading-relaxed`}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={`mt-3 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-bold hover:bg-primary/20 transition-colors`}
        >
          {action.icon && <span className="material-symbols-outlined text-[14px]">{action.icon}</span>}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
