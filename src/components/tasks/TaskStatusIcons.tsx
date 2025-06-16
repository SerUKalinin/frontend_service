import React from 'react';
import { TaskStatus } from '../common/TaskStatusIcon';
import NewTaskIcon from '../common/task-status/NewTaskIcon';
import InProgressTaskIcon from '../common/task-status/InProgressTaskIcon';
import ExpiredTaskIcon from '../common/task-status/ExpiredTaskIcon';
import UrgentTaskIcon from '../common/task-status/UrgentTaskIcon';
import CompletedTaskIcon from '../common/task-status/CompletedTaskIcon';

interface TaskStatusIconsProps {
  size?: number;
  className?: string;
  tasks: Array<{ status: TaskStatus }>;
  onStatusClick?: (status: TaskStatus) => void;
  selectedStatus?: TaskStatus | null;
}

const statusColor: Record<TaskStatus, string> = {
  NEW: 'text-blue-500',
  IN_PROGRESS: 'text-yellow-500',
  EXPIRED: 'text-red-500',
  URGENT: 'text-orange-600',
  COMPLETED: 'text-green-500',
};

const TaskStatusIcons: React.FC<TaskStatusIconsProps> = ({ size = 192, className = '', tasks, onStatusClick, selectedStatus }) => {
  const getStatusCount = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status).length;
  };

  const iconClasses = (status: TaskStatus) =>
    `transition cursor-pointer rounded-full p-2 ${selectedStatus === status ? 'ring-4 ring-offset-2 ring-blue-300 bg-blue-50' : 'hover:bg-gray-100'}`;

  return (
    <div className={`grid grid-cols-5 gap-4 ${className}`}>
      <div className="flex flex-col items-center">
        <div onClick={() => onStatusClick?.('NEW')} className={iconClasses('NEW')}>
          <NewTaskIcon size={size} />
        </div>
        <span className="mt-2 text-sm font-medium text-gray-900">Новые</span>
        <span className={`text-3xl font-bold mt-1 ${statusColor['NEW']}`}>{getStatusCount('NEW')}</span>
      </div>
      <div className="flex flex-col items-center">
        <div onClick={() => onStatusClick?.('IN_PROGRESS')} className={iconClasses('IN_PROGRESS')}>
          <InProgressTaskIcon size={size} />
        </div>
        <span className="mt-2 text-sm font-medium text-gray-900">В работе</span>
        <span className={`text-3xl font-bold mt-1 ${statusColor['IN_PROGRESS']}`}>{getStatusCount('IN_PROGRESS')}</span>
      </div>
      <div className="flex flex-col items-center">
        <div onClick={() => onStatusClick?.('EXPIRED')} className={iconClasses('EXPIRED')}>
          <ExpiredTaskIcon size={size} />
        </div>
        <span className="mt-2 text-sm font-medium text-gray-900">Просроченные</span>
        <span className={`text-3xl font-bold mt-1 ${statusColor['EXPIRED']}`}>{getStatusCount('EXPIRED')}</span>
      </div>
      <div className="flex flex-col items-center">
        <div onClick={() => onStatusClick?.('URGENT')} className={iconClasses('URGENT')}>
          <UrgentTaskIcon size={size} />
        </div>
        <span className="mt-2 text-sm font-medium text-gray-900">Срочные</span>
        <span className={`text-3xl font-bold mt-1 ${statusColor['URGENT']}`}>{getStatusCount('URGENT')}</span>
      </div>
      <div className="flex flex-col items-center">
        <div onClick={() => onStatusClick?.('COMPLETED')} className={iconClasses('COMPLETED')}>
          <CompletedTaskIcon size={size} />
        </div>
        <span className="mt-2 text-sm font-medium text-gray-900">Выполненные</span>
        <span className={`text-3xl font-bold mt-1 ${statusColor['COMPLETED']}`}>{getStatusCount('COMPLETED')}</span>
      </div>
    </div>
  );
};

export default TaskStatusIcons; 