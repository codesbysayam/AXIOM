import React from 'react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  detail?: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MetricCard({
  label,
  value,
  detail,
  tone = 'neutral',
  icon,
  onClick,
  className = '',
}: MetricCardProps) {
  const valueToneClasses = {
    neutral: 'text-[#17263A]',
    success: 'text-[#00866B]',
    warning: 'text-[#B97800]',
    danger: 'text-[#C93645]',
    info: 'text-[#3569A8]',
  };

  const renderValue = () => {
    if (typeof value === 'number') return value;
    const str = String(value);
    const suffixMatch = str.match(/^(.*?)(\s*(?:ms|%|runs|SLA))$/i);
    if (suffixMatch) {
      return (
        <>
          <span>{suffixMatch[1]}</span>
          <span className="metric-technical ml-0.5 text-base font-normal opacity-85">
            {suffixMatch[2]}
          </span>
        </>
      );
    }
    return str;
  };

  return (
    <article
      onClick={onClick}
      className={`metric-card ${onClick ? 'cursor-pointer hover:bg-[#FAF7EE] transition-colors' : ''} ${className}`}
    >
      <div className="flex items-center justify-between text-[#68758A]">
        <span className="metric-label">{label}</span>
        {icon && <span className="opacity-75">{icon}</span>}
      </div>

      <div className={`metric-value ${valueToneClasses[tone]}`}>{renderValue()}</div>

      {detail && <div className="metric-detail">{detail}</div>}
    </article>
  );
}
