import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import TaskInfo from './TaskInfo';
import TaskAttachmentsPanel from './TaskAttachmentsPanel';
import TaskCommentsPanel from './TaskCommentsPanel';

interface Task {
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
}

const TaskDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTask = async () => {
        try {
            setLoading(true);
            const response = await api.get<Task>(`/tasks/${id}`);
            setTask(response.data);
            setError(null);
        } catch (err) {
            setError('Ошибка при загрузке задачи');
            console.error('Error fetching task:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [id]);

    const handleFilesChanged = () => {
        // Обновляем информацию о задаче после изменения файлов
        fetchTask();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 text-xl mb-4">{error || 'Задача не найдена'}</div>
                <button
                    onClick={() => navigate('/tasks')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Вернуться к списку задач
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/3">
                    <TaskInfo task={task} onTaskChange={fetchTask} />
                </div>
                <div className="lg:w-1/3 space-y-6">
                    <TaskAttachmentsPanel 
                        taskId={task.id} 
                        onFilesChanged={handleFilesChanged}
                    />
                    <TaskCommentsPanel 
                        taskId={task.id} 
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsPage; 