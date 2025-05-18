import React from 'react';
import Button from '../common/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

interface AddTaskButtonProps {
    onClick: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick }) => {
    return (
        <Button
            variant="primary"
            onClick={onClick}
            className="flex items-center gap-2"
        >
            <PlusIcon className="h-5 w-5" />
            Добавить задачу
        </Button>
    );
};

export default AddTaskButton; 