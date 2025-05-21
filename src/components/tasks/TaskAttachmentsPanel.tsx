import React from 'react';
import TaskFiles from './TaskFiles';
import TaskFileUpload from './TaskFileUpload';

interface TaskAttachmentsPanelProps {
  taskId: number;
  onFilesChanged?: () => void;
}

const TaskAttachmentsPanel: React.FC<TaskAttachmentsPanelProps> = ({ taskId, onFilesChanged }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Прикрепленные файлы</h3>
      <TaskFiles taskId={taskId} />
      <div className="mt-4">
        <TaskFileUpload taskId={taskId} onFileUploaded={onFilesChanged} />
      </div>
    </div>
  );
};

export default TaskAttachmentsPanel; 