import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type FilterGroupProps = {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  badge?: number;
  className?: string;
};

export const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  children,
  expanded = false,
  badge,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className={`bg-white rounded-xl overflow-hidden mb-3 ${className}`}>
      <button
        className="w-full p-4 flex items-center justify-between font-medium text-black-text"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <div className="flex items-center">
          <span>{title}</span>
          {badge !== undefined && badge > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-light text-primary text-xs font-medium rounded-full">
              {badge}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className="text-gray-text" />
        ) : (
          <ChevronDown size={18} className="text-gray-text" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterGroup;