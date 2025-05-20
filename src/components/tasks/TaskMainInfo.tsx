import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import TaskResponsibleUserManager from './TaskResponsibleUserManager';
import TakeInWorkButton from './TakeInWorkButton';
import { userService } from '../../services/userService';
import CompleteTaskButton from './CompleteTaskButton';
import TakeTaskButton from './TakeTaskButton';

interface TaskMainInfoProps {
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

const TaskMainInfo: React.FC<TaskMainInfoProps> = ({ task, onTaskChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
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
    <div className="bg-white shadow rounded-lg">
      <div 
        className="p-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-gray-900">Информация о задаче</span>
          <span className="ml-2 flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100">
            {getStatusIcon(task.status)}
            {getStatusLabel(task.status)}
          </span>
        </div>
        <button onClick={e => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
          <svg className={`h-5 w-5 transition-transform ${isExpanded ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{task.title}</h1>
            {task.status === 'NEW' && (
              <TakeTaskButton taskId={task.id} onTaskChange={onTaskChange} />
            )}
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
          <div className="mt-6">
            <div className="text-gray-700 font-semibold mb-1">Описание задачи:</div>
            <div className="bg-gray-50 rounded p-3 min-h-[40px]">{task.description || <span className="text-gray-400">Нет описания</span>}</div>
          </div>
          <div className="flex flex-row items-center">
            {user && (
              <TakeInWorkButton task={task} user={user} onTaskChange={onTaskChange} />
            )}
            <CompleteTaskButton task={task} onTaskChange={onTaskChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskMainInfo; 