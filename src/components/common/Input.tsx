import React from 'react';

interface InputProps {
  label?: string;
  name: string;
  id?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  leftIcon,
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-secondary mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          name={name}
          id={id || name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
            leftIcon ? 'pl-10' : ''
          }`}
        />
      </div>
    </div>
  );
};

export default Input;