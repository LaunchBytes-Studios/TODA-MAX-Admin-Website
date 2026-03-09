import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconBgClassName?: string;
  iconColorClassName?: string;
  className?: string;
  description?: string;
  compact?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBgClassName = '',
  iconColorClassName = '',
  className = '',
  description,
  compact = false,
}) => {
  return (
    <div
      className={`bg-white rounded-lg border flex items-center justify-between ${compact ? 'p-4' : 'p-6'} ${className}`}
    >
      <div className={compact ? 'space-y-1.5' : 'space-y-2'}>
        <p className="text-sm text-gray-600">{title}</p>
        <p
          className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}
        >
          {value}
        </p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
      {icon && (
        <div
          className={`${iconBgClassName} ${compact ? 'p-2.5' : 'p-3'} rounded-lg`}
        >
          {React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{ className?: string }>,
                {
                  className:
                    `${compact ? 'size-5' : 'size-6'} ${iconColorClassName} ${(icon as React.ReactElement<{ className?: string }>).props.className ?? ''}`.trim(),
                },
              )
            : icon}
        </div>
      )}
    </div>
  );
};
