import React from 'react';
import TaskStatusIcon from '../TaskStatusIcon';

interface InProgressTaskIconProps {
  size?: number;
  className?: string;
}

const InProgressTaskIcon: React.FC<InProgressTaskIconProps> = ({ size, className }) => {
  return <TaskStatusIcon status="IN_PROGRESS" size={size} className={className} />;
};

export default InProgressTaskIcon; 