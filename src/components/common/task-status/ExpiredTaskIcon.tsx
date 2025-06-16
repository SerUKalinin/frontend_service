import React from 'react';
import TaskStatusIcon from '../TaskStatusIcon';

interface ExpiredTaskIconProps {
  size?: number;
  className?: string;
}

const ExpiredTaskIcon: React.FC<ExpiredTaskIconProps> = ({ size, className }) => {
  return <TaskStatusIcon status="EXPIRED" size={size} className={className} />;
};

export default ExpiredTaskIcon; 