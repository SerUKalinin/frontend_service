import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon, XCircleIcon, FireIcon } from '@heroicons/react/24/outline';

export type TaskStatus = 'NEW' | 'IN_PROGRESS' | 'EXPIRED' | 'URGENT' | 'COMPLETED';

interface TaskStatusIconProps {
  status: TaskStatus;
  size?: number;
  className?: string;
}

const statusConfig: Record<TaskStatus, { icon: React.ElementType; color: string }> = {
  NEW: { icon: ClockIcon, color: 'text-blue-500' },
  IN_PROGRESS: { icon: ExclamationCircleIcon, color: 'text-yellow-500' },
  EXPIRED: { icon: XCircleIcon, color: 'text-red-500' },
  URGENT: { icon: FireIcon, color: 'text-orange-600' },
  COMPLETED: { icon: CheckCircleIcon, color: 'text-green-500' },
};

const TaskStatusIcon: React.FC<TaskStatusIconProps> = ({ 
  status, 
  size = 192,
  className = '' 
}) => {
  const { icon: Icon, color } = statusConfig[status];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Icon 
        className={color} 
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default TaskStatusIcon; 