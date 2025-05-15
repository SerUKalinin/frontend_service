import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <p className={`mt-1 text-sm text-red-500 ${className}`}>
      {message}
    </p>
  );
};

export default ErrorMessage; 