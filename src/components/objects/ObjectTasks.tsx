import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpandButton from '../common/ExpandButton';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import AddTaskButton from './AddTaskButton';
import AddObjectTaskModal from './AddObjectTaskModal';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
  responsibleUserFirstName?: string;
  responsibleUserLastName?: string;
}

interface ObjectTasksProps {
  objectId: string;
  objectName: string;
}

const ObjectTasks: React.FC<ObjectTasksProps> = ({ objectId, objectName }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get<Task[]>(`http://localhost:8080/tasks/object/${objectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке задач');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [objectId]);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleTaskAdded = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast.success('Задача успешно создана');
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    if (!priority) return 'text-gray-600';
    
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return 'Неизвестно';
    switch (status.toLowerCase()) {
      case 'new':
        return 'Новая';
      case 'in_progress':
        return 'В работе';
      case 'expired':
        return 'Просрочена';
      case 'urgent':
        return 'Срочная';
      case 'completed':
        return 'Завершена';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div 
        className="border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 pb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-medium text-gray-900">Задачи объекта</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <ExpandButton 
            isExpanded={isExpanded}
            onClick={handleExpandClick}
          />
        </div>
      </div>
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}> 
        {tasks.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Задачи отсутствуют
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/tasks/${task.id}`}
                      className="text-sm font-medium text-[#4361ee] hover:text-[#3651d4] hover:underline"
                    >
                      {task.title}
                    </Link>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                      Приоритет: {task.priority}
                    </span>
                    <span>Срок: {task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : 'Не указан'}</span>
                    <span>
                      Ответственный: {task.responsibleUserFirstName && task.responsibleUserLastName 
                        ? `${task.responsibleUserFirstName} ${task.responsibleUserLastName}`
                        : 'Не назначен'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <AddTaskButton onClick={() => setIsAddModalOpen(true)} />
        </div>
        <AddObjectTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onTaskAdded={handleTaskAdded}
          objectId={objectId}
          objectName={objectName}
        />
      </div>
    </div>
  );
};

export default ObjectTasks; 