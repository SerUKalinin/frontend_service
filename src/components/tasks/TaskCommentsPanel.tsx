import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface Comment {
  id: number;
  text: string;
  createdAt: string;
  createdByFirstName?: string;
  createdByLastName?: string;
}

interface TaskCommentsPanelProps {
  taskId: number;
}

const TaskCommentsPanel: React.FC<TaskCommentsPanelProps> = ({ taskId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get<Comment[]>(`/tasks/${taskId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`/tasks/${taskId}/comments`, { text: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Комментарии</h3>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Добавить комментарий..."
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={!newComment.trim()}
        >
          Отправить
        </button>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Загрузка комментариев...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-500">Нет комментариев</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">
                  {comment.createdByFirstName && comment.createdByLastName
                    ? `${comment.createdByFirstName} ${comment.createdByLastName}`
                    : 'Анонимный пользователь'}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString('ru-RU')}
                </div>
              </div>
              <div className="text-gray-700">{comment.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskCommentsPanel; 