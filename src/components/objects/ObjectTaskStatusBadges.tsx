import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon, XCircleIcon, FireIcon } from '@heroicons/react/24/outline';

export type TaskStatus = 'NEW' | 'IN_PROGRESS' | 'EXPIRED' | 'URGENT' | 'COMPLETED';

export interface TaskStatusStats {
  NEW?: number;
  IN_PROGRESS?: number;
  EXPIRED?: number;
  URGENT?: number;
  COMPLETED?: number;
}

interface ObjectTaskStatusBadgesProps {
  stats: TaskStatusStats;
  onStatusClick?: (status: TaskStatus) => void;
  size?: number;
}

const statusConfig: Record<TaskStatus, { icon: React.ElementType; color: string; label: string }> = {
  NEW: { icon: ClockIcon, color: 'text-blue-500', label: 'Новая' },
  IN_PROGRESS: { icon: ExclamationCircleIcon, color: 'text-yellow-500', label: 'В работе' },
  EXPIRED: { icon: XCircleIcon, color: 'text-red-500', label: 'Просрочена' },
  URGENT: { icon: FireIcon, color: 'text-orange-600', label: 'Срочная' },
  COMPLETED: { icon: CheckCircleIcon, color: 'text-green-500', label: 'Завершена' },
};

const ObjectTaskStatusBadges: React.FC<ObjectTaskStatusBadgesProps> = ({ stats, onStatusClick, size = 18 }) => {
  return (
    <div className="flex items-center space-x-1">
      {Object.entries(statusConfig).map(([status, { icon: Icon, color, label }]) => {
        const count = stats[status as TaskStatus] || 0;
        if (count === 0) return null;
        return (
          <button
            key={status}
            type="button"
            title={label}
            onClick={onStatusClick ? () => onStatusClick(status as TaskStatus) : undefined}
            className={`flex items-center px-1 py-0.5 rounded hover:bg-gray-100 transition group`}
            style={{ fontSize: size }}
          >
            <Icon className={`${color} h-4 w-4 mr-0.5 group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-semibold text-gray-700 group-hover:text-black">{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ObjectTaskStatusBadges; 