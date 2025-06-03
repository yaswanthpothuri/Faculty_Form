import React from 'react';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: RegExp;
  patternMessage?: string;
  min?: string | number;
  max?: string | number;
  options?: Array<{ value: string, label: string }>;
  className?: string;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  name, 
  label, 
  type = 'text', 
  placeholder = '', 
  required = false,
  pattern,
  patternMessage = 'Invalid format',
  min,
  max,
  options,
  className = '',
  disabled = false
}) => {
  const { register, formState: { errors } } = useFormContext();
  
  const inputBaseClasses = "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200";
  const validClass = "border-gray-300 focus:border-blue-500 focus:ring-blue-200";
  const errorClass = "border-red-300 focus:border-red-500 focus:ring-red-200";
  
  const inputClasses = clsx(
    inputBaseClasses,
    errors[name] ? errorClass : validClass,
    className
  );
  
  const registerOptions: any = {
    required: required ? 'This field is required' : false,
    disabled
  };
  
  if (pattern) {
    registerOptions.pattern = {
      value: pattern,
      message: patternMessage
    };
  }
  
  if (min !== undefined) {
    registerOptions.min = {
      value: min,
      message: `Minimum value is ${min}`
    };
  }
  
  if (max !== undefined) {
    registerOptions.max = {
      value: max,
      message: `Maximum value is ${max}`
    };
  }
  
  // Generate a unique ID for the input
  const id = `field-${name}`;
  
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea 
            id={id}
            {...register(name, registerOptions)} 
            placeholder={placeholder}
            className={`${inputClasses} min-h-[100px]`}
          />
        );
        
      case 'select':
        return (
          <select 
            id={id}
            {...register(name, registerOptions)} 
            className={inputClasses}
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'radio':
        return (
          <div className="flex flex-wrap gap-4 mt-1">
            {options?.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value={option.value}
                  {...register(name, registerOptions)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
        
      case 'checkbox':
        return (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register(name)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-gray-700">{placeholder || label}</span>
          </label>
        );
        
      default:
        return (
          <input 
            id={id}
            type={type} 
            {...register(name, registerOptions)} 
            placeholder={placeholder}
            className={inputClasses}
          />
        );
    }
  };
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 transition-all duration-200">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};