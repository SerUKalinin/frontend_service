import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import PageLayout from '../layout/PageLayout';

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    deadline: string;
    realEstateObjectId: number;
    realEstateObjectName?: string;
    createdAt: string;
}

const TaskDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/tasks/${id}`);
                setTask(response.data as Task);
            } catch (err: any) {
                setError('Ошибка при загрузке задачи');
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    if (loading) return <PageLayout><div className="p-8">Загрузка...</div></PageLayout>;
    if (error) return <PageLayout><div className="p-8 text-red-600">{error}</div></PageLayout>;
    if (!task) return <PageLayout><div className="p-8">Задача не найдена</div></PageLayout>;

    return (
        <PageLayout>
            <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
                <div className="mb-2 text-gray-600">Статус: <span className="font-semibold">{task.status}</span></div>
                <div className="mb-2 text-gray-600">Срок выполнения: <span className="font-semibold">{task.deadline ? new Date(task.deadline).toLocaleString('ru-RU') : '-'}</span></div>
                <div className="mb-2 text-gray-600">Создана: <span className="font-semibold">{new Date(task.createdAt).toLocaleString('ru-RU')}</span></div>
                <div className="mb-4 text-gray-600">
                    Объект недвижимости: {task.realEstateObjectId && (
                        <Link to={`/objects/${task.realEstateObjectId}`} className="text-blue-600 underline hover:text-blue-800">
                            {task.realEstateObjectName || `Объект #${task.realEstateObjectId}`}
                        </Link>
                    )}
                </div>
                <div className="mb-4">
                    <div className="text-gray-700 font-semibold mb-1">Описание:</div>
                    <div className="bg-gray-50 rounded p-3 min-h-[40px]">{task.description || <span className="text-gray-400">Нет описания</span>}</div>
                </div>
            </div>
        </PageLayout>
    );
};

export default TaskDetailsPage; 