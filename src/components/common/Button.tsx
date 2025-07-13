import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  icon,
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';
      case 'secondary':
        return 'border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';
      case 'outline':
        return 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';
      default:
        return 'border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${getVariantClasses()}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;