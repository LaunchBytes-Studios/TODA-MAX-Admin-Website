import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconBgClassName?: string;
  iconColorClassName?: string;
  className?: string;
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBgClassName = '',
  iconColorClassName = '',
  className = '',
  description,
}) => {
  return (
    <div
      className={`bg-white rounded-lg border p-6 flex items-center justify-between ${className}`}
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
      {icon && (
        <div className={`${iconBgClassName} p-3 rounded-lg`}>
          {React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{ className?: string }>,
                {
                  className:
                    `size-6 ${iconColorClassName} ${(icon as React.ReactElement<{ className?: string }>).props.className ?? ''}`.trim(),
                },
              )
            : icon}
        </div>
      )}
    </div>
  );
};
