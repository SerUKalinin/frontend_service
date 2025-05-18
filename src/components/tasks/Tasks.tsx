import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import { Task } from '../../types/task';
import { api } from '../../services/api';
import PageLayout from '../layout/PageLayout';
import { authService } from '../../services/authService';
import AddTaskButton from './AddTaskButton';
import AddTaskModal from './AddTaskModal';

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            if (!authService.isAuthenticated()) {
                throw new Error('Требуется авторизация');
            }

            const response = await api.get<Task[]>('/tasks');
            setTasks(response.data);
            setError(null);
        } catch (err: any) {
            if (err?.response?.status === 403) {
                setError('Доступ запрещен. Пожалуйста, войдите в систему.');
            } else {
                setError('Ошибка при загрузке задач');
            }
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId: number, newStatus: string) => {
        try {
            if (!authService.isAuthenticated()) {
                throw new Error('Требуется авторизация');
            }

            await api.patch(`/tasks/${taskId}`, { status: newStatus });
            setTasks(tasks.map(task => 
                task.id === taskId ? { ...task, status: newStatus as Task['status'] } : task
            ));
        } catch (err: any) {
            console.error('Error updating task status:', err);
            if (err?.response?.status === 403) {
                setError('Доступ запрещен. Пожалуйста, войдите в систему.');
            }
        }
    };

    const handleAddTask = (createdTask: Task) => {
        setTasks(prev => [...prev, createdTask]);
        setIsAddModalOpen(false);
    };

    if (loading) {
        return (
            <PageLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout>
                <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button
                        onClick={fetchTasks}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Попробовать снова
                    </button>
                </div>
            </PageLayout>
        );
    }

  return (
    <PageLayout>
      <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Задачи</h1>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <AddTaskButton onClick={() => setIsAddModalOpen(true)} />
                    </div>
                </div>
        
        <div className="bg-white shadow rounded-lg p-6">
                    {tasks.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            Задачи не найдены
                        </div>
                    ) : (
                        <TaskList 
                            tasks={tasks} 
                            onStatusChange={handleStatusChange}
                        />
                    )}
        </div>
      </div>

            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onTaskAdded={handleAddTask}
            />
    </PageLayout>
  );
};

export default Tasks; 