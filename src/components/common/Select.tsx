import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  id: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ label, id, options, value, onChange }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-secondary mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-3 py-2 border border-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;