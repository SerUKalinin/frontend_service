import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface RecentActionsProps {
  actions?: Array<{
    id: number;
    description: string;
    date: string;
  }>;
}

const RecentActions: React.FC<RecentActionsProps> = ({ actions = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold">Последние действия</h2>
        <button className="p-1 hover:bg-gray-100 rounded-full transition-transform duration-200">
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-gray-500">
          {actions.length === 0 ? (
            <p>Нет последних действий</p>
          ) : (
            <ul className="space-y-2">
              {actions.map(action => (
                <li key={action.id} className="flex justify-between items-center">
                  <span>{action.description}</span>
                  <span className="text-sm text-gray-400">{action.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActions; 