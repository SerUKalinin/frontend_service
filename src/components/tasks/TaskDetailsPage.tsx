import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import PageLayout from '../layout/PageLayout';
import TaskMainInfo from './TaskMainInfo';

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

    useEffect(() => {
        fetchTask();
    }, [id]);

    if (loading) return <PageLayout><div className="p-8">Загрузка...</div></PageLayout>;
    if (error) return <PageLayout><div className="p-8 text-red-600">{error}</div></PageLayout>;
    if (!task) return <PageLayout><div className="p-8">Задача не найдена</div></PageLayout>;

    return (
        <PageLayout>
            <div className="max-w-2xl mx-auto">
                <TaskMainInfo task={task} onTaskChange={fetchTask} />
            </div>
        </PageLayout>
    );
};

export default TaskDetailsPage; 