import React from 'react';
import ErrorMessage from './ErrorMessage';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  id,
  children,
  ...props
}) => {
  const selectClasses = `
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
      <select
        id={id}
        className={selectClasses}
        {...props}
      >
        {children}
      </select>
      <ErrorMessage message={error || ''} />
    </div>
  );
};

export default Select; 