import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import TaskResponsibleUserManager from './TaskResponsibleUserManager';
import TakeInWorkButton from './TakeInWorkButton';
import CompleteTaskButton from './CompleteTaskButton';
import { userService } from '../../services/userService';

interface TaskInfoProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: string;
    deadline: string;
    realEstateObjectId: number;
    realEstateObjectName?: string;
    createdAt: string;
    createdByFirstName?: string;
    createdByLastName?: string;
    responsibleUserFirstName?: string;
    responsibleUserLastName?: string;
  };
  onTaskChange?: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case 'IN_PROGRESS':
      return <ClockIcon className="h-5 w-5 text-blue-500" />;
    case 'NEW':
      return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />;
    case 'CANCELLED':
      return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'NEW':
      return 'Новая';
    case 'IN_PROGRESS':
      return 'В работе';
    case 'EXPIRED':
      return 'Просрочена';
    case 'URGENT':
      return 'Срочная';
    case 'COMPLETED':
      return 'Завершена';
    default:
      return status;
  }
};

const TaskInfo: React.FC<TaskInfoProps> = ({ task, onTaskChange }) => {
  const [objectName, setObjectName] = useState<string | null>(task.realEstateObjectName || null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!objectName && task.realEstateObjectId) {
      api.get<{ name: string }>(`/real-estate-objects/${task.realEstateObjectId}`)
        .then(res => {
          setObjectName(res.data.name);
        })
        .catch(() => {
          setObjectName(`Объект #${task.realEstateObjectId}`);
        });
    }
  }, [objectName, task.realEstateObjectId]);

  useEffect(() => {
    userService.getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  const infoItems = [
    {
      icon: CalendarIcon,
      label: 'Статус',
      value: (
        <span className="flex items-center gap-1 text-sm">
          {getStatusIcon(task.status)}
          {getStatusLabel(task.status)}
        </span>
      ),
      color: 'text-gray-500'
    },
    {
      icon: CalendarIcon,
      label: 'Создана',
      value: new Date(task.createdAt).toLocaleString('ru-RU'),
      color: 'text-green-500'
    },
    {
      icon: UserIcon,
      label: 'Создатель задачи',
      value: task.createdByFirstName && task.createdByLastName
        ? `${task.createdByFirstName} ${task.createdByLastName}`
        : '—',
      color: 'text-purple-500'
    },
    {
      icon: UserIcon,
      label: 'Ответственный',
      value: (
        <TaskResponsibleUserManager
          responsibleUserFirstName={task.responsibleUserFirstName}
          responsibleUserLastName={task.responsibleUserLastName}
          taskId={task.id}
          onChange={onTaskChange || (() => {})}
        />
      ),
      color: 'text-orange-500'
    },
    {
      icon: CalendarIcon,
      label: 'Срок выполнения',
      value: task.deadline ? new Date(task.deadline).toLocaleString('ru-RU') : '-',
      color: 'text-blue-500'
    },
    {
      icon: UserIcon,
      label: 'Объект недвижимости',
      value: (
        <Link to={`/objects/${task.realEstateObjectId}`} className="text-blue-600 underline hover:text-blue-800">
          {objectName || `Объект #${task.realEstateObjectId}`}
        </Link>
      ),
      color: 'text-indigo-500'
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Информация о задаче</h2>
        <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`flex-shrink-0 ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">{item.label}</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{item.value}</dd>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-gray-700 font-semibold mb-1">Описание задачи:</div>
        <div className="bg-gray-50 rounded p-3 min-h-[40px]">
          {task.description || <span className="text-gray-400">Нет описания</span>}
        </div>
      </div>
      <div className="mt-6 flex flex-row items-center gap-4">
        {user && (
          <TakeInWorkButton task={task} user={user} onTaskChange={onTaskChange} />
        )}
        <CompleteTaskButton task={task} onTaskChange={onTaskChange} />
      </div>
    </div>
  );
};

export default TaskInfo; 