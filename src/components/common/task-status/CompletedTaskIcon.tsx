import React from 'react';
import TaskStatusIcon from '../TaskStatusIcon';

interface CompletedTaskIconProps {
  size?: number;
  className?: string;
}

const CompletedTaskIcon: React.FC<CompletedTaskIconProps> = ({ size, className }) => {
  return <TaskStatusIcon status="COMPLETED" size={size} className={className} />;
};

export default CompletedTaskIcon; 