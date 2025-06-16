import React from 'react';
import TaskStatusIcon from '../TaskStatusIcon';

interface UrgentTaskIconProps {
  size?: number;
  className?: string;
}

const UrgentTaskIcon: React.FC<UrgentTaskIconProps> = ({ size, className }) => {
  return <TaskStatusIcon status="URGENT" size={size} className={className} />;
};

export default UrgentTaskIcon; 