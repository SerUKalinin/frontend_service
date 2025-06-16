import React from 'react';
import TaskStatusIcon from '../TaskStatusIcon';

interface NewTaskIconProps {
  size?: number;
  className?: string;
}

const NewTaskIcon: React.FC<NewTaskIconProps> = ({ size, className }) => {
  return <TaskStatusIcon status="NEW" size={size} className={className} />;
};

export default NewTaskIcon; 