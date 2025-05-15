import React from 'react';
import ErrorMessage from './ErrorMessage';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  id,
  ...props
}) => {
  const inputClasses = `
    px-4 py-2 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    ${error ? 'border-red-500' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <div className={`form-group ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={inputClasses}
        {...props}
      />
      <ErrorMessage message={error || ''} />
    </div>
  );
};

export default Input; 