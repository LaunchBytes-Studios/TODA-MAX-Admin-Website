import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  isWarning?: boolean;
  isDanger?: boolean;
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, isWarning, isDanger }) => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${isWarning ? 'text-black' : isDanger ? 'text-red-600' : ''}`}>
        {value}
      </p>
    </div>
  );
};

export default StatsCard;