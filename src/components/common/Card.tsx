import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="card shadow-sm rounded-lg border p-6">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-medium text-primary mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-secondary">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;